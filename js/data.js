// ============================================================
// data.js — Exercise database & nutrition reference values
// ============================================================

const EXERCISES = {
  // ──────────────── PULL (Back / Biceps) ────────────────
  australian_row: {
    id: 'australian_row', name: 'Australian Row', nameHe: 'משיכת אוסטרלי',
    muscles: ['back', 'biceps'], equipment: ['bar_low', 'rings'],
    level: 1, category: 'pull',
    description: 'שכב מתחת לחסם אופקי (מוט/טבעות), גוף ישר, משוך את החזה לכיוון המוט.',
    cues: ['שמור גוף ישר כמו קרש', 'מרפקים קרובים לגוף', 'כווץ שכמות בראש התנועה'],
    progressions: ['australian_row', 'pullup_negatives', 'pullup', 'wide_grip_pullup'],
    gifUrl: null,
    safetyNote: 'אין ללחוץ את הצוואר קדימה. תנועה איטית ומבוקרת.'
  },
  pullup_negatives: {
    id: 'pullup_negatives', name: 'Pull-up Negatives', nameHe: 'נגטיבים מתח',
    muscles: ['back', 'biceps', 'core'], equipment: ['pullup_bar'],
    level: 2, category: 'pull',
    description: 'עלה על הכסא/קפוץ לעמדת עליונה (סנטר מעל מוט) וירד לאט 5-8 שניות.',
    cues: ['ירידה מבוקרת – 5 שניות לפחות', 'אל תתמוטט בבת אחת', 'כתפיים יורדות בשליטה'],
    progressions: ['australian_row', 'pullup_negatives', 'pullup'],
    gifUrl: null,
    safetyNote: 'אל תשחרר בפתאומיות – סכנת כתף.'
  },
  pullup: {
    id: 'pullup', name: 'Pull-up', nameHe: 'מתח אחיזה עלית',
    muscles: ['back', 'biceps', 'core'], equipment: ['pullup_bar'],
    level: 3, category: 'pull',
    description: 'תלה על המוט, אחיזה רחבה, משוך עד שהסנטר מעל המוט.',
    cues: ['הפעל שכמות לפני שאתה מושך', 'אל תתנד', 'ירידה מלאה בין חזרות'],
    progressions: ['pullup_negatives', 'pullup', 'wide_grip_pullup', 'archer_pullup'],
    gifUrl: null,
    safetyNote: 'חמם כתפיים לפני. אל תסובב מרפקים החוצה בכוח.'
  },
  chinup: {
    id: 'chinup', name: 'Chin-up', nameHe: 'מתח אחיזה תחתית',
    muscles: ['biceps', 'back', 'core'], equipment: ['pullup_bar'],
    level: 3, category: 'pull',
    description: 'אחיזה צרה עם כפות הידיים לכיוון הפנים, משוך עד שהסנטר מעל.',
    cues: ['מרפקים מול הגוף', 'כווץ ביצפס בראש', 'ירידה מלאה'],
    progressions: ['pullup_negatives', 'chinup', 'pullup', 'weighted_chinup'],
    gifUrl: null,
    safetyNote: 'בטוח יותר למתחילים בגלל זווית הכתף.'
  },
  wide_grip_pullup: {
    id: 'wide_grip_pullup', name: 'Wide Grip Pull-up', nameHe: 'מתח אחיזה רחבה',
    muscles: ['lats', 'back', 'biceps'], equipment: ['pullup_bar'],
    level: 4, category: 'pull',
    description: 'אחיזה רחבה מעבר לרוחב כתפיים, משוך עד שהחזה נוגע במוט.',
    cues: ['הפעל גב רחב', 'מרפקים מכוונים לרצפה', 'תנועה מבוקרת'],
    progressions: ['pullup', 'wide_grip_pullup', 'archer_pullup'],
    gifUrl: null,
    safetyNote: 'אחיזה רחבה מדי – סכנת כתף. אל תרחיק מעבר ל-1.5x רוחב כתפיים.'
  },
  archer_pullup: {
    id: 'archer_pullup', name: 'Archer Pull-up', nameHe: 'מתח קשת',
    muscles: ['back', 'biceps'], equipment: ['pullup_bar'],
    level: 5, category: 'pull',
    description: 'משוך לצד אחד תוך כדי שהיד השנייה יורדת ישרה. חיזוק לעבר one-arm.',
    cues: ['תנועה צידית מבוקרת', 'שמור על יציבות ליבה', 'שני הצדדים שווים'],
    progressions: ['wide_grip_pullup', 'archer_pullup', 'one_arm_pullup_assist'],
    gifUrl: null,
    safetyNote: 'רק אחרי שליטה מלאה במתח רגיל.'
  },

  // ──────────────── PUSH (Chest / Triceps / Shoulders) ────────────────
  knee_pushup: {
    id: 'knee_pushup', name: 'Knee Push-up', nameHe: 'שכיבה סמיכה על ברכיים',
    muscles: ['chest', 'triceps', 'shoulders'], equipment: [],
    level: 1, category: 'push',
    description: 'כמו שכיבת סמיכה רגילה אך הברכיים נוגעות ברצפה.',
    cues: ['גוף ישר מהברכיים לכתפיים', 'ירד עד שחזה קרוב לרצפה', 'אל תשפיל ישבן'],
    progressions: ['knee_pushup', 'pushup', 'diamond_pushup'],
    gifUrl: null,
    safetyNote: 'מתאים למתחילים. אל תשים לחץ על הברכיים.'
  },
  pushup: {
    id: 'pushup', name: 'Push-up', nameHe: 'שכיבת סמיכה',
    muscles: ['chest', 'triceps', 'shoulders', 'core'], equipment: [],
    level: 2, category: 'push',
    description: 'עמד על כפות ידיים ורגליים, גוף ישר, ירד עד שחזה כמעט נוגע ברצפה.',
    cues: ['ידיים ברוחב כתפיים', 'גוף ישר כמו קרש', 'מרפקים בזווית 45°'],
    progressions: ['knee_pushup', 'pushup', 'diamond_pushup', 'wide_pushup', 'archer_pushup'],
    gifUrl: null,
    safetyNote: 'אל תשפיל מותניים. שמור ליבה מכווצת.'
  },
  diamond_pushup: {
    id: 'diamond_pushup', name: 'Diamond Push-up', nameHe: 'שכיבת סמיכה יהלום',
    muscles: ['triceps', 'chest', 'shoulders'], equipment: [],
    level: 3, category: 'push',
    description: 'ידיים צמודות יוצרות צורת יהלום, מדגיש טריצפס.',
    cues: ['ידיים צמודות מתחת לחזה', 'מרפקים ישרות לאחור', 'גוף ישר'],
    progressions: ['pushup', 'diamond_pushup', 'pseudo_planche_pushup'],
    gifUrl: null,
    safetyNote: 'לא מתאים לאנשים עם בעיות שורש כף יד.'
  },
  wide_pushup: {
    id: 'wide_pushup', name: 'Wide Push-up', nameHe: 'שכיבת סמיכה רחבה',
    muscles: ['chest', 'shoulders'], equipment: [],
    level: 2, category: 'push',
    description: 'ידיים רחבות יותר מרוחב כתפיים, מדגיש חזה חיצוני.',
    cues: ['ידיים רחבות', 'ירד לאט', 'הרגש את החזה נמתח'],
    progressions: ['pushup', 'wide_pushup', 'archer_pushup'],
    gifUrl: null,
    safetyNote: 'אל תרחיב יותר מדי – סכנת כתף.'
  },
  pike_pushup: {
    id: 'pike_pushup', name: 'Pike Push-up', nameHe: 'שכיבת סמיכה פייק',
    muscles: ['shoulders', 'triceps'], equipment: [],
    level: 3, category: 'push',
    description: 'ישבן גבוה, גוף ב-V הפוך, ירד כך שהראש בין הידיים.',
    cues: ['ישבן גבוה מאוד', 'ירד בשליטה', 'מצח לכיוון הרצפה'],
    progressions: ['pushup', 'pike_pushup', 'handstand_pushup_wall'],
    gifUrl: null,
    safetyNote: 'אל תדחוף צוואר קדימה. שמור ראש בציר הגוף.'
  },
  dip: {
    id: 'dip', name: 'Dip', nameHe: 'דיפ מקביליים',
    muscles: ['triceps', 'chest', 'shoulders'], equipment: ['parallel_bars', 'dip_bars'],
    level: 3, category: 'push',
    description: 'תמוך על מקביליים, ירד עד שמרפקים ב-90°, עלה חזרה.',
    cues: ['הישאר זקוף לטריצפס, הטה קדימה לחזה', 'ירד בשליטה', 'אל תנעל מרפקים בראש'],
    progressions: ['bench_dip', 'dip', 'weighted_dip'],
    gifUrl: null,
    safetyNote: 'אל תרד מתחת ל-90° בכתף. לא מתאים עם בעיית כתף.'
  },
  bench_dip: {
    id: 'bench_dip', name: 'Bench Dip', nameHe: 'דיפ ספסל',
    muscles: ['triceps', 'chest'], equipment: [],
    level: 2, category: 'push',
    description: 'ידיים על ספסל/כיסא מאחורי הגוף, ירד ועלה בשליטה.',
    cues: ['ישבן קרוב לספסל', 'מרפקים ישרות לאחור', 'ירד 90°'],
    progressions: ['bench_dip', 'dip'],
    gifUrl: null,
    safetyNote: 'אל תרחיק ידיים יותר מדי – עומס על כתפיים.'
  },
  handstand_pushup_wall: {
    id: 'handstand_pushup_wall', name: 'Wall Handstand Push-up', nameHe: 'עמידת ידיים בשכיבה סמיכה',
    muscles: ['shoulders', 'triceps', 'core'], equipment: [],
    level: 5, category: 'push',
    description: 'עמידת ידיים ליד קיר, ירד עד שראש כמעט נוגע ברצפה.',
    cues: ['שמור ליבה מכווץ', 'ירד לאט 3 שניות', 'אצבעות מכוונות קדימה'],
    progressions: ['pike_pushup', 'handstand_pushup_wall'],
    gifUrl: null,
    safetyNote: 'רק אחרי שליטה מלאה בפייק פוש-אפ. סכנת נפילה – תאמן ליד קיר.'
  },
  archer_pushup: {
    id: 'archer_pushup', name: 'Archer Push-up', nameHe: 'שכיבת סמיכה קשת',
    muscles: ['chest', 'triceps', 'shoulders'], equipment: [],
    level: 4, category: 'push',
    description: 'ירד לצד אחד תוך כדי יד אחת ישרה, כמו קשת.',
    cues: ['תנועה צידית מבוקרת', 'יד ישרה נשארת על הרצפה', 'שני צדדים שווים'],
    progressions: ['wide_pushup', 'archer_pushup', 'one_arm_pushup_assist'],
    gifUrl: null,
    safetyNote: 'רק אחרי 20+ שכיבות סמיכה רגילות.'
  },
  pseudo_planche_pushup: {
    id: 'pseudo_planche_pushup', name: 'Pseudo Planche Push-up', nameHe: 'שכיבת סמיכה פלאנש',
    muscles: ['chest', 'triceps', 'shoulders', 'core'], equipment: [],
    level: 4, category: 'push',
    description: 'ידיים בצדי הגוף (בטן), הישען קדימה ועשה שכיבת סמיכה.',
    cues: ['נטה קדימה על כפות הידיים', 'הרגש לחץ על שורש כף יד', 'גוף ישר'],
    progressions: ['diamond_pushup', 'pseudo_planche_pushup'],
    gifUrl: null,
    safetyNote: 'חמם שורשות כף יד. התחל עם נטייה קטנה.'
  },

  // ──────────────── LEGS ────────────────
  squat: {
    id: 'squat', name: 'Bodyweight Squat', nameHe: 'סקוואט משקל גוף',
    muscles: ['quads', 'glutes', 'hamstrings'], equipment: [],
    level: 1, category: 'legs',
    description: 'עמוד ברוחב כתפיים, ירד כאילו אתה יושב על כיסא, ברכיים מעל אצבעות.',
    cues: ['ברכיים לא עוברות אצבעות (בסיסי)', 'עקבים ברצפה', 'גב ישר'],
    progressions: ['squat', 'bulgarian_split_squat', 'pistol_squat_assist', 'pistol_squat'],
    gifUrl: null,
    safetyNote: 'אל תקפל גב. ברכיים בכיוון אצבעות.'
  },
  lunge: {
    id: 'lunge', name: 'Lunge', nameHe: 'לנג',
    muscles: ['quads', 'glutes', 'hamstrings'], equipment: [],
    level: 2, category: 'legs',
    description: 'צעד גדול קדימה, ירד עד שהברך האחורית כמעט נוגעת ברצפה.',
    cues: ['ברך קדמית מעל קרסול', 'גוף זקוף', 'דחוף מהעקב בחזרה'],
    progressions: ['squat', 'lunge', 'bulgarian_split_squat'],
    gifUrl: null,
    safetyNote: 'אל תטה קדימה. דחוף מהעקב בחזרה.'
  },
  bulgarian_split_squat: {
    id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', nameHe: 'סקוואט בולגרי',
    muscles: ['quads', 'glutes', 'hamstrings'], equipment: [],
    level: 3, category: 'legs',
    description: 'רגל אחורית על ספסל, ירד על הרגל הקדמית.',
    cues: ['ברך קדמית מעל קרסול', 'גוף זקוף', 'ירד לאט 3 שניות'],
    progressions: ['lunge', 'bulgarian_split_squat', 'pistol_squat_assist'],
    gifUrl: null,
    safetyNote: 'הגדל טווח בהדרגה. אל תניח משקל על הברך האחורית.'
  },
  pistol_squat_assist: {
    id: 'pistol_squat_assist', name: 'Assisted Pistol Squat', nameHe: 'פיסטול סקוואט עם עזרה',
    muscles: ['quads', 'glutes', 'core'], equipment: [],
    level: 4, category: 'legs',
    description: 'אחוז משהו לאיזון, ירד על רגל אחת.',
    cues: ['שמור גב ישר', 'רגל קדמית מושטת', 'ירד בשליטה'],
    progressions: ['bulgarian_split_squat', 'pistol_squat_assist', 'pistol_squat'],
    gifUrl: null,
    safetyNote: 'אל תכפוף ברך פנימה. אל תגש לפיסטול לפני בולגרי מלא.'
  },
  pistol_squat: {
    id: 'pistol_squat', name: 'Pistol Squat', nameHe: 'פיסטול סקוואט',
    muscles: ['quads', 'glutes', 'core'], equipment: [],
    level: 5, category: 'legs',
    description: 'ירד על רגל אחת לגמרי ללא עזרה, רגל אחת מושטת קדימה.',
    cues: ['ידיים קדימה לאיזון', 'ברך ישרה בקו', 'עלה בנפץ'],
    progressions: ['pistol_squat_assist', 'pistol_squat'],
    gifUrl: null,
    safetyNote: 'מיומנות מתקדמת. נדרש גמישות וכוח.'
  },
  calf_raise: {
    id: 'calf_raise', name: 'Calf Raise', nameHe: 'הרמת עקבים',
    muscles: ['calves'], equipment: [],
    level: 1, category: 'legs',
    description: 'עמוד על קצות אצבעות הרגל ועלה וירד בשליטה.',
    cues: ['עלה גבוה', 'ירד עד מתיחה', 'על מדרגה = טווח מלא'],
    progressions: ['calf_raise'],
    gifUrl: null,
    safetyNote: 'אל תזנק. תנועה מבוקרת.'
  },
  jump_squat: {
    id: 'jump_squat', name: 'Jump Squat', nameHe: 'סקוואט קפיצה',
    muscles: ['quads', 'glutes', 'calves'], equipment: [],
    level: 2, category: 'legs',
    description: 'ירד לסקוואט ואז קפוץ גבוה, נחת בעדינות.',
    cues: ['נחת רכות על כרית', 'ירד לסקוואט לפני קפיצה', 'גב ישר'],
    progressions: ['squat', 'jump_squat'],
    gifUrl: null,
    safetyNote: 'נחת קדימה לא על עקבים. לא לאנשים עם בעיות ברכיים.'
  },

  // ──────────────── CORE ────────────────
  plank: {
    id: 'plank', name: 'Plank', nameHe: 'פלאנק',
    muscles: ['core', 'shoulders'], equipment: [],
    level: 1, category: 'core',
    description: 'שכב על מרפקים וקצות אצבעות, גוף ישר, החזק.',
    cues: ['ישבן לא למעלה ולא למטה', 'כווץ בטן ועכוז', 'נשום בנחת'],
    progressions: ['plank', 'plank_shoulder_tap', 'side_plank', 'hollow_body'],
    gifUrl: null,
    safetyNote: 'אל תחזיק נשימה. הפסק אם כאב גב.'
  },
  side_plank: {
    id: 'side_plank', name: 'Side Plank', nameHe: 'פלאנק צידי',
    muscles: ['obliques', 'core'], equipment: [],
    level: 2, category: 'core',
    description: 'שכב על מרפק אחד בצד, גוף ישר, ירכיים למעלה.',
    cues: ['גוף ישר', 'ירכיים לא צונחות', 'כווץ אלכסוניים'],
    progressions: ['plank', 'side_plank'],
    gifUrl: null,
    safetyNote: 'שני צדדים שווים.'
  },
  hollow_body: {
    id: 'hollow_body', name: 'Hollow Body Hold', nameHe: 'תנוחת חלול',
    muscles: ['core', 'hip_flexors'], equipment: [],
    level: 3, category: 'core',
    description: 'שכב, הרם ידיים ורגליים, כווץ בטן, מרפקים נגד הגב.',
    cues: ['גב שטוח לרצפה', 'כווץ בטן חזק', 'ידיים ורגליים מורמות'],
    progressions: ['plank', 'hollow_body', 'l_sit'],
    gifUrl: null,
    safetyNote: 'גב חייב להישאר ברצפה. שמור נשימה רגילה.'
  },
  plank_shoulder_tap: {
    id: 'plank_shoulder_tap', name: 'Plank Shoulder Tap', nameHe: 'פלאנק עם נגיעת כתף',
    muscles: ['core', 'shoulders', 'obliques'], equipment: [],
    level: 2, category: 'core',
    description: 'בפלאנק, גע ביד כל פעם לכתף הנגדית מבלי לנדנד.',
    cues: ['מזעור נדנוד ירכיים', 'רגליים קצת יותר רחבות', 'איטי ומבוקר'],
    progressions: ['plank', 'plank_shoulder_tap', 'hollow_body'],
    gifUrl: null,
    safetyNote: 'שמור ירכיים יציבים.'
  },
  leg_raise: {
    id: 'leg_raise', name: 'Hanging Leg Raise', nameHe: 'הרמת רגליים בתלייה',
    muscles: ['core', 'hip_flexors'], equipment: ['pullup_bar'],
    level: 3, category: 'core',
    description: 'תלה על המוט, הרם רגליים ישרות עד מקביל לרצפה.',
    cues: ['ידיים נינוחות', 'אל תתנד', 'הרם בשליטה לא בתאוצה'],
    progressions: ['knee_raise', 'leg_raise', 'l_sit'],
    gifUrl: null,
    safetyNote: 'אל תשתמש בתאוצה. גב לא מקומר.'
  },
  knee_raise: {
    id: 'knee_raise', name: 'Hanging Knee Raise', nameHe: 'הרמת ברכיים בתלייה',
    muscles: ['core', 'hip_flexors'], equipment: ['pullup_bar'],
    level: 2, category: 'core',
    description: 'תלה על המוט, הרם ברכיים לחזה.',
    cues: ['שלוט בירידה', 'אל תנדנד', 'כווץ בטן'],
    progressions: ['knee_raise', 'leg_raise'],
    gifUrl: null,
    safetyNote: 'תנועה מבוקרת.'
  },
  l_sit: {
    id: 'l_sit', name: 'L-Sit', nameHe: 'ישיבת L',
    muscles: ['core', 'triceps', 'hip_flexors'], equipment: ['parallel_bars', 'floor'],
    level: 4, category: 'core',
    description: 'תמוך על ידיים, הרם רגליים ישרות מקביל לרצפה.',
    cues: ['שכמות לפנים', 'ידיים ישרות', 'רגליים ישרות'],
    progressions: ['hollow_body', 'l_sit'],
    gifUrl: null,
    safetyNote: 'בנה בהדרגה עם ברכיים כפופות קודם.'
  },
  russian_twist: {
    id: 'russian_twist', name: 'Russian Twist', nameHe: 'סיבוב רוסי',
    muscles: ['obliques', 'core'], equipment: [],
    level: 2, category: 'core',
    description: 'שב, רגליים מורמות, סובב פלג גוף עליון צד לצד.',
    cues: ['רגליים מורמות לקושי גבוה', 'גב ישר', 'תנועה מבוקרת'],
    progressions: ['russian_twist'],
    gifUrl: null,
    safetyNote: 'אל תסובב בכוח. מבוקר.'
  },

  // ──────────────── CARDIO / CONDITIONING ────────────────
  burpee: {
    id: 'burpee', name: 'Burpee', nameHe: 'בורפי',
    muscles: ['full_body'], equipment: [],
    level: 3, category: 'cardio',
    description: 'שכיבת סמיכה + קפיצה – כל הגוף בתנועה אחת.',
    cues: ['שכיבת סמיכה מלאה', 'קפוץ עם ידיים מעל', 'קצב קבוע'],
    progressions: ['step_burpee', 'burpee', 'burpee_pullup'],
    gifUrl: null,
    safetyNote: 'שמור גב בשכיבת סמיכה. נחת רכות.'
  },
  step_burpee: {
    id: 'step_burpee', name: 'Step Burpee', nameHe: 'בורפי צעד',
    muscles: ['full_body'], equipment: [],
    level: 2, category: 'cardio',
    description: 'כמו בורפי אך ללא קפיצה – עדין יותר.',
    cues: ['צעד אחת בכל פעם', 'מבוקר', 'גב ישר'],
    progressions: ['step_burpee', 'burpee'],
    gifUrl: null,
    safetyNote: 'גרסה עדינה לברכיים ומפרקים.'
  },
  mountain_climber: {
    id: 'mountain_climber', name: 'Mountain Climber', nameHe: 'טיפוס הר',
    muscles: ['core', 'cardio', 'shoulders'], equipment: [],
    level: 2, category: 'cardio',
    description: 'בעמדת פלאנק, הבא ברכיים לחזה לסירוגין בקצב מהיר.',
    cues: ['ירכיים נמוכות', 'גוף ישר', 'קצב מהיר'],
    progressions: ['mountain_climber'],
    gifUrl: null,
    safetyNote: 'שמור גוף ישר.'
  },
  jumping_jack: {
    id: 'jumping_jack', name: 'Jumping Jack', nameHe: 'קפיצות פיזור',
    muscles: ['cardio', 'legs', 'shoulders'], equipment: [],
    level: 1, category: 'cardio',
    description: 'קפוץ תוך כדי פיזור ידיים ורגליים ואחר כך קרב.',
    cues: ['נחת רכות', 'ידיים מעל ראש', 'קצב אחיד'],
    progressions: ['jumping_jack'],
    gifUrl: null,
    safetyNote: 'נחת על כרית הרגל.'
  },
  high_knees: {
    id: 'high_knees', name: 'High Knees', nameHe: 'ברכיים גבוהות',
    muscles: ['cardio', 'core', 'legs'], equipment: [],
    level: 2, category: 'cardio',
    description: 'ריצה במקום עם הרמת ברכיים לגובה מותן.',
    cues: ['גבה ישר', 'ידיים מסייעות', 'ברכיים גבוהות'],
    progressions: ['high_knees'],
    gifUrl: null,
    safetyNote: 'נחת על כרית הרגל.'
  },
  box_jump: {
    id: 'box_jump', name: 'Box Jump', nameHe: 'קפיצת ספסל',
    muscles: ['quads', 'glutes', 'calves', 'cardio'], equipment: [],
    level: 3, category: 'cardio',
    description: 'קפוץ על ספסל/מדרגה, נחת רכות, ירד בזהירות.',
    cues: ['קפוץ ונחת בסקוואט', 'אל תקפוץ מהגובה לאחור', 'רד בצעדים'],
    progressions: ['jump_squat', 'box_jump'],
    gifUrl: null,
    safetyNote: 'ירד מהספסל – אל תקפוץ לאחור.'
  },
};

// ──── Equipment options ────
const EQUIPMENT_OPTIONS = [
  { id: 'pullup_bar', label: 'מוט מתח', icon: '🔧' },
  { id: 'parallel_bars', label: 'מקביליים', icon: '⚙️' },
  { id: 'dip_bars', label: 'מוטות דיפ', icon: '🏗️' },
  { id: 'rings', label: 'טבעות', icon: '⭕' },
  { id: 'bar_low', label: 'מוט נמוך / ספסל (לאוסטרלי)', icon: '📏' },
  { id: 'resistance_bands', label: 'גומיות עזר', icon: '🟡' },
  { id: 'jump_rope', label: 'חבל קפיצה', icon: '🪢' },
];

// ──── Muscle group Hebrew names ────
const MUSCLE_NAMES_HE = {
  back: 'גב', biceps: 'ביצפס', triceps: 'טריצפס', chest: 'חזה',
  shoulders: 'כתפיים', core: 'ליבה', quads: 'ארבע ראשי', glutes: 'עכוז',
  hamstrings: 'גידי ברך', calves: 'שוקיים', obliques: 'אלכסוניים',
  hip_flexors: 'פלקסורי ירך', lats: 'גב רחב', full_body: 'כל הגוף', cardio: 'קרדיו'
};

// ──── Nutrition reference ────
const NUTRITION_REFERENCE = {
  protein_per_kg: { toning: 2.0, mass: 2.2, strength: 2.0 },
  fat_pct: { toning: 0.25, mass: 0.25, strength: 0.30 },
  // Mifflin-St Jeor BMR
  bmr_male: (w, h, a) => 10 * w + 6.25 * h - 5 * a + 5,
  bmr_female: (w, h, a) => 10 * w + 6.25 * h - 5 * a - 161,
  activity_multipliers: {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  },
  goal_adjustments: {
    toning: -300,    // deficit
    mass: +400,      // surplus
    strength: +100   // slight surplus
  }
};

// ──── Weekly split templates ────
const SPLIT_TEMPLATES = {
  1: [['push', 'pull', 'legs', 'core', 'cardio']],
  2: [['push', 'pull', 'core'], ['legs', 'cardio']],
  3: [['push', 'core'], ['pull', 'legs'], ['full_body', 'cardio']],
  4: [['push', 'core'], ['pull', 'legs'], ['push', 'cardio'], ['pull', 'legs']],
  5: [['push', 'core'], ['pull', 'legs'], ['push', 'shoulders'], ['pull', 'core'], ['legs', 'cardio']],
  6: [['push'], ['pull', 'core'], ['legs', 'cardio'], ['push', 'shoulders'], ['pull'], ['legs', 'core']],
  7: [['push'], ['pull'], ['legs'], ['core', 'cardio'], ['push', 'shoulders'], ['pull'], ['legs']],
};

const REST_DAYS_LABEL = 'יום מנוחה';
