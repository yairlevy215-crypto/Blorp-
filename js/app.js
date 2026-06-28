// ============================================================
// app.js — Main app logic, UI rendering, navigation
// ============================================================

// ──── Toast helper ────
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ──── Rest Timer ────
let restTimerInterval = null;

function startRestTimer(seconds, display, btn) {
  if (restTimerInterval) { clearInterval(restTimerInterval); }
  let remaining = seconds;
  display.textContent = formatTime(remaining);
  display.parentElement.style.display = 'flex';

  restTimerInterval = setInterval(() => {
    remaining--;
    display.textContent = formatTime(remaining);
    if (remaining <= 0) {
      clearInterval(restTimerInterval);
      display.textContent = '✓';
      display.style.color = 'var(--accent3)';
      showToast('⏰ זמן מנוחה הסתיים – המשך!', 'success');
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
    }
  }, 1000);
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// ──── Navigation ────
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const page = document.getElementById(`page-${pageId}`);
  if (page) {
    page.classList.add('active');
    page.scrollTop = 0;
    window.scrollTo(0, 0);
  }
  const navBtn = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
  if (navBtn) navBtn.classList.add('active');

  // Render page-specific content
  if (pageId === 'dashboard') renderDashboard();
  if (pageId === 'workout') renderWorkoutPage();
  if (pageId === 'progress') renderProgressPage();
  if (pageId === 'program') renderProgramPage();
  if (pageId === 'nutrition') renderNutritionPage();
}

// ──── Onboarding ────
let onboardingData = {};
let currentStep = 0;
const TOTAL_STEPS = 7;

function initOnboarding() {
  onboardingData = {};
  currentStep = 0;
  showStep(0);
  updateStepDots();
}

function showStep(n) {
  document.querySelectorAll('.onboarding-step').forEach((s, i) => {
    s.classList.toggle('active', i === n);
  });
  updateStepDots();
}

function updateStepDots() {
  document.querySelectorAll('.step-dot').forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i === currentStep) dot.classList.add('active');
    else if (i < currentStep) dot.classList.add('done');
  });
}

function nextStep() {
  if (!validateStep(currentStep)) return;
  currentStep++;
  if (currentStep >= TOTAL_STEPS) {
    finishOnboarding();
  } else {
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

function validateStep(step) {
  if (step === 0) {
    const age = parseInt(document.getElementById('ob-age').value);
    const weight = parseFloat(document.getElementById('ob-weight').value);
    const height = parseFloat(document.getElementById('ob-height').value);
    const gender = document.getElementById('ob-gender').value;
    if (!age || age < 12 || age > 90) { showToast('אנא הזן גיל תקין (12-90)', 'info'); return false; }
    if (!weight || weight < 30 || weight > 300) { showToast('אנא הזן משקל תקין', 'info'); return false; }
    if (!height || height < 100 || height > 250) { showToast('אנא הזן גובה תקין', 'info'); return false; }
    onboardingData.age = age;
    onboardingData.weight = weight;
    onboardingData.height = height;
    onboardingData.gender = gender;
  }
  if (step === 1) {
    onboardingData.currentCardio = document.getElementById('ob-cardio').value;
    onboardingData.currentStrength = document.getElementById('ob-strength').value;
  }
  if (step === 2) {
    if (!onboardingData.goal) { showToast('אנא בחר מטרה', 'info'); return false; }
  }
  if (step === 3) {
    if (onboardingData.goal === 'toning' || onboardingData.goal === 'mass') {
      const tc = document.getElementById('ob-target-change');
      onboardingData.targetWeightChange = tc ? parseFloat(tc.value) || null : null;
    }
  }
  if (step === 4) {
    onboardingData.daysPerWeek = parseInt(document.getElementById('ob-days').value);
    onboardingData.durationMinutes = parseInt(document.getElementById('ob-duration').value);
  }
  if (step === 5) {
    const chips = document.querySelectorAll('#ob-equipment-chips .chip.selected');
    onboardingData.equipment = Array.from(chips).map(c => c.dataset.eq);
  }
  if (step === 6) {
    onboardingData.wantsNutrition = document.getElementById('ob-nutrition-yes').classList.contains('selected');
  }
  return true;
}

function finishOnboarding() {
  Store.set('profile', onboardingData);

  const gen = new ProgramGenerator(onboardingData);
  const program = gen.generateFullProgram();
  const nutrition = gen.calculateNutrition();
  const milestones = gen.getMilestones();

  Store.set('program', program);
  Store.set('nutrition', nutrition);
  Store.set('milestones', milestones);
  Store.set('currentWeek', 1);
  Store.set('currentDay', 0);
  Store.set('onboardingDone', true);

  document.getElementById('onboarding').style.display = 'none';
  document.getElementById('main-app').style.display = 'block';

  renderTopbar();
  navigate('dashboard');
  showToast('🎉 ברוך הבא לתוכנית שלך!', 'success');
}

// ──── Top bar ────
function renderTopbar() {
  const streak = Store.get('streak') || 0;
  const streakEl = document.getElementById('topbar-streak');
  if (streakEl) streakEl.textContent = `🔥 ${streak} ימים`;

  const pct = Math.min(100, (streak % 7) / 7 * 100);
  const ring = document.getElementById('dash-streak-ring');
  if (ring) ring.style.setProperty('--pct', pct);
}

// ──── Dashboard ────
function renderDashboard() {
  renderTopbar();
  const profile = Store.get('profile');
  const program = Store.get('program');
  const currentWeek = Store.get('currentWeek') || 1;
  const streak = Store.get('streak') || 0;

  if (!program || !profile) return;

  const weekData = program[currentWeek - 1];
  const today = new Date().getDay();
  const todayWorkout = weekData?.days[today];

  // Hero section
  const pct = Math.min(100, (streak % 7) / 7 * 100);
  document.getElementById('dash-streak-num').textContent = streak;
  document.getElementById('dash-streak-ring').style.setProperty('--pct', pct);
  document.getElementById('dash-week-label').textContent = `שבוע ${currentWeek} / ${program.length}`;
  document.getElementById('dash-phase-label').textContent = weekData?.phase?.name || '';

  // Today's workout
  const todayEl = document.getElementById('dash-today');
  if (!todayWorkout) { todayEl.innerHTML = ''; return; }

  const isCompleted = Store.isWorkoutCompleted(currentWeek, today);

  if (todayWorkout.isRest) {
    todayEl.innerHTML = `
      <div class="card" style="text-align:center;padding:28px">
        <div style="font-size:2.5rem;margin-bottom:10px">😴</div>
        <h2>יום מנוחה</h2>
        <p style="margin-top:6px">המנוחה היא חלק מהתוכנית. הגוף מתחזק בזמן ההתאוששות!</p>
      </div>`;
    return;
  }

  const cats = (todayWorkout.workout?.categories || []).join(' + ');
  const exCount = todayWorkout.workout?.exercises?.length || 0;
  const mins = todayWorkout.workout?.estimatedMinutes || 0;

  todayEl.innerHTML = `
    <div class="today-workout-card">
      <div class="today-workout-header">
        <span>💪 אימון היום – ${todayWorkout.dayLabel}</span>
      </div>
      <div style="padding:16px">
        <p style="color:var(--text2);font-size:0.88rem;margin-bottom:10px">${translateCategories(cats)}</p>
        <div style="display:flex;gap:12px;margin-bottom:14px">
          <span class="badge badge-purple">⏱ ${mins} דק'</span>
          <span class="badge badge-green">🏋️ ${exCount} תרגילים</span>
        </div>
        ${isCompleted
          ? `<div class="btn btn-secondary btn-full" style="color:var(--accent3)">✅ הושלם היום!</div>`
          : `<button class="btn btn-primary btn-full" onclick="navigate('workout')">▶ התחל אימון</button>`}
      </div>
    </div>`;

  // Milestones
  const milestones = Store.get('milestones') || [];
  const milestonesEl = document.getElementById('dash-milestones');
  if (milestonesEl && milestones.length) {
    const nextMilestone = milestones.find(m => m.week >= currentWeek);
    if (nextMilestone) {
      milestonesEl.innerHTML = `
        <div class="card" style="border-color:var(--accent4)">
          <div class="section-title">🎯 אבן הדרך הבאה</div>
          <h3>${nextMilestone.title}</h3>
          <p style="font-size:0.85rem;margin-top:4px">${nextMilestone.description}</p>
          <p style="font-size:0.8rem;color:var(--text3);margin-top:8px">בשבוע ${nextMilestone.week}</p>
        </div>`;
    }
  }

  // Quick log
  renderQuickLog();
}

function renderQuickLog() {
  const el = document.getElementById('dash-quicklog');
  if (!el) return;
  const today = new Date().toISOString().split('T')[0];
  const nutLog = Store.get('nutritionLog') || [];
  const todayNut = nutLog.find(n => n.date === today);
  const wLog = Store.get('weightLog') || [];
  const lastWeight = wLog.length ? wLog[wLog.length - 1].weight : null;

  el.innerHTML = `
    <div class="section-title">📊 רישום מהיר</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-sm btn-secondary" onclick="openWeightModal()">⚖️ רשום משקל ${lastWeight ? `(${lastWeight} ק"ג)` : ''}</button>
      ${todayNut
        ? `<span class="badge ${todayNut.met ? 'badge-green' : 'badge-orange'}">${todayNut.met ? '✅ תזונה בוצעה' : '⚠️ חריגה תזונתית'}</span>`
        : `<button class="btn btn-sm btn-secondary" onclick="logNutrition(true)">✅ עמדתי בתזונה</button>
           <button class="btn btn-sm btn-secondary" onclick="logNutrition(false)">❌ חרגתי</button>`}
    </div>`;
}

function logNutrition(met) {
  Store.logNutrition(met);
  showToast(met ? '✅ נרשם – כל הכבוד!' : '📝 נרשם. מחר תנסה שוב!', 'success');
  renderQuickLog();
}

function openWeightModal() {
  const w = prompt('הזן משקל נוכחי (ק"ג):');
  const val = parseFloat(w);
  if (!isNaN(val) && val > 0) {
    Store.logWeight(val);
    showToast(`⚖️ משקל נרשם: ${val} ק"ג`, 'success');
    renderQuickLog();
    renderProgressPage();
  }
}

function translateCategories(cats) {
  return cats
    .replace(/push/g, 'דחיפה').replace(/pull/g, 'משיכה')
    .replace(/legs/g, 'רגליים').replace(/core/g, 'ליבה')
    .replace(/cardio/g, 'קרדיו').replace(/shoulders/g, 'כתפיים')
    .replace(/full_body/g, 'כל הגוף');
}

// ──── Workout Page ────
let activeExerciseRatings = {};

function renderWorkoutPage() {
  const program = Store.get('program');
  const currentWeek = Store.get('currentWeek') || 1;
  const today = new Date().getDay();
  const weekData = program?.[currentWeek - 1];
  const dayData = weekData?.days?.[today];

  const container = document.getElementById('workout-container');
  if (!container) return;

  if (!dayData || dayData.isRest) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">😴</div><h2>יום מנוחה</h2><p>הגוף מתאושש. נלך מחר!</p></div>`;
    return;
  }

  const { workout } = dayData;
  const isCompleted = Store.isWorkoutCompleted(currentWeek, today);
  activeExerciseRatings = {};

  let html = `
    <div class="card" style="margin-bottom:16px">
      <h2 style="margin-bottom:4px">💪 ${translateCategories((workout.categories || []).join(' + '))}</h2>
      <p style="font-size:0.85rem">שבוע ${currentWeek} · ${dayData.dayLabel} · ${workout.estimatedMinutes} דק'</p>
      ${weekData.phase ? `<div class="badge badge-purple" style="margin-top:8px">${weekData.phase.name}</div>` : ''}
      ${weekData.progressionNote ? `<p style="font-size:0.82rem;color:var(--accent4);margin-top:8px">${weekData.progressionNote}</p>` : ''}
    </div>`;

  // Warm-up
  html += `<div class="card"><h3 style="margin-bottom:10px">🔥 חימום (8 דקות)</h3>`;
  workout.warmup.forEach(w => {
    html += `<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:0.88rem">
      <span style="font-weight:700">${w.nameHe}</span>
      <span style="color:var(--text3);margin-right:6px">${w.duration}</span>
      <span style="color:var(--text2);display:block;font-size:0.8rem">${w.desc}</span>
    </div>`;
  });
  html += `</div>`;

  // Exercises
  html += `<div class="section-title" style="margin-top:4px">🏋️ תרגילים</div>`;
  workout.exercises.forEach((ex, idx) => {
    html += buildExerciseCard(ex, idx, workout);
  });

  // Cooldown
  html += `<div class="card"><h3 style="margin-bottom:10px">🧘 שחרור (5 דקות)</h3>`;
  workout.cooldown.forEach(c => {
    html += `<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:0.88rem">
      <span style="font-weight:700">${c.nameHe}</span>
      <span style="color:var(--text3);margin-right:6px">${c.duration}</span>
      <span style="color:var(--text2);display:block;font-size:0.8rem">${c.desc}</span>
    </div>`;
  });
  html += `</div>`;

  // Complete button
  if (!isCompleted) {
    html += `<button class="btn btn-success btn-full" onclick="completeWorkout()" style="margin-top:8px">🎉 סיימתי את האימון!</button>`;
  } else {
    html += `<div class="card" style="text-align:center;border-color:var(--accent3)"><p style="color:var(--accent3);font-weight:800;font-size:1.1rem">✅ אימון הושלם!</p></div>`;
  }

  container.innerHTML = html;
  initExerciseCards();
}

function buildExerciseCard(ex, idx, workout) {
  const levelColors = ['', 'level-1', 'level-1', '', 'level-3', 'level-5'];
  const levelLabelMap = ['', 'מתחיל', 'בסיסי', 'בינוני', 'מתקדם', 'אליט'];
  const categoryIcons = { push: '💪', pull: '🔗', legs: '🦵', core: '🎯', cardio: '🏃' };
  const icon = categoryIcons[ex.category] || '🏋️';

  const muscles = (ex.muscles || []).map(m => MUSCLE_NAMES_HE[m] || m).join(', ');
  const avgRating = Store.getAvgRating(ex.id);

  const adaptation = ProgramGenerator.adaptExercise(ex.id, {
    avgRating,
    currentSets: ex.sets,
    currentRepsMin: ex.repsMin,
    currentRepsMax: ex.repsMax,
  });

  const diffOverrides = (Store.get('difficultyOverrides') || {})[ex.id] || {};
  const sets = diffOverrides.sets || ex.sets;
  const repsMin = diffOverrides.repsMin || ex.repsMin;
  const repsMax = diffOverrides.repsMax || ex.repsMax;
  const rest = diffOverrides.restSeconds || ex.restSeconds;

  let setsHtml = '';
  for (let s = 1; s <= sets; s++) {
    setsHtml += `
      <div class="set-box" id="set-${idx}-${s}" onclick="toggleSet(${idx}, ${s}, ${rest})">
        <div class="set-num">סט ${s}</div>
        <div class="set-reps">${repsMin}–${repsMax}</div>
      </div>`;
  }

  return `
    <div class="exercise-card" id="ex-card-${idx}">
      <div class="exercise-header" onclick="toggleExerciseBody(${idx})">
        <div class="exercise-icon-circle">${icon}</div>
        <div class="exercise-meta">
          <h3>${ex.nameHe || ex.name}</h3>
          <div class="tags">
            <span class="tag ${levelColors[ex.level] || ''}">${levelLabelMap[ex.level] || ''}</span>
            <span class="tag">${sets} סטים × ${repsMin}–${repsMax}</span>
            <span class="tag">⏸ ${formatTime(rest)}</span>
          </div>
        </div>
        <span id="ex-arrow-${idx}" style="color:var(--text3);font-size:1.2rem">▼</span>
      </div>
      <div class="exercise-body hidden" id="ex-body-${idx}">
        <div class="exercise-demo">
          <h4>📋 הוראות ביצוע</h4>
          <p style="font-size:0.88rem;margin-bottom:8px">${ex.description || ''}</p>
          <ul class="cues">
            ${(ex.cues || []).map(c => `<li>${c}</li>`).join('')}
          </ul>
          <div class="muscle-diagram" style="margin-top:10px">
            ${(ex.muscles || []).map(m => `<span class="muscle-chip">${MUSCLE_NAMES_HE[m] || m}</span>`).join('')}
          </div>
          ${ex.safetyNote ? `<p style="font-size:0.78rem;color:var(--warn);margin-top:8px">⚠️ ${ex.safetyNote}</p>` : ''}
          ${adaptation && adaptation.message ? `<p style="font-size:0.8rem;color:var(--accent3);margin-top:6px">💡 ${adaptation.message}</p>` : ''}
        </div>

        <div class="section-title" style="margin-top:12px">סטים</div>
        <div class="sets-grid">${setsHtml}</div>

        <div class="rest-timer" id="rest-${idx}" style="display:none">
          <span>⏱ מנוחה:</span>
          <span class="rest-timer-count" id="rest-count-${idx}">--</span>
          <button class="btn btn-sm btn-secondary" onclick="skipRest(${idx})">דלג</button>
        </div>

        <div class="difficulty-rating">
          <span class="diff-label">רמת קושי:</span>
          <div class="diff-stars">
            ${['1','2','3','4','5'].map(v => `<div class="diff-star" data-ex="${idx}" data-eid="${ex.id}" data-v="${v}" onclick="rateDifficulty(this)">
              ${['😄','🙂','😐','😓','😰'][parseInt(v)-1]}
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

function toggleExerciseBody(idx) {
  const body = document.getElementById(`ex-body-${idx}`);
  const arrow = document.getElementById(`ex-arrow-${idx}`);
  if (body) {
    body.classList.toggle('hidden');
    if (arrow) arrow.textContent = body.classList.contains('hidden') ? '▼' : '▲';
  }
}

function toggleSet(exIdx, setNum, restSeconds) {
  const box = document.getElementById(`set-${exIdx}-${setNum}`);
  if (!box) return;
  const isDone = box.classList.toggle('done');
  if (isDone) {
    const display = document.getElementById(`rest-count-${exIdx}`);
    startRestTimer(restSeconds, display, null);
  }
}

function skipRest(exIdx) {
  if (restTimerInterval) clearInterval(restTimerInterval);
  const display = document.getElementById(`rest-count-${exIdx}`);
  if (display) { display.textContent = '✓'; display.style.color = 'var(--accent3)'; }
}

function rateDifficulty(el) {
  const exIdx = el.dataset.ex;
  const eid = el.dataset.eid;
  const val = parseInt(el.dataset.v);

  // Visual update
  document.querySelectorAll(`.diff-star[data-ex="${exIdx}"]`).forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');

  activeExerciseRatings[eid] = val;
}

function initExerciseCards() {
  // Auto-open first exercise
  const firstBody = document.getElementById('ex-body-0');
  if (firstBody) {
    firstBody.classList.remove('hidden');
    const arrow = document.getElementById('ex-arrow-0');
    if (arrow) arrow.textContent = '▲';
  }
}

function completeWorkout() {
  const currentWeek = Store.get('currentWeek') || 1;
  const today = new Date().getDay();

  // Save ratings
  Object.entries(activeExerciseRatings).forEach(([eid, rating]) => {
    Store.rateExercise(eid, rating);
    // Apply adaptation
    const overrides = Store.get('difficultyOverrides') || {};
    const program = Store.get('program');
    const weekData = program?.[currentWeek - 1];
    const dayData = weekData?.days?.[today];
    const ex = dayData?.workout?.exercises?.find(e => e.id === eid);
    if (ex) {
      const avg = Store.getAvgRating(eid);
      const adaptation = ProgramGenerator.adaptExercise(eid, {
        avgRating: avg,
        currentSets: ex.sets,
        currentRepsMin: ex.repsMin,
        currentRepsMax: ex.repsMax,
      });
      if (adaptation) {
        const current = overrides[eid] || { sets: ex.sets, repsMin: ex.repsMin, repsMax: ex.repsMax, restSeconds: ex.restSeconds };
        if (adaptation.action === 'add_reps') {
          current.repsMin += adaptation.deltaReps;
          current.repsMax += adaptation.deltaReps;
        } else if (adaptation.action === 'reduce_reps') {
          current.repsMin = Math.max(1, current.repsMin + adaptation.deltaReps);
          current.repsMax = Math.max(2, current.repsMax + adaptation.deltaReps);
        } else if (adaptation.action === 'add_rest') {
          current.restSeconds += adaptation.deltaRest;
        }
        overrides[eid] = current;
      }
    }
    Store.set('difficultyOverrides', overrides);
  });

  Store.completeWorkout(currentWeek, today);
  renderTopbar();

  // Check if week is done
  const program = Store.get('program');
  const weekData = program?.[currentWeek - 1];
  const workoutDays = weekData?.days?.filter(d => !d.isRest) || [];
  const completedDays = workoutDays.filter((d, i) => {
    const dayIdx = weekData.days.indexOf(d);
    return Store.isWorkoutCompleted(currentWeek, dayIdx);
  });

  if (completedDays.length >= workoutDays.length && currentWeek < program.length) {
    setTimeout(() => {
      if (confirm(`🎉 שבוע ${currentWeek} הושלם! עברת לשבוע ${currentWeek + 1}?`)) {
        Store.set('currentWeek', currentWeek + 1);
        showToast(`🚀 שבוע ${currentWeek + 1} מתחיל!`, 'success');
        navigate('dashboard');
      }
    }, 800);
  } else {
    showToast('🎉 אימון הושלם! עבודה טובה!', 'success');
    renderWorkoutPage();
    navigate('dashboard');
  }
}

// ──── Progress Page ────
let weightChart = null;

function renderProgressPage() {
  const streak = Store.get('streak') || 0;
  const weightLog = Store.get('weightLog') || [];
  const achievements = Store.get('achievements') || [];
  const currentWeek = Store.get('currentWeek') || 1;
  const program = Store.get('program') || [];

  // Streak
  const el = document.getElementById('prog-streak');
  if (el) el.textContent = streak;

  // Weight chart
  renderWeightChart(weightLog);

  // Achievements
  const achEl = document.getElementById('prog-achievements');
  if (achEl) {
    const ALL_ACHIEVEMENTS = [
      { id: 'streak_3', label: 'שלושה ימים ברצף', icon: '🔥' },
      { id: 'streak_7', label: 'שבוע שלם!', icon: '⚡' },
      { id: 'streak_14', label: 'שבועיים ברצף!', icon: '💪' },
      { id: 'streak_30', label: 'חודש ברצף!', icon: '🏆' },
      { id: 'streak_60', label: 'שישים יום!', icon: '🌟' },
      { id: 'streak_100', label: '100 ימים!', icon: '👑' },
    ];
    achEl.innerHTML = `<div class="achievements-grid">` +
      ALL_ACHIEVEMENTS.map(a => {
        const unlocked = achievements.find(u => u.id === a.id);
        return `<div class="achievement-badge ${unlocked ? 'unlocked' : ''}">
          <div class="badge-icon">${unlocked ? a.icon : '🔒'}</div>
          <div class="badge-name">${a.label}</div>
          ${unlocked ? `<div style="font-size:0.65rem;color:var(--text3);margin-top:3px">${new Date(unlocked.unlockedAt).toLocaleDateString('he-IL')}</div>` : ''}
        </div>`;
      }).join('') + `</div>`;
  }

  // Progress metrics
  const profile = Store.get('profile');
  const nutrition = Store.get('nutrition');
  const metricsEl = document.getElementById('prog-metrics');
  if (metricsEl && profile && nutrition) {
    const weeks = program.length;
    const wLog = Store.get('weightLog') || [];
    const startWeight = wLog.length > 0 ? wLog[0].weight : profile.weight;
    const currentWeight = wLog.length > 0 ? wLog[wLog.length - 1].weight : profile.weight;
    const change = (currentWeight - startWeight).toFixed(1);
    const pctDone = Math.round((currentWeek / weeks) * 100);

    metricsEl.innerHTML = `
      <div class="card" style="margin-bottom:0">
        <h3 style="margin-bottom:12px">📈 התקדמות</h3>
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          <div style="text-align:center;flex:1;min-width:80px">
            <div style="font-size:1.8rem;font-weight:900;color:var(--accent2)">${pctDone}%</div>
            <div style="font-size:0.75rem;color:var(--text3)">מהתוכנית</div>
          </div>
          <div style="text-align:center;flex:1;min-width:80px">
            <div style="font-size:1.8rem;font-weight:900;color:${change < 0 ? 'var(--accent3)' : 'var(--accent4)'}">${change > 0 ? '+' : ''}${change}</div>
            <div style="font-size:0.75rem;color:var(--text3)">שינוי ק"ג</div>
          </div>
          <div style="text-align:center;flex:1;min-width:80px">
            <div style="font-size:1.8rem;font-weight:900;color:var(--accent4)">${currentWeek}</div>
            <div style="font-size:0.75rem;color:var(--text3)">שבוע נוכחי</div>
          </div>
        </div>
        <div style="margin-top:14px">
          <div style="font-size:0.78rem;color:var(--text3);margin-bottom:4px">התקדמות כללית</div>
          <div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden">
            <div style="height:100%;width:${pctDone}%;background:linear-gradient(90deg,var(--accent),var(--accent3));border-radius:4px;transition:width 1s"></div>
          </div>
        </div>
      </div>`;
  }

  // Challenges
  renderChallenges();
}

function renderWeightChart(weightLog) {
  const canvas = document.getElementById('weight-chart');
  if (!canvas) return;

  if (weightLog.length < 2) {
    canvas.parentElement.innerHTML = `<div class="empty-state"><div class="empty-icon">📉</div><p>רשום לפחות 2 מדידות משקל לראות גרף</p><button class="btn btn-sm btn-primary" onclick="openWeightModal()" style="margin-top:12px">+ רשום משקל</button></div>`;
    return;
  }

  const labels = weightLog.map(e => e.date.slice(5));
  const data = weightLog.map(e => e.weight);

  if (weightChart) weightChart.destroy();
  weightChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'משקל (ק"ג)',
        data,
        borderColor: '#7c6af5',
        backgroundColor: 'rgba(124,106,245,0.1)',
        borderWidth: 2.5,
        pointBackgroundColor: '#a78bfa',
        pointRadius: 5,
        tension: 0.4,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#94a3b8', font: { size: 13 } } },
        tooltip: { rtl: true },
      },
      scales: {
        x: { ticks: { color: '#64748b' }, grid: { color: '#2e2e44' } },
        y: { ticks: { color: '#64748b' }, grid: { color: '#2e2e44' } },
      },
    },
  });
}

// ──── Challenges ────
const CHALLENGES = [
  { id: 'ch_7days', icon: '📅', title: '7 ימים ברצף', desc: 'אמן 7 ימים ברצף', target: 7, metric: 'streak' },
  { id: 'ch_100pushup', icon: '💪', title: '100 שכיבות סמיכה', desc: 'בצע 100 שכיבות סמיכה ביום אחד', target: 100, metric: 'manual' },
  { id: 'ch_first_pullup', icon: '🏆', title: 'המתח הראשון', desc: 'בצע מתח מלא ראשון', target: 1, metric: 'manual' },
  { id: 'ch_30days', icon: '📆', title: '30 ימים ברצף', desc: 'אמן 30 ימים ברצף', target: 30, metric: 'streak' },
  { id: 'ch_plank2min', icon: '⏱', title: 'פלאנק 2 דקות', desc: 'החזק פלאנק 2 דקות ברצף', target: 1, metric: 'manual' },
  { id: 'ch_10workouts', icon: '🔟', title: '10 אימונים', desc: 'השלם 10 אימונים', target: 10, metric: 'workouts' },
];

function renderChallenges() {
  const el = document.getElementById('prog-challenges');
  if (!el) return;
  const challenges = Store.get('challenges') || {};
  const streak = Store.get('streak') || 0;
  const completed = Object.keys(Store.get('completedWorkouts') || {}).length;

  el.innerHTML = CHALLENGES.map(ch => {
    const state = challenges[ch.id] || { progress: 0, completed: false };
    let progress = state.progress;

    if (ch.metric === 'streak') progress = Math.min(streak, ch.target);
    if (ch.metric === 'workouts') progress = Math.min(completed, ch.target);

    const pct = Math.min(100, (progress / ch.target) * 100);
    const done = ch.metric === 'manual' ? state.completed : progress >= ch.target;

    return `
      <div class="challenge-card" style="${done ? 'border-color:var(--accent3)' : ''}">
        <div class="ch-icon">${done ? '✅' : ch.icon}</div>
        <div style="flex:1">
          <h3>${ch.title} ${done ? '<span style="color:var(--accent3)">הושלם!</span>' : ''}</h3>
          <p style="font-size:0.82rem">${ch.desc}</p>
          <div class="challenge-progress">
            <div class="challenge-progress-bar" style="width:${pct}%"></div>
          </div>
          <div style="font-size:0.75rem;color:var(--text3);margin-top:4px">${ch.metric === 'manual' ? (done ? 'הושלם!' : 'סמן ידנית') : `${progress} / ${ch.target}`}</div>
          ${ch.metric === 'manual' && !done
            ? `<button class="btn btn-sm btn-secondary" style="margin-top:8px" onclick="completeChallenge('${ch.id}')">✅ סיימתי!</button>`
            : ''}
        </div>
      </div>`;
  }).join('');
}

function completeChallenge(id) {
  const challenges = Store.get('challenges') || {};
  challenges[id] = { progress: 1, completed: true };
  Store.set('challenges', challenges);
  showToast('🏆 אתגר הושלם! כל הכבוד!', 'achievement');
  renderChallenges();
}

// ──── Program Page ────
function renderProgramPage() {
  const program = Store.get('program') || [];
  const currentWeek = Store.get('currentWeek') || 1;
  const container = document.getElementById('program-container');
  if (!container) return;

  const milestones = Store.get('milestones') || [];

  let html = `
    <div class="card" style="margin-bottom:20px">
      <h2 style="margin-bottom:6px">📅 תוכנית אימונים</h2>
      <p>משך: ${program.length} שבועות · שבוע נוכחי: ${currentWeek}</p>
      <div class="phase-bar" style="margin-top:12px">
        <div class="phase-seg phase-1" title="שלב 1"></div>
        <div class="phase-seg phase-2" title="שלב 2"></div>
        <div class="phase-seg phase-3" title="שלב 3"></div>
        <div class="phase-seg phase-4" title="שלב 4"></div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;font-size:0.75rem;color:var(--text3)">
        <span>🟢 בסיס</span><span>🟣 פיתוח</span><span>🟠 אינטנסיבי</span><span>🔴 שיאים</span>
      </div>
    </div>`;

  // Milestones
  if (milestones.length) {
    html += `<div class="section-title">🎯 אבני דרך</div>`;
    html += milestones.map(m => `
      <div class="card" style="margin-bottom:8px;border-color:${currentWeek >= m.week ? 'var(--accent3)' : 'var(--border)'}">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:1.4rem">${currentWeek >= m.week ? '✅' : '🎯'}</span>
          <div>
            <h3>${m.title} (שבוע ${m.week})</h3>
            <p style="font-size:0.82rem">${m.description}</p>
          </div>
        </div>
      </div>`).join('');
  }

  html += `<div class="section-title" style="margin-top:8px">📋 שבועות</div>`;

  program.forEach((week, wi) => {
    const isCurrent = week.week === currentWeek;
    const isPast = week.week < currentWeek;
    html += `
      <div class="week-card" style="${isCurrent ? 'border-color:var(--accent)' : ''}">
        <div class="week-card-header" onclick="toggleWeekCard(${wi})">
          <div>
            <span style="font-weight:800">שבוע ${week.week}</span>
            <span class="badge ${isCurrent ? 'badge-purple' : isPast ? 'badge-green' : ''}" style="margin-right:8px">${isCurrent ? 'נוכחי' : isPast ? 'הושלם' : ''}</span>
          </div>
          <span style="color:var(--text3)">${week.phase?.name?.split(' – ')[1] || ''}</span>
          <span id="week-arrow-${wi}" style="color:var(--text3)">▼</span>
        </div>
        <div class="week-card-body hidden" id="week-body-${wi}">
          ${week.progressionNote ? `<p style="font-size:0.82rem;color:var(--accent4);margin-bottom:8px">${week.progressionNote}</p>` : ''}
          ${week.days.map((d, di) => {
            const isDone = !d.isRest && Store.isWorkoutCompleted(week.week, di);
            const cats = d.isRest ? 'מנוחה' : translateCategories((d.workout?.categories || []).join(' + '));
            return `<div class="day-row">
              <div class="day-dot ${d.isRest ? 'rest' : isDone ? 'done' : isCurrent && di === new Date().getDay() ? 'today' : ''}"></div>
              <span style="font-weight:600;min-width:48px">${d.dayLabel}</span>
              <span style="color:var(--text2);font-size:0.85rem">${cats}</span>
              ${isDone ? '<span style="color:var(--accent3);margin-right:auto">✓</span>' : ''}
            </div>`;
          }).join('')}
        </div>
      </div>`;
  });

  container.innerHTML = html;
}

function toggleWeekCard(wi) {
  const body = document.getElementById(`week-body-${wi}`);
  const arrow = document.getElementById(`week-arrow-${wi}`);
  if (body) {
    body.classList.toggle('hidden');
    if (arrow) arrow.textContent = body.classList.contains('hidden') ? '▼' : '▲';
  }
}

// ──── Nutrition Page ────
function renderNutritionPage() {
  const nutrition = Store.get('nutrition');
  const profile = Store.get('profile');
  const container = document.getElementById('nutrition-container');
  if (!container || !nutrition || !profile) return;

  if (!profile.wantsNutrition) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🥗</div>
        <h2>מידע תזונתי כבוי</h2>
        <p>ניתן להפעיל בהגדרות</p>
      </div>`;
    return;
  }

  const goalLabel = { toning: 'חיטוב', mass: 'מסה', strength: 'חיזוק' }[profile.goal] || profile.goal;
  const nutLog = Store.get('nutritionLog') || [];
  const metCount = nutLog.filter(n => n.met).length;
  const adherence = nutLog.length ? Math.round((metCount / nutLog.length) * 100) : 0;

  const meals = nutrition.mealSuggestions;

  container.innerHTML = `
    <div class="calorie-display">
      <div class="kcal">${nutrition.calories.toLocaleString()}</div>
      <div class="kcal-label">קלוריות יומיות · מטרה: ${goalLabel}</div>
    </div>

    <div class="macro-ring-row">
      <div class="macro-ring">
        <div class="ring-val" style="color:var(--accent2)">${nutrition.protein}ג</div>
        <div class="ring-label">חלבון</div>
      </div>
      <div class="macro-ring">
        <div class="ring-val" style="color:var(--accent4)">${nutrition.carbs}ג</div>
        <div class="ring-label">פחמימות</div>
      </div>
      <div class="macro-ring">
        <div class="ring-val" style="color:var(--accent3)">${nutrition.fat}ג</div>
        <div class="ring-label">שומן</div>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-bottom:8px">📊 נאמנות תזונתית</h3>
      <div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${adherence}%;background:linear-gradient(90deg,var(--accent),var(--accent3));transition:width 1s"></div>
      </div>
      <p style="font-size:0.82rem;margin-top:6px;color:var(--text3)">${adherence}% ימים עמדת ביעד (${metCount}/${nutLog.length} ימים)</p>
    </div>

    <div class="card">
      <h3 style="margin-bottom:4px">🧮 חישוב</h3>
      <p style="font-size:0.82rem">BMR: ${nutrition.bmr} קל/יום · TDEE: ${nutrition.tdee} קל/יום</p>
      <p style="font-size:0.82rem;margin-top:4px">שינוי משקל צפוי: ${nutrition.expectedWeightChange} ק"ג ב-${Store.get('program')?.length || 0} שבועות</p>
    </div>

    <div class="section-title">🍽️ המלצות ארוחות</div>

    ${renderMealSection('🌅 ארוחת בוקר', meals.breakfast)}
    ${renderMealSection('☀️ ארוחת צהריים', meals.lunch)}
    ${renderMealSection('🌙 ארוחת ערב', meals.dinner)}
    ${renderMealSection('🍎 חטיפים', meals.snacks)}

    <div class="card" style="margin-top:4px">
      <h3 style="margin-bottom:8px">💧 עצות כלליות</h3>
      <ul style="list-style:none">
        <li style="padding:4px 0;font-size:0.88rem">💧 שתה 2.5–3 ליטר מים ביום</li>
        <li style="padding:4px 0;font-size:0.88rem">🕐 אכול 3–5 ארוחות ביום</li>
        <li style="padding:4px 0;font-size:0.88rem">💪 אכול חלבון תוך 30 דק' אחרי אימון</li>
        <li style="padding:4px 0;font-size:0.88rem">🌙 אל תחסור יותר מ-500 קל/יום</li>
        <li style="padding:4px 0;font-size:0.88rem">🥗 עדיף מזון שלם על מעובד</li>
      </ul>
    </div>`;
}

function renderMealSection(title, items) {
  return `
    <div class="card" style="margin-bottom:10px">
      <h3 style="margin-bottom:8px">${title}</h3>
      ${items.map(item => `<div style="padding:4px 0;border-bottom:1px solid var(--border);font-size:0.88rem">• ${item}</div>`).join('')}
    </div>`;
}

// ──── Settings Page ────
function renderSettingsPage() {
  const profile = Store.get('profile');
  const el = document.getElementById('settings-container');
  if (!el || !profile) return;

  const eqLabels = EQUIPMENT_OPTIONS.map(e => ({...e, selected: (profile.equipment || []).includes(e.id)}));

  el.innerHTML = `
    <div class="settings-section">
      <h3>פרופיל</h3>
      <div class="card">
        <div class="form-group"><label>גיל</label><input type="number" id="s-age" value="${profile.age}" min="12" max="90"></div>
        <div class="form-group"><label>משקל (ק"ג)</label><input type="number" id="s-weight" value="${profile.weight}" step="0.1"></div>
        <div class="form-group"><label>גובה (ס"מ)</label><input type="number" id="s-height" value="${profile.height}"></div>
        <div class="form-group"><label>מגדר</label>
          <select id="s-gender">
            <option value="male" ${profile.gender==='male'?'selected':''}>זכר</option>
            <option value="female" ${profile.gender==='female'?'selected':''}>נקבה</option>
          </select>
        </div>
      </div>
    </div>
    <div class="settings-section">
      <h3>מטרה ואימון</h3>
      <div class="card">
        <div class="form-group"><label>מטרה</label>
          <select id="s-goal">
            <option value="toning" ${profile.goal==='toning'?'selected':''}>חיטוב</option>
            <option value="mass" ${profile.goal==='mass'?'selected':''}>מסה</option>
            <option value="strength" ${profile.goal==='strength'?'selected':''}>חיזוק</option>
          </select>
        </div>
        <div class="form-group"><label>ימי אימון בשבוע</label>
          <select id="s-days">
            ${[1,2,3,4,5,6,7].map(d=>`<option value="${d}" ${profile.daysPerWeek===d?'selected':''}>${d} ימים</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>משך אימון (דקות)</label>
          <select id="s-dur">
            ${[20,30,45,60,75,90,120,150,180,210].map(d=>`<option value="${d}" ${profile.durationMinutes===d?'selected':''}>${d} דק'</option>`).join('')}
          </select>
        </div>
      </div>
    </div>
    <div class="settings-section">
      <h3>ציוד זמין</h3>
      <div class="card">
        <div class="chip-group" id="s-equipment">
          ${eqLabels.map(e => `<div class="chip ${e.selected?'selected':''}" data-eq="${e.id}" onclick="this.classList.toggle('selected')">${e.icon} ${e.label}</div>`).join('')}
        </div>
      </div>
    </div>
    <div class="settings-section">
      <h3>תזונה</h3>
      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span>הצגת המלצות תזונה</span>
          <label style="display:flex;align-items:center;cursor:pointer;gap:8px">
            <input type="checkbox" id="s-nutrition" ${profile.wantsNutrition?'checked':''} style="width:20px;height:20px">
          </label>
        </div>
      </div>
    </div>
    <button class="btn btn-primary btn-full" onclick="saveSettings()">💾 שמור ועדכן תוכנית</button>
    <div style="height:16px"></div>
    <button class="btn btn-danger btn-full" onclick="resetApp()">🗑️ איפוס מלא</button>
    <div style="height:24px"></div>
    <div class="card" style="border-color:var(--border)">
      <h3 style="margin-bottom:8px">📖 מדריך עריכה</h3>
      <p style="font-size:0.82rem;line-height:1.7">
        לשינוי תרגילים: ערוך <code style="color:var(--accent2)">js/data.js</code><br>
        לשינוי לוגיקת תוכנית: ערוך <code style="color:var(--accent2)">js/program.js</code><br>
        לשינוי עיצוב: ערוך <code style="color:var(--accent2)">css/style.css</code><br>
        להתקנה על אייפון: Safari → Share → Add to Home Screen
      </p>
    </div>`;
}

function saveSettings() {
  const profile = Store.get('profile');
  const age = parseInt(document.getElementById('s-age').value);
  const weight = parseFloat(document.getElementById('s-weight').value);
  const height = parseFloat(document.getElementById('s-height').value);
  const gender = document.getElementById('s-gender').value;
  const goal = document.getElementById('s-goal').value;
  const daysPerWeek = parseInt(document.getElementById('s-days').value);
  const durationMinutes = parseInt(document.getElementById('s-dur').value);
  const equipment = Array.from(document.querySelectorAll('#s-equipment .chip.selected')).map(c => c.dataset.eq);
  const wantsNutrition = document.getElementById('s-nutrition').checked;

  if (!age || !weight || !height) { showToast('אנא מלא את כל השדות', 'info'); return; }

  const newProfile = { ...profile, age, weight, height, gender, goal, daysPerWeek, durationMinutes, equipment, wantsNutrition };
  Store.set('profile', newProfile);

  const gen = new ProgramGenerator(newProfile);
  Store.set('program', gen.generateFullProgram());
  Store.set('nutrition', gen.calculateNutrition());
  Store.set('milestones', gen.getMilestones());
  Store.set('currentWeek', 1);
  Store.set('difficultyOverrides', {});

  showToast('✅ הגדרות נשמרו ותוכנית עודכנה!', 'success');
  navigate('dashboard');
}

function resetApp() {
  if (confirm('האם לאפס את כל הנתונים? פעולה זו אינה הפיכה.')) {
    Store.reset();
    location.reload();
  }
}

// ──── Boot ────
document.addEventListener('DOMContentLoaded', () => {
  Store.load();

  const done = Store.get('onboardingDone');

  if (!done) {
    document.getElementById('onboarding').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
    initOnboarding();
  } else {
    document.getElementById('onboarding').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    renderTopbar();
    navigate('dashboard');
  }

  // Nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.page));
  });

  // Settings page trigger
  document.querySelectorAll('.nav-btn[data-page="settings"]').forEach(btn => {
    btn.addEventListener('click', () => renderSettingsPage());
  });

  // Goal selection in onboarding step 2
  document.querySelectorAll('.goal-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      onboardingData.goal = card.dataset.goal;
      // Show/hide target weight section in step 3
      updateStep3UI();
    });
  });

  // Days slider
  const daysRange = document.getElementById('ob-days');
  const daysDisplay = document.getElementById('ob-days-display');
  if (daysRange && daysDisplay) {
    daysRange.addEventListener('input', () => { daysDisplay.textContent = daysRange.value; });
  }

  // Duration slider
  const durSelect = document.getElementById('ob-duration');

  // Equipment chips
  document.querySelectorAll('#ob-equipment-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('selected'));
  });

  // Nutrition choice
  document.getElementById('ob-nutrition-yes')?.addEventListener('click', () => {
    document.getElementById('ob-nutrition-yes').classList.add('selected');
    document.getElementById('ob-nutrition-no').classList.remove('selected');
  });
  document.getElementById('ob-nutrition-no')?.addEventListener('click', () => {
    document.getElementById('ob-nutrition-no').classList.add('selected');
    document.getElementById('ob-nutrition-yes').classList.remove('selected');
  });
});

function updateStep3UI() {
  const goal = onboardingData.goal;
  const tg = document.getElementById('ob-target-group');
  const label = document.getElementById('ob-target-label');
  if (!tg || !label) return;
  if (goal === 'toning') {
    tg.style.display = 'block';
    label.textContent = 'כמה ק"ג תרצה לרדת? (אופציונלי)';
  } else if (goal === 'mass') {
    tg.style.display = 'block';
    label.textContent = 'כמה ק"ג תרצה לעלות? (אופציונלי)';
  } else {
    tg.style.display = 'none';
  }
}
