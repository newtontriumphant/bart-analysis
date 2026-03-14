'use strict';
const CORS_PROXY = 'https://corsproxy.io/?';

(function() {
    const bg = document.getElementById('hero-parallax');
    if (bg) {
        window.addEventListener('scroll', () => {
            bg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.28}px)`;
        }, { passive: true });
    }

    const links = document.querySelectorAll('.nav-links a');
    const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href')));
    window.addEventListener('scroll', () => {
        let cur = 0;
        sections.forEach((el, i) => { if (el && window.scrollY + 80 >= el.offsetTop) cur = i; });
links.forEach((l, i) => l.classList.toggle('active', i === cur));
}, { passive: true });
})();
 
(function() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
    document.querySelectorAll('.fu, .tl-item').forEach(el => io.observe(el));

    const fundsec = document.getElementById('fund-section');
    if (fundsec) {
        const io2 = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fundsec.querySelectorAll('.fb-fill').forEach (f => { f.style.width = f.dataset.pct + '%'; });
                io2.disconnect();
            }
        }, { threshold: 0.3 });
        io2.observe(fundsec);
    }
})();

(function() {
  const canvas = document.getElementById('budget-canvas');
  if (!canvas) return;
  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['2018','2019','2020','2021','2022','2023'],
      datasets: [
        { label: 'Farebox',      data: [685,721,227,98,268,398],  backgroundColor:'rgba(245,166,35,.75)', borderRadius:2 },
        { label: 'Property Tax', data: [502,526,541,560,598,620],  backgroundColor:'rgba(0,153,216,.7)',  borderRadius:2 },
        { label: 'Federal',      data: [248,261,410,785,390,330],  backgroundColor:'rgba(77,184,72,.7)',  borderRadius:2 },
        { label: 'State',        data: [135,148,192,220,185,168],  backgroundColor:'rgba(245,210,0,.65)', borderRadius:2 },
        { label: 'Other',        data: [58,62,44,39,52,60],        backgroundColor:'rgba(100,100,100,.5)',borderRadius:2 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: {
        legend: { labels: { color:'#7a7770', font:{ family:'Space Mono', size:10 }, boxWidth:10, padding:14 } },
        tooltip: {
          backgroundColor:'#1a1a1a', borderColor:'#282828', borderWidth:1,
          titleColor:'#e6e3dc', bodyColor:'#7a7770',
          callbacks: { label: c => ` ${c.dataset.label}: $${c.parsed.y}M` }
        }
      },
      scales: {
        x: { stacked:true, ticks:{ color:'#7a7770', font:{family:'Space Mono',size:10} }, grid:{ color:'rgba(255,255,255,.03)' } },
        y: { stacked:true, ticks:{ color:'#7a7770', font:{family:'Space Mono',size:10}, callback: v=>'$'+v+'M' }, grid:{ color:'rgba(255,255,255,.05)' } }
      }
    }
  });
})();

/* BART DATA: see bart-data.py */

const BART_STATIONS = {
  ANTC: { name:'Antioch',                lat:37.995388, lng:-121.780420 },
  ASHB: { name:'Ashby',                  lat:37.852960, lng:-122.270062 },
  BALB: { name:'Balboa Park',            lat:37.722800, lng:-122.447578 },
  BAYF: { name:'Bay Fair',               lat:37.696924, lng:-122.126908 },
  BERY: { name:'Berryessa/N. San José',  lat:37.398000, lng:-121.874700 },
  CAST: { name:'Castro Valley',          lat:37.690746, lng:-122.075801 },
  CIVC: { name:'Civic Center/UN Plaza',  lat:37.779528, lng:-122.413817 },
  COLM: { name:'Colma',                  lat:37.684638, lng:-122.466233 },
  COLS: { name:'Coliseum',               lat:37.754006, lng:-122.197273 },
  CONC: { name:'Concord',                lat:37.973737, lng:-122.029095 },
  DALY: { name:'Daly City',              lat:37.706120, lng:-122.469081 },
  DBRK: { name:'Downtown Berkeley',      lat:37.869867, lng:-122.268045 },
  DELN: { name:'El Cerrito del Norte',   lat:37.925655, lng:-122.317218 },
  DUBL: { name:'Dublin/Pleasanton',      lat:37.701687, lng:-121.900586 },
  ECCR: { name:'El Cerrito Plaza',       lat:37.892110, lng:-122.298460 },
  EMBR: { name:'Embarcadero',            lat:37.792976, lng:-122.396742 },
  FTVL: { name:'Fruitvale',              lat:37.774963, lng:-122.224274 },
  FRMT: { name:'Fremont',                lat:37.557355, lng:-121.976432 },
  GLEN: { name:'Glen Park',              lat:37.732969, lng:-122.434209 },
  HAYW: { name:'Hayward',                lat:37.670387, lng:-122.088002 },
  '12TH': { name:'12th St. Oakland',     lat:37.803317, lng:-122.271604 },
  '19TH': { name:'19th St. Oakland',     lat:37.808350, lng:-122.268602 },
  LAKE: { name:'Lake Merritt',           lat:37.797484, lng:-122.265990 },
  LAFY: { name:'Lafayette',              lat:37.893394, lng:-122.124673 },
  MCAR: { name:'MacArthur',              lat:37.828415, lng:-122.267227 },
  MLBR: { name:'Millbrae',               lat:37.599537, lng:-122.386234 },
  MLPT: { name:'Milpitas',               lat:37.434477, lng:-121.885449 },
  MONT: { name:'Montgomery St.',         lat:37.789256, lng:-122.401407 },
  NBRK: { name:'North Berkeley',         lat:37.874090, lng:-122.283881 },
  NCON: { name:'North Concord/Martinez', lat:37.936540, lng:-122.026011 },
  OAKL: { name:'Oakland Airport',        lat:37.713238, lng:-122.212191 },
  ORIN: { name:'Orinda',                 lat:37.878361, lng:-122.183791 },
  PHIL: { name:'Pleasant Hill/CBC',      lat:37.928403, lng:-122.056847 },
  PITT: { name:'Pittsburg/Bay Point',    lat:37.909054, lng:-121.884740 },
  PLZA: { name:'El Cerrito Plaza',       lat:37.902632, lng:-122.298904 },
  POWL: { name:'Powell St.',             lat:37.784200, lng:-122.408091 },
  RICH: { name:'Richmond',               lat:37.937015, lng:-122.353099 },
  ROCK: { name:'Rockridge',              lat:37.844601, lng:-122.251793 },
  SANL: { name:'San Leandro',            lat:37.722832, lng:-122.160830 },
  SFIA: { name:'SFO Airport',            lat:37.615966, lng:-122.392409 },
  SHAY: { name:'South Hayward',          lat:37.634800, lng:-122.057408 },
  SSAN: { name:'South San Francisco',    lat:37.664480, lng:-122.443796 },
  UCTY: { name:'Union City',             lat:37.590762, lng:-122.017388 },
  WARM: { name:'Warm Springs/S. Fremont',lat:37.502480, lng:-121.939313 },
  WCRK: { name:'Walnut Creek',           lat:37.905628, lng:-122.067545 },
  WDUB: { name:'West Dublin/Pleasanton', lat:37.699800, lng:-121.928360 },
  WOAK: { name:'West Oakland',           lat:37.804872, lng:-122.294969 },
  '16TH': { name:'16th St. Mission',     lat:37.765062, lng:-122.419694 },
  '24TH': { name:'24th St. Mission',     lat:37.752240, lng:-122.418143 },
};

const BART_LINE_SEQS = {
  RED:    ['RICH','DELN','PLZA','ECCR','NBRK','DBRK','ASHB','MCAR','19TH','12TH','WOAK','EMBR','MONT','POWL','CIVC','16TH','24TH','GLEN','BALB','DALY','COLM','SSAN','SFIA','MLBR'],
  YELLOW: ['ANTC','PITT','NCON','CONC','PHIL','WCRK','LAFY','ORIN','ROCK','MCAR','19TH','12TH','WOAK','EMBR','MONT','POWL','CIVC','16TH','24TH','GLEN','BALB','DALY','COLM','SSAN','SFIA','MLBR'],
  ORANGE: ['RICH','DELN','PLZA','ECCR','NBRK','DBRK','ASHB','MCAR','19TH','12TH','LAKE','FTVL','COLS','SANL','BAYF','HAYW','SHAY','UCTY','FRMT','WARM','MLPT','BERY'],
  BLUE:   ['DUBL','WDUB','CAST','BAYF','SANL','COLS','FTVL','LAKE','12TH','WOAK','EMBR','MONT','POWL','CIVC','16TH','24TH','GLEN','BALB','DALY'],
  GREEN:  ['BERY','MLPT','WARM','FRMT','UCTY','SHAY','HAYW','BAYF','SANL','COLS','FTVL','LAKE','12TH','WOAK','EMBR','MONT','POWL','CIVC','16TH','24TH','GLEN','BALB','DALY'],
};

const BART_LINE_COLORS = {
  RED: '#ed1c24', YELLOW: '#f9d71c', ORANGE: '#ef7c00',
  BLUE: '#00a1df', GREEN: '#4bbf6b',
};

const AVG_SEG_MIN = 2.6; // avg time it takes from one bart station to next

// leaflet for map

const CARTO_DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const CARTO_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

function createDarkMap(elementId, lat, lng, zoom, opts = {}) {
    const map = L.map(elementId, {
        center: [lat, lng],
        zoom: zoom,
        zoomControl: opts.zoomControl !== false,
        attributionControl: opts.attributionControl !== false,
        scrollWheelZoom: opts.scrollWheelZoom !== false,
        ...opts.extraOpts
    });
    L.tileLayer(CARTO_DARK_TILES, {
        attribution: CARTO_ATTR,
        subdomains: 'abcd',
        maxZoom: 19,
    }).addTo(map);
    return map;
}

function drawBARTLines(map, opacity = 0.7) {
    Object.entries(BART_LINE_SEQS).forEach(([line, seq]) => {
        const coords = seq.map(abbr => {
            const s = BART_STATIONS[abbr];
            return s ? [s.lat, s.lng] : null;
        }).filter(Boolean);
        L.polyline(coords, {
            color: BART_LINE_COLORS[line],
            weight: 3,
            opacity: opacity,
            lineJoin: 'round',
        }).addTo(map);
    });
}

function drawBARTStations(map, small = false) {
  Object.entries(BART_STATIONS).forEach(([abbr, stn]) => {
    const r = small ? 3 : 4;
    L.circleMarker([stn.lat, stn.lng], {
      radius: r,
      fillColor: '#0c0c14',
      color: '#aaa',
      weight: 1,
      opacity: 0.7,
      fillOpacity: 1,
    }).bindTooltip(stn.name, { className: 'train-tooltip', direction: 'top' }).addTo(map);
  });
}

// this is a public api key /tableflip
const BART_API_KEY = 'MW9S-E7SL-26DU-VV8V';
const BART_ETD_URL = `https://api.bart.gov/api/etd.aspx?cmd=etd&orig=ALL&key=${BART_API_KEY}&json=y`;

async function fetchBARTEtd() {
    const resp = await fetch(BART_ETD_URL);
    if (!resp.ok) throw new Error(`BART API HTTP ${resp.status}`);
    const data = await resp.json();
    if (!data?.root?.station) throw new Error('Unexpected API format waaaah :c');
    return data.root.station;
}

function normAbbr(a) {
    const map = { '12th': '12TH', '19th': '19TH', '16th': '16TH', '24th': '24TH' };
    const k = a ? a.toLowerCase() : '';
    return map[k] || a.toUpperCase();
}

// ai-assisted code next ~30 lines (i am seriously stupid)

function computeTrainPositions(etdStations) {
  const candidates = new Map();

  etdStations.forEach(stnData => {
    const abbr = normAbbr(stnData.abbr);
    const station = BART_STATIONS[abbr];
    if (!station) return;

    (stnData.etd || []).forEach(dest => {
      const destAbbr = normAbbr(dest.abbreviation);
      const color = (dest.estimate?.[0]?.color || '').toUpperCase();
      const lineSeq = BART_LINE_SEQS[color];
      if (!lineSeq) return;

      (dest.estimate || []).slice(0, 2).forEach(est => {
        const mins = est.minutes === 'Leaving' ? 0 : parseInt(est.minutes, 10);
        if (isNaN(mins) || mins > 20) return;

        // Find station in sequence oriented toward destination
        let seq = lineSeq;
        const destIdx = lineSeq.indexOf(destAbbr);
        const stnIdx  = lineSeq.indexOf(abbr);
        if (destIdx === -1 || stnIdx === -1) return;
        if (destIdx < stnIdx) seq = [...lineSeq].reverse();

        const posInSeq = seq.indexOf(abbr);
        if (posInSeq <= 0) {
          // Train is at/near the terminus; place dot at this station
          const key = `${color}_${abbr}_0`;
          if (!candidates.has(key)) {
            candidates.set(key, {
              lat: station.lat, lng: station.lng,
              color: color.toLowerCase(), colorHex: BART_LINE_COLORS[color],
              destination: dest.destination, minutes: mins, stationAbbr: abbr,
            });
          }
          return;
        }

        const prevAbbr = seq[posInSeq - 1];
        const prevStn  = BART_STATIONS[prevAbbr];
        if (!prevStn) return;

        // Fraction of travel from prevStn → station completed
        // When mins=0: fraction=1 (at station). When mins=AVG_SEG_MIN: fraction=0 (just left prev).
        const frac = Math.max(0, Math.min(1, 1 - mins / AVG_SEG_MIN));

        const lat = prevStn.lat + (station.lat - prevStn.lat) * frac;
        const lng = prevStn.lng + (station.lng - prevStn.lng) * frac;

        // Dedup: one dot per (color, segment pair, approximate minute slot)
        const slot = Math.round(mins);
        const key  = `${color}_${prevAbbr}_${abbr}_${slot}`;
        if (!candidates.has(key)) {
          candidates.set(key, {
            lat, lng, color: color.toLowerCase(), colorHex: BART_LINE_COLORS[color],
            destination: dest.destination, minutes: mins, stationAbbr: abbr,
          });
        }
      });
    });
  });

  return Array.from(candidates.values());
}

// ok i know how to do this now xoxo

(function() {
    const mapEl = document.getElementById('bart-live-map');
    if (!mapEl) return;

    const map = createDarkMap('bart-live-map', 37.780, -122.270, 10, {
        zoomControl: true,
        scrollWheelZoom: true,
        extraOpts: { minZoom: 8, maxZoom: 16 },
    });

    drawBARTLines(map, 0.65);
    drawBARTStations(map, false);

    const trainLayer = L.layerGroup().addTo(map);
    const errorBox   = document.getElementById('live-api-error');
    const errorMsg   = document.getElementById('live-api-error-msg');
    const statusTxt  = document.getElementById('live-status-txt');
    const trainCnt   = document.getElementById('train-count');
    const etdList    = document.getElementById('etd-list');

    let lastFetch = null;

    function trainMarker(pos) {
        const color = pos.colorHex || '#aaa';
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
      <circle cx="7" cy="7" r="5.5" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="1.5"/>
      <circle cx="7" cy="7" r="2.5" fill="${color}"/>
    </svg>`;
        const icon = L.divIcon({
            html: svg,
            className: '',
            iconSize: [14, 14],
            iconAnchor: [7, 7],
        });
        const minStr = pos.minutes === 0 ? 'Now Departing' : `${pos.minutes} min to ${BART_STATIONS[pos.stationAbbr]?.name || pos.stationAbbr}`;
        return L.marker([pos.lat, pos.lng], { icon })
            .bindTooltip(`${pos.color.toUpperCase()} --> ${pos.destination}<br>${minStr}`, {
                className: 'train-tooltip',
                direction: 'top',
            });
        
    }
    async function refreshLive() {
        try {
            const stations = await fetchBARTEtd();
            console.log('BART ETD loaded:', stations.length, 'stations');
            errorBox.style.display = 'none';
            lastFetch = new Date();

            trainLayer.clearLayers();
            const positions = computeTrainPositions(stations);
            positions.forEach(p => trainMarker(p).addTo(trainLayer));
            trainCnt.textContent = positions.length;

            const hh = lastFetch.getHours().toString().padStart(2, '0');
            const mm = lastFetch.getMinutes().toString().padStart(2, '0');
            const ss = lastFetch.getSeconds().toString().padStart(2, '0');
            statusTxt.textContent = `Last updated: ${hh}:${mm}:${ss} :3`;
            
            const imminentDeps = [];
            stations.forEach(stn => {
                const abbr = normAbbr(stn.abbr);
                (stn.etd || []).forEach(dest => {
                    (dest.estimate || []).slice(0, 2).forEach(est => {
                        const mins = est.minutes === 'Leaving' ? 0 : parseInt(est.minutes, 10);
                        if (!isNaN(mins) && mins <= 5) {
                            imminentDeps.push({
                                station: stn.name,
                                destination: dest.destination,
                                color: (est.color || '').toLowerCase(),
                                colorHex: BART_LINE_COLORS[(est.color || '').toUpperCase()] || '#aaa',
                                mins,
                            });
                        }
                    });
            });
        });
        imminentDeps.sort((a, b) => a.mins - b.mins);
        etdList.innerHTML = imminentDeps.slice(0, 14).map(d => `
            <div class="etd-row">
                <div class="etd-dot" style="background:${d.colorHex}"></div>
                <span class="etd-stn" title="${d.station} → ${d.destination}">${d.station.replace(/ Station$/,'').replace(/ \(.*\)$/,'').slice(0,20)}</span>
                <span class="etd-min">${d.mins === 0 ? '<span style="color:var(--green)">Now</span>' : d.mins + ' min'}</span>
                </div>
                `).join('') || '<div class="etd-row"><span class="etd-stn">No imminent departures</span></div>';
    } catch(e) {
        errorBox.style.display = 'block';
        errorMsg.textContent = `BART API error: ${e.message}.`;
        statusTxt.textContent = 'API Error :(';
        trainLayer.clearLayers();
        trainCnt.textContent = '-';
    }
}

refreshLive();
setInterval(refreshLive, 30000);
})();

// it works!! now for the smaller maps... ...time to pull an all-nighter :3

(function() {
    const el = document.getElementById('bart-cmp-map');
    if (!el) return;
    const map = createDarkMap('bart-cmp-map', 37.780, -122.270, 9, {
        zoomControl: false,
        scrollWheelZoom: false,
        extraOpts: { dragging: false, doubleClickZoom: false },
    });
    drawBARTLines(map, 0.7);
    Object.values(BART_STATIONS).forEach(s => {
        L.circleMarker([s.lat, s.lng], { radius: 2, fillColor: '#aaa', color: '#aaa', weight: 0.5, fillOpacity: 0.8 }).addTo(map);
    });

    (async () => {
        const depsEl = document.getElementById('bart-cmp-deps');
        const errEl = document.getElementById('bart-cmp-err');
        // const staleMarkers = [];
        try {
            const url = `https://api.bart.gov/api/etd.aspx?cmd=etd&orig=MONT&key=${BART_API_KEY}&json=y`;
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            const etds = data?.root?.station?.[0]?.etd || [];
            if (!etds.length) throw new Error('No ETD data');

            const rows = [];
            etds.forEach(dest => {
                (dest.estimate || []).slice(0, 2).forEach(est => {
                    const mins = est.minutes === 'Leaving' ? 0 : parseInt(est.minutes, 10);
                    rows.push({
                        color: (est.color || '').toUpperCase(),
                        colorHex: BART_LINE_COLORS[(est.color || '').toUpperCase()] || '#aaa',
                        platform: est.platform,
                        dest: dest.destination,
                        mins,
                    });
                });
            });

            rows.sort((a, b) => a.mins - b.mins);
            depsEl.innerHTML = rows.slice(0, 6).map(r => `
                <div class="dep-row">
                    <div class="dep-dot" style="background:${r.colorHex}"></div>
                    <div class="dep-line">${r.color.slice(0,3)}</div>
                    <div class="dep-dest">${r.dest}</div>
                    <div class="dep-min">${r.mins === 0 ? '<span style="color:var(--green)">Now</span>' : r.mins + ' min'}</div>
                </div>
            `).join('');
        } catch(e) {
            depsEl.innerHTML = '';
            errEl.style.display = 'block';
            errEl.textContent = `API Error: ${e.message} :(`;
        }
    })();
})();

// some help from AI on getting the correct api to work, had to resort from network-wide to hbf only :(

(function() {
  const el = document.getElementById('munich-cmp-map');
  if (!el) return;

  const map = createDarkMap('munich-cmp-map', 48.137, 11.575, 11, {
    zoomControl: false,
    scrollWheelZoom: false,
    extraOpts: { dragging: false, doubleClickZoom: false },
  });

  // Munich U-Bahn approximate routes (real station coordinates)
  const MUNICH_LINES = {
    U1: { color: '#e2001a', coords: [[48.1274,11.4989],[48.1335,11.5237],[48.1369,11.5493],[48.1398,11.5573],[48.1418,11.5650],[48.1382,11.5748],[48.1357,11.5813],[48.1298,11.5913],[48.1242,11.5967],[48.1212,11.6046]] },
    U2: { color: '#0065b3', coords: [[48.1703,11.4699],[48.1636,11.4878],[48.1573,11.5007],[48.1496,11.5107],[48.1418,11.5163],[48.1376,11.5313],[48.1347,11.5407],[48.1311,11.5494],[48.1280,11.5580],[48.1248,11.5668],[48.1218,11.5746],[48.1187,11.5847],[48.1181,11.5965],[48.1192,11.6084],[48.1224,11.6218]] },
    U3: { color: '#f08700', coords: [[48.2014,11.5327],[48.1935,11.5283],[48.1847,11.5281],[48.1768,11.5282],[48.1697,11.5295],[48.1637,11.5329],[48.1575,11.5371],[48.1497,11.5388],[48.1418,11.5385],[48.1376,11.5313],[48.1324,11.5288],[48.1258,11.5249],[48.1195,11.5210],[48.1110,11.5220],[48.1020,11.5196]] },
    U4: { color: '#00ab8e', coords: [[48.1498,11.5387],[48.1437,11.5324],[48.1418,11.5163],[48.1389,11.5057],[48.1378,11.4966],[48.1374,11.4877],[48.1375,11.4795]] },
    U5: { color: '#d06c00', coords: [[48.1424,11.4682],[48.1411,11.4793],[48.1374,11.4877],[48.1340,11.4975],[48.1418,11.5163],[48.1466,11.5247],[48.1502,11.5350],[48.1489,11.5463],[48.1484,11.5576],[48.1499,11.5694],[48.1502,11.5828]] },
    U6: { color: '#006ab3', coords: [[48.2538,11.5475],[48.2424,11.5499],[48.2320,11.5493],[48.2187,11.5476],[48.1987,11.5408],[48.1847,11.5380],[48.1697,11.5341],[48.1575,11.5371],[48.1418,11.5385],[48.1376,11.5313],[48.1288,11.5353],[48.1209,11.5375],[48.1090,11.5394],[48.0973,11.5345]] },
  };

  Object.entries(MUNICH_LINES).forEach(([name, line]) => {
    L.polyline(line.coords, { color: line.color, weight: 2.5, opacity: 0.75 }).addTo(map);
    // Terminus markers
    L.circleMarker(line.coords[0], { radius: 3, fillColor: line.color, color: '#111', weight: 1, fillOpacity: 0.9 }).addTo(map);
    L.circleMarker(line.coords[line.coords.length-1], { radius: 3, fillColor: line.color, color: '#111', weight: 1, fillOpacity: 0.9 }).addTo(map);
  });

  // Mark Hauptbahnhof
  L.circleMarker([48.1400, 11.5600], { radius: 5, fillColor: '#fff', color: '#111', weight: 1.5, fillOpacity: 1 })
    .bindTooltip('Hauptbahnhof', { className: 'train-tooltip', direction: 'top', permanent: false })
    .addTo(map);

  // MVG API
  (async () => {
    const depsEl = document.getElementById('munich-cmp-deps');
    const errEl  = document.getElementById('munich-cmp-err');
    try {
      // MVG public departure API - Hauptbahnhof global station ID
      const MVG_URL = CORS_PROXY + encodeURIComponent('https://www.mvg.de/api/bgw-pt/v3/departures?globalId=de:09162:6&limit=10');
      const resp = await fetch(MVG_URL);
      if (!resp.ok) throw new Error(`MVG API HTTP ${resp.status}`);
      const data = await resp.json();

      const deps = Array.isArray(data) ? data : (data.departures || data.entries || []);
      if (!deps.length) throw new Error('No departure data returned from MVG API');

      // Only U-Bahn lines
      const ubahn = deps.filter(d => {
        const lineId = d.line || d.label || d.sev || '';
        return String(lineId).toUpperCase().startsWith('U');
      }).slice(0, 8);

      if (!ubahn.length) throw new Error('No U-Bahn departures in MVG response');

      const lineColors = { U1:'#e2001a',U2:'#0065b3',U3:'#f08700',U4:'#00ab8e',U5:'#d06c00',U6:'#006ab3',U7:'#e2001a',U8:'#006ab3' };

      depsEl.innerHTML = ubahn.map(d => {
        const lineStr = (d.line || d.label || '?').toString().toUpperCase();
        const col     = lineColors[lineStr] || '#aaa';
        const dest    = d.destination || d.direction || '?';
        let   minsRaw = d.departureInSeconds != null
          ? Math.round(d.departureInSeconds / 60)
          : (d.departing != null ? Math.round((new Date(d.departing) - Date.now()) / 60000) : null);
        if (minsRaw == null && d.realDepartureTime) {
          minsRaw = Math.round((new Date(d.realDepartureTime) - Date.now()) / 60000);
        }
        const minsStr = minsRaw != null
          ? (minsRaw <= 0 ? '<span style="color:var(--green)">Now</span>' : minsRaw + ' min')
          : '-';
        return `<div class="dep-row">
          <div class="dep-dot" style="background:${col}"></div>
          <div class="dep-line">${lineStr}</div>
          <div class="dep-dest">${dest.slice(0,20)}</div>
          <div class="dep-min">${minsStr}</div>
        </div>`;
      }).join('');
    } catch(e) {
      depsEl.innerHTML = '';
      errEl.style.display = 'block';
      errEl.textContent = `MVG API unavailable: ${e.message}`;
    }
  })();
})();

(function() {
  const el = document.getElementById('vienna-cmp-map');
  if (!el) return;

  const map = createDarkMap('vienna-cmp-map', 48.208, 16.373, 11, {
    zoomControl: false,
    scrollWheelZoom: false,
    extraOpts: { dragging: false, doubleClickZoom: false },
  });
  const VIENNA_LINES = {
    U1: { color: '#e2001a', coords: [[48.1616,16.3364],[48.1669,16.3428],[48.1735,16.3504],[48.1823,16.3625],[48.1903,16.3693],[48.1984,16.3774],[48.2033,16.3797],[48.2085,16.3788],[48.2138,16.3730],[48.2183,16.3688],[48.2278,16.3671],[48.2400,16.3705],[48.2445,16.3687]] },
    U2: { color: '#834a9e', coords: [[48.1733,16.2830],[48.1811,16.2908],[48.1880,16.2980],[48.1943,16.3057],[48.2000,16.3177],[48.2032,16.3262],[48.2040,16.3364],[48.2033,16.3467],[48.2050,16.3575],[48.2088,16.3787],[48.2131,16.3878],[48.2169,16.4015],[48.2235,16.4140],[48.2302,16.4292]] },
    U3: { color: '#f08700', coords: [[48.2181,16.2733],[48.2168,16.2868],[48.2144,16.3003],[48.2063,16.3157],[48.1995,16.3273],[48.1984,16.3774],[48.1979,16.3818],[48.1957,16.3962],[48.1937,16.4119],[48.1935,16.4285],[48.1935,16.4455]] },
    U4: { color: '#00a050', coords: [[48.1786,16.2937],[48.1900,16.3156],[48.2000,16.3177],[48.2033,16.3467],[48.2040,16.3600],[48.2057,16.3710],[48.2074,16.3803],[48.2100,16.3940],[48.2136,16.4090]] },
    U6: { color: '#9d5f00', coords: [[48.1418,16.3185],[48.1532,16.3200],[48.1637,16.3281],[48.1738,16.3342],[48.1851,16.3395],[48.1960,16.3458],[48.2033,16.3467],[48.2140,16.3524],[48.2289,16.3560],[48.2380,16.3658],[48.2476,16.3752]] },
  };

  Object.entries(VIENNA_LINES).forEach(([name, line]) => {
    L.polyline(line.coords, { color: line.color, weight: 2.5, opacity: 0.75 }).addTo(map);
    L.circleMarker(line.coords[0], { radius: 3, fillColor: line.color, color: '#111', weight: 1, fillOpacity: 0.9 }).addTo(map);
    L.circleMarker(line.coords[line.coords.length-1], { radius: 3, fillColor: line.color, color: '#111', weight: 1, fillOpacity: 0.9 }).addTo(map);
  });

  L.circleMarker([48.2000, 16.3694], { radius: 5, fillColor: '#fff', color: '#111', weight: 1.5, fillOpacity: 1 })
    .bindTooltip('Karlsplatz', { className: 'train-tooltip', direction: 'top' })
    .addTo(map);
  const WL_RBLS = [143, 144, 4101, 4102, 4119, 252];
  const WL_URL = CORS_PROXY + encodeURIComponent('https://www.wienerlinien.at/ogd_realtime/monitor?' + WL_RBLS.map(r => 'rbl=' + r).join('&'));

  (async () => {
    const depsEl = document.getElementById('vienna-cmp-deps');
    const errEl  = document.getElementById('vienna-cmp-err');
    try {
      const resp = await fetch(WL_URL);
      if (!resp.ok) throw new Error(`Wiener Linien API HTTP ${resp.status}`);
      const data = await resp.json();
      const monitors = data?.data?.monitors || [];
      if (!monitors.length) throw new Error('No monitor data from Wiener Linien API');

      const rows = [];
      monitors.forEach(mon => {
        (mon.lines || []).forEach(line => {
          const lineId  = line.name || '?';
          const dir     = line.towards || line.direction || '';
          (line.departures?.departure || []).slice(0, 2).forEach(dep => {
            const cd = dep.departureTime?.countdown;
            rows.push({ lineId, dir, countdown: typeof cd === 'number' ? cd : null });
          });
        });
      });

      rows.sort((a, b) => (a.countdown ?? 999) - (b.countdown ?? 999));

      const lineColors = { U1:'#e2001a',U2:'#834a9e',U3:'#f08700',U4:'#00a050',U6:'#9d5f00' };

      depsEl.innerHTML = rows.slice(0, 8).map(r => {
        const col = lineColors[r.lineId] || '#aaa';
        const cnt = r.countdown;
        const minsStr = cnt == null ? '-' : (cnt <= 0 ? '<span style="color:var(--green)">Now</span>' : cnt + ' min');
        return `<div class="dep-row">
          <div class="dep-dot" style="background:${col}"></div>
          <div class="dep-line">${r.lineId}</div>
          <div class="dep-dest">${(r.dir || '?').slice(0,20)}</div>
          <div class="dep-min">${minsStr}</div>
        </div>`;
      }).join('') || '<div class="dep-row"><span class="dep-dest">No departures found</span></div>';

    } catch(e) {
      depsEl.innerHTML = '';
      errEl.style.display = 'block';
      errEl.textContent = `Wiener Linien API error: ${e.message}`;
    }
  })();
})();

// it works owo
// i wonder if anyone actually reads these notes
// if so, ily <3