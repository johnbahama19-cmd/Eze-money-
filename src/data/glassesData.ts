export interface SmartGlassModel {
  id: string;
  name: string;
  category: 'Ray-Ban / Meta / Oakley' | 'Display Glasses' | 'Audio AI Glasses' | 'Big Screen Glasses';
  priceUSD: number;
  weightGrams: number;
  batteryHours: number;
  hasCamera: boolean;
  hasDisplay: boolean;
  hasOpenEarAudio: boolean;
  aiAssistant: string;
  popularUseCases: string[];
  description: string;
  image: string;
  highlights: string[];
}

export const SMART_GLASSES_DATA: SmartGlassModel[] = [
  // 1. Ray-Ban / Meta / Oakley
  {
    id: 'rb-meta-gen2',
    name: 'Ray-Ban Meta Gen 2',
    category: 'Ray-Ban / Meta / Oakley',
    priceUSD: 329,
    weightGrams: 49,
    batteryHours: 8,
    hasCamera: true,
    hasDisplay: false,
    hasOpenEarAudio: true,
    aiAssistant: 'Meta AI (Muse Spark)',
    popularUseCases: ['Content Creation & POV Vlogs', 'Hands-free WhatsApp Calls', 'Real-time Image Analysis', 'Live Translation'],
    description: 'The market leader capturing 69% market share in 2026. Features 12MP ultra-wide camera, 3K video, open-ear spatial audio, and Meta AI voice intelligence.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
    highlights: ['12MP Ultra-wide camera', '3K HD video recording', '5-mic spatial array', 'Charging case gives 36h extra']
  },
  {
    id: 'rb-meta-gen1',
    name: 'Ray-Ban Meta Gen 1',
    category: 'Ray-Ban / Meta / Oakley',
    priceUSD: 299,
    weightGrams: 51,
    batteryHours: 6,
    hasCamera: true,
    hasDisplay: false,
    hasOpenEarAudio: true,
    aiAssistant: 'Meta AI',
    popularUseCases: ['Casual Photography', 'Music Streaming', 'Voice Calls'],
    description: 'The foundational smart frame that pioneered stylish AI wearables. Features 5MP camera and directional speakers.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
    highlights: ['Classic Wayfarer & Round designs', 'Built-in camera', 'Discreet audio arms']
  },
  {
    id: 'rb-meta-display',
    name: 'Ray-Ban Meta Display',
    category: 'Ray-Ban / Meta / Oakley',
    priceUSD: 449,
    weightGrams: 54,
    batteryHours: 7,
    hasCamera: true,
    hasDisplay: true,
    hasOpenEarAudio: true,
    aiAssistant: 'Meta AI + Hologram HUD',
    popularUseCases: ['In-lens Notifications', 'Real-time Navigation', 'Hologram Video Calls', 'Live Translation in Ear & Eye'],
    description: 'The breakthrough display model featuring an ultra-crisp in-lens corner HUD for WhatsApp messages, Spotify, maps, and real-time biometric tracking.',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800',
    highlights: ['Micro-LED in-lens display', 'Hologram video calling', 'Gesture control support', 'Full Meta AI multimodal vision']
  },
  {
    id: 'rb-meta-audio',
    name: 'Ray-Ban Meta Audio',
    category: 'Ray-Ban / Meta / Oakley',
    priceUSD: 349,
    weightGrams: 43,
    batteryHours: 12,
    hasCamera: false,
    hasDisplay: false,
    hasOpenEarAudio: true,
    aiAssistant: 'Meta AI Audio',
    popularUseCases: ['Strict Privacy Workplaces', 'All-day Music & Calls', 'Hearing Enhancement', 'Market Traders & Professionals'],
    description: 'Announced yesterday — the slimmest and lightest Ray-Ban Meta ever at only 43g. Zero camera for absolute privacy compliance in offices and restricted zones.',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800',
    highlights: ['Camera-free privacy design', 'Ultra-lightweight 43g titanium frame', '12-hour continuous battery', '5-mic crystal clear call array']
  },
  {
    id: 'oakley-vanguard',
    name: 'Oakley Meta Vanguard',
    category: 'Ray-Ban / Meta / Oakley',
    priceUSD: 429,
    weightGrams: 58,
    batteryHours: 10,
    hasCamera: true,
    hasDisplay: false,
    hasOpenEarAudio: true,
    aiAssistant: 'Meta AI Sports Coach',
    popularUseCases: ['Cycling & Mountain Biking', 'Marathon Training', 'Extreme Outdoor Sports', 'Biometric HUD Voice Feedback'],
    description: 'Ruggedized athletic smart eyewear engineered by Oakley with impact-resistant Prizm lenses, wind-canceling mics, and sweat-proof grip arms.',
    image: 'https://images.unsplash.com/photo-1509695507497-903c140c49b0?auto=format&fit=crop&q=80&w=800',
    highlights: ['Prizm Sport optics', 'Wind-shear noise cancellation', 'IP67 water & sweat resistance', 'Action sports stabilization']
  },

  // 2. Display Glasses
  {
    id: 'even-realities-g2',
    name: 'Even Realities G2',
    category: 'Display Glasses',
    priceUSD: 699,
    weightGrams: 38,
    batteryHours: 24,
    hasCamera: false,
    hasDisplay: true,
    hasOpenEarAudio: false,
    aiAssistant: 'Even AI Assistant',
    popularUseCases: ['Live Teleprompter', 'Instant Translation in View', 'Turn-by-turn Navigation', 'Professional Executive Wear'],
    description: 'Incredible lightweight optical glasses with dual green micro-LED waveguide displays that look completely indistinguishable from normal luxury eyewear.',
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=800',
    highlights: ['Dual green waveguide projection', 'Indistinguishable from normal glasses', '24-hour battery life with charging case', 'Real-time translation reader']
  },
  {
    id: 'even-realities-g1',
    name: 'Even Realities G1',
    category: 'Display Glasses',
    priceUSD: 599,
    weightGrams: 40,
    batteryHours: 18,
    hasCamera: false,
    hasDisplay: true,
    hasOpenEarAudio: false,
    aiAssistant: 'Even OS Assistant',
    popularUseCases: ['Subtle Notifications', 'Note-taking HUD', 'Directional Arrows'],
    description: 'The award-winning predecessor to G2 featuring minimalist heads-up text display for notes, directions, and calendar reminders.',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800',
    highlights: ['Discreet monochrome HUD', 'Prescription lens ready', 'Touch stem controls']
  },
  {
    id: 'rokid-glasses',
    name: 'Rokid Glasses',
    category: 'Display Glasses',
    priceUSD: 499,
    weightGrams: 49,
    batteryHours: 8,
    hasCamera: true,
    hasDisplay: true,
    hasOpenEarAudio: true,
    aiAssistant: 'Rokid AI Copilot',
    popularUseCases: ['Visual Search', 'AR Object Tagging', 'Multilingual Subtitles'],
    description: 'Advanced lightweight AR glasses with a full-color micro-OLED display engine and onboard camera for instant AI environment analysis.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    highlights: ['Full-color micro-OLED display', 'AI camera vision', 'Open-ear directional audio']
  },
  {
    id: 'rokid-glasses-style',
    name: 'Rokid Glasses Style',
    category: 'Display Glasses',
    priceUSD: 549,
    weightGrams: 45,
    batteryHours: 9,
    hasCamera: false,
    hasDisplay: true,
    hasOpenEarAudio: true,
    aiAssistant: 'Rokid AI',
    popularUseCases: ['Fashion-forward AR', 'Smart Notifications', 'Audio Streaming'],
    description: 'A sleeker, fashion-tuned variant of Rokid Glasses prioritizing titanium frames and designer aesthetics without sacrificing the heads-up display.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
    highlights: ['Designer titanium frame', 'Subtle optical combiner', 'All-day ergonomics']
  },
  {
    id: 'rokid-max',
    name: 'Rokid Max',
    category: 'Display Glasses',
    priceUSD: 439,
    weightGrams: 75,
    batteryHours: 10,
    hasCamera: false,
    hasDisplay: true,
    hasOpenEarAudio: true,
    aiAssistant: 'Virtual Screen AI',
    popularUseCases: ['Private 215-inch Virtual Cinema', 'Steam Deck & Switch Gaming', 'Productivity Multi-monitor'],
    description: 'High FOV immersive wearable display acting as a massive 215-inch virtual screen wherever you travel, with 120Hz OLED panels.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    highlights: ['Massive 215" virtual screen FOV', '120Hz smooth refresh rate', 'Diopter adjustment for nearsightedness']
  },

  // 3. Audio AI Glasses
  {
    id: 'solos-airgo-v2',
    name: 'Solos AirGo V2',
    category: 'Audio AI Glasses',
    priceUSD: 249,
    weightGrams: 34,
    batteryHours: 10,
    hasCamera: false,
    hasDisplay: false,
    hasOpenEarAudio: true,
    aiAssistant: 'SolosChat AI',
    popularUseCases: ['Language Translation in Ear', 'Posture & Wellness Tracking', 'Hands-free Conferencing'],
    description: 'Ultra-lightweight smart audio frames with interchangeable front frames, LED mood lighting, and advanced ChatGPT-powered voice translation.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    highlights: ['Interchangeable modular frames', 'Smart LED status indicator', 'Advanced noise suppression mic']
  },
  {
    id: 'solos-airgo-3',
    name: 'Solos AirGo 3',
    category: 'Audio AI Glasses',
    priceUSD: 299,
    weightGrams: 32,
    batteryHours: 14,
    hasCamera: false,
    hasDisplay: false,
    hasOpenEarAudio: true,
    aiAssistant: 'SolosSmart AI 3.0',
    popularUseCases: ['All-day Voice Assistant', 'Fitness Audio Coaching', 'Bilingual Conversation Mode'],
    description: 'The upgraded 3rd gen Solos audio eyewear featuring enhanced directional speakers, 14-hour battery life, and instant voice-to-text dictation.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    highlights: ['14-hour extended battery', 'Whisper-quiet directional audio', 'Gesture touch stem']
  },
  {
    id: 'dymesty-ai-glasses',
    name: 'Dymesty AI Glasses',
    category: 'Audio AI Glasses',
    priceUSD: 199,
    weightGrams: 36,
    batteryHours: 9,
    hasCamera: false,
    hasDisplay: false,
    hasOpenEarAudio: true,
    aiAssistant: 'Dymesty Voice AI',
    popularUseCases: ['Budget AI Companion', 'Podcast & Music Listening', 'Voice Memo Recording'],
    description: 'Affordable, stylish audio-first smart glasses offering seamless Bluetooth pairing, voice assistant triggering, and lightweight all-day comfort.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
    highlights: ['Cost-effective entry point', 'Ergonomic lightweight temples', 'Quick charge technology']
  },
  {
    id: 'brilliant-labs-frame',
    name: 'Brilliant Labs Frame',
    category: 'Audio AI Glasses',
    priceUSD: 349,
    weightGrams: 39,
    batteryHours: 8,
    hasCamera: true,
    hasDisplay: true,
    hasOpenEarAudio: true,
    aiAssistant: 'Noa AI Multi-modal',
    popularUseCases: ['Open Source AI Hacking', 'Visual AI Research', 'Retro Round Fashion'],
    description: 'Striking circular AR glasses inspired by vintage eyewear, featuring a built-in AI camera, open-source plugin architecture, and vibrant in-lens display.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
    highlights: ['Distinctive retro circular design', 'Open-source AI platform (Noa)', 'Built-in camera & mic']
  },

  // 4. Big Screen Glasses
  {
    id: 'xreal-one-pro',
    name: 'XREAL One Pro',
    category: 'Big Screen Glasses',
    priceUSD: 499,
    weightGrams: 72,
    batteryHours: 12,
    hasCamera: false,
    hasDisplay: true,
    hasOpenEarAudio: true,
    aiAssistant: 'XREAL Spatial OS',
    popularUseCases: ['Mac/PC 3-Screen Virtual Workspace', 'Cinematic Movie Streaming', 'Immersive Console Gaming'],
    description: 'Industry-leading spatial display glasses featuring custom Micro-OLED optics that project an ultra-sharp 330-inch virtual screen with zero lag.',
    image: 'https://images.unsplash.com/photo-1516575334481-f85287c2c82d?auto=format&fit=crop&q=80&w=800',
    highlights: ['330-inch virtual cinema display', 'Zero-latency USB-C connection', 'Spatial smoothing anchor technology']
  },
  {
    id: 'viture-luma-pro',
    name: 'VITURE Luma Pro',
    category: 'Big Screen Glasses',
    priceUSD: 459,
    weightGrams: 78,
    batteryHours: 10,
    hasCamera: false,
    hasDisplay: true,
    hasOpenEarAudio: true,
    aiAssistant: 'VITURE XR Engine',
    popularUseCases: ['Handheld Gaming (Steam Deck/Switch)', 'Electrochromic Tint Adjustment', 'Private Flight/Train Entertainment'],
    description: 'Elite XR glasses with adjustable electrochromic lenses that instantly darken for bright daylight viewing, backed by Harman audio and massive virtual canvas.',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=800',
    highlights: ['Instant electrochromic film tint', 'Harman Audio tuned speakers', 'Built-in myopia dial adjustment']
  },
  {
    id: 'viture-pro-xr',
    name: 'VITURE Pro XR',
    category: 'Big Screen Glasses',
    priceUSD: 439,
    weightGrams: 76,
    batteryHours: 10,
    hasCamera: false,
    hasDisplay: true,
    hasOpenEarAudio: true,
    aiAssistant: 'VITURE Assistant',
    popularUseCases: ['Multi-display Work', 'Cloud Gaming', 'Media Bingeing'],
    description: 'Renowned for having the brightest Sony Micro-OLED displays in the industry with 4000 nits of peak panel brightness for vivid HDR playback.',
    image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=800',
    highlights: ['4000 nit peak brightness OLED', '135-inch FOV equivalent', 'Plug-and-play compatibility']
  },
  {
    id: 'rayneo-air-4-pro',
    name: 'RayNeo Air 4 Pro',
    category: 'Big Screen Glasses',
    priceUSD: 399,
    weightGrams: 70,
    batteryHours: 9,
    hasCamera: false,
    hasDisplay: true,
    hasOpenEarAudio: true,
    aiAssistant: 'RayNeo XR Copilot',
    popularUseCases: ['Affordable Giant Screen Gaming', 'Phone Mirroring', 'Immersive YouTube & Netflix'],
    description: 'Value-packed cinematic AR glasses delivering buttery-smooth 120Hz visuals, thunderous directional audio, and featherlight titanium hinges.',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800',
    highlights: ['120Hz high refresh rate', 'Whisper-mode directional speakers', 'Featherlight ergonomic profile']
  }
];

export const PORT_HARCOURT_IMPORT_GUIDE = {
  city: 'Port Harcourt, Nigeria',
  shippingHubs: ['Port Harcourt International Airport (OGS)', 'Onne Deep Sea Port'],
  nairaExchangeRate: 1500, // 1 USD = 1500 NGN
  customsDutyPercentage: 20, // 20% electronics duty
  vatPercentage: 7.5, // 7.5% VAT
  clearingFeeNGN: 15000,
  deliveryToDoorNGN: 5000
};

export const AI_EYEGLASSES_FACTS = [
  "AI eyeglass looks like normal Ray-Ban but has computer inside — camera, mics, speakers, AI assistant",
  "The main brand now is Ray-Ban Meta made by Meta + EssilorLuxottica — they control 69% of the market in 2026",
  "They have sold over 7 million units in 2025 alone",
  "There are 3 types now: Audio-only (no camera), Gen 2 (with camera), and Display (with screen inside lens)",
  "The newest one just announced yesterday — Ray-Ban Meta Audio — no camera, for privacy. Weighs only 43g, slimmest ever",
  "It starts at $349 and launches Oct 13",
  "Hands-free: Say 'Hey Meta' — no need to touch phone",
  "Open-ear audio: Speakers in the arms, you hear music but still hear traffic/people around you",
  "Discrete sound: Only you hear what is playing",
  "5-mic array for clear calls and video audio",
  "12-hour battery on single charge, +48 hours with charging case for Audio model",
  "8-hour battery for Gen 2 camera model",
  "Lightweight titanium frames for all-day wear",
  "Prescription lenses supported — from mild astigmatism to high myopia, with photochromic and anti-blue light",
  "LED light shows when you are recording — privacy feature",
  "12MP ultra-wide lens takes panoramic photos",
  "3K Ultra HD video from your eye view",
  "Hyperlapse, Dynamic photos, Slow-motion modes built-in",
  "Point-of-view capture — record while walking, cooking, riding bike without holding phone",
  "Double-tap to share your view on WhatsApp video call",
  "Image analysis: Ask 'Hey Meta, what am I looking at?' — it will tell you",
  "Meta AI (Muse Spark) inside — answers questions, understands what you see",
  "Live translation across 20 languages — someone speaks Yoruba/English/French and you hear translation in your ear",
  "Real-time navigation: Shows walking, cycling and public transit directions",
  "Human-like directions: Instead of 'turn at Third Street' it says 'turn left at the yellow house'",
  "Neural handwriting: Write letters with fingertip on any table to type messages silently — no speaking needed",
  "Neural Band (EMG wristband) detects muscle movement before you even move — for scrolling, clicking",
  "In-lens display on Display model — shows texts, WhatsApp, Spotify, weather, stocks, calendar in corner of eye",
  "Hologram calls: Creates photorealistic version of your face for video calls without holding phone",
  "AI food logging: Looks at your plate and logs calories to MyFitnessPal",
  "Health reminders & eye-strain breaks",
  "Hearing Enhancement: New accessibility feature for hard-of-hearing — uses 6 speakers to amplify voices",
  "Content creation: Vloggers in PH can record market, bike ride POV without holding phone",
  "Reduce screen time: Reply WhatsApp, check messages by voice instead of picking phone",
  "Tourism: Point at a landmark and ask 'what is this building?'",
  "Translate street signs/menus instantly",
  "For riders/drivers: Get directions in your ear while keeping hands on bike/steering",
  "For market traders: Take calls, listen to music while attending to customers",
  "For disabled / hard-of-hearing: Hearing Enhancement as cheaper alternative to hearing aids",
  "For chefs/cooks: Hands-free recipe steps while cooking",
  "For security: Record evidence hands-free",
  "For livestreaming: Stream directly to Instagram/Facebook hands-free",
  "For fashion: Looks like normal Ray-Ban Wayfarer, not like big VR headset"
];
