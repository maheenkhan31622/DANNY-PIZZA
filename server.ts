import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { KARACHI_AREAS } from './src/data/karachiAreas.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Danny Pizza Restaurant Location: Shop No. L-363, Sector 5-A/2, North Karachi
const RESTAURANT_COORDS = {
  lat: 24.9854,
  lng: 67.0648,
};

// Backend-only daily Pakistan petrol benchmark (Rs. 400 / Litre) — never exposed on storefront UI
let currentFuelBenchmarkPkr = Number(process.env.PAKISTAN_PETROL_RATE_PKR) || 400;
let lastFuelSyncIso = new Date().toISOString();

const KARACHI_AREA_COORDS: Record<string, { name: string; lat: number; lng: number }> = Object.fromEntries(
  KARACHI_AREAS.map((area) => [area.id, { name: area.name, lat: area.lat, lng: area.lng }])
);

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getCurrentPktHour(): number {
  const now = new Date();
  const pktOffsetMs = 5 * 60 * 60 * 1000;
  const pktDate = new Date(now.getTime() + pktOffsetMs);
  return pktDate.getUTCHours();
}

function getDynamicPrepMinutes(hour: number): number {
  if (hour >= 20 && hour <= 23) return 28;
  if (hour >= 16 || hour <= 1) return 20;
  return 22;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, restaurant: 'DANNY PIZZA' });
  });

  // Reverse geocoding proxy for accurate auto-location detection
  app.get('/api/reverse-geocode', async (req, res) => {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ ok: false, error: 'Invalid coordinates' });
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=17&addressdetails=1`;
      const nomResp = await fetch(nomUrl, {
        headers: {
          'User-Agent': 'DannyPizzaKarachi/1.0 (https://dannypizza.pk)',
          'Accept-Language': 'en',
        },
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (nomResp.ok) {
        const data: any = await nomResp.json();
        const addr = data?.address || {};
        const neighborhood =
          addr.neighbourhood ||
          addr.suburb ||
          addr.quarter ||
          addr.residential ||
          addr.city_district ||
          addr.road ||
          '';
        const city = addr.city || addr.town || addr.village || addr.state_district || addr.state || '';
        const parts = [neighborhood, addr.suburb !== neighborhood ? addr.suburb : '', city].filter(Boolean);
        const label = parts.slice(0, 2).join(', ') || data?.display_name?.split(',').slice(0, 3).join(', ') || '';

        if (label) {
          return res.json({
            ok: true,
            label,
            city,
            fullAddress: data?.display_name || label,
          });
        }
      }
    } catch {
      // Fall through to BigDataCloud fallback
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4500);
      const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
      const bdcResp = await fetch(bdcUrl, { signal: controller.signal });
      clearTimeout(timer);
      if (bdcResp.ok) {
        const data: any = await bdcResp.json();
        const locality = data?.locality || '';
        const city = data?.city || data?.principalSubdivision || '';
        const label = [locality, city].filter((v, i, arr) => v && arr.indexOf(v) === i).join(', ');
        if (label) {
          return res.json({
            ok: true,
            label,
            city,
            fullAddress: [label, data?.countryName].filter(Boolean).join(', '),
          });
        }
      }
    } catch {
      // Ignore fallback error
    }

    return res.json({ ok: false, label: '', city: '', fullAddress: '' });
  });

  // Network IP geolocation fallback when browser GPS is unavailable or blocked
  app.get('/api/ip-location', async (req, res) => {
    try {
      const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
      const targetIp = forwarded && !forwarded.startsWith('127.') && forwarded !== '::1' ? forwarded : '';
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4500);
      const url = targetIp ? `https://ipwho.is/${encodeURIComponent(targetIp)}` : 'https://ipwho.is/';
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (resp.ok) {
        const data: any = await resp.json();
        if (data?.success && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
          return res.json({
            ok: true,
            lat: data.latitude,
            lng: data.longitude,
            city: data.city || '',
            region: data.region || '',
            country: data.country || '',
          });
        }
      }
    } catch {
      // Ignore IP lookup failure
    }
    return res.json({ ok: false });
  });

  // Dynamic distance & backend-only Rs. 400/L petrol-indexed delivery charge endpoint
  app.post('/api/delivery-quote', (req, res) => {
    const { areaId, lat, lng, orderType = 'delivery', subtotal = 0 } = req.body || {};

    let targetLat = RESTAURANT_COORDS.lat;
    let targetLng = RESTAURANT_COORDS.lng;
    let resolvedArea = 'North Karachi - Sector 5-A/2';

    const hasCoords =
      typeof lat === 'number' && typeof lng === 'number' && !Number.isNaN(lat) && !Number.isNaN(lng);

    if (areaId && KARACHI_AREA_COORDS[areaId]) {
      resolvedArea = KARACHI_AREA_COORDS[areaId].name;
      if (hasCoords && haversineKm(RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng, lat, lng) <= 45) {
        targetLat = lat;
        targetLng = lng;
      } else {
        targetLat = KARACHI_AREA_COORDS[areaId].lat;
        targetLng = KARACHI_AREA_COORDS[areaId].lng;
      }
    } else if (hasCoords) {
      targetLat = lat;
      targetLng = lng;
      let minD = Infinity;
      for (const [, info] of Object.entries(KARACHI_AREA_COORDS)) {
        const d = haversineKm(lat, lng, info.lat, info.lng);
        if (d < minD) {
          minD = d;
          resolvedArea = info.name;
        }
      }
    }

    const straightKm = haversineKm(RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng, targetLat, targetLng);
    const roadKm = Math.max(0.5, Number((straightKm * 1.28).toFixed(1)));
    const pktHour = getCurrentPktHour();
    const prepMins = getDynamicPrepMinutes(pktHour);

    if (orderType !== 'delivery') {
      return res.json({
        areaName: resolvedArea,
        distanceKm: roadKm,
        deliveryFee: 0,
        estimatedMinutes: prepMins,
        subtotal,
        total: subtotal,
      });
    }

    // Backend-only KM rate calibrated to Rs. 400/Litre Pakistan petrol price (bike ~20 km/L effective city round-trip + rider wear)
    const perKmRate = currentFuelBenchmarkPkr / 20 + 5;
    const rawFee = roadKm <= 1.2 ? 60 : 50 + roadKm * perKmRate;
    const roundedFee = Math.min(550, Math.max(60, Math.round(rawFee / 10) * 10));
    const transitMins = Math.min(50, Math.max(10, Math.round(roadKm * 2.4)));

    return res.json({
      areaName: resolvedArea,
      distanceKm: roadKm,
      deliveryFee: roundedFee,
      estimatedMinutes: prepMins + transitMins,
      subtotal,
      total: subtotal + roundedFee,
    });
  });

  // Backend admin/cron endpoint to update daily Pakistan petrol rate dynamically
  app.post('/api/admin/fuel-benchmark', (req, res) => {
    const rate = Number(req.body?.ratePkr);
    if (!Number.isFinite(rate) || rate < 100 || rate > 1000) {
      return res.status(400).json({ error: 'Invalid rate value' });
    }
    currentFuelBenchmarkPkr = rate;
    lastFuelSyncIso = new Date().toISOString();
    return res.json({ ok: true, updatedAt: lastFuelSyncIso });
  });

  // Guest / direct order persistence endpoint
  app.post('/api/orders', (req, res) => {
    const body = req.body || {};
    if (!body.customerName || !body.customerPhone || !Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }
    const orderNumber = `DP-${Math.floor(1000 + Math.random() * 9000)}`;
    const id = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    return res.status(201).json({
      id,
      orderNumber,
      status: 'placed',
      createdAt: new Date().toISOString(),
    });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath, { maxAge: '7d' }));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build not found');
      }
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DANNY PIZZA server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
