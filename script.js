/* ================================================
 AirLeaf — script.js
 ================================================ */
'use strict';

// Constants 

const SCORES = {
 roomType: { bedroom: 25, living: 22, office: 18, kitchen: 12 },
 roomSize: { large: 35, medium: 25, small: 15 },
 ventilation:{ good: 40, average: 25, poor: 10 }
};

// Penalty subtracted from total score based on pollution source
const POLLUTION_PENALTIES = {
 none: 0,
 dust: -5,
 pets: -7,
 mold: -12,
 cooking: -8,
 smoking: -18,
 candles: -6,
 gas: -14,
 cleaners: -10,
 paint: -15,
 electronics: -5,
 furniture: -12
};

// Human-readable labels for results display
const POLLUTION_LABELS = {
 none: 'No known sources',
 dust: 'Dust & poor cleaning',
 pets: 'Pets & dander',
 mold: 'Damp & mould risk',
 cooking: 'Cooking fumes & steam',
 smoking: 'Smoking / tobacco',
 candles: 'Candles & incense',
 gas: 'Gas appliances / heaters',
 cleaners: 'Cleaning products & sprays',
 paint: 'Fresh paint or varnish',
 electronics: 'Electronics & printers',
 furniture: 'New furniture / carpets (VOCs)'
};

// Room-specific plant recommendations
const ROOM_PLANTS = {
 bedroom: [
 { name:"Snake Plant", emoji:"", benefit:"Releases oxygen at night unlike most plants — ideal for bedrooms. Filters formaldehyde, benzene, and CO while you sleep.", care:"Very Easy", tag:" Night O₂ Booster" },
 { name:"Spider Plant", emoji:"", benefit:"Removes CO and xylene quietly overnight. Pet-safe and incredibly low-maintenance. Perfect for shelves or hanging pots.", care:"Easy", tag:" Pet Safe" },
 { name:"Aloe Vera", emoji:"", benefit:"Filters formaldehyde and benzene from bedding and furniture VOCs. Turns brown when pollution spikes — a natural air alarm.", care:"Easy", tag:" Natural Air Alarm" },
 { name:"Peace Lily", emoji:"", benefit:"Improves humidity in dry bedrooms and absorbs mould spores. Thrives in low light — no direct sun needed.", care:"Moderate", tag:" Humidity Booster" },
 { name:"Lavender", emoji:"", benefit:"Scientifically shown to lower heart rate and anxiety. Its calming scent promotes deeper, more restful sleep.", care:"Moderate", tag:" Sleep Aid" },
 { name:"Rubber Plant", emoji:"", benefit:"Large leaves absorb significant amounts of airborne toxins from new furniture and paint. Great statement plant.", care:"Easy", tag:" VOC Absorber" },
 ],
 kitchen: [
 { name:"Aloe Vera", emoji:"", benefit:"Thrives near kitchen heat. Absorbs benzene from cleaning sprays and also handy for minor burns from cooking.", care:"Easy", tag:" Heat Tolerant" },
 { name:"Spider Plant", emoji:"", benefit:"Handles humidity swings and temperature changes well. Removes CO produced by gas stoves and cooking fumes.", care:"Easy", tag:" CO Fighter" },
 { name:"Pothos", emoji:"", benefit:"Removes CO, formaldehyde, and xylene from cooking emissions. Thrives in low light above cabinets.", care:"Very Easy", tag:" Fume Absorber" },
 { name:"Basil", emoji:"", benefit:"Natural air freshener that also repels flies and mosquitoes. Loves kitchen warmth and doubles as a cooking herb.", care:"Easy", tag:" Dual Purpose" },
 { name:"English Ivy", emoji:"", benefit:"Filters airborne mould particles that thrive in damp kitchen environments. Effective against cooking-related bacteria.", care:"Moderate", tag:" Mould Fighter" },
 { name:"Mint", emoji:"", benefit:"Freshens kitchen air naturally, repels insects, and thrives in moist kitchen conditions. Use it for cooking too!", care:"Easy", tag:" Air Freshener" },
 ],
 living: [
 { name:"Peace Lily", emoji:"", benefit:"NASA's top-rated air purifier. Removes benzene, formaldehyde, and trichloroethylene from furniture and carpets.", care:"Moderate", tag:" NASA Approved" },
 { name:"Boston Fern", emoji:"", benefit:"Excellent natural humidifier for large living spaces. Removes xylene and toluene from furniture and electronics.", care:"Moderate", tag:" Humidifier" },
 { name:"Rubber Plant", emoji:"", benefit:"Large leaves trap dust and absorb VOCs from sofas and carpets. A beautiful statement plant for living rooms.", care:"Easy", tag:" Dust Trap" },
 { name:"Bamboo Palm", emoji:"", benefit:"One of the most effective filters for benzene and trichloroethylene. Tall and elegant — suits large living rooms.", care:"Moderate", tag:" Deep Purifier" },
 { name:"Snake Plant", emoji:"", benefit:"Tolerates any light level in a living room. Continuously filters toxins from furniture VOCs and electronics.", care:"Very Easy", tag:" Any Light" },
 { name:"Dracaena", emoji:"", benefit:"Removes xylene, trichloroethylene, and formaldehyde from household cleaners and off-gassing furniture.", care:"Easy", tag:" Cleaner Air" },
 ],
 office: [
 { name:"Snake Plant", emoji:"", benefit:"Survives low light and infrequent watering — perfect for a busy desk. Filters toxins from electronics and printers.", care:"Very Easy", tag:" Desk Friendly" },
 { name:"Pothos", emoji:"", benefit:"Fast-growing and effective at removing CO₂ and VOCs from electronics. Ideal on shelves or trailing from bookcases.", care:"Very Easy", tag:" CO₂ Reducer" },
 { name:"ZZ Plant", emoji:"", benefit:"Virtually indestructible — survives low light and weeks without water. Removes xylene from printer ink and toner.", care:"Very Easy", tag:" Tough as Nails" },
 { name:"Spider Plant", emoji:"", benefit:"Removes chemical fumes from printers and electronics. Great on high shelves where it can trail down naturally.", care:"Easy", tag:" Printer Fumes" },
 { name:"Bamboo Palm", emoji:"", benefit:"Filters pollutants from electronics and acts as a natural humidifier against dry office air from AC systems.", care:"Moderate", tag:" AC Dry Air" },
 { name:"Peace Lily", emoji:"", benefit:"Reduces stress and improves focus — studies show plants on desks increase productivity by up to 15%.", care:"Moderate", tag:" Focus Booster" },
 ],
};

// Fallback generic list
const PLANTS = [
 { name:"Snake Plant", emoji:"", benefit:"Filters formaldehyde, benzene, and carbon monoxide. Releases oxygen at night — perfect for bedrooms.", care:"Very Easy", tag:" All Rooms" },
 { name:"Spider Plant", emoji:"", benefit:"Removes carbon monoxide and xylene. Safe for pets and incredibly easy to grow — great for beginners.", care:"Easy", tag:" Pet Safe" },
 { name:"Peace Lily", emoji:"", benefit:"Absorbs mould spores, acetone, and ammonia. Thrives in low light and noticeably improves air moisture.", care:"Moderate", tag:" Low Light" },
 { name:"Aloe Vera", emoji:"", benefit:"Removes formaldehyde and benzene from cleaning products. Leaves turn brown when pollution is high.", care:"Easy", tag:" Air Alarm" },
 { name:"Boston Fern", emoji:"", benefit:"Excellent natural humidifier. Removes formaldehyde, xylene, and toluene. Best in humid environments.", care:"Moderate", tag:" Humidifier" },
];

const STATUS_CONFIG = [
 { min:80, label:" Excellent", title:"Your Air Quality is Excellent!", desc:"Your room has great ventilation and low pollution risk. A few low-maintenance plants will keep it that way. Well done!", color:"#1b7a4a" },
 { min:60, label:"🟢 Good", title:"Your Air Quality is Good", desc:"Your room is in decent shape but there's room to improve. Adding 3–4 air-purifying plants and improving ventilation will make a noticeable difference.", color:"#40916c" },
 { min:40, label:"🟡 Moderate", title:"Air Quality Needs Attention", desc:"Your room has moderate pollution risk. Consider improving ventilation, reducing chemical cleaners, and placing multiple air-purifying plants around the space.", color:"#e9a428" },
 { min:0, label:" Poor", title:"Air Quality is Poor", desc:"Your room has significant air quality challenges. We strongly recommend improving ventilation, minimising pollutant sources, and placing several plants throughout.", color:"#c0392b" }
];

const AQI_BANDS = [
 { range:"0–50", level:"Good", color:"#00c853", desc:"Satisfactory, minimal risk." },
 { range:"51–100", level:"Moderate", color:"#ffd600", desc:"Acceptable for most people." },
 { range:"101–150",level:"Unhealthy for Sensitive", color:"#ff6d00", desc:"Sensitive groups at risk." },
 { range:"151–200",level:"Unhealthy", color:"#dd2c00", desc:"Everyone may be affected." },
 { range:"201+", level:"Very Unhealthy / Hazardous", color:"#6a1b9a", desc:"Serious health alert." }
];

// State 
let lastScore = null;
let lastRoomType = null;
let lastVentilation = null;
let historyChart = null;
let airChart = null;
let selectedFeedbackType = 'suggestion';
let selectedStars = 0;

// SPA Router 

// ── Navigation ──
function showPage(pageId) {
  if (!pageId) return;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn[data-page]').forEach(b => b.classList.remove('active'));

  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');

  document.querySelectorAll(`.nav-btn[data-page="${pageId}"]`).forEach(b => b.classList.add('active'));

  const navMobile = document.getElementById('navMobile');
  if (navMobile) navMobile.classList.remove('open');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pageId === 'dashboard') renderDashboard();
  if (pageId === 'profile') loadProfile();
}

// Single clean click handler for all navigation
document.addEventListener('click', e => {

  // Feedback modal
  if (e.target.closest('#openFeedback') || e.target.closest('#openFeedbackMobile')) {
    openFeedback(); return;
  }
  if (e.target.closest('#closeFeedback')) { closeFeedback(); return; }
  if (e.target.id === 'feedbackOverlay') { closeFeedback(); return; }

  // Hamburger
  if (e.target.closest('#navHamburger')) {
    const navMobile = document.getElementById('navMobile');
    if (navMobile) navMobile.classList.toggle('open');
    return;
  }

  // Nav logo
  if (e.target.closest('.nav-logo')) {
    showPage('home'); return;
  }

  // Nav profile chip
  if (e.target.closest('#navProfileChip')) {
    showPage('profile'); return;
  }

  // Any button or element with data-page (but NOT the chip div itself)
  const pageEl = e.target.closest('[data-page]');
  if (pageEl && pageEl.dataset.page && pageEl.id !== 'navProfileChip') {
    showPage(pageEl.dataset.page);
    return;
  }
});

// Option Groups 

function setupOptionGroup(groupId, btnSelector = '.option-btn') {
 const group = document.getElementById(groupId);
 if (!group) return;

 group.addEventListener('click', e => {
 const btn = e.target.closest(btnSelector);
 if (!btn || !group.contains(btn)) return;

 group.querySelectorAll(btnSelector).forEach(b => {
 b.classList.remove('selected');
 b.setAttribute('aria-pressed', 'false');
 });
 btn.classList.add('selected');
 btn.setAttribute('aria-pressed', 'true');
 clearFieldError(groupId);
 });

 group.addEventListener('keydown', e => {
 if (e.key === ' ' || e.key === 'Enter') {
 const btn = e.target.closest(btnSelector);
 if (btn) { e.preventDefault(); btn.click(); }
 }
 });
}

setupOptionGroup('roomType', '.room-card');
setupOptionGroup('roomSize', '.size-pill');
setupOptionGroup('ventilation', '.vent-btn');

// Validation 

function showFieldError(groupId, message) {
 const group = document.getElementById(groupId);
 if (!group) return;
 group.classList.add('field-error');
 if (!group.nextElementSibling?.classList.contains('field-error-msg')) {
 const msg = document.createElement('p');
 msg.className = 'field-error-msg';
 msg.setAttribute('role', 'alert');
 msg.textContent = message;
 group.insertAdjacentElement('afterend', msg);
 }
}

function clearFieldError(groupId) {
 const group = document.getElementById(groupId);
 if (!group) return;
 group.classList.remove('field-error');
 const msg = group.nextElementSibling;
 if (msg?.classList.contains('field-error-msg')) msg.remove();
}

function clearAllErrors() {
 ['roomType','roomSize','ventilation'].forEach(clearFieldError);
}

function shakeGroup(groupId) {
 const group = document.getElementById(groupId);
 if (!group) return;
 group.classList.remove('shake');
 void group.offsetWidth;
 group.classList.add('shake');
 group.addEventListener('animationend', () => group.classList.remove('shake'), { once: true });
}

// Helpers 

function getSelected(groupId, btnSelector = '.option-btn') {
 const el = document.querySelector(`#${groupId} ${btnSelector}.selected`);
 return el ? el.dataset.value : null;
}

function getStatus(score) {
 return STATUS_CONFIG.find(s => score >= s.min);
}

function getRecommendedPlants(score, roomType) {
 const list = (roomType && ROOM_PLANTS[roomType]) ? ROOM_PLANTS[roomType] : PLANTS;
 if (score < 50) return list; // all 6
 if (score < 75) return list.slice(0, 4); // top 4
 return list.slice(0, 3); // top 3
}

function scoreToAQIBand(score) {
 // Map our 0-100 score to approximate AQI band (inverse: lower score = worse)
 if (score >= 80) return AQI_BANDS[0];
 if (score >= 60) return AQI_BANDS[1];
 if (score >= 40) return AQI_BANDS[2];
 if (score >= 20) return AQI_BANDS[3];
 return AQI_BANDS[4];
}

// Animations 

function animateRing(score) {
 const ring = document.getElementById('ringFill');
 if (!ring) return;
 const circ = 314;
 ring.style.strokeDashoffset = circ;
 requestAnimationFrame(() => requestAnimationFrame(() => {
 ring.style.strokeDashoffset = circ - (score / 100) * circ;
 }));
}

function animateCount(target, duration = 1200) {
 const el = document.getElementById('scoreNumber');
 if (!el) return;
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = target; return; }
 const start = performance.now();
 const step = now => {
 const p = Math.min((now - start) / duration, 1);
 el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
 if (p < 1) requestAnimationFrame(step);
 };
 requestAnimationFrame(step);
}

// Chart 

function renderChart(score, status) {
 const canvas = document.getElementById('airChart');
 if (!canvas) return;
 if (airChart) { airChart.destroy(); airChart = null; }
 airChart = new Chart(canvas.getContext('2d'), {
 type: 'doughnut',
 data: {
 labels: ['Your Score', 'Room to Improve'],
 datasets: [{ data: [score, 100 - score], backgroundColor: [status.color, '#e8f5e9'], borderColor: ['#fff','#fff'], borderWidth: 3, hoverOffset: 8 }]
 },
 options: {
 responsive: true, maintainAspectRatio: false, cutout: '68%',
 plugins: {
 legend: { position: 'bottom', labels: { font: { family: 'DM Sans', size: 13 }, color: '#3a4f40', padding: 20, usePointStyle: true } },
 tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}/100` } }
 },
 animation: { animateRotate: true, duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1200, easing: 'easeInOutQuart' }
 }
 });
}

// AQI Quick Strip 

function renderAQIQuick(score) {
 const container = document.getElementById('aqiQuick');
 if (!container) return;
 const activeBand = scoreToAQIBand(score);
 container.innerHTML = AQI_BANDS.map(band => `
 <div class="aqi-quick-item ${band === activeBand ? 'aqi-quick-active' : ''}">
 <div class="aqi-quick-dot" style="background:${band.color}"></div>
 <span class="aqi-quick-label">${band.level}</span>
 <span class="aqi-quick-val">${band.range}</span>
 ${band === activeBand ? '<span style="font-size:0.75rem;font-weight:700;color:var(--green-main)">← Your level</span>' : ''}
 </div>`).join('');
}

// Plant Cards 

function renderPlants(plants, roomType) {
 const grid = document.getElementById('plantsGrid');
 if (!grid) return;

 // Update the section heading with the room name
 const roomNames = { bedroom:'Bedroom', kitchen:'Kitchen', living:'Living Room', office:'Office / Study' };
 const heading = document.getElementById('plantsHeading');
 if (heading && roomType && roomNames[roomType]) {
 heading.textContent = `Best Plants for Your ${roomNames[roomType]}`;
 } else if (heading) {
 heading.textContent = 'Recommended Plants for You';
 }

 const frag = document.createDocumentFragment();
 plants.forEach(plant => {
 const card = document.createElement('div');
 card.className = 'plant-card';
 card.innerHTML = `
 <span class="plant-emoji" aria-hidden="true">${plant.emoji}</span>
 <h3 class="plant-name">${plant.name}</h3>
 <p class="plant-benefit">${plant.benefit}</p>
 <div class="plant-meta">
 <span class="plant-tag"> Care: ${plant.care}</span>
 <span class="plant-tag plant-tag-highlight">${plant.tag}</span>
 </div>`;
 frag.appendChild(card);
 });
 grid.textContent = '';
 grid.appendChild(frag);
}

// Main Calculate 

function calculateScore() {
 const roomType = document.getElementById('roomTypeSelect')?.value || '';
 const roomSize = document.getElementById('roomSizeSelect')?.value || '';
 const ventilation = document.getElementById('ventilationSelect')?.value || '';
 const pollutionEl = document.getElementById('pollutionSource');
 const pollutionSource = pollutionEl ? pollutionEl.value : '';

 // Clear previous errors
 ['roomTypeSelect','roomSizeSelect','ventilationSelect'].forEach(id => {
 const el = document.getElementById(id);
 if (el) { el.classList.remove('select-error'); }
 });
 ['err-roomType','err-roomSize','err-ventilation'].forEach(id => {
 document.getElementById(id)?.classList.add('hidden');
 });

 let hasError = false;
 if (!roomType) {
 document.getElementById('roomTypeSelect')?.classList.add('select-error');
 document.getElementById('err-roomType')?.classList.remove('hidden');
 hasError = true;
 }
 if (!roomSize) {
 document.getElementById('roomSizeSelect')?.classList.add('select-error');
 document.getElementById('err-roomSize')?.classList.remove('hidden');
 hasError = true;
 }
 if (!ventilation) {
 document.getElementById('ventilationSelect')?.classList.add('select-error');
 document.getElementById('err-ventilation')?.classList.remove('hidden');
 hasError = true;
 }
 if (hasError) return;

 const baseScore = SCORES.roomType[roomType] + SCORES.roomSize[roomSize] + SCORES.ventilation[ventilation];
 const penalty = pollutionSource && POLLUTION_PENALTIES[pollutionSource] !== undefined ? POLLUTION_PENALTIES[pollutionSource] : 0;
 const score = Math.max(0, Math.min(100, baseScore + penalty));
 const status = getStatus(score);

 // Track room analysis event
 if (window.trackEvent) window.trackEvent('room_analysed', {
 room_type: roomType,
 room_size: roomSize,
 ventilation: ventilation,
 score: score,
 status: status.label
 });

 lastScore = score;
 lastRoomType = roomType;
 lastVentilation = ventilation;

 document.getElementById('statusLabel').textContent = status.label;
 document.getElementById('scoreTitle').textContent = status.title;
 document.getElementById('scoreDesc').textContent = status.desc;

 // Show pollution source badge in results if selected
 let sourceBadgeEl = document.getElementById('pollutionBadge');
 if (pollutionSource && POLLUTION_LABELS[pollutionSource]) {
 if (!sourceBadgeEl) {
 sourceBadgeEl = document.createElement('div');
 sourceBadgeEl.id = 'pollutionBadge';
 sourceBadgeEl.className = 'pollution-badge';
 const scoreInfo = document.querySelector('.score-info');
 if (scoreInfo) scoreInfo.appendChild(sourceBadgeEl);
 }
 const penaltyText = penalty < 0 ? ` (${penalty} pts)` : '';
 sourceBadgeEl.innerHTML = ` Pollution source: <strong>${POLLUTION_LABELS[pollutionSource]}</strong>${penaltyText}`;
 sourceBadgeEl.classList.remove('hidden');
 } else if (sourceBadgeEl) {
 sourceBadgeEl.classList.add('hidden');
 }

 const results = document.getElementById('results');
 results.classList.remove('hidden');

 animateCount(score);
 animateRing(score);
 renderChart(score, status);
 renderAQIQuick(score);
 renderPlants(getRecommendedPlants(score, roomType), roomType);

 requestAnimationFrame(() => results.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}

document.getElementById('checkBtn')?.addEventListener('click', calculateScore);

// Highlight selects when a value is chosen
['roomTypeSelect','roomSizeSelect','ventilationSelect','pollutionSource'].forEach(id => {
 document.getElementById(id)?.addEventListener('change', function() {
 this.classList.toggle('has-value', this.value !== '');
 // Clear error on change
 this.classList.remove('select-error');
 const errMap = { roomTypeSelect:'err-roomType', roomSizeSelect:'err-roomSize', ventilationSelect:'err-ventilation' };
 if (errMap[id]) document.getElementById(errMap[id])?.classList.add('hidden');
 });
});

// Save to Dashboard 

document.getElementById('saveResultBtn')?.addEventListener('click', () => {
 if (lastScore === null) return;
 const history = getHistory();
 history.unshift({
 score: lastScore,
 roomType: lastRoomType,
 ventilation: lastVentilation,
 date: new Date().toISOString(),
 status: getStatus(lastScore).label
 });
 // Cap at 20 entries
 localStorage.setItem('airleaf_history', JSON.stringify(history.slice(0, 20)));
 showToast(' Saved to your dashboard!');
});

// History (localStorage) 

function getHistory() {
 try { return JSON.parse(localStorage.getItem('airleaf_history') || '[]'); }
 catch { return []; }
}

document.getElementById('clearHistory')?.addEventListener('click', () => {
 if (!confirm('Clear all saved checks?')) return;
 localStorage.removeItem('airleaf_history');
 renderDashboard();
 showToast(' History cleared.');
});

// Dashboard 

function renderDashboard() {
 const history = getHistory();

 // Air quality stats 
 document.getElementById('statTotal').textContent = history.length || '0';
 if (history.length) {
 const scores = history.map(h => h.score);
 document.getElementById('statBest').textContent = Math.max(...scores);
 document.getElementById('statAvg').textContent = Math.round(scores.reduce((a,b) => a+b, 0) / scores.length);
 const d = new Date(history[0].date);
 document.getElementById('statLast').textContent = d.toLocaleDateString('en-GB', { day:'numeric', month:'short' });
 } else {
 ['statBest','statAvg','statLast'].forEach(id => document.getElementById(id).textContent = '—');
 }

 // History list
 const listEl = document.getElementById('historyList');
 if (!history.length) {
 listEl.innerHTML = `<div class="empty-state"><div class="empty-icon"></div><p>No checks saved yet.<br/>Run an analysis and click "Save to Dashboard".</p><button class="btn-primary" style="margin-top:1rem;animation:none;" data-page="home">Go to Checker</button></div>`;
 listEl.querySelector('[data-page]')?.addEventListener('click', () => showPage('home'));
 } else {
 const frag = document.createDocumentFragment();
 history.forEach(item => {
 const status = getStatus(item.score);
 const d = new Date(item.date);
 const row = document.createElement('div');
 row.className = 'history-item';
 row.innerHTML = `
 <div class="history-score-badge" style="background:${status.color}">${item.score}</div>
 <div class="history-info">
 <div class="history-room"> ${capitalize(item.roomType)} · ${capitalize(item.ventilation)} ventilation</div>
 <div class="history-meta">${d.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })} · ${d.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })}</div>
 </div>
 <span class="history-status" style="background:${status.color}22;color:${status.color}">${status.label}</span>`;
 frag.appendChild(row);
 });
 listEl.textContent = '';
 listEl.appendChild(frag);
 }

 // History chart
 const card = document.getElementById('dashChartCard');
 if (!history.length) { card.style.display = 'none'; return; }
 card.style.display = '';

 const canvas = document.getElementById('historyChart');
 if (!canvas) return;
 if (historyChart) { historyChart.destroy(); historyChart = null; }

 const recent = [...history].reverse().slice(-10);
 historyChart = new Chart(canvas.getContext('2d'), {
 type: 'line',
 data: {
 labels: recent.map((_, i) => `Check ${i + 1}`),
 datasets: [{
 label: 'Score',
 data: recent.map(h => h.score),
 borderColor: '#2d6a4f',
 backgroundColor: 'rgba(45,106,79,0.1)',
 borderWidth: 2.5,
 pointBackgroundColor: recent.map(h => getStatus(h.score).color),
 pointRadius: 5, pointHoverRadius: 7,
 tension: 0.4, fill: true
 }]
 },
 options: {
 responsive: true, maintainAspectRatio: false,
 scales: {
 y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { family: 'DM Sans' } } },
 x: { grid: { display: false }, ticks: { font: { family: 'DM Sans' } } }
 },
 plugins: { legend: { display: false } },
 animation: { duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 800 }
 }
 });
}

// Profile 

function updateProfileUI(data) {
 if (!data.name) return;

 // Nav chip 
 const chip = document.getElementById('navProfileChip');
 const navBtn = document.getElementById('navProfileBtn');
 const chipAvatar = document.getElementById('navProfileAvatar');
 const chipName = document.getElementById('navProfileName');
 if (chip && navBtn) {
 chip.classList.remove('hidden');
 navBtn.classList.add('hidden');
 chipAvatar.textContent = data.avatar || '';
 // Show first name only
 chipName.textContent = data.name.split(' ')[0];
 // Make chip navigate to profile
 chip.onclick = () => showPage('profile');
 }

 // Profile hero banner 
 const guest = document.getElementById('profileHeroGuest');
 const user  = document.getElementById('profileHeroUser');
 if (guest && user) {
   guest.classList.add('hidden');
   user.classList.remove('hidden');
   document.getElementById('profileHeroName').textContent = data.name;
   // Apply avatar initials + color
   const heroAvatar = document.getElementById('profileHeroAvatar');
   if (heroAvatar) {
     heroAvatar.textContent = getInitials(data.name);
     heroAvatar.style.background = AVATAR_COLORS[data.avatar] || AVATAR_COLORS.green;
     heroAvatar.style.color = '#fff';
     heroAvatar.style.fontSize = '1.8rem';
     heroAvatar.style.fontWeight = '800';
     heroAvatar.style.display = 'flex';
     heroAvatar.style.alignItems = 'center';
     heroAvatar.style.justifyContent = 'center';
   }
   // Show meta info as separate tags
   const metaEl = document.getElementById('profileHeroMeta');
   let metaHTML = '';
   if (data.city) metaHTML += `<span class="profile-meta-tag">📍 ${data.city}</span>`;
   if (data.home) metaHTML += `<span class="profile-meta-tag">🏠 ${data.home}</span>`;
   if (data.email) metaHTML += `<span class="profile-meta-tag">✉️ ${data.email}</span>`;
   metaEl.innerHTML = metaHTML || '';
 }

 // Save button → saved state 
 const btn = document.getElementById('saveProfile');
 if (btn) {
 btn.classList.add('btn-saved');
 document.getElementById('btnSaveInner').innerHTML =
 '<span class="btn-save-icon"></span><span class="btn-save-text">Profile Saved</span>';
 // Reset to normal after 3s so user can re-save
 setTimeout(() => {
 btn.classList.remove('btn-saved');
 document.getElementById('btnSaveInner').innerHTML =
 '<span class="btn-save-icon"></span><span class="btn-save-text">Save Profile</span>';
 }, 3000);
 }
}

function loadProfile() {
 const data = getProfileData();
 if (data.name) document.getElementById('profileName').value = data.name;
 if (data.email) document.getElementById('profileEmail').value = data.email;
 if (data.city) document.getElementById('profileCity').value = data.city;
 if (data.home) document.getElementById('profileHome').value = data.home;
 if (data.asthma) document.getElementById('hasAsthma').checked = true;
 if (data.allergies) document.getElementById('hasAllergies').checked = true;
 if (data.children) document.getElementById('hasChildren').checked = true;
 if (data.pets) document.getElementById('hasPets').checked = true;
 if (data.avatar || data.name) {
   applyAvatar(data.name || '', data.avatar || 'green');
 }
 // Always reflect saved state in UI when profile page loads
 if (data.name) updateProfileUI(data);
 renderProfileSummary();
}

function getProfileData() {
 try { return JSON.parse(localStorage.getItem('airleaf_profile') || '{}'); }
 catch { return {}; }
}

document.getElementById('saveProfile')?.addEventListener('click', () => {
 const avatarEl = document.getElementById('profileAvatar');
 const activeOpt = document.querySelector('.avatar-opt.active');
 const color = activeOpt ? activeOpt.dataset.avatar : 'green';
 const data = {
   name:      document.getElementById('profileName').value.trim(),
   email:     document.getElementById('profileEmail').value.trim(),
   city:      document.getElementById('profileCity').value.trim(),
   home:      document.getElementById('profileHome').value,
   asthma:    document.getElementById('hasAsthma').checked,
   allergies: document.getElementById('hasAllergies').checked,
   children:  document.getElementById('hasChildren').checked,
   pets:      document.getElementById('hasPets').checked,
   avatar:    color
 };
 localStorage.setItem('airleaf_profile', JSON.stringify(data));
 applyAvatar(data.name, data.avatar);
 updateProfileUI(data);
 if (window.trackEvent) window.trackEvent('profile_saved', { has_name: !!data.name, has_city: !!data.city });
 showToast('Profile saved!');
 renderProfileSummary();
});

function renderProfileSummary() {
 const history = getHistory();
 const el = document.getElementById('profileSummaryContent');
 if (!history.length) {
 el.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;">Complete at least one check to see your summary here.</p>';
 return;
 }
 const scores = history.map(h => h.score);
 const avg = Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
 const best = Math.max(...scores);
 const worst = Math.min(...scores);
 const trend = scores.length >= 2 ? (scores[0] > scores[1] ? ' Improving' : scores[0] < scores[1] ? ' Declining' : ' Stable') : '—';
 el.innerHTML = `
 <div class="dash-stats" style="grid-template-columns:repeat(2,1fr)">
 <div class="dash-stat-card"><div class="dash-stat-icon"></div><div class="dash-stat-val">${best}</div><div class="dash-stat-label">Best Score</div></div>
 <div class="dash-stat-card"><div class="dash-stat-icon"></div><div class="dash-stat-val">${avg}</div><div class="dash-stat-label">Average</div></div>
 <div class="dash-stat-card"><div class="dash-stat-icon"></div><div class="dash-stat-val">${worst}</div><div class="dash-stat-label">Worst Score</div></div>
 <div class="dash-stat-card"><div class="dash-stat-icon"></div><div class="dash-stat-val" style="font-size:1rem">${trend}</div><div class="dash-stat-label">Trend</div></div>
 </div>`;
}

const AVATAR_COLORS = {
  green:  '#2d6a4f',
  blue:   '#2b6cb0',
  purple: '#6b46c1',
  rose:   '#c05621',
  teal:   '#2c7a7b',
  dark:   '#1a202c'
};

function getInitials(name) {
  if (!name) return 'A';
  return name.trim()[0].toUpperCase();
}

function applyAvatar(name, color) {
  const initials = getInitials(name);
  const bg = AVATAR_COLORS[color] || AVATAR_COLORS.green;
  const avatarEl = document.getElementById('profileAvatar');
  const initialsEl = document.getElementById('avatarInitials');
  if (avatarEl) avatarEl.style.background = bg;
  if (initialsEl) initialsEl.textContent = initials || 'A';
  // Mark active color button
  document.querySelectorAll('.avatar-opt').forEach(b => {
    b.classList.toggle('active', b.dataset.avatar === color);
  });
  // Update nav chip
  const navAvatar = document.getElementById('navProfileAvatar');
  if (navAvatar) {
    navAvatar.textContent = initials || 'A';
    navAvatar.style.background = bg;
    navAvatar.style.color = '#fff';
  }
}

// Avatar picker
document.getElementById('profileAvatar')?.addEventListener('click', () => {
  document.getElementById('avatarPicker').classList.toggle('hidden');
});
document.getElementById('avatarPicker')?.addEventListener('click', e => {
  const btn = e.target.closest('.avatar-opt');
  if (!btn) return;
  const name = document.getElementById('profileName').value.trim();
  applyAvatar(name, btn.dataset.avatar);
  document.getElementById('avatarPicker').classList.add('hidden');
});

// Feedback Modal 

function openFeedback() {
  const overlay = document.getElementById('feedbackOverlay');
  const success = document.getElementById('fbSuccess');
  const submit  = document.getElementById('submitFeedback');
  const text    = document.getElementById('feedbackText');
  if (overlay) overlay.classList.remove('hidden');
  if (success) success.classList.add('hidden');
  if (submit)  submit.classList.remove('hidden');
  if (text)    text.value = '';
  resetStars();
}
function closeFeedback() {
  document.getElementById('feedbackOverlay')?.classList.add('hidden');
}

// Feedback type buttons
document.querySelectorAll('.fb-type-btn').forEach(btn => {
 btn.addEventListener('click', () => {
 document.querySelectorAll('.fb-type-btn').forEach(b => b.classList.remove('selected'));
 btn.classList.add('selected');
 selectedFeedbackType = btn.dataset.type;
 });
});

// Star rating
function resetStars() {
 selectedStars = 0;
 document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('lit'));
}
document.getElementById('starRow')?.addEventListener('click', e => {
 const btn = e.target.closest('.star-btn');
 if (!btn) return;
 selectedStars = parseInt(btn.dataset.star);
 document.querySelectorAll('.star-btn').forEach(b => {
 b.classList.toggle('lit', parseInt(b.dataset.star) <= selectedStars);
 });
});
// Hover preview
document.getElementById('starRow')?.addEventListener('mouseover', e => {
 const btn = e.target.closest('.star-btn');
 if (!btn) return;
 const hover = parseInt(btn.dataset.star);
 document.querySelectorAll('.star-btn').forEach(b => {
 b.classList.toggle('lit', parseInt(b.dataset.star) <= hover);
 });
});
document.getElementById('starRow')?.addEventListener('mouseleave', () => {
 document.querySelectorAll('.star-btn').forEach(b => {
 b.classList.toggle('lit', parseInt(b.dataset.star) <= selectedStars);
 });
});

// Submit feedback
document.getElementById('submitFeedback')?.addEventListener('click', () => {
 const text = document.getElementById('feedbackText').value.trim();
 const fb = {
 type: selectedFeedbackType,
 stars: selectedStars,
 message: text,
 date: new Date().toISOString()
 };

 // Save to localStorage (local)
 const all = JSON.parse(localStorage.getItem('airleaf_feedback') || '[]');
 all.push(fb);
 localStorage.setItem('airleaf_feedback', JSON.stringify(all));

 // Save to Firestore (real database)
 if (window.saveFeedbackToFirestore) {
 window.saveFeedbackToFirestore({
 type: fb.type || 'general',
 stars: fb.stars || 0,
 message: fb.message || '',
 date: fb.date
 });
 }

 // Track analytics event
 if (window.trackEvent) window.trackEvent('feedback_submitted', { type: selectedFeedbackType, stars: selectedStars || 0 });

 document.getElementById('submitFeedback').classList.add('hidden');
 document.getElementById('fbSuccess').classList.remove('hidden');
 setTimeout(closeFeedback, 2500);
 showToast(' Feedback received — thank you!');
});

// Toast 

let toastTimer = null;
function showToast(msg) {
 const el = document.getElementById('toast');
 el.textContent = msg;
 el.classList.remove('hidden');
 clearTimeout(toastTimer);
 toastTimer = setTimeout(() => el.classList.add('hidden'), 2800);
}
window.showToast = showToast;

// Scroll Reveal 

function setupScrollAnimations() {
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 const targets = document.querySelectorAll('.tip-card, .form-card, .stat-pill');
 targets.forEach(el => el.classList.add('scroll-reveal'));
 const obs = new IntersectionObserver(entries => {
 entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
 }, { threshold: 0.12 });
 targets.forEach(el => obs.observe(el));
}

// Utils 
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

// Init 
document.addEventListener('DOMContentLoaded', () => {
 setupScrollAnimations();
 showPage('home');
 // Restore nav chip if profile already saved
 const saved = getProfileData();
 if (saved.name) updateProfileUI(saved);
});
