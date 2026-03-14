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
        sections.forEach((el, i) => {
            if (el && window.scrollY + 80 >= el.offsetTop) cur = i; })
                links.forEach((l, i) => l.classList.toggle('active', i === cur));
        }, { passive: true });
})();

(function() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
    document.querySelectorAll('.fu, .tl_item').forEach(el => io.observe(el));

    const fundsec = document.getElementById('fund-section');
    if (fundsec) {
        const io2 = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fundsec.querySelectorAll('.fb-fill').forEach (f => { f.style.width = f.dataset.pct; + '%'; });
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