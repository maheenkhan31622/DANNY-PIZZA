import type { KarachiArea } from '../types';

export const KARACHI_AREAS: KarachiArea[] = [
  // North Karachi & New Karachi
  { id: 'north-karachi-5a2', name: 'North Karachi - Sector 5-A/2 (Near Zahid Biryani)', zone: 'North Karachi', lat: 24.9854, lng: 67.0648 },
  { id: 'north-karachi-5a1', name: 'North Karachi - Sector 5-A/1 & 5-A/3', zone: 'North Karachi', lat: 24.9838, lng: 67.0622 },
  { id: 'north-karachi-5b', name: 'North Karachi - Sector 5-B', zone: 'North Karachi', lat: 24.9862, lng: 67.0675 },
  { id: 'north-karachi-5c', name: 'North Karachi - Sector 5-C', zone: 'North Karachi', lat: 24.9875, lng: 67.0601 },
  { id: 'north-karachi-5d', name: 'North Karachi - Sector 5-D', zone: 'North Karachi', lat: 24.9912, lng: 67.0582 },
  { id: 'north-karachi-7d', name: 'North Karachi - Sector 7-D (1 to 4)', zone: 'North Karachi', lat: 24.9742, lng: 67.0558 },
  { id: 'north-karachi-8', name: 'North Karachi - Sector 8 & 9', zone: 'North Karachi', lat: 24.9774, lng: 67.0596 },
  { id: 'north-karachi-11a', name: 'North Karachi - Sector 11-A', zone: 'North Karachi', lat: 24.9798, lng: 67.0695 },
  { id: 'north-karachi-11b', name: 'North Karachi - Sector 11-B', zone: 'North Karachi', lat: 24.9756, lng: 67.0631 },
  { id: 'north-karachi-11c', name: 'North Karachi - Sector 11-C', zone: 'North Karachi', lat: 24.9821, lng: 67.0539 },
  { id: 'north-karachi-11l', name: 'North Karachi - Sector 11-L & 11-I', zone: 'North Karachi', lat: 24.9882, lng: 67.0742 },
  { id: 'up-more', name: 'UP More / North Karachi', zone: 'North Karachi', lat: 24.9762, lng: 67.0688 },
  { id: 'power-house', name: 'Power House Chowrangi', zone: 'North Karachi', lat: 24.9889, lng: 67.0698 },
  { id: 'nagan-chowrangi', name: 'Nagan Chowrangi', zone: 'North Karachi', lat: 24.9665, lng: 67.0667 },
  { id: 'saleem-center', name: 'Saleem Center / Sindhi Hotel', zone: 'New Karachi', lat: 24.9935, lng: 67.0694 },
  { id: 'new-karachi', name: 'New Karachi - Sectors 5-E / 5-G / 5-J', zone: 'New Karachi', lat: 24.9964, lng: 67.0752 },
  { id: 'new-karachi-11f', name: 'New Karachi - Sectors 11-D / 11-E / 11-F', zone: 'New Karachi', lat: 25.0012, lng: 67.0698 },
  { id: 'godhra-camp', name: 'Godhra Camp / New Karachi Industrial', zone: 'New Karachi', lat: 24.9942, lng: 67.0815 },
  { id: 'surjani-town', name: 'Surjani Town (Sectors 4, 5, 7, 10)', zone: 'Surjani', lat: 25.0256, lng: 67.0642 },
  { id: 'khuda-ki-basti', name: 'Khuda Ki Basti / Taiser Town', zone: 'Surjani', lat: 25.0445, lng: 67.0585 },

  // Shadman, Buffer Zone & North Nazimabad
  { id: 'shadman-1', name: 'Shadman Town - Sector 14-A', zone: 'North Karachi', lat: 24.9598, lng: 67.0558 },
  { id: 'shadman-2', name: 'Shadman Town - Sector 14-B', zone: 'North Karachi', lat: 24.9625, lng: 67.0504 },
  { id: 'bufferzone-15a', name: 'Buffer Zone - Sector 15-A (1 to 5)', zone: 'Buffer Zone', lat: 24.9562, lng: 67.0672 },
  { id: 'bufferzone-15b', name: 'Buffer Zone - Sector 15-B', zone: 'Buffer Zone', lat: 24.9524, lng: 67.0621 },
  { id: 'bufferzone-16a', name: 'Buffer Zone - Sector 16-A & Haroon Royal', zone: 'Buffer Zone', lat: 24.9605, lng: 67.0642 },
  { id: 'sakhi-hassan', name: 'Sakhi Hassan Chowrangi', zone: 'North Nazimabad', lat: 24.9519, lng: 67.0518 },
  { id: 'five-star', name: 'Five Star Chowrangi', zone: 'North Nazimabad', lat: 24.9408, lng: 67.0439 },
  { id: 'kda-chowrangi', name: 'KDA Chowrangi / Hyderi Market', zone: 'North Nazimabad', lat: 24.9378, lng: 67.0405 },
  { id: 'north-nazimabad-a', name: 'North Nazimabad - Block A & B', zone: 'North Nazimabad', lat: 24.9315, lng: 67.0418 },
  { id: 'north-nazimabad-c', name: 'North Nazimabad - Block C & D', zone: 'North Nazimabad', lat: 24.9385, lng: 67.0505 },
  { id: 'north-nazimabad-f', name: 'North Nazimabad - Block E, F & G', zone: 'North Nazimabad', lat: 24.9345, lng: 67.0321 },
  { id: 'north-nazimabad-h', name: 'North Nazimabad - Block H & I', zone: 'North Nazimabad', lat: 24.9442, lng: 67.0415 },
  { id: 'north-nazimabad-j', name: 'North Nazimabad - Block J & K', zone: 'North Nazimabad', lat: 24.9498, lng: 67.0396 },
  { id: 'north-nazimabad-l', name: 'North Nazimabad - Block L & M', zone: 'North Nazimabad', lat: 24.9532, lng: 67.0468 },
  { id: 'north-nazimabad-n', name: 'North Nazimabad - Block N, P & Q', zone: 'North Nazimabad', lat: 24.9595, lng: 67.0484 },
  { id: 'north-nazimabad-r', name: 'North Nazimabad - Block R, S & T (Nusrat Bhutto)', zone: 'North Nazimabad', lat: 24.9628, lng: 67.0408 },
  { id: 'pahar-ganj', name: 'Pahar Ganj / Nusrat Bhutto Colony', zone: 'North Nazimabad', lat: 24.9548, lng: 67.0342 },

  // FB Area, Gulberg & Central Karachi
  { id: 'sohrab-goth', name: 'Sohrab Goth / Al-Asif Square', zone: 'Gulberg / Super Hwy', lat: 24.9452, lng: 67.0889 },
  { id: 'water-pump', name: 'Water Pump (FB Area Block 16)', zone: 'Federal B Area', lat: 24.9398, lng: 67.0754 },
  { id: 'ayesha-manzil', name: 'Ayesha Manzil (FB Area Block 7)', zone: 'Federal B Area', lat: 24.9267, lng: 67.0654 },
  { id: 'karimabad', name: 'Karimabad (FB Area Block 3 & 4)', zone: 'Federal B Area', lat: 24.9182, lng: 67.0568 },
  { id: 'azizabad', name: 'Azizabad / Mukka Chowk (FB Area Block 2 & 8)', zone: 'Federal B Area', lat: 24.9225, lng: 67.0688 },
  { id: 'fb-area-5', name: 'Federal B Area - Block 1, 5 & 6 (Dastagir)', zone: 'Federal B Area', lat: 24.9288, lng: 67.0608 },
  { id: 'fb-area-9', name: 'Federal B Area - Block 9, 10 & 11', zone: 'Federal B Area', lat: 24.9345, lng: 67.0658 },
  { id: 'fb-area-12', name: 'Federal B Area - Block 12 & 15', zone: 'Federal B Area', lat: 24.9312, lng: 67.0734 },
  { id: 'fb-area-13', name: 'Federal B Area - Block 13 & 17', zone: 'Federal B Area', lat: 24.9344, lng: 67.0792 },
  { id: 'fb-area-14', name: 'Federal B Area - Block 14 (Naseerabad)', zone: 'Federal B Area', lat: 24.9378, lng: 67.0825 },
  { id: 'fb-area-18', name: 'Federal B Area - Block 18 & 19 (Samanabad)', zone: 'Federal B Area', lat: 24.9438, lng: 67.0748 },
  { id: 'ancholi', name: 'Ancholi (FB Area Block 20 & 21)', zone: 'Federal B Area', lat: 24.9482, lng: 67.0791 },
  { id: 'gulberg', name: 'Gulberg Town / Shafiq More', zone: 'Gulberg', lat: 24.9428, lng: 67.0699 },
  { id: 'nazimabad-1', name: 'Nazimabad No. 1 to 4', zone: 'Nazimabad', lat: 24.9125, lng: 67.0322 },
  { id: 'nazimabad-5', name: 'Nazimabad No. 5, 6 & 7 (Paposh Nagar)', zone: 'Nazimabad', lat: 24.9188, lng: 67.0265 },
  { id: 'liaquatabad', name: 'Liaquatabad (No. 1 to 10 / Dak Khana)', zone: 'Central', lat: 24.9041, lng: 67.0467 },
  { id: 'sharifabad', name: 'Sharifabad / Essa Nagri', zone: 'Central', lat: 24.9082, lng: 67.0582 },
  { id: 'golimar', name: 'Golimar / Gulbahar', zone: 'Central', lat: 24.8998, lng: 67.0258 },

  // West Karachi (Orangi, SITE, Baldia, Manghopir, Hawksbay)
  { id: 'orangi-town', name: 'Orangi Town (Sectors 1 to 16)', zone: 'West', lat: 24.9468, lng: 67.0012 },
  { id: 'qasba-colony', name: 'Qasba Colony / Banaras Chowk', zone: 'West', lat: 24.9325, lng: 67.0095 },
  { id: 'manghopir', name: 'Manghopir / Sultanabad', zone: 'West', lat: 24.9788, lng: 67.0185 },
  { id: 'site-area', name: 'SITE Industrial Area / Metroville', zone: 'West', lat: 24.9065, lng: 66.9965 },
  { id: 'baldia-town', name: 'Baldia Town / Saeedabad', zone: 'West', lat: 24.9185, lng: 66.9632 },
  { id: 'sher-shah', name: 'Sher Shah / Mauripur', zone: 'West', lat: 24.8832, lng: 66.9828 },
  { id: 'hawkesbay', name: 'Hawkesbay / Kemari / Manora', zone: 'West', lat: 24.8395, lng: 66.9735 },

  // Gulshan-e-Iqbal, Gulistan-e-Johar & Scheme 33
  { id: 'gulshan-13d', name: 'Gulshan-e-Iqbal - Block 13-D & 13-A/B/C', zone: 'Gulshan', lat: 24.9189, lng: 67.0885 },
  { id: 'gulshan-2', name: 'Gulshan-e-Iqbal - Blocks 1 to 7', zone: 'Gulshan', lat: 24.9261, lng: 67.0987 },
  { id: 'gulshan-10', name: 'Gulshan-e-Iqbal - Blocks 8 to 11', zone: 'Gulshan', lat: 24.9102, lng: 67.1058 },
  { id: 'gulshan-14', name: 'Gulshan-e-Iqbal - Blocks 14 to 19 (Civic Centre / Hasan Square)', zone: 'Gulshan', lat: 24.8992, lng: 67.0825 },
  { id: 'pibm-university-rd', name: 'University Road / NIPA / Baitul Mukarram', zone: 'Gulshan', lat: 24.9178, lng: 67.0975 },
  { id: 'gulistan-johar-1', name: 'Gulistan-e-Johar - Blocks 1 to 10', zone: 'Johar', lat: 24.9205, lng: 67.1312 },
  { id: 'gulistan-johar-15', name: 'Gulistan-e-Johar - Blocks 11 to 20', zone: 'Johar', lat: 24.9124, lng: 67.1426 },
  { id: 'pahalwan-goth', name: 'Pehlwan Goth / Johar Chowrangi', zone: 'Johar', lat: 24.9138, lng: 67.1525 },
  { id: 'safoora-goth', name: 'Safoora Goth / Mosamyat', zone: 'Scheme 33', lat: 24.9465, lng: 67.1495 },
  { id: 'scheme-33', name: 'Scheme 33 (Gulzar-e-Hijri / Abul Hasan Ispahani)', zone: 'Scheme 33', lat: 24.9562, lng: 67.1438 },
  { id: 'gulshan-kaneez', name: 'Gulshan-e-Kaneez Fatima / Sachal Goth', zone: 'Scheme 33', lat: 24.9695, lng: 67.1338 },
  { id: 'gulshan-maymar', name: 'Gulshan-e-Maymar / Sector X, Y, Z', zone: 'Gadap', lat: 25.0185, lng: 67.1294 },
  { id: 'ahsanabad', name: 'Ahsanabad / Super Highway Toll Plaza', zone: 'Gadap', lat: 25.0055, lng: 67.1558 },

  // East Karachi (Bahadurabad, PECHS, Tariq Road, Jamshed Town, Shahrah-e-Faisal)
  { id: 'bahadurabad', name: 'Bahadurabad / Sharfabad / Dhoraji', zone: 'East', lat: 24.8819, lng: 67.0689 },
  { id: 'kda-scheme-1', name: 'KDA Scheme 1 / Karsaz / National Stadium', zone: 'East', lat: 24.8895, lng: 67.0842 },
  { id: 'pechs', name: 'PECHS - Blocks 2 & 6', zone: 'East', lat: 24.8689, lng: 67.0631 },
  { id: 'pechs-3', name: 'PECHS - Blocks 1, 3, 4 & 5', zone: 'East', lat: 24.8642, lng: 67.0525 },
  { id: 'tariq-road', name: 'Tariq Road / Khalid Bin Waleed Road', zone: 'East', lat: 24.8726, lng: 67.0588 },
  { id: 'nursery', name: 'Nursery / Baloch Colony', zone: 'East', lat: 24.8595, lng: 67.0668 },
  { id: 'shahrah-faisal', name: 'Shahrah-e-Faisal (Drigh Road to Lal Kothi)', zone: 'East', lat: 24.8648, lng: 67.0792 },
  { id: 'jamshed-road', name: 'Jamshed Road / Guru Mandir / PIB Colony', zone: 'East', lat: 24.8868, lng: 67.0492 },
  { id: 'mahmudabad', name: 'Mehmoodabad / Manzoor Colony / Kashmir Colony', zone: 'East', lat: 24.8525, lng: 67.0748 },
  { id: 'akhtar-colony', name: 'Akhtar Colony / Defence View / Qayyumabad', zone: 'East', lat: 24.8415, lng: 67.0812 },

  // South & Old Karachi (Saddar, Garden, Lyari, Clifton, DHA)
  { id: 'garden', name: 'Garden East & Garden West', zone: 'South', lat: 24.8744, lng: 67.0225 },
  { id: 'soldier-bazaar', name: 'Soldier Bazaar / Lasbela', zone: 'South', lat: 24.8842, lng: 67.0315 },
  { id: 'saddar', name: 'Saddar / Empress Market / Zainab Market', zone: 'South', lat: 24.8556, lng: 67.0241 },
  { id: 'burns-road', name: 'Burns Road / I.I. Chundrigar Road / Pakistan Chowk', zone: 'South', lat: 24.8548, lng: 67.0128 },
  { id: 'civil-lines', name: 'Civil Lines / PIDC / Cantt Station', zone: 'South', lat: 24.8468, lng: 67.0315 },
  { id: 'kharadar', name: 'Kharadar / Mithadar / Tower / Bolton Market', zone: 'South', lat: 24.8528, lng: 66.9985 },
  { id: 'lyari', name: 'Lyari (Baghdadi, Chakiwara, Kalakot)', zone: 'South', lat: 24.8698, lng: 66.9942 },
  { id: 'clifton', name: 'Clifton - Blocks 1 to 5 (Boat Basin / Seaview)', zone: 'South', lat: 24.8138, lng: 67.0305 },
  { id: 'clifton-6-9', name: 'Clifton - Blocks 6 to 9 (Teen Talwar / Do Talwar)', zone: 'South', lat: 24.8255, lng: 67.0365 },
  { id: 'gizri', name: 'Gizri / Punjab Colony / Delhi Colony', zone: 'South', lat: 24.8285, lng: 67.0495 },
  { id: 'dha-1-5', name: 'DHA Phase 1, 2, 4 & 5', zone: 'South', lat: 24.8195, lng: 67.0612 },
  { id: 'dha-6-8', name: 'DHA Phase 6, 7 & 8', zone: 'South', lat: 24.7912, lng: 67.0731 },

  // Malir, Shah Faisal, Korangi & Highway
  { id: 'shah-faisal-colony', name: 'Shah Faisal Colony (1 to 5)', zone: 'Korangi / Malir', lat: 24.8812, lng: 67.1488 },
  { id: 'drigh-road-cantt', name: 'PAF Base Faisal / Askari 4 / Gulistan Society', zone: 'East', lat: 24.8845, lng: 67.1225 },
  { id: 'model-colony', name: 'Model Colony / Airport / Jinnah Terminal', zone: 'Malir', lat: 24.9012, lng: 67.1842 },
  { id: 'malir-cantt', name: 'Malir Cantt (Phases & Sectors)', zone: 'Malir', lat: 24.9385, lng: 67.2045 },
  { id: 'malir-city', name: 'Malir City / Saudabad / Kala Board', zone: 'Malir', lat: 24.8925, lng: 67.1985 },
  { id: 'malir-halt', name: 'Malir Halt / Khokhrapar / Liaquat Market', zone: 'Malir', lat: 24.8855, lng: 67.1852 },
  { id: 'korangi', name: 'Korangi (No. 1 to 6 / Zaman Town)', zone: 'Korangi', lat: 24.8355, lng: 67.1318 },
  { id: 'korangi-crossing', name: 'Korangi Crossing / Korangi Industrial Area', zone: 'Korangi', lat: 24.8282, lng: 67.1105 },
  { id: 'landhi', name: 'Landhi (No. 1 to 6 / Babar Market)', zone: 'Korangi', lat: 24.8442, lng: 67.1945 },
  { id: 'quaidabad', name: 'Quaidabad / Bhains Colony', zone: 'Malir', lat: 24.8525, lng: 67.2245 },
  { id: 'steel-town', name: 'Steel Town / Gulshan-e-Hadeed / Bin Qasim', zone: 'Malir', lat: 24.8595, lng: 67.3385 },
  { id: 'bahria-town', name: 'Bahria Town Karachi / Precincts', zone: 'Highway', lat: 25.0721, lng: 67.3264 },
];

export function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestKarachiAreaWithDistance(
  lat: number,
  lng: number
): { area: KarachiArea; distanceKm: number } {
  let nearest = KARACHI_AREAS[0];
  let bestDist = Infinity;
  for (const area of KARACHI_AREAS) {
    const dist = haversineDistanceKm(lat, lng, area.lat, area.lng);
    if (dist < bestDist) {
      bestDist = dist;
      nearest = area;
    }
  }
  return { area: nearest, distanceKm: bestDist };
}

export function findNearestKarachiArea(lat: number, lng: number): KarachiArea {
  return findNearestKarachiAreaWithDistance(lat, lng).area;
}

const AREA_KEYWORDS: { id: string; patterns: RegExp[] }[] = [
  { id: 'north-karachi-5a2', patterns: [/5[-\s]?a\/?2/i, /zahid biryani/i] },
  { id: 'north-karachi-5a1', patterns: [/5[-\s]?a\/?[13]/i] },
  { id: 'north-karachi-5b', patterns: [/5[-\s]?b/i] },
  { id: 'north-karachi-5c', patterns: [/5[-\s]?c/i] },
  { id: 'north-karachi-5d', patterns: [/5[-\s]?d/i] },
  { id: 'north-karachi-7d', patterns: [/7[-\s]?d/i] },
  { id: 'north-karachi-11a', patterns: [/11[-\s]?a/i] },
  { id: 'north-karachi-11b', patterns: [/11[-\s]?b/i] },
  { id: 'north-karachi-11c', patterns: [/11[-\s]?c/i] },
  { id: 'up-more', patterns: [/up\s?more/i, /u\.p\.\s?more/i] },
  { id: 'power-house', patterns: [/power\s?house/i] },
  { id: 'nagan-chowrangi', patterns: [/nagan/i] },
  { id: 'new-karachi', patterns: [/new karachi/i] },
  { id: 'surjani-town', patterns: [/surjani/i] },
  { id: 'shadman-1', patterns: [/shadman.*14[-\s]?a/i, /sector\s?14[-\s]?a/i] },
  { id: 'shadman-2', patterns: [/shadman.*14[-\s]?b/i, /sector\s?14[-\s]?b/i, /shadman/i] },
  { id: 'bufferzone-15a', patterns: [/15[-\s]?a/i] },
  { id: 'bufferzone-15b', patterns: [/15[-\s]?b/i, /buffer\s?zone/i] },
  { id: 'sakhi-hassan', patterns: [/sakhi\s?hassan/i] },
  { id: 'five-star', patterns: [/five\s?star/i, /5\s?star/i] },
  { id: 'kda-chowrangi', patterns: [/hyderi/i, /kda\s?chowrangi/i] },
  { id: 'sohrab-goth', patterns: [/sohrab\s?goth/i, /al[-\s]?asif/i] },
  { id: 'water-pump', patterns: [/water\s?pump/i, /block\s?16/i] },
  { id: 'ayesha-manzil', patterns: [/ayesha\s?manzil/i] },
  { id: 'karimabad', patterns: [/karimabad/i] },
  { id: 'azizabad', patterns: [/azizabad/i, /mukka\s?chowk/i] },
  { id: 'ancholi', patterns: [/ancholi/i, /block\s?20/i] },
  { id: 'gulberg', patterns: [/gulberg/i] },
  { id: 'nazimabad-5', patterns: [/paposh/i] },
  { id: 'nazimabad-1', patterns: [/nazimabad/i] },
  { id: 'liaquatabad', patterns: [/liaquatabad/i, /lalu\s?khet/i] },
  { id: 'orangi-town', patterns: [/orangi/i] },
  { id: 'site-area', patterns: [/s\.?i\.?t\.?e/i, /metroville/i] },
  { id: 'baldia-town', patterns: [/baldia/i] },
  { id: 'gulshan-13d', patterns: [/13[-\s]?d/i] },
  { id: 'gulshan-2', patterns: [/gulshan.*iqbal/i] },
  { id: 'gulistan-johar-1', patterns: [/gulistan.*johar/i, /jauhar/i] },
  { id: 'safoora-goth', patterns: [/safoora/i] },
  { id: 'scheme-33', patterns: [/scheme\s?33/i, /gulzar[-\s]?e[-\s]?hijri/i] },
  { id: 'gulshan-maymar', patterns: [/maymar/i] },
  { id: 'bahadurabad', patterns: [/bahadurabad/i, /dhoraji/i] },
  { id: 'pechs', patterns: [/p\.?e\.?c\.?h\.?s/i] },
  { id: 'tariq-road', patterns: [/tariq\s?road/i] },
  { id: 'garden', patterns: [/garden\s?(east|west)/i] },
  { id: 'soldier-bazaar', patterns: [/soldier\s?bazaar/i] },
  { id: 'saddar', patterns: [/saddar/i] },
  { id: 'lyari', patterns: [/lyari/i] },
  { id: 'shahrah-faisal', patterns: [/shahrah[-\s]?e?[-\s]?faisal/i] },
  { id: 'clifton', patterns: [/clifton/i] },
  { id: 'dha-6-8', patterns: [/dha.*phase\s?[678]/i, /phase\s?[678]/i] },
  { id: 'dha-1-5', patterns: [/dha/i, /defence/i] },
  { id: 'shah-faisal-colony', patterns: [/shah\s?faisal/i] },
  { id: 'model-colony', patterns: [/model\s?colony/i] },
  { id: 'malir-cantt', patterns: [/malir\s?cantt/i] },
  { id: 'malir-city', patterns: [/malir/i, /saudabad/i] },
  { id: 'korangi', patterns: [/korangi/i] },
  { id: 'landhi', patterns: [/landhi/i] },
  { id: 'steel-town', patterns: [/steel\s?town/i, /hadeed/i] },
  { id: 'bahria-town', patterns: [/bahria\s?town/i] },
];

export interface SnappedServiceAreaResult {
  area: KarachiArea;
  distanceKm: number;
  withinServiceRange: boolean;
  matchMethod: 'address-and-coords' | 'nearest-coords';
}

export function snapCoordsToKarachiServiceArea(
  lat: number,
  lng: number,
  addressText?: string
): SnappedServiceAreaResult {
  const nearest = findNearestKarachiAreaWithDistance(lat, lng);
  const withinServiceRange = nearest.distanceKm <= 45;

  if (addressText && withinServiceRange) {
    let bestKeywordArea: KarachiArea | null = null;
    let bestKeywordDist = Infinity;

    for (const entry of AREA_KEYWORDS) {
      if (entry.patterns.some((rx) => rx.test(addressText))) {
        const candidate = KARACHI_AREAS.find((a) => a.id === entry.id);
        if (candidate) {
          const dist = haversineDistanceKm(lat, lng, candidate.lat, candidate.lng);
          if (dist <= 15 && dist < bestKeywordDist) {
            bestKeywordDist = dist;
            bestKeywordArea = candidate;
          }
        }
      }
    }

    if (bestKeywordArea) {
      return {
        area: bestKeywordArea,
        distanceKm: bestKeywordDist,
        withinServiceRange: true,
        matchMethod: 'address-and-coords',
      };
    }
  }

  return {
    area: nearest.area,
    distanceKm: nearest.distanceKm,
    withinServiceRange,
    matchMethod: 'nearest-coords',
  };
}

export function matchKarachiAreaFromCoordsAndText(
  lat: number,
  lng: number,
  addressText?: string
): { area: KarachiArea; distanceKm: number } {
  const res = snapCoordsToKarachiServiceArea(lat, lng, addressText);
  return { area: res.area, distanceKm: res.distanceKm };
}
