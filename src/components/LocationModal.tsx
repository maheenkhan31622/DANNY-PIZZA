import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Navigation,
  Search,
  Truck,
  ShoppingBag,
  Utensils,
  X,
  Check,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  KARACHI_AREAS,
  snapCoordsToKarachiServiceArea,
} from '../data/karachiAreas';
import { RESTAURANT_INFO } from '../data/menuData';
import type { KarachiArea, OrderType } from '../types';

interface LocationModalProps {
  open: boolean;
  initialAreaId: string;
  initialOrderType: OrderType;
  initialDetectedCoords?: { lat: number; lng: number };
  initialDetectedAddress?: string;
  canClose: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    area: KarachiArea;
    orderType: OrderType;
    coords?: { lat: number; lng: number };
    detectedAddress?: string;
  }) => void;
}

function getBrowserPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('GEOLOCATION_UNSUPPORTED'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

async function fetchJsonWithTimeout(url: string, timeoutMs = 4500): Promise<any | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { signal: controller.signal });
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function detectClientIpLocation(): Promise<{
  lat: number;
  lng: number;
  city: string;
  region: string;
  country: string;
} | null> {
  // 1. Direct browser request to CORS-enabled ipwho.is (sees user's actual ISP IP, not server datacenter IP)
  const ipwho = await fetchJsonWithTimeout('https://ipwho.is/', 4500);
  if (ipwho?.success && typeof ipwho.latitude === 'number' && typeof ipwho.longitude === 'number') {
    return {
      lat: ipwho.latitude,
      lng: ipwho.longitude,
      city: ipwho.city || '',
      region: ipwho.region || '',
      country: ipwho.country || '',
    };
  }

  // 2. Direct browser fallback to GeoJS
  const geojs = await fetchJsonWithTimeout('https://get.geojs.io/v1/ip/geo.json', 4500);
  if (geojs) {
    const lat = Number(geojs.latitude);
    const lng = Number(geojs.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return {
        lat,
        lng,
        city: geojs.city || '',
        region: geojs.region || '',
        country: geojs.country || '',
      };
    }
  }

  // 3. Server proxy fallback (only succeeds when proxy forwarded real public client IP header)
  const serverIp = await fetchJsonWithTimeout('/api/ip-location', 4500);
  if (serverIp?.ok && typeof serverIp.lat === 'number' && typeof serverIp.lng === 'number') {
    return {
      lat: serverIp.lat,
      lng: serverIp.lng,
      city: serverIp.city || '',
      region: serverIp.region || '',
      country: serverIp.country || '',
    };
  }

  return null;
}

async function reverseGeocodeWithFallback(
  lat: number,
  lng: number
): Promise<{ label: string; fullAddress: string }> {
  // 1. Primary server-side reverse geocode (Nominatim + BigDataCloud)
  const geo = await fetchJsonWithTimeout(`/api/reverse-geocode?lat=${lat}&lng=${lng}`, 5000);
  if (geo?.ok && (geo.label || geo.fullAddress)) {
    return {
      label: geo.label || '',
      fullAddress: geo.fullAddress || geo.label || '',
    };
  }

  // 2. Direct client-side BigDataCloud reverse-geocode fallback
  const data = await fetchJsonWithTimeout(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
    4500
  );
  if (data) {
    const locality = data?.locality || '';
    const city = (data?.city || data?.principalSubdivision || '').replace(/\s+Division$/i, '').trim();
    const label = [locality, city].filter((v, i, arr) => v && arr.indexOf(v) === i).join(', ');
    if (label) {
      return {
        label,
        fullAddress: [label, data?.countryName].filter(Boolean).join(', '),
      };
    }
  }

  return { label: '', fullAddress: '' };
}

export function LocationModal({
  open,
  initialAreaId,
  initialOrderType,
  initialDetectedCoords,
  initialDetectedAddress,
  canClose,
  onClose,
  onConfirm,
}: LocationModalProps) {
  const [orderType, setOrderType] = useState<OrderType>(initialOrderType);
  const [selectedAreaId, setSelectedAreaId] = useState(initialAreaId);
  const [areaQuery, setAreaQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | undefined>(
    initialDetectedCoords
  );
  const [detectedAddress, setDetectedAddress] = useState<string | undefined>(initialDetectedAddress);
  const [geoStatus, setGeoStatus] = useState<{
    type: 'success' | 'warning' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (open) {
      setOrderType(initialOrderType);
      setSelectedAreaId(initialAreaId);
      setDetectedCoords(initialDetectedCoords);
      setDetectedAddress(initialDetectedAddress);
      setGeoStatus(null);
      setAreaQuery('');
    }
  }, [open, initialAreaId, initialOrderType, initialDetectedCoords, initialDetectedAddress]);

  const selectedArea = useMemo(
    () => KARACHI_AREAS.find((a) => a.id === selectedAreaId) || KARACHI_AREAS[0],
    [selectedAreaId]
  );

  const filteredAreas = useMemo(() => {
    const q = areaQuery.trim().toLowerCase();
    if (!q) return KARACHI_AREAS;
    return KARACHI_AREAS.filter(
      (a) => a.name.toLowerCase().includes(q) || a.zone.toLowerCase().includes(q)
    );
  }, [areaQuery]);

  const snapAndApplyLocation = async (
    lat: number,
    lng: number,
    accuracyM: number,
    source: 'gps-high' | 'gps-network' | 'ip',
    fallbackCityLabel?: string
  ) => {
    const isCoarseIp = source === 'ip' || accuracyM > 3500;
    const { label: revLabel, fullAddress: revFull } = isCoarseIp
      ? { label: fallbackCityLabel || '', fullAddress: fallbackCityLabel || '' }
      : await reverseGeocodeWithFallback(lat, lng);

    const snapped = snapCoordsToKarachiServiceArea(
      lat,
      lng,
      isCoarseIp ? undefined : revLabel || revFull || fallbackCityLabel
    );

    if (snapped.withinServiceRange) {
      setSelectedAreaId(snapped.area.id);

      if (isCoarseIp) {
        // City-level network IP is approximate (ISP hub), so keep area editable & ask user to confirm exact sector
        setDetectedCoords({ lat: snapped.area.lat, lng: snapped.area.lng });
        setDetectedAddress(undefined);
        setDropdownOpen(true);
        setGeoStatus({
          type: 'warning',
          text: `Detected ${fallbackCityLabel || 'Karachi'} via network IP (GPS unavailable). Selected ${snapped.area.name} — choose your exact sector below if needed.`,
        });
      } else {
        setDetectedCoords({ lat, lng });
        const displayLabel = revLabel || snapped.area.name;
        setDetectedAddress(displayLabel);
        setDropdownOpen(false);
        setGeoStatus({
          type: 'success',
          text: `Location detected: ${displayLabel} (${snapped.area.name}).`,
        });
      }
    } else {
      const outsideLabel = revLabel || fallbackCityLabel || `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
      setDetectedCoords(undefined);
      setDetectedAddress(undefined);
      setDropdownOpen(true);
      setGeoStatus({
        type: 'warning',
        text: `Network/GPS reported "${outsideLabel}" (outside Karachi delivery zone). Please select your Karachi area below.`,
      });
    }
  };

  const handleUseCurrentLocation = async () => {
    setDetecting(true);
    setGeoStatus(null);

    try {
      let permissionDenied = false;
      let blockedByIframePolicy = false;

      if (navigator.geolocation) {
        // Attempt 1: High-accuracy GPS
        try {
          const pos = await getBrowserPosition({
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 15000,
          });
          await snapAndApplyLocation(
            pos.coords.latitude,
            pos.coords.longitude,
            Math.round(pos.coords.accuracy || 0),
            'gps-high'
          );
          return;
        } catch (err1: any) {
          if (err1?.code === 1) {
            permissionDenied = true;
            if (/permissions?\s*policy|feature\s*policy/i.test(String(err1?.message || ''))) {
              blockedByIframePolicy = true;
            }
          } else {
            // Attempt 2: Wi-Fi / Network positioning via browser Geolocation API
            try {
              const pos = await getBrowserPosition({
                enableHighAccuracy: false,
                timeout: 8000,
                maximumAge: 180000,
              });
              await snapAndApplyLocation(
                pos.coords.latitude,
                pos.coords.longitude,
                Math.round(pos.coords.accuracy || 0),
                'gps-network'
              );
              return;
            } catch (err2: any) {
              if (err2?.code === 1) {
                permissionDenied = true;
                if (/permissions?\s*policy|feature\s*policy/i.test(String(err2?.message || ''))) {
                  blockedByIframePolicy = true;
                }
              }
            }
          }
        }
      }

      // Attempt 3: Direct client-side IP geolocation fallback (sees user's actual ISP IP)
      const ipData = await detectClientIpLocation();
      if (ipData) {
        const cityLabel = [ipData.city, ipData.region, ipData.country].filter(Boolean).join(', ');
        await snapAndApplyLocation(ipData.lat, ipData.lng, 5000, 'ip', cityLabel);
        return;
      }

      setGeoStatus({
        type: 'error',
        text: blockedByIframePolicy
          ? 'Browser preview blocked GPS access. Please search and select your Karachi area below.'
          : permissionDenied
          ? 'Location permission is blocked. Allow location access in your browser site settings or select your Karachi area below.'
          : 'Could not detect your GPS location automatically. Please choose your Karachi area below.',
      });
      setDropdownOpen(true);
    } finally {
      setDetecting(false);
    }
  };

  const handleSubmit = () => {
    onConfirm({
      area: selectedArea,
      orderType,
      coords: detectedCoords,
      detectedAddress,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md max-h-[92vh] flex flex-col rounded-2xl border border-red-500/25 bg-[#FFF8F8] dark:bg-[#16070A] text-[#1F0B0D] dark:text-white shadow-2xl overflow-hidden"
          >
            {/* Top Crimson Crest Header */}
            <div className="relative shrink-0 bg-gradient-to-r from-red-800 via-red-700 to-red-800 px-5 pt-5 pb-4 text-center text-white">
              {canClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close location selector"
                  className="absolute right-3 top-3 rounded-lg p-1.5 text-white/80 hover:bg-white/15 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <div className="mx-auto mb-2.5 h-14 w-14 rounded-full p-1 bg-white/20 shadow-lg">
                <img
                  src={RESTAURANT_INFO.logoUrl}
                  alt="DANNY PIZZA"
                  className="h-full w-full rounded-full object-cover bg-black"
                />
              </div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight">
                Select Your Order Type
              </h2>
              <p className="mt-0.5 text-xs text-red-100/90">
                Serving all across Karachi from{' '}
                <span className="whitespace-nowrap">North Karachi Sector 5-A/2</span>
              </p>
            </div>

            <div className="overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Order Type Segmented Selector */}
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-red-900/10 dark:bg-black/40 p-1">
                {(
                  [
                    { id: 'delivery', label: 'Delivery', icon: Truck },
                    { id: 'takeaway', label: 'Takeaway', icon: ShoppingBag },
                    { id: 'dine-in', label: 'Dine-In', icon: Utensils },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  const active = orderType === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setOrderType(tab.id)}
                      className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 px-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-red-600 text-white shadow-md'
                          : 'text-[#5C3337] dark:text-red-200/75 hover:text-red-700 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Use Current Location Button */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={detecting}
                  className="inline-flex items-center gap-2 rounded-full border border-red-600/35 bg-red-50 dark:bg-red-950/40 px-4 py-2 text-xs font-bold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Navigation className={`h-3.5 w-3.5 ${detecting ? 'animate-spin' : ''}`} />
                  <span>{detecting ? 'Detecting location...' : 'Use Current Location'}</span>
                </button>

                {geoStatus && (
                  <div
                    className={`mt-2.5 flex items-start gap-1.5 rounded-xl px-3 py-2 text-[11px] font-medium leading-snug w-full ${
                      geoStatus.type === 'success'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : geoStatus.type === 'warning'
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300'
                        : 'bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {geoStatus.type === 'success' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    )}
                    <span>{geoStatus.text}</span>
                  </div>
                )}
              </div>

              {/* Karachi Area Dropdown (All Karachi Areas) */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#5C3337] dark:text-red-200/80">
                    Select your area in Karachi
                  </label>
                  <span className="text-[11px] font-semibold text-red-700/80 dark:text-red-300/80 tabular-nums">
                    {KARACHI_AREAS.length} Areas
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-red-900/20 dark:border-red-500/25 bg-white dark:bg-[#230B10] px-3.5 py-3 text-left text-sm font-medium text-[#1F0B0D] dark:text-white hover:border-red-500 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <MapPin className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                    <span className="truncate">{detectedAddress || selectedArea.name}</span>
                  </span>
                  <span className="text-xs text-red-600 dark:text-red-400 font-semibold shrink-0">
                    {dropdownOpen ? 'Close' : 'Select'}
                  </span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mt-2 rounded-xl border border-red-900/20 dark:border-red-500/25 bg-white dark:bg-[#1E090D] shadow-xl overflow-hidden"
                    >
                      <div className="flex items-center gap-2 border-b border-red-900/10 dark:border-red-500/15 px-3 py-2">
                        <Search className="h-4 w-4 text-red-500 shrink-0" />
                        <input
                          type="text"
                          value={areaQuery}
                          onChange={(e) => setAreaQuery(e.target.value)}
                          placeholder="Search any Karachi area (e.g. Gulshan, DHA, Orangi, Malir)..."
                          className="w-full bg-transparent text-xs text-[#1F0B0D] dark:text-white placeholder:text-red-900/40 dark:placeholder:text-red-200/40 focus:outline-none"
                        />
                      </div>

                      <div className="max-h-52 overflow-y-auto divide-y divide-red-900/5 dark:divide-red-500/10">
                        {filteredAreas.map((area) => {
                          const isSelected = area.id === selectedArea.id;
                          return (
                            <button
                              key={area.id}
                              type="button"
                              onClick={() => {
                                setSelectedAreaId(area.id);
                                setDetectedCoords(undefined);
                                setDetectedAddress(undefined);
                                setGeoStatus(null);
                                setDropdownOpen(false);
                              }}
                              className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-red-600 text-white font-bold'
                                  : 'text-[#1F0B0D] dark:text-red-50 hover:bg-red-50 dark:hover:bg-red-950/60'
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <p className="truncate">{area.name}</p>
                                <p
                                  className={`text-[10px] truncate ${
                                    isSelected
                                      ? 'text-red-100'
                                      : 'text-[#5C3337]/75 dark:text-red-200/60'
                                  }`}
                                >
                                  {area.zone}
                                </p>
                              </div>
                              {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                            </button>
                          );
                        })}
                        {filteredAreas.length === 0 && (
                          <div className="px-3.5 py-4 text-center text-xs text-red-900/50 dark:text-red-200/50">
                            No matching Karachi area found.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/25 transition-transform active:scale-[0.98] cursor-pointer"
              >
                Confirm &amp; View Menu
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
