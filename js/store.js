// ============================================================
// store.js — LocalStorage state management
// ============================================================

const STORAGE_KEY = 'blorp_app_v1';

const Store = {
  _data: null,

  _defaults() {
    return {
      profile: null,        // user profile / onboarding data
      program: null,        // generated program weeks[]
      nutrition: null,      // calculated nutrition
      currentWeek: 1,
      currentDay: 0,        // index within week
      streak: 0,
      lastWorkoutDate: null,
      weightLog: [],        // [{date, weight}]
      nutritionLog: [],     // [{date, met: bool}]
      completedWorkouts: {},// {weekDay: bool} e.g. {"1_0": true}
      exerciseRatings: {},  // {exerciseId: [ratings]}
      achievements: [],     // [{id, unlockedAt}]
      challenges: {},       // {challengeId: {started, progress, completed}}
      difficultyOverrides: {}, // {exerciseId: {sets, repsMin, repsMax, restSeconds}}
      onboardingDone: false,
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      this._data = raw ? { ...this._defaults(), ...JSON.parse(raw) } : this._defaults();
    } catch (e) {
      this._data = this._defaults();
    }
    return this._data;
  },

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
  },

  get(key) {
    if (!this._data) this.load();
    return this._data[key];
  },

  set(key, value) {
    if (!this._data) this.load();
    this._data[key] = value;
    this.save();
  },

  patch(key, updates) {
    if (!this._data) this.load();
    this._data[key] = { ...this._data[key], ...updates };
    this.save();
  },

  // Weight logging
  logWeight(weight) {
    const log = this.get('weightLog') || [];
    const date = new Date().toISOString().split('T')[0];
    const existing = log.findIndex(e => e.date === date);
    if (existing >= 0) log[existing].weight = weight;
    else log.push({ date, weight });
    this.set('weightLog', log);
  },

  // Nutrition logging
  logNutrition(met) {
    const log = this.get('nutritionLog') || [];
    const date = new Date().toISOString().split('T')[0];
    const existing = log.findIndex(e => e.date === date);
    if (existing >= 0) log[existing].met = met;
    else log.push({ date, met });
    this.set('nutritionLog', log);
  },

  // Mark workout complete & manage streak
  completeWorkout(weekNum, dayIdx) {
    const key = `${weekNum}_${dayIdx}`;
    const completed = this.get('completedWorkouts') || {};
    completed[key] = new Date().toISOString();
    this.set('completedWorkouts', completed);
    this._updateStreak();
  },

  _updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const last = this.get('lastWorkoutDate');
    let streak = this.get('streak') || 0;

    if (last === today) return; // Already counted

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (last === yesterdayStr) {
      streak += 1;
    } else if (last !== today) {
      streak = 1; // Reset streak if more than 1 day gap (unless today)
    }

    this.set('streak', streak);
    this.set('lastWorkoutDate', today);
    this._checkAchievements(streak);
  },

  _checkAchievements(streak) {
    const achievements = this.get('achievements') || [];
    const unlock = (id, label, icon) => {
      if (!achievements.find(a => a.id === id)) {
        achievements.push({ id, label, icon, unlockedAt: new Date().toISOString() });
        this.set('achievements', achievements);
        showToast(`🏆 הישג חדש: ${label}!`, 'achievement');
      }
    };
    if (streak >= 3) unlock('streak_3', 'שלושה ימים ברצף', '🔥');
    if (streak >= 7) unlock('streak_7', 'שבוע שלם!', '⚡');
    if (streak >= 14) unlock('streak_14', 'שבועיים ברצף!', '💪');
    if (streak >= 30) unlock('streak_30', 'חודש ברצף!', '🏆');
    if (streak >= 60) unlock('streak_60', 'שישים יום!', '🌟');
    if (streak >= 100) unlock('streak_100', '100 ימים – אגדה!', '👑');
  },

  // Record exercise difficulty rating
  rateExercise(exerciseId, rating) {
    const ratings = this.get('exerciseRatings') || {};
    if (!ratings[exerciseId]) ratings[exerciseId] = [];
    ratings[exerciseId].push(rating);
    // Keep last 5 ratings
    if (ratings[exerciseId].length > 5) ratings[exerciseId].shift();
    this.set('exerciseRatings', ratings);
  },

  getAvgRating(exerciseId) {
    const ratings = (this.get('exerciseRatings') || {})[exerciseId];
    if (!ratings || ratings.length === 0) return 3;
    return ratings.reduce((a, b) => a + b, 0) / ratings.length;
  },

  isWorkoutCompleted(weekNum, dayIdx) {
    const completed = this.get('completedWorkouts') || {};
    return !!completed[`${weekNum}_${dayIdx}`];
  },

  reset() {
    this._data = this._defaults();
    localStorage.removeItem(STORAGE_KEY);
  },
};
