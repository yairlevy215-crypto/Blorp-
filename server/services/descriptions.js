const Anthropic = require('@anthropic-ai/sdk')

const DESCRIPTIONS = [
  'This person was thinking about soup when they wrote this',
  'Written at a moment of extreme beige energy',
  'Our scientists analyzed this and found: nothing',
  'This post smells like a Tuesday',
  'Certified meaningless by the Ministry of Whatever',
  'Written by someone who definitely exists',
  'Emotional damage level: mild inconvenience',
  'Vibe: a damp sock',
  'Contains trace amounts of consciousness',
  'Typed with someone\'s feelings turned off',
  'Radiates confused carrot energy',
  'Certified: approximately words',
  'This post was peer-reviewed by no one',
  'Energy detected: soggy',
  'The algorithm is confused too, don\'t worry',
  'Powered by spite and leftover pizza',
  'This text was found in a parking lot',
  'Emotional support level: a decorative pillow',
  'Contains 60% confusion, 40% more confusion',
  'This has the energy of a shy potato',
  'Written by someone who knows 7 languages and uses none correctly',
  'Smells like regret and medium-priced candles',
  'Rated E for Existence',
  'The author was not asked for their opinion',
  'Certified: vibing with unknown frequencies',
  'This post was autocorrected by the universe',
  'Contains one feeling, used incorrectly',
  'The vibes here are structurally unsound',
  'Filed under: miscellaneous existence',
  'This person just stared at the ceiling first',
  'Typed with the confidence of someone who googled nothing',
  'Approved by a committee that doesn\'t exist',
  'Energy: a microwave at 3am',
  'Classified as: a mood, probably',
  'Written during Mercury\'s commute',
  'Tastes like off-brand nostalgia',
  'The writer was technically present',
  'Contains the essence of a waiting room',
  'Certified lukewarm',
  'Made from 100% renewable confusion',
  'Raised by WiFi and uncertainty',
  'The subtext is: nothing, there is no subtext',
  'Written in the key of beige',
  'Energetically: a gentle shrug',
  'Status: persisting despite everything',
  'Contains multitudes, none of them useful',
  'Written in invisible ink then made visible',
  'The author used all braincells on the title',
  'Vibrationally: a wet paper bag',
  'Emotional bandwidth used: some',
  'Rated PG for Probably Good',
  'Submitted without explanation or apology',
  'May contain traces of effort',
  'Typed by someone who definitely slept',
  'Contains exactly zero revelations',
  'Certified by the Bureau of Ambient Existence',
  'The font this was written in: desperate',
  'Categorized as: technically communication',
  'This text has been carbon-dated to now',
  'Energy: a lamp that won\'t stop flickering',
  'Contains one (1) implied shrug',
  'Arrived slightly late to its own point',
  'Verified by absolutely no one credible',
  'Post-analyzed: inconclusive',
  'Smells like a decision made on a Thursday',
  'Has the structural integrity of a thought',
]

let client = null
function getClient() {
  if (!client && process.env.ANTHROPIC_API_KEY) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return client
}

function randomFallback() {
  return DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)]
}

async function getDescription(content) {
  const c = getClient()
  if (!c) return randomFallback()

  try {
    const msg = await c.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: `Write ONE absurd, funny, 6-12 word description label for this social media post. Style: "This person was thinking about soup when they wrote this". Output the description only, nothing else.\nPost: "${content.slice(0, 200)}"`,
      }],
    })
    const text = msg.content[0].text.trim().replace(/^["']|["']$/g, '')
    return text.slice(0, 120) || randomFallback()
  } catch {
    return randomFallback()
  }
}

module.exports = { getDescription }
