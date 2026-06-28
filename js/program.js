// ============================================================
// program.js — Program generation & adaptation logic
// ============================================================

class ProgramGenerator {

  constructor(profile) {
    this.profile = profile;
  }

  // ── Determine user fitness level (1–5) ──
  getFitnessLevel() {
    const { age, currentStrength, currentCardio } = this.profile;
    let score = 0;

    if (currentStrength === 'none') score += 0;
    else if (currentStrength === 'beginner') score += 1;
    else if (currentStrength === 'intermediate') score += 2;
    else if (currentStrength === 'advanced') score += 3;

    if (currentCardio === 'sedentary') score += 0;
    else if (currentCardio === 'light') score += 1;
    else if (currentCardio === 'moderate') score += 2;
    else if (currentCardio === 'active') score += 3;

    const total = score / 6;
    if (total < 0.2) return 1;
    if (total < 0.4) return 2;
    if (total < 0.6) return 3;
    if (total < 0.8) return 4;
    return 5;
  }

  // ── Calculate program duration in weeks ──
  getProgramDuration() {
    const level = this.getFitnessLevel();
    const { goal } = this.profile;
    const base = { toning: 12, mass: 16, strength: 14 }[goal] || 12;
    const levelMod = [0, 0, 2, 0, -2, -2][level] || 0;
    return base + levelMod;
  }

  // ── Get exercises appropriate for level & equipment ──
  getAvailableExercises(categories) {
    const level = this.getFitnessLevel();
    const { equipment } = this.profile;
    const maxLevel = Math.min(level + 1, 5);

    return Object.values(EXERCISES).filter(ex => {
      if (!categories.includes(ex.category) && !categories.includes('full_body')) return false;
      if (ex.category === 'cardio' && !categories.includes('cardio') && !categories.includes('full_body')) return false;
      if (ex.level > maxLevel) return false;
      if (ex.equipment.length === 0) return true;
      return ex.equipment.some(eq => equipment.includes(eq));
    });
  }

  // ── Build a single workout session ──
  buildWorkout(dayCategories, weekNumber, sessionIndex) {
    const level = this.getFitnessLevel();
    const { durationMinutes, goal } = this.profile;
    const exercises = [];

    // Warm-up is always included (counted in time)
    const warmupTime = 8;
    const cooldownTime = 5;
    const workTime = durationMinutes - warmupTime - cooldownTime;

    // Determine sets/reps scheme based on goal
    let scheme = this.getScheme(goal, level, weekNumber);

    // Get exercises per category
    const pool = this.getAvailableExercises(dayCategories);
    const selected = this.selectExercises(pool, dayCategories, level, workTime, scheme);

    selected.forEach(ex => {
      const adapted = this.adaptToWeek(ex, scheme, weekNumber);
      exercises.push(adapted);
    });

    return {
      warmup: this.buildWarmup(dayCategories),
      exercises,
      cooldown: this.buildCooldown(dayCategories),
      categories: dayCategories,
      estimatedMinutes: durationMinutes,
    };
  }

  getScheme(goal, level, weekNumber) {
    const phase = Math.floor((weekNumber - 1) / 4); // 0-indexed phase (every 4 weeks)
    if (goal === 'toning') {
      return {
        sets: 3 + Math.min(phase, 1),
        repsMin: 12 + phase * 2,
        repsMax: 20 + phase * 2,
        restSeconds: 45 + (level < 3 ? 15 : 0),
        type: 'endurance',
        holdSeconds: null,
      };
    }
    if (goal === 'mass') {
      return {
        sets: 4 + Math.min(phase, 1),
        repsMin: 6 + phase,
        repsMax: 12 + phase,
        restSeconds: 90 + (level < 3 ? 30 : 0),
        type: 'hypertrophy',
        holdSeconds: null,
      };
    }
    // strength
    return {
      sets: 5,
      repsMin: 3 + phase,
      repsMax: 6 + phase,
      restSeconds: 120 + (level < 3 ? 60 : 0),
      type: 'strength',
      holdSeconds: null,
    };
  }

  selectExercises(pool, categories, level, workTime, scheme) {
    // Estimate time per exercise (set × (avg reps × 3s + rest))
    const avgReps = (scheme.repsMin + scheme.repsMax) / 2;
    const setTime = avgReps * 3 + scheme.restSeconds;
    const exerciseTime = scheme.sets * setTime / 60; // minutes
    const maxExercises = Math.max(3, Math.floor(workTime / exerciseTime));

    // Prioritize variety and coverage
    const byCategory = {};
    pool.forEach(ex => {
      if (!byCategory[ex.category]) byCategory[ex.category] = [];
      byCategory[ex.category].push(ex);
    });

    const selected = [];
    const targetCategories = [...new Set(categories.filter(c => c !== 'full_body'))];

    // Pick best exercises per category
    targetCategories.forEach(cat => {
      const catPool = byCategory[cat] || [];
      // Sort by level proximity to user
      catPool.sort((a, b) => Math.abs(a.level - level) - Math.abs(b.level - level));
      // Pick 1-2 per category
      const pick = Math.min(2, catPool.length);
      for (let i = 0; i < pick && selected.length < maxExercises; i++) {
        if (!selected.find(s => s.id === catPool[i].id)) {
          selected.push(catPool[i]);
        }
      }
    });

    // If still under max and full_body category, add cardio/core
    if (categories.includes('cardio') || categories.includes('full_body')) {
      const cardioPool = (byCategory['cardio'] || []).slice(0, 2);
      cardioPool.forEach(ex => {
        if (selected.length < maxExercises && !selected.find(s => s.id === ex.id)) {
          selected.push(ex);
        }
      });
    }

    return selected.slice(0, maxExercises);
  }

  adaptToWeek(exercise, scheme, weekNumber) {
    // Progressive overload: add reps/sets as weeks progress
    const progressMod = Math.floor((weekNumber - 1) / 4);
    return {
      ...exercise,
      sets: scheme.sets,
      repsMin: scheme.repsMin,
      repsMax: scheme.repsMax,
      restSeconds: scheme.restSeconds,
      progressionNote: progressMod > 0
        ? `שבוע ${weekNumber}: + ${progressMod} שניות מנוחה פחות / + חזרה אחת`
        : '',
    };
  }

  buildWarmup(categories) {
    const warmups = [
      { name: 'Arm Circles', nameHe: 'סיבובי ידיים', duration: '30 שניות × 2 כיוונים', desc: 'הגדל טווח בהדרגה' },
      { name: 'Shoulder Rolls', nameHe: 'סיבובי כתפיים', duration: '20 שניות', desc: 'קדימה ואחורה' },
      { name: 'Hip Circles', nameHe: 'סיבובי ירכיים', duration: '30 שניות', desc: 'ירכיים רחבות' },
      { name: 'Wrist Circles', nameHe: 'סיבובי שורש כף יד', duration: '20 שניות', desc: 'חשוב לפני לחיצות' },
      { name: 'Jumping Jacks', nameHe: 'קפיצות פיזור', duration: '60 שניות', desc: 'הפעל מחזור הדם' },
      { name: 'Leg Swings', nameHe: 'נדנודי רגל', duration: '30 שניות × צד', desc: 'קדימה, אחורה, צד' },
      { name: 'Cat-Cow Stretch', nameHe: 'תרגיל חתול-פרה', duration: '30 שניות', desc: 'גמישות עמוד שדרה' },
    ];
    if (categories.includes('pull') || categories.includes('full_body')) {
      warmups.push({ name: 'Dead Hang', nameHe: 'תלייה פסיבית', duration: '30 שניות', desc: 'מתיחת כתפיים וגב' });
    }
    return warmups;
  }

  buildCooldown(categories) {
    return [
      { name: 'Child\'s Pose', nameHe: 'תנוחת ילד', duration: '60 שניות', desc: 'גב ופלדואה' },
      { name: 'Chest Stretch', nameHe: 'מתיחת חזה', duration: '30 שניות × צד', desc: 'זרוע על הקיר, סובב' },
      { name: 'Pigeon Pose', nameHe: 'תנוחת יונה', duration: '60 שניות × צד', desc: 'מתיחת ירך' },
      { name: 'Shoulder Cross Stretch', nameHe: 'מתיחת כתף', duration: '30 שניות × צד', desc: 'זרוע מעל חזה' },
      { name: 'Standing Quad Stretch', nameHe: 'מתיחת ארבע ראשי', duration: '30 שניות × צד', desc: 'עמד ואחוז קרסול' },
      { name: 'Deep Breathing', nameHe: 'נשימות עמוקות', duration: '60 שניות', desc: '4 שניות שאיפה, 6 נשיפה' },
    ];
  }

  // ── Generate full program ──
  generateFullProgram() {
    const weeks = this.getProgramDuration();
    const { daysPerWeek, goal } = this.profile;
    const splitTemplate = SPLIT_TEMPLATES[daysPerWeek] || SPLIT_TEMPLATES[3];
    const program = [];

    for (let week = 1; week <= weeks; week++) {
      const weekPlan = {
        week,
        phase: this.getPhaseInfo(week, weeks),
        days: [],
        progressionNote: this.getProgressionNote(week),
      };

      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const sessionIndex = dayOfWeek % daysPerWeek;
        const dayTemplate = splitTemplate[sessionIndex];

        if (dayOfWeek < daysPerWeek) {
          weekPlan.days.push({
            dayOfWeek,
            dayLabel: this.getDayLabel(dayOfWeek),
            isRest: false,
            workout: this.buildWorkout(dayTemplate, week, sessionIndex),
          });
        } else {
          weekPlan.days.push({
            dayOfWeek,
            dayLabel: this.getDayLabel(dayOfWeek),
            isRest: true,
          });
        }
      }
      program.push(weekPlan);
    }
    return program;
  }

  getPhaseInfo(week, totalWeeks) {
    const pct = week / totalWeeks;
    if (pct < 0.25) return { phase: 1, name: 'שלב 1 – בניית בסיס', description: 'לומדים את התנועות, מבנים כוח בסיסי, אין ממהרים' };
    if (pct < 0.5) return { phase: 2, name: 'שלב 2 – פיתוח', description: 'עומסים עולים, נפח גדל, התאמה לאתגרים' };
    if (pct < 0.75) return { phase: 3, name: 'שלב 3 – אינטנסיביות', description: 'עוצמה גבוהה, התקדמות לתרגילים מתקדמים' };
    return { phase: 4, name: 'שלב 4 – שיאים', description: 'שיאים אישיים, התגרות בגבולות, וחיזוק רווחים' };
  }

  getProgressionNote(week) {
    if (week % 4 === 0) return '🔁 שבוע דיאלוד – הפחת נפח ב-30%, התאוששות פעילה';
    if (week % 4 === 1 && week > 1) return '💪 שלב חדש! הוסף חזרה לכל סט';
    return '';
  }

  getDayLabel(i) {
    return ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'][i];
  }

  // ── Nutrition calculation ──
  calculateNutrition() {
    const { age, weight, height, gender, goal, targetWeightChange } = this.profile;
    const ref = NUTRITION_REFERENCE;

    const bmr = gender === 'male'
      ? ref.bmr_male(weight, height, age)
      : ref.bmr_female(weight, height, age);

    const activityLevel = this.getActivityLevel();
    const tdee = bmr * ref.activity_multipliers[activityLevel];
    const goalAdj = ref.goal_adjustments[goal] || 0;
    const calories = Math.round(tdee + goalAdj);

    const protein = Math.round(weight * ref.protein_per_kg[goal]);
    const fat = Math.round((calories * ref.fat_pct[goal]) / 9);
    const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

    const weeks = this.getProgramDuration();
    const weeklyChange = goal === 'toning' ? -0.3 : goal === 'mass' ? 0.3 : 0.1;
    const expectedChange = weeklyChange * weeks;
    const targetWeight = weight + expectedChange;

    return {
      calories,
      protein,
      fat,
      carbs,
      tdee: Math.round(tdee),
      bmr: Math.round(bmr),
      expectedWeightChange: expectedChange.toFixed(1),
      targetWeight: targetWeight.toFixed(1),
      weeklyChange,
      mealSuggestions: this.getMealSuggestions(calories, protein, goal),
    };
  }

  getActivityLevel() {
    const { currentCardio, daysPerWeek } = this.profile;
    if (currentCardio === 'sedentary' && daysPerWeek <= 2) return 'sedentary';
    if (daysPerWeek <= 3) return 'light';
    if (daysPerWeek <= 5) return 'moderate';
    return 'active';
  }

  getMealSuggestions(calories, protein, goal) {
    const suggestions = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    };

    if (goal === 'toning') {
      suggestions.breakfast = ['חביתת 3 ביצים + ירקות', 'יוגורט יווני + פירות', 'שיבולת שועל + חלב שקדים'];
      suggestions.lunch = ['חזה עוף צלוי + אורז חום + ירקות', 'סלט טונה + לחם מחיטה מלאה', 'חומוס + ירקות + ביצים'];
      suggestions.dinner = ['סלמון + ירקות מאודים', 'הודו טחון + ירקות', 'ביצים + סלט'];
      suggestions.snacks = ['אגוזים (30 גרם)', 'פרי + גבינה', 'חטיף חלבון'];
    } else if (goal === 'mass') {
      suggestions.breakfast = ['שיבולת שועל + בננה + חלבון', 'חביתת 4 ביצים + לחם', 'פנקייקים מחיטה מלאה + סירופ דבש'];
      suggestions.lunch = ['חזה עוף 200ג + אורז 100ג יבש + שמן זית', 'סטייק + בטטה + ברוקולי', 'שקשוקה + לחם'];
      suggestions.dinner = ['סלמון + פסטה + ירקות', 'בשר טחון + אורז', 'ביצים + לחם + אבוקדו'];
      suggestions.snacks = ['גלידת חלבון', 'פיסטוקים + פרי', 'לחם + חמאת בוטנים'];
    } else {
      suggestions.breakfast = ['ביצים + אבוקדו + לחם', 'קוואקר + חלבון + פירות יבשים'];
      suggestions.lunch = ['סטייק + ירקות + בטטה', 'עוף שלם + קינואה'];
      suggestions.dinner = ['דג + אורז + סלט'];
      suggestions.snacks = ['גבינת קוטג + עגבנייה', 'אגוזים'];
    }

    return suggestions;
  }

  // ── Adapt exercise based on difficulty rating ──
  static adaptExercise(exerciseId, ratingData) {
    const ex = EXERCISES[exerciseId];
    if (!ex) return null;
    const { avgRating, currentSets, currentRepsMin, currentRepsMax } = ratingData;

    if (avgRating <= 2) {
      // Too easy – increase difficulty
      const nextIdx = ex.progressions.indexOf(exerciseId) + 1;
      if (nextIdx < ex.progressions.length) {
        return { action: 'progress', nextExercise: ex.progressions[nextIdx], message: 'שדרוג לתרגיל הבא בסדרה!' };
      }
      return { action: 'add_reps', deltaReps: 2, deltaSets: 0, message: '+2 חזרות לכל סט' };
    }
    if (avgRating === 3) {
      return { action: 'maintain', message: 'קצב מושלם – המשך כך!' };
    }
    if (avgRating === 4) {
      return { action: 'add_rest', deltaRest: 15, message: '+15 שניות מנוחה' };
    }
    // Rating 5 (too hard)
    const prevIdx = ex.progressions.indexOf(exerciseId) - 1;
    if (prevIdx >= 0) {
      return { action: 'regress', prevExercise: ex.progressions[prevIdx], message: 'חזרה לתרגיל קודם – עוד קצת!' };
    }
    return { action: 'reduce_reps', deltaReps: -2, deltaSets: 0, message: '-2 חזרות לכל סט' };
  }

  // ── Expected milestones ──
  getMilestones() {
    const weeks = this.getProgramDuration();
    const { goal, profile } = this;
    const nutrition = this.calculateNutrition();
    const milestones = [];

    milestones.push({ week: 2, title: '🎉 שבועיים ראשונים', description: 'גוף מתחיל להסתגל, ייתכן כאב שרירים – זה בסדר!' });
    milestones.push({ week: 4, title: '💪 חודש ראשון', description: 'שיפור בסיבולת, תבחין ביכולת לבצע יותר חזרות' });
    milestones.push({ week: 8, title: '🔥 חודשיים', description: `שינוי גלוי בגוף, כ-${Math.abs(nutrition.weeklyChange * 8).toFixed(1)} ק"ג ${nutrition.weeklyChange < 0 ? 'ירידה' : 'עלייה'}` });
    milestones.push({ week: 12, title: '🏆 שלושה חודשים', description: 'תוצאות ניכרות, כוח בסיסי מבוסס' });
    if (weeks > 12) {
      milestones.push({ week: weeks, title: '🌟 סיום התוכנית', description: `משקל יעד: ${nutrition.targetWeight} ק"ג, כוח ויכולת בקליסטניקס מרשימים` });
    }
    return milestones;
  }
}
