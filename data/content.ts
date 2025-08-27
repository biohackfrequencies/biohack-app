import type { AppContentData, Frequency } from '../types';
import { BenefitCategory } from '../types';
import { harmonicElements } from './elements';
import { codexData } from './codex';

const mirrorAxisColors = { primary: "#d8b4fe", secondary: "#e9d5ff", accent: "#c084fc" };

const mirrorAxisFrequencies: Frequency[] = [
    {
      id: 'mirror-binaural-root-crown', name: 'Root–Crown Axis Binaural', range: '111 Hz ↔ 999 Hz', baseFrequency: 0, binauralFrequency: 0, leftFrequency: 111, rightFrequency: 999,
      description: 'A split binaural tone balancing primal instincts (111 Hz) with spiritual clarity (999 Hz).', category: BenefitCategory.COGNITIVE, categoryId: 'brainwaves',
      defaultMode: 'SPLIT_BINAURAL', availableModes: ['SPLIT_BINAURAL'], colors: mirrorAxisColors, premium: true
    },
    {
      id: 'mirror-binaural-shadow-light', name: 'Shadow–Light Axis Binaural', range: '174 Hz ↔ 852 Hz', baseFrequency: 0, binauralFrequency: 0, leftFrequency: 174, rightFrequency: 852,
      description: 'A split binaural tone for clearing subconscious blocks (174 Hz) and activating love resonance (852 Hz).', category: BenefitCategory.COGNITIVE, categoryId: 'brainwaves',
      defaultMode: 'SPLIT_BINAURAL', availableModes: ['SPLIT_BINAURAL'], colors: mirrorAxisColors, premium: true
    },
    {
      id: 'mirror-binaural-mind-mystic', name: 'Mind–Mystic Axis Binaural', range: '285 Hz ↔ 741 Hz', baseFrequency: 0, binauralFrequency: 0, leftFrequency: 285, rightFrequency: 741,
      description: 'A split binaural tone for cleansing mental fog (285 Hz) and unlocking creative solutions (741 Hz).', category: BenefitCategory.COGNITIVE, categoryId: 'brainwaves',
      defaultMode: 'SPLIT_BINAURAL', availableModes: ['SPLIT_BINAURAL'], colors: mirrorAxisColors, premium: true
    },
    {
      id: 'mirror-binaural-pineal-thymus', name: 'Pineal–Thymus Axis Binaural', range: '639 Hz ↔ 963 Hz', baseFrequency: 0, binauralFrequency: 0, leftFrequency: 639, rightFrequency: 963,
      description: 'A split binaural tone for supporting intuition (639 Hz) and cellular harmony (963 Hz).', category: BenefitCategory.COGNITIVE, categoryId: 'brainwaves',
      defaultMode: 'SPLIT_BINAURAL', availableModes: ['SPLIT_BINAURAL'], colors: mirrorAxisColors, premium: true
    },
    {
      id: 'mirror-binaural-inner-outer-vision', name: 'Inner–Outer Vision Axis Binaural', range: '222 Hz ↔ 888 Hz', baseFrequency: 0, binauralFrequency: 0, leftFrequency: 222, rightFrequency: 888,
      description: 'A split binaural tone for enhancing self-awareness (222 Hz) and manifestation (888 Hz).', category: BenefitCategory.COGNITIVE, categoryId: 'brainwaves',
      defaultMode: 'SPLIT_BINAURAL', availableModes: ['SPLIT_BINAURAL'], colors: mirrorAxisColors, premium: true
    },
    {
      id: 'mirror-binaural-cosmic-earth', name: 'Cosmic–Earth Axis Binaural', range: '333 Hz ↔ 777 Hz', baseFrequency: 0, binauralFrequency: 0, leftFrequency: 333, rightFrequency: 777,
      description: 'A split binaural tone for bridging ethereal visions (333 Hz) with earthly embodiment (777 Hz).', category: BenefitCategory.COGNITIVE, categoryId: 'brainwaves',
      defaultMode: 'SPLIT_BINAURAL', availableModes: ['SPLIT_BINAURAL'], colors: mirrorAxisColors, premium: true
    },
    {
      id: 'mirror-binaural-solar-lunar', name: 'Solar–Lunar Axis Binaural', range: '396 Hz ↔ 639 Hz', baseFrequency: 0, binauralFrequency: 0, leftFrequency: 396, rightFrequency: 639,
      description: 'A split binaural tone for balancing masculine-feminine energetics.', category: BenefitCategory.COGNITIVE, categoryId: 'brainwaves',
      defaultMode: 'SPLIT_BINAURAL', availableModes: ['SPLIT_BINAURAL'], colors: mirrorAxisColors, premium: true
    },
    {
      id: 'mirror-binaural-mirror-gate', name: 'Mirror Gate Axis Binaural', range: '321 Hz ↔ 123 Hz', baseFrequency: 0, binauralFrequency: 0, leftFrequency: 321, rightFrequency: 123,
      description: 'A reflective split binaural tone for navigating memory loops and karmic clarity.', category: BenefitCategory.COGNITIVE, categoryId: 'brainwaves',
      defaultMode: 'SPLIT_BINAURAL', availableModes: ['SPLIT_BINAURAL'], colors: mirrorAxisColors, premium: true
    },
    {
      id: 'mirror-binaural-soma-spirit', name: 'Soma–Spirit Axis Binaural', range: '288 Hz ↔ 864 Hz', baseFrequency: 0, binauralFrequency: 0, leftFrequency: 288, rightFrequency: 864,
      description: 'A split binaural tone for integrating bodily (288 Hz) and soul (864 Hz) awareness.', category: BenefitCategory.COGNITIVE, categoryId: 'brainwaves',
      defaultMode: 'SPLIT_BINAURAL', availableModes: ['SPLIT_BINAURAL'], colors: mirrorAxisColors, premium: true
    },
    {
      id: 'mirror-binaural-golden-tri', name: 'Golden Tri-Mirror Binaural', range: '369 Hz ↔ 639 Hz', baseFrequency: 0, binauralFrequency: 0, leftFrequency: 369, rightFrequency: 639,
      description: 'A split binaural tone based on the Tesla code to open creative insight and energy flow.', category: BenefitCategory.COGNITIVE, categoryId: 'brainwaves',
      defaultMode: 'SPLIT_BINAURAL', availableModes: ['SPLIT_BINAURAL'], colors: mirrorAxisColors, premium: true
    }
];

export const appContentData: AppContentData = {
  "categories": {
    "elements": {
      "title": "Harmonic Elements",
      "description": "Discover the resonant frequencies of the first 81 elements, inspired by the harmonic frequency chart, and explore their acoustic patterns.",
      "colors": { "primary": "#a5f3fc", "secondary": "#e0f2fe", "accent": "#22d3ee" }
    },
    "codex": {
      "title": "Codex Harmonics",
      "description": "Experience frequencies derived from the Mod-24 wheel, a harmonic system designed for exploration and creative resonance.",
      "colors": { "primary": "#e9d5ff", "secondary": "#c4b5fd", "accent": "#a855f7" },
      "premium": true
    },
    "kabbalah": {
      "title": "Kabbalistic Harmonics",
      "description": "Explore the sonic pathways of ancient mysticism with 32 frequencies corresponding to the 10 Sefirot of the Tree of Life and the 22 letters of the Hebrew alphabet.",
      "colors": { "primary": "#fefce8", "secondary": "#fde68a", "accent": "#f59e0b" },
      "premium": true
    },
    "guided": {
      "title": "Guided Protocols",
      "description": "Follow sequenced audio protocols that transition through different frequencies to support specific neuro-acoustic goals.",
      "colors": { "primary": "#a7f3d0", "secondary": "#93c5fd", "accent": "#6ee7b7" }
    },
    "brainwaves": {
      "title": "Brainwave Entrainment",
      "description": "Use rhythmic sound to guide your brain into states of focus, relaxation, or creativity. Includes advanced protocols for synchronization.",
      "colors": { "primary": "#d8b4fe", "secondary": "#e9d5ff", "accent": "#c084fc" }
    },
    "solfeggio": {
      "title": "Solfeggio Protocols",
      "description": "Explore a set of ancient resonant tones rooted in the physics of sound and vibration, traditionally associated with harmony and balance.",
      "colors": { "primary": "#fcd34d", "secondary": "#fdba74", "accent": "#fde047" }
    },
    "angel": {
      "title": "Ascension Codes",
      "description": "Engage with high-vibrational harmonic protocols intended to support awareness, clear energetic pathways, and deepen inner exploration.",
      "colors": { "primary": "#fbcfe8", "secondary": "#fda4af", "accent": "#f9a8d4" }
    },
    "celestial": {
      "title": "Planetary Harmonics",
      "description": "Listen to acoustic protocols tuned to the orbital frequencies of celestial bodies, designed for alignment with archetypal energies.",
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" }
    },
    "rife": {
      "title": "Rife Bio-Resonance",
      "description": "Explore resonant frequencies inspired by bio-resonance principles, intended to support balance and holistic well-being.",
      "colors": { "primary": "#a7f3d0", "secondary": "#bbf7d0", "accent": "#6ee7b7" }
    },
    "noise": {
      "title": "Acoustic Environments",
      "description": "Immerse yourself in crafted soundscapes (such as colored noise and natural ambiences) to reduce distractions and encourage relaxation or focus.",
      "colors": { "primary": "#e7e5e4", "secondary": "#d6d3d1", "accent": "#cbd5e1" }
    }
  },
  "guided_sessions": [
    {
      "id": "triad-grounding", "title": "The Grounding Triad", "categoryId": "elements", "description": "An elemental sequence of Carbon, Iron, and Zinc to establish a deep connection to the Earth, fortify your core stability, and protect your energetic field.", "steps": [ { "title": "Foundation: Carbon", "description": "Establish a stable base with the cornerstone of organic life.", "duration": 180, "frequencyId": "carbon" }, { "title": "Strength: Iron", "description": "Build inner strength and magnetic grounding.", "duration": 180, "frequencyId": "iron" }, { "title": "Protection: Zinc", "description": "Fortify your energetic defenses and seal your field.", "duration": 180, "frequencyId": "zinc" } ], "colors": { "primary": "#a7f3d0", "secondary": "#86efac", "accent": "#4ade80" }, "premium": false
    },
    {
      "id": "triad-vitality", "title": "The Vitality Triad", "categoryId": "elements", "description": "A sequence of Hydrogen, Oxygen, and Sulphur to spark new potential, purify your system, and energize your entire bio-field with life force.", "steps": [ { "title": "Spark: Hydrogen", "description": "Ignite pure potential and new beginnings.", "duration": 180, "frequencyId": "hydrogen" }, { "title": "Purify: Oxygen", "description": "Cleanse and invigorate with life-sustaining energy.", "duration": 180, "frequencyId": "oxygen" }, { "title": "Energize: Sulphur", "description": "Transmute old energy and catalyze your inner fire.", "duration": 180, "frequencyId": "sulphur" } ], "colors": { "primary": "#fecaca", "secondary": "#fda4af", "accent": "#f87171" }, "premium": true
    },
    {
      "id": "triad-alchemical", "title": "The Alchemical Triad", "categoryId": "elements", "description": "An advanced sequence of Silver, Gold, and Platinum to enhance intuition, connect with divine wisdom, and elevate your consciousness to higher states.", "steps": [ { "title": "Intuition: Silver", "description": "Tune into the reflective, intuitive energy of the divine feminine.", "duration": 180, "frequencyId": "silver" }, { "title": "Enlightenment: Gold", "description": "Resonate with solar radiance and the purity of the perfected soul.", "duration": 180, "frequencyId": "gold" }, { "title": "Ascension: Platinum", "description": "Purify the energetic body and attract higher-vibrational experiences.", "duration": 180, "frequencyId": "platinum" } ], "colors": { "primary": "#e7e5e4", "secondary": "#fcd34d", "accent": "#d6d3d1" }, "premium": true
    },
    {
      "id": "triad-ethereal", "title": "The Ethereal Bridge", "categoryId": "elements", "description": "A sequence of Helium, Neon, and Argon to lift the spirit, illuminate inner truths, and create a state of profound, stable calm for deep meditation.", "steps": [ { "title": "Levity: Helium", "description": "Lift your spirit with the vibration of joy and lightheartedness.", "duration": 180, "frequencyId": "helium" }, { "title": "Illumination: Neon", "description": "Shine a light on your inner world with radiant brilliance.", "duration": 180, "frequencyId": "neon" }, { "title": "Stillness: Argon", "description": "Settle into a state of noble stability and inner quiet.", "duration": 180, "frequencyId": "argon" } ], "colors": { "primary": "#e0f2fe", "secondary": "#cffafe", "accent": "#22d3ee" }, "premium": true
    },
    {
      "id": "earth-resonance-grounding", "title": "Earth Resonance Grounding", "categoryId": "guided", "description": "A deeply grounding protocol that combines the Earth's Schumann Resonance with calming Alpha waves and gentle rain sounds to align your bio-field.", "steps": [ { "title": "Calm & Settle", "description": "Ease into a state of relaxation with gentle alpha waves, the soothing sound of rain, and grounding brown noise.", "duration": 300, "frequencyId": "alpha", "layerFrequencyId": "ambient-rain", "layer3FrequencyId": "noise-brown" }, { "title": "Earth Attunement", "description": "Tune into the planet's heartbeat with the 7.83Hz Schumann Resonance, layered with the magnetic pulse of Iron and foundational Carbon to deeply anchor your energy.", "duration": 300, "frequencyId": "schumann-resonance", "layerFrequencyId": "iron", "layer3FrequencyId": "carbon" }, { "title": "Harmonize & Integrate", "description": "Combine alpha waves, the Schumann Resonance, and the foundational energy of Carbon to harmonize your energy field and integrate the benefits.", "duration": 300, "frequencyId": "alpha", "layerFrequencyId": "carbon", "layer3FrequencyId": "schumann-resonance" } ], "colors": { "primary": "#86efac", "secondary": "#bbf7d0", "accent": "#4ade80" }, "premium": false
    },
    {
      "id": "vagus-lymph-reset", "title": "Vagus Nerve & Lymph Flow Reset", "categoryId": "guided", "description": "Stimulate your vagus nerve and support lymphatic flow with this calming protocol designed to activate your body's 'rest and digest' system.", "steps": [ { "title": "Vagal Toning", "description": "Use the Earth's Schumann Resonance, soothed by Lithium, and deepened by Delta waves to gently stimulate the vagus nerve and induce a deep parasympathetic state.", "duration": 300, "frequencyId": "schumann-resonance", "layerFrequencyId": "lithium", "layer3FrequencyId": "delta" }, { "title": "Lymphatic Flow", "description": "A low-frequency pulse, infused with purifying Oxygen and cleansing rain, to encourage gentle movement and drainage within the lymphatic system.", "duration": 300, "frequencyId": "rife-lymph-support", "layerFrequencyId": "oxygen", "layer3FrequencyId": "ambient-rain" }, { "title": "System Reset", "description": "Conclude with deep Delta waves, oceanic sounds, and healing frequencies to allow for profound physical rest and integration.", "duration": 300, "frequencyId": "delta", "layerFrequencyId": "ambient-sea", "layer3FrequencyId": "solfeggio-285-healing" } ], "colors": { "primary": "#cffafe", "secondary": "#a5f3fc", "accent": "#67e8f9" }, "premium": true
    },
    {
      "id": "metabolic-harmony-protocol", "title": "Metabolic Harmony Protocol", "categoryId": "guided", "description": "A session to support a healthy metabolism, reduce stress-related cravings, and encourage a positive mindset towards your wellness goals.", "steps": [ { "title": "Reduce Cortisol", "description": "Begin with calming Alpha waves, restorative Magnesium, and soothing Pink Noise to lower stress—a key factor in metabolic balance.", "duration": 300, "frequencyId": "alpha", "layerFrequencyId": "magnesium", "layer3FrequencyId": "noise-pink" }, { "title": "Metabolic Resonance", "description": "Focus on the 1550 Hz Rife frequency, harmonized with balancing Chromium and grounding Carbon, to support thyroid and adrenal function.", "duration": 300, "frequencyId": "rife-metabolism-support", "layerFrequencyId": "chromium", "layer3FrequencyId": "carbon" }, { "title": "Mindful Motivation", "description": "Conclude with the 417 Hz Solfeggio frequency, energizing Beta waves, and the Sun's vitality to facilitate positive change and reinforce healthy habits.", "duration": 300, "frequencyId": "solfeggio-417-change", "layerFrequencyId": "beta", "layer3FrequencyId": "celestial-sun" } ], "colors": { "primary": "#fed7aa", "secondary": "#fde047", "accent": "#fb923c" }, "premium": true
    },
    {
      "id": "pre-workout-ignition", "title": "Pre-Workout Ignition", "categoryId": "guided", "description": "An energizing protocol using Beta waves and the driving frequency of Mars to prime your mind and body for peak physical performance.", "steps": [ { "title": "Awaken Focus", "description": "Start with Beta waves, the driving frequency of Mars, and a vitality boost to bring sharp, focused energy to your mind.", "duration": 300, "frequencyId": "beta", "layerFrequencyId": "celestial-mars", "layer3FrequencyId": "rife-633hz-vitality" }, { "title": "Ignite Drive", "description": "Introduce the resonant frequency of Mars, layered with the grounding strength of Iron and focused Beta waves, to boost motivation and physical drive.", "duration": 300, "frequencyId": "celestial-mars", "layerFrequencyId": "iron", "layer3FrequencyId": "beta" } ], "colors": { "primary": "#fecaca", "secondary": "#fca5a5", "accent": "#ef4444" }, "premium": true
    },
    {
      "id": "peak-performance-endurance", "title": "Peak Performance Endurance", "categoryId": "guided", "description": "A session for maintaining focus and energy during your workout. Combines Beta and Gamma waves for sustained concentration and peak performance.", "steps": [ { "title": "Sustained Focus", "description": "Lock in with a steady Beta wave protocol, infused with vital Oxygen and radiant solar energy, to maintain alertness and cellular respiration.", "duration": 600, "frequencyId": "beta", "layerFrequencyId": "oxygen", "layer3FrequencyId": "celestial-sun" }, { "title": "Peak Performance", "description": "Layer in 40Hz Gamma waves to sharpen cognitive processing and push your limits.", "duration": 600, "frequencyId": "beta", "layerFrequencyId": "gamma-40hz-precise" } ], "colors": { "primary": "#fdba74", "secondary": "#fb923c", "accent": "#f97316" }, "premium": true
    },
    {
      "id": "post-workout-recovery", "title": "Post-Workout Recovery", "categoryId": "guided", "description": "A cool-down protocol to ease muscle soreness, reduce inflammation, and shift your nervous system into a restorative state.", "steps": [ { "title": "Inflammation Reduction", "description": "Use a targeted Rife frequency for inflammation, combined with grounding Carbon and healing Solfeggio, to begin the recovery process.", "duration": 480, "frequencyId": "rife-inflammation", "layerFrequencyId": "carbon", "layer3FrequencyId": "solfeggio-285-healing" }, { "title": "Deep Relaxation", "description": "Transition to Theta waves, soothing rain, and calming Magnesium to promote deep physical and mental relaxation, allowing your body to repair.", "duration": 600, "frequencyId": "theta", "layerFrequencyId": "ambient-rain", "layer3FrequencyId": "magnesium" } ], "colors": { "primary": "#93c5fd", "secondary": "#a5b4fc", "accent": "#60a5fa" }, "premium": true
    },
    {
      "id": "oxygenation-circulation-flow", "title": "Oxygenation & Circulation Flow", "categoryId": "guided", "description": "A session using specific frequencies to support healthy blood flow, oxygenation, and cellular vitality.", "steps": [ { "title": "Circulation Support", "description": "Use the 727 Hz Rife frequency, magnetic Iron, and vital Oxygen to support blood health and circulation.", "duration": 450, "frequencyId": "rife-727", "layerFrequencyId": "iron", "layer3FrequencyId": "oxygen" }, { "title": "Cellular Oxygenation", "description": "Conclude with a blend of Oxygen, vitality, and magnetic Iron to enhance cellular respiration and energy.", "duration": 450, "frequencyId": "oxygen", "layerFrequencyId": "rife-727", "layer3FrequencyId": "iron" } ], "colors": { "primary": "#fecaca", "secondary": "#fda4af", "accent": "#f87171" }, "premium": true
    },
    {
      "id": "mitochondrial-energy-protocol", "title": "Mitochondrial Energy Protocol", "categoryId": "guided", "description": "A protocol designed to support your cellular powerhouses, the mitochondria, for enhanced energy and vitality.", "steps": [ { "title": "Cellular Resonance", "description": "A combination of a general vitality frequency, an NAD+ booster, and the spark of Hydrogen to stimulate your cellular powerhouses.", "duration": 360, "frequencyId": "rife-880", "layerFrequencyId": "nad-plus-booster", "layer3FrequencyId": "hydrogen" }, { "title": "Energetic Charge", "description": "Combine the 528 Hz 'Miracle Tone' with the vital spark of Hydrogen and a radiant vitality frequency to charge your cells with life force.", "duration": 360, "frequencyId": "solfeggio-528-repair", "layerFrequencyId": "hydrogen", "layer3FrequencyId": "rife-633hz-vitality" } ], "colors": { "primary": "#fde047", "secondary": "#facc15", "accent": "#eab308" }, "premium": true
    },
    {
      "id": "red-light-synergy", "title": "Red Light Therapy Synergy", "categoryId": "guided", "description": "An audio protocol to complement your Red Light Therapy sessions, promoting collagen production and enhancing cellular absorption of light.", "steps": [ { "title": "Cellular Repair", "description": "A blend for tissue healing, fascial support, and structural integrity to prepare the cells for light therapy.", "duration": 450, "frequencyId": "solfeggio-285-healing", "layerFrequencyId": "rife-fascia", "layer3FrequencyId": "carbon" }, { "title": "Structural Support", "description": "The Rife frequency for fascia, combined with tissue healing and Carbon's energy, helps support the skin's underlying structural matrix.", "duration": 450, "frequencyId": "rife-fascia", "layerFrequencyId": "solfeggio-285-healing", "layer3FrequencyId": "carbon" } ], "colors": { "primary": "#fca5a5", "secondary": "#f87171", "accent": "#ef4444" }, "premium": true
    },
    {
      "id": "post-procedure-recovery", "title": "Post-Procedure Recovery", "categoryId": "guided", "description": "A gentle session to support the body's natural healing process after cosmetic procedures, helping to reduce inflammation and promote tissue repair.", "steps": [ { "title": "Soothe & Calm", "description": "Begin with a Rife frequency for inflammation, layered with calming Lithium and deep Delta waves, to soothe the system.", "duration": 600, "frequencyId": "rife-inflammation", "layerFrequencyId": "lithium", "layer3FrequencyId": "delta" }, { "title": "Tissue Repair", "description": "Use a combination of tissue healing, fascial support, and Zinc's defensive energy to support cellular regeneration.", "duration": 600, "frequencyId": "solfeggio-285-healing", "layerFrequencyId": "rife-fascia", "layer3FrequencyId": "zinc" } ], "colors": { "primary": "#d8b4fe", "secondary": "#c084fc", "accent": "#a855f7" }, "premium": true
    },
    {
      "id": "cellular-longevity-protocol", "title": "Cellular Longevity Protocol", "categoryId": "guided", "description": "A session to support graceful aging by targeting NAD+ levels and promoting deep cellular restoration during Delta wave states.", "steps": [ { "title": "NAD+ Boost", "description": "A specialized frequency to support NAD+ production, enhanced by high-vibrational Platinum and restorative Delta waves.", "duration": 720, "frequencyId": "nad-plus-booster", "layerFrequencyId": "platinum", "layer3FrequencyId": "delta" }, { "title": "Deep Restoration", "description": "Enter a deep Delta wave state, reinforced with the NAD+ and Platinum frequencies, for physical repair and cellular cleansing.", "duration": 600, "frequencyId": "delta", "layerFrequencyId": "nad-plus-booster", "layer3FrequencyId": "platinum" } ], "colors": { "primary": "#a5f3fc", "secondary": "#67e8f9", "accent": "#22d3ee" }, "premium": true
    },
    {
      "id": "adhd-focus-protocol", "title": "ADHD Focus Protocol", "categoryId": "guided", "description": "A protocol that starts with calming Theta waves to quiet a busy mind and then transitions to Beta waves to support sustained, focused attention.", "steps": [ { "title": "Calm the Mind", "description": "Begin with Theta waves, balancing Lithium, and grounding Brown Noise to reduce mental chatter and create a state of relaxed awareness.", "duration": 600, "frequencyId": "theta", "layerFrequencyId": "lithium", "layer3FrequencyId": "noise-brown" }, { "title": "Engage Focus", "description": "Transition to a steady Beta wave frequency, sharpened by 40Hz Gamma and fortified by Iron, to promote alertness and concentration.", "duration": 900, "frequencyId": "beta", "layerFrequencyId": "gamma-40hz-precise", "layer3FrequencyId": "iron" } ], "colors": { "primary": "#e0e7ff", "secondary": "#c7d2fe", "accent": "#818cf8" }, "premium": true
    },
    {
      "id": "neurogenesis-support-protocol", "title": "Neurogenesis Support Protocol", "categoryId": "guided", "description": "A session combining 40Hz Gamma waves and specific Rife frequencies to support brain health and the creation of new neural pathways.", "steps": [ { "title": "Gamma Stimulation", "description": "A blend of 40Hz Gamma, neural support Rife, and inspirational Phosphorous to stimulate cognitive function and brain activity.", "duration": 600, "frequencyId": "gamma-40hz-precise", "layerFrequencyId": "rife-880", "layer3FrequencyId": "phosphorous" }, { "title": "Neural Support", "description": "A Rife frequency for neural health, enhanced by Gamma and Phosphorous, to support the creation of new pathways.", "duration": 600, "frequencyId": "rife-880", "layerFrequencyId": "gamma-40hz-precise", "layer3FrequencyId": "phosphorous" } ], "colors": { "primary": "#c4b5fd", "secondary": "#a78bfa", "accent": "#8b5cf6" }, "premium": true
    },
    {
      "id": "dopamine-release-protocol", "title": "Dopamine Release Protocol", "categoryId": "guided", "description": "A dynamic session using Beta and Gamma waves to naturally support dopamine, enhancing motivation, focus, and mood.", "steps": [ { "title": "Cognitive Priming", "description": "Beta waves, the driving frequency of Mars, and a vitality boost to sharpen focus and build motivation.", "duration": 450, "frequencyId": "beta", "layerFrequencyId": "celestial-mars", "layer3FrequencyId": "rife-633hz-vitality" }, { "title": "Peak State Activation", "description": "High-frequency Gamma waves, vital solar energy, and the frequency of luck to stimulate reward centers and elevate mood.", "duration": 450, "frequencyId": "gamma", "layerFrequencyId": "celestial-sun", "layer3FrequencyId": "angel-777" } ], "colors": { "primary": "#fde047", "secondary": "#facc15", "accent": "#eab308" }, "premium": true
    },
    {
      "id": "serotonin-boost-protocol", "title": "Serotonin Boost Protocol", "categoryId": "guided", "description": "A calming session using Alpha waves to create a relaxed, positive mental state conducive to natural serotonin production.", "steps": [ { "title": "Release & Prepare", "description": "Begin with 396 Hz and deep Theta waves to release subconscious stressors, set to the backdrop of gentle rain.", "duration": 600, "frequencyId": "solfeggio-396-liberation", "layerFrequencyId": "ambient-rain", "layer3FrequencyId": "theta" }, { "title": "Cultivate Calm", "description": "A 10 Hz Alpha wave, layered with Lithium's balance and the 639 Hz harmony tone, induces a state of serene positivity.", "duration": 600, "frequencyId": "alpha", "layerFrequencyId": "lithium", "layer3FrequencyId": "solfeggio-639-harmony" } ], "colors": { "primary": "#93c5fd", "secondary": "#60a5fa", "accent": "#3b82f6" }, "premium": true
    },
    {
      "id": "oxytocin-love-protocol", "title": "Oxytocin 'Love' Protocol", "categoryId": "guided", "description": "A heart-centered session using frequencies for harmony and connection to cultivate feelings of empathy and love.", "steps": [ { "title": "Opening the Heart", "description": "Gentle Alpha waves, the frequency of Venus, and the 639 Hz harmony tone create a receptive state of peace.", "duration": 450, "frequencyId": "alpha", "layerFrequencyId": "celestial-venus", "layer3FrequencyId": "solfeggio-639-harmony" }, { "title": "Deepening Connection", "description": "The 639 Hz frequency, grounded by the Earth's Schumann Resonance and Venus's loving energy, fosters profound connection.", "duration": 450, "frequencyId": "solfeggio-639-harmony", "layerFrequencyId": "schumann-resonance", "layer3FrequencyId": "celestial-venus" } ], "colors": { "primary": "#f9a8d4", "secondary": "#f472b6", "accent": "#ec4899" }, "premium": true
    },
    {
      "id": "endorphin-bliss-protocol", "title": "Endorphin Bliss Protocol", "categoryId": "guided", "description": "A session that uses Alpha-to-Theta transitions to mimic states of deep relaxation and meditation, which can support the natural release of endorphins.", "steps": [ { "title": "Alpha-Theta Bridge", "description": "Gently guide your mind from a relaxed Alpha state to a deeper, meditative Theta state, enhanced by angelic and expansive frequencies for a blissful experience.", "duration": 900, "frequencyId": "theta", "layerFrequencyId": "angel-111", "layer3FrequencyId": "celestial-jupiter" } ], "colors": { "primary": "#a7f3d0", "secondary": "#6ee7b7", "accent": "#34d399" }, "premium": true
    },
    {
      "id": "mindful-start", "title": "Mindful Start", "categoryId": "guided", "description": "Begin your day with this session combining gentle Alpha waves and Solfeggio frequencies to clear your mind and set a positive intention.", "steps": [ { "title": "Release & Center", "description": "396 Hz, gentle Theta, and soothing rain to release subconscious blockages and center your being.", "duration": 300, "frequencyId": "solfeggio-396-liberation", "layerFrequencyId": "theta", "layer3FrequencyId": "ambient-rain" }, { "title": "Calm Awareness", "description": "Alpha waves, solar vitality, and invigorating Oxygen to foster a state of relaxed, present-moment awareness.", "duration": 300, "frequencyId": "alpha", "layerFrequencyId": "celestial-sun", "layer3FrequencyId": "oxygen" } ], "colors": { "primary": "#fde047", "secondary": "#fcd34d", "accent": "#facc15" }, "premium": true
    },
    {
      "id": "deep-relaxation", "title": "Deep Relaxation", "categoryId": "guided", "description": "Unwind completely with this journey from Alpha to Theta brainwaves, perfect for melting away stress and anxiety after a long day.", "steps": [ { "title": "Stress Release", "description": "Start with Alpha waves, calming ocean sounds, and restorative Magnesium to calm the nervous system.", "duration": 600, "frequencyId": "alpha", "layerFrequencyId": "ambient-sea", "layer3FrequencyId": "magnesium" }, { "title": "Enter Deep Calm", "description": "Transition to Theta and Delta waves with grounding Brown Noise for profound mental and physical relaxation.", "duration": 600, "frequencyId": "theta", "layerFrequencyId": "noise-brown", "layer3FrequencyId": "delta" } ], "colors": { "primary": "#c7d2fe", "secondary": "#a5b4fc", "accent": "#818cf8" }, "premium": true
    },
    {
      "id": "yoga-savasana-relaxation", "title": "Yoga & Savasana Relaxation", "categoryId": "guided", "description": "A session to enhance your Savasana or cool-down. Deep Theta waves help integrate your practice and guide you into a state of profound rest.", "steps": [ { "title": "Deep Integration", "description": "Theta waves, healing Solfeggio, and Earth's resonance to deepen relaxation and help the body absorb the benefits of your yoga practice.", "duration": 900, "frequencyId": "theta", "layerFrequencyId": "solfeggio-285-healing", "layer3FrequencyId": "schumann-resonance" } ], "colors": { "primary": "#d8b4fe", "secondary": "#c084fc", "accent": "#a855f7" }, "premium": true
    },
    {
      "id": "ultimate-deep-sleep", "title": "Ultimate Deep Sleep", "categoryId": "guided", "description": "This protocol guides you from a relaxed Theta state into deep, restorative Delta sleep, enhanced by the grounding frequency of Brown Noise.", "steps": [ { "title": "Mind Quieting", "description": "Theta waves, grounding Brown Noise, and relaxing Magnesium to slow down brain activity and prepare for sleep.", "duration": 900, "frequencyId": "theta", "layerFrequencyId": "noise-brown", "layer3FrequencyId": "magnesium" }, { "title": "Restorative Sleep", "description": "Deep Delta waves, Brown Noise, and calming Lithium to promote physical repair and dreamless sleep.", "duration": 900, "frequencyId": "delta", "layerFrequencyId": "noise-brown", "layer3FrequencyId": "lithium" } ], "colors": { "primary": "#a5b4fc", "secondary": "#818cf8", "accent": "#6366f1" }, "premium": true
    },
    {
      "id": "focus-10-protocol", "title": "Focus 10 Protocol", "categoryId": "guided", "description": "A protocol inspired by Hemi-Sync to achieve the 'mind awake, body asleep' state, ideal for deep meditation and inner exploration.", "steps": [ { "title": "Relaxation", "description": "Transition from Beta to Alpha with a focused Pink Noise background to calm the body.", "duration": 300, "frequencyId": "alpha", "layerFrequencyId": "noise-pink" }, { "title": "Deepening", "description": "Move into Theta with Pink Noise to maintain focus while achieving profound physical relaxation.", "duration": 300, "frequencyId": "theta", "layerFrequencyId": "noise-pink" }, { "title": "Focus 10 State", "description": "A specific combination of Beta, Theta, and 40Hz Gamma to keep the mind sharp and alert while the body is in a state of deep stillness.", "duration": 600, "frequencyId": "beta", "layerFrequencyId": "theta", "layer3FrequencyId": "gamma-40hz-precise" } ], "colors": { "primary": "#e9d5ff", "secondary": "#c4b5fd", "accent": "#d8b4fe" }, "premium": false
    },
    {
      "id": "focus-12-protocol", "title": "Focus 12 Protocol", "categoryId": "guided", "description": "A journey to Focus 12, a state of expanded awareness beyond the five physical senses, used for creative problem solving and insight.", "steps": [ { "title": "Enter Focus 10", "description": "Establish the 'mind awake, body asleep' foundation with a powerful blend of Beta, Theta, and Gamma waves.", "duration": 600, "frequencyId": "beta", "layerFrequencyId": "theta", "layer3FrequencyId": "gamma-40hz-precise" }, { "title": "Expanded Awareness", "description": "Introduce Gamma and Alpha waves with the 999 Hz 'completion' frequency to broaden perception and access deeper levels of consciousness.", "duration": 900, "frequencyId": "gamma", "layerFrequencyId": "alpha", "layer3FrequencyId": "angel-999" } ], "colors": { "primary": "#c4b5fd", "secondary": "#a78bfa", "accent": "#a855f7" }, "premium": true
    },
    {
      "id": "pineal-gland-activation", "title": "Pineal Gland Activation", "categoryId": "guided", "description": "A session using specific Solfeggio frequencies associated with activating the 'third eye' for enhanced intuition and spiritual connection.", "steps": [ { "title": "Intuitive Gateway", "description": "Theta waves, paired with the Moon's frequency and the 888 Hz 'abundance' tone, open the gateway to deep, intuitive states of mind.", "duration": 450, "frequencyId": "theta", "layerFrequencyId": "celestial-moon", "layer3FrequencyId": "angel-888" }, { "title": "Oneness Attunement", "description": "The 963 Hz frequency, layered with 852 Hz and high-vibrational Platinum, works to activate the pineal gland and connect you to unity consciousness.", "duration": 450, "frequencyId": "solfeggio-963-oneness", "layerFrequencyId": "solfeggio-852-intuition", "layer3FrequencyId": "platinum" } ], "colors": { "primary": "#d8b4fe", "secondary": "#c084fc", "accent": "#a855f7" }, "premium": true
    },
    {
      "id": "vision-restoration", "title": "Vision Restoration Protocol", "categoryId": "guided", "description": "A protocol using specific Rife frequencies associated with eye health to support and maintain healthy vision.", "steps": [ { "title": "Relax & Oxygenate", "description": "Calming Alpha waves, purifying Oxygen, and a targeted Rife frequency reduce eye strain and support cellular health in the visual system.", "duration": 600, "frequencyId": "alpha", "layerFrequencyId": "oxygen", "layer3FrequencyId": "rife-eye-health" }, { "title": "Targeted Support", "description": "A targeted Rife frequency for eye wellness, layered with protective Selenium and relaxing Alpha waves, to support visual acuity.", "duration": 600, "frequencyId": "rife-eye-health", "layerFrequencyId": "selenium", "layer3FrequencyId": "alpha" } ], "colors": { "primary": "#93c5fd", "secondary": "#60a5fa", "accent": "#3b82f6" }, "premium": true
    },
    {
      "id": "lucid-dream-induction", "title": "Lucid Dream Induction", "categoryId": "guided", "description": "A session combining Theta and Gamma waves to create the ideal brain state for lucid dreaming—deeply relaxed yet consciously aware.", "steps": [ { "title": "Relax into Theta", "description": "Enter the dream-like Theta state with the support of lunar and Neptunian frequencies to enhance subconscious exploration.", "duration": 900, "frequencyId": "theta", "layerFrequencyId": "celestial-moon", "layer3FrequencyId": "celestial-neptune" }, { "title": "Awaken Awareness", "description": "Introduce Gamma waves and a protective angelic frequency to promote conscious awareness within the dream state.", "duration": 600, "frequencyId": "gamma", "layerFrequencyId": "theta", "layer3FrequencyId": "angel-444" } ], "colors": { "primary": "#c4b5fd", "secondary": "#a78bfa", "accent": "#8b5cf6" }, "premium": true
    },
    {
      "id": "chakra-balancing-journey", "title": "Chakra Balancing Journey", "categoryId": "guided", "description": "A journey through the seven primary Solfeggio frequencies, each corresponding to a major energy center (chakra) for a full-system energetic tune-up.", "steps": [ { "title": "Root Chakra (396 Hz)", "description": "Grounding and releasing fear.", "duration": 300, "frequencyId": "solfeggio-396-liberation" }, { "title": "Sacral Chakra (417 Hz)", "description": "Facilitating positive change.", "duration": 300, "frequencyId": "solfeggio-417-change" }, { "title": "Solar Plexus (528 Hz)", "description": "Transformation and empowerment.", "duration": 300, "frequencyId": "solfeggio-528-repair" }, { "title": "Heart Chakra (639 Hz)", "description": "Connection and love.", "duration": 300, "frequencyId": "solfeggio-639-harmony" }, { "title": "Throat Chakra (741 Hz)", "description": "Expression and truth.", "duration": 300, "frequencyId": "solfeggio-741-expression" }, { "title": "Third Eye Chakra (852 Hz)", "description": "Intuition and inner vision.", "duration": 300, "frequencyId": "solfeggio-852-intuition" }, { "title": "Crown Chakra (963 Hz)", "description": "Spiritual oneness.", "duration": 300, "frequencyId": "solfeggio-963-oneness" } ], "colors": { "primary": "#fde047", "secondary": "#facc15", "accent": "#eab308" }, "premium": true
    },
    {
      "id": "abundance-matrix-attunement", "title": "Abundance Matrix Attunement", "categoryId": "guided", "description": "A session using the 777 Hz 'luck' frequency combined with the magnetic properties of Gold to align your energy field with prosperity and abundance.", "steps": [ { "title": "Attune to Abundance", "description": "777 Hz, the frequency of Gold, and Jupiter's expansive energy align your bio-field with luck and prosperity.", "duration": 900, "frequencyId": "angel-777", "layerFrequencyId": "gold", "layer3FrequencyId": "celestial-jupiter" } ], "colors": { "primary": "#fcd34d", "secondary": "#fbbf24", "accent": "#f59e0b" }, "premium": true
    },
    {
      "id": "astral-projection-gateway", "title": "Astral Projection Gateway", "categoryId": "guided", "description": "An advanced protocol that guides you to the Focus 12 state of expanded awareness, designed to create the ideal conditions for out-of-body experiences.", "steps": [ { "title": "Body Asleep", "description": "Deep Theta relaxation, with frequencies of completion and transformation, to quiet the physical body.", "duration": 900, "frequencyId": "theta", "layerFrequencyId": "angel-999", "layer3FrequencyId": "celestial-pluto" }, { "title": "Mind Awake & Expanded", "description": "A blend of Gamma, Alpha, and Uranian frequencies to enter Focus 12 and encourage breakthroughs in consciousness.", "duration": 900, "frequencyId": "gamma", "layerFrequencyId": "alpha", "layer3FrequencyId": "celestial-uranus" } ], "colors": { "primary": "#e9d5ff", "secondary": "#c4b5fd", "accent": "#d8b4fe" }, "premium": true
    },
    {
      "id": "heart-coherence-journey", "title": "Heart Coherence Journey", "categoryId": "guided", "description": "A journey combining the 639 Hz 'love' frequency with Alpha waves and the Earth's Schumann resonance to bring your heart and brain into a state of harmonious coherence.", "steps": [ { "title": "Heart-Brain Sync", "description": "Alpha waves, the 639 Hz harmony tone, and the frequency of Venus to bridge heart and mind.", "duration": 450, "frequencyId": "alpha", "layerFrequencyId": "solfeggio-639-harmony", "layer3FrequencyId": "celestial-venus" }, { "title": "Ground in Love", "description": "Combine 639 Hz, the Schumann Resonance, and relaxing Alpha waves to ground your coherent state.", "duration": 450, "frequencyId": "solfeggio-639-harmony", "layerFrequencyId": "schumann-resonance", "layer3FrequencyId": "alpha" } ], "colors": { "primary": "#f9a8d4", "secondary": "#f472b6", "accent": "#ec4899" }, "premium": true
    },
    {
      "id": "cosmic-thread-alignment",
      "title": "The Cosmic Thread",
      "categoryId": "guided",
      "description": "Tune into the rhythm of the cosmos through the bridge between the known and the infinite. 137 Hz is believed to underpin the very laws of nature — a sacred constant guiding energy, light, and structure. Paired with the frequency of Divine Oneness, this session is a portal to heightened perception, balance, and inner alignment with the universal blueprint.",
      "steps": [
        { "title": "Harmonic Grounding", "description": "Begin by attuning to 432 Hz, the universal frequency of natural harmony. This prepares your bio-field and creates a stable foundation for deeper exploration.", "duration": 300, "frequencyId": "hz-432-universal-tuning" },
        { "title": "The Cosmic Bridge", "description": "Experience the 137 Hz frequency, the 'magic number' of physics. This tone acts as a bridge, aligning your energy with the fundamental structure of the cosmos.", "duration": 480, "frequencyId": "cosmic-constant-137" },
        { "title": "Integration with Oneness", "description": "Finally, integrate the experience with 963 Hz, the frequency of Divine Oneness. This anchors your newfound alignment and connects you to universal consciousness.", "duration": 300, "frequencyId": "solfeggio-963-oneness" }
      ],
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" },
      "premium": true
    },
    {
      "id": "cosmic-threshold",
      "title": "Cosmic Threshold: OM & the Divine Constant",
      "categoryId": "guided",
      "description": "A harmonic gateway between cosmic sound and universal structure, using the OM frequency and the symbolic resonance of 137 Hz.",
      "advice": "This session is designed to create a harmonic gateway between cosmic sound and universal structure. The journey begins with the primordial OM tone to align you with Earth's resonance. It then transitions to a layered frequency of the 'Divine Constant' (137 Hz) and a calming Alpha wave, creating a symbolic bridge to the structure of reality. The session concludes by returning to the OM frequency, grounding you in a state of inner spaciousness. For best results, use headphones and find a quiet, comfortable space.",
      "steps": [
        { "title": "Primordial Tone — OM Resonance", "description": "Aligns with the Earth’s orbit, opening the body to stillness and cosmic attunement.", "duration": 300, "frequencyId": "om-resonance", "layerFrequencyId": "schumann-resonance" },
        { "title": "Harmonic Gateway — Divine Constant", "description": "Integrates the fine-structure constant with an 8 Hz alpha wave and high-vibrational Platinum to bridge insight and calm.", "duration": 300, "frequencyId": "cosmic-constant-137", "layerFrequencyId": "alpha-bridge-8hz", "layer3FrequencyId": "platinum" },
        { "title": "Inner Infinity — Return to Silence", "description": "Fades the session back into deep grounding and inner spaciousness, reinforcing the OM resonance.", "duration": 300, "frequencyId": "om-resonance", "layerFrequencyId": "schumann-resonance" }
      ],
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" },
      "premium": true
    },
    {
      "id": "phi-axis-harmonic-balance",
      "title": "Phi Axis — Harmonic Balance",
      "categoryId": "brainwaves",
      "description": "Brings the user into a state of inner balance, aligning brain hemispheres and energetic centers through the spiral mathematics of life itself.",
      "advice": "This 15-minute protocol uses the Golden Mean (Phi) to bring your system into harmonic balance. It begins by aligning you with the divine proportion, then uses a special binaural beat to synchronize your brain hemispheres, and concludes with an elemental integration to ground the experience. Use headphones for the best effect, especially during the second step.",
      "steps": [
        {
          "title": "Golden Spiral Alignment",
          "description": "Introduces coherence and symmetry across physical and subtle bodies using the 161.8 Hz tone.",
          "duration": 300,
          "frequencyId": "golden-mean-phi"
        },
        {
          "title": "Mirror Axis",
          "description": "Creates a binaural differential of 61.8 Hz to encourage neural cross-hemisphere entrainment and intuitive insight.",
          "duration": 300,
          "frequencyId": "mirror-axis-phi"
        },
        {
          "title": "Harmonic Integration",
          "description": "A three-layer blend of Hydrogen (pure potential), Harmonic Grounding, and the Tav frequency for energetic renewal.",
          "duration": 300,
          "frequencyId": "harmonic-grounding-81hz",
          "layerFrequencyId": "hydrogen",
          "layer3FrequencyId": "kabbalah-tav"
        }
      ],
      "colors": { "primary": "#fcd34d", "secondary": "#fdba74", "accent": "#fde047" },
      "premium": true
    },
    {
      "id": "beauty-facelift",
      "title": "Acoustic Face Lift",
      "categoryId": "guided",
      "description": "A session using Solfeggio, Alpha, and Delta waves to support facial muscle tone and skin vitality.",
      "steps": [
        { "title": "Cellular Preparation", "description": "The 528 Hz 'Miracle Tone', calming Alpha waves, and fascial support frequencies prepare skin cells for rejuvenation.", "duration": 300, "frequencyId": "solfeggio-528-repair", "layerFrequencyId": "alpha", "layer3FrequencyId": "rife-fascia" },
        { "title": "Harmonize & Tone", "description": "639 Hz for intercellular harmony, Delta waves for regeneration, and Selenium's resonance for antioxidant support.", "duration": 300, "frequencyId": "solfeggio-639-harmony", "layerFrequencyId": "delta", "layer3FrequencyId": "selenium" }
      ],
      "colors": { "primary": "#fda4af", "secondary": "#fca5a5", "accent": "#f9a8d4" },
      "premium": false
    },
    {
      "id": "beauty-collagen",
      "title": "Collagen & Elastin Support",
      "categoryId": "guided",
      "description": "A protocol with Delta waves and bio-resonance frequencies to energetically support the body's natural production of collagen and elastin.",
      "steps": [
        { "title": "Deep Relaxation & Priming", "description": "Deep Delta waves, tissue healing Solfeggio, and connective Silicon put the body in an optimal restorative state.", "duration": 360, "frequencyId": "delta", "layerFrequencyId": "solfeggio-285-healing", "layer3FrequencyId": "silicon" },
        { "title": "Structural Resonance", "description": "The Rife frequency for fascia, layered with foundational Carbon and structural Silicon, supports the skin's matrix.", "duration": 360, "frequencyId": "rife-fascia", "layerFrequencyId": "carbon", "layer3FrequencyId": "silicon" }
      ],
      "colors": { "primary": "#fda4af", "secondary": "#fca5a5", "accent": "#f9a8d4" },
      "premium": true
    },
    {
      "id": "beauty-hair-growth",
      "title": "Hair Growth & Restoration",
      "categoryId": "guided",
      "description": "A session with Rife and Solfeggio frequencies to support scalp circulation and healthy hair follicle function.",
      "steps": [
        { "title": "Scalp Circulation Support", "description": "A Rife vitality frequency, magnetic Iron, and vital Oxygen support healthy blood flow to the scalp.", "duration": 300, "frequencyId": "rife-727", "layerFrequencyId": "iron", "layer3FrequencyId": "oxygen" },
        { "title": "Follicle Energizing", "description": "The 528 Hz 'Miracle Tone', purifying Oxygen, and Sulphur (a key component of keratin) support cellular repair and energize hair follicles.", "duration": 300, "frequencyId": "solfeggio-528-repair", "layerFrequencyId": "oxygen", "layer3FrequencyId": "sulphur" }
      ],
      "colors": { "primary": "#fda4af", "secondary": "#fca5a5", "accent": "#f9a8d4" },
      "premium": true
    },
    {
      "id": "kabbalah-protocol-mother-letters",
      "title": "Three Mother Letters – Creation Breath",
      "categoryId": "kabbalah",
      "description": "A 15-minute breathwork session to regulate your body and mind through the primal elements. Use a 4-7-8 breath pattern (Inhale-Hold-Exhale) to harmonize Air, Water, and Fire within you.",
      "premium": false,
      "colors": { "primary": "#fefce8", "secondary": "#fde68a", "accent": "#f59e0b" },
      "steps": [
        { "title": "Aleph (א) – Air", "description": "Draw in the breath of Air, clarity and expansion.", "duration": 300, "frequencyId": "kabbalah-aleph" },
        { "title": "Mem (מ) – Water", "description": "Rest in the stillness of Water, calm and renewal.", "duration": 300, "frequencyId": "kabbalah-mem" },
        { "title": "Shin (ש) – Fire", "description": "Release with Fire, transformation and energy.", "duration": 300, "frequencyId": "kabbalah-shin" }
      ]
    },
    {
      "id": "kabbalah-protocol-tree-of-life",
      "title": "Tree of Life Alignment",
      "categoryId": "kabbalah",
      "description": "A 20-minute journey to balance and align the 10 Sefirot, from the Crown's unity to the Earth's grounding. Close with the feeling of your Tree of Life aligned, rooted, and radiant.",
      "premium": true,
      "colors": { "primary": "#fefce8", "secondary": "#fde68a", "accent": "#f59e0b" },
      "steps": [
        { "title": "Keter (Crown – Unity)", "description": "Open to infinite light above your head. Feel unity.", "duration": 120, "frequencyId": "kabbalah-keter" },
        { "title": "Chokhmah (Wisdom – Expansion)", "description": "Breathe into expansion, pure inspiration.", "duration": 120, "frequencyId": "kabbalah-chokhmah" },
        { "title": "Binah (Understanding – Structure)", "description": "Form takes shape, wisdom becomes structure.", "duration": 120, "frequencyId": "kabbalah-binah" },
        { "title": "Chesed (Loving-Kindness)", "description": "Feel generosity and open-heartedness expand within.", "duration": 120, "frequencyId": "kabbalah-chesed" },
        { "title": "Gevurah (Strength, Boundaries)", "description": "Anchor with strength. Boundaries create freedom.", "duration": 120, "frequencyId": "kabbalah-gevurah" },
        { "title": "Tiferet (Harmony, Beauty)", "description": "The heart unites above and below, harmony in the center.", "duration": 120, "frequencyId": "kabbalah-tiferet" },
        { "title": "Netzach (Endurance, Flow)", "description": "Step into perseverance and flow.", "duration": 120, "frequencyId": "kabbalah-netzach" },
        { "title": "Hod (Splendor, Intellect)", "description": "The brilliance of clarity shines in thought and speech.", "duration": 120, "frequencyId": "kabbalah-hod" },
        { "title": "Yesod (Foundation)", "description": "Energy gathers at the foundation, preparing to manifest.", "duration": 120, "frequencyId": "kabbalah-yesod" },
        { "title": "Malkhut (Kingdom – Earth)", "description": "Feel grounded in the body, the divine manifest in Earth.", "duration": 120, "frequencyId": "kabbalah-malkuth" }
      ]
    },
    {
      "id": "kabbalah-protocol-22-pathways",
      "title": "22 Pathways of Resonance",
      "categoryId": "kabbalah",
      "description": "A 22-minute sonic meditation through the Hebrew alphabet. For each letter, see it glowing, breathe in its tone, and let its resonance infuse your body and spirit.",
      "premium": true,
      "colors": { "primary": "#fefce8", "secondary": "#fde68a", "accent": "#f59e0b" },
      "steps": [
        { "title": "Aleph (א) – Breath of life", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-aleph" },
        { "title": "Bet (ב) – House, structure", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-bet" },
        { "title": "Gimel (ג) – Giving, generosity", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-gimel" },
        { "title": "Dalet (ד) – Door, opening", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-dalet" },
        { "title": "He (ה) – Expansion, divine breath", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-he" },
        { "title": "Vav (ו) – Connection, bridge", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-vav" },
        { "title": "Zayin (ז) – Spark, movement", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-zayin" },
        { "title": "Chet (ח) – Life force", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-chet" },
        { "title": "Tet (ט) – Hidden good", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-tet" },
        { "title": "Yod (י) – Point of creation", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-yod" },
        { "title": "Kaf (כ) – Palm, potential", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-kaf" },
        { "title": "Lamed (ל) – Learning, ascent", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-lamed" },
        { "title": "Mem (מ) – Water, renewal", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-mem" },
        { "title": "Nun (נ) – Continuity, humility", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-nun" },
        { "title": "Samekh (ס) – Support, circle", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-samekh" },
        { "title": "Ayin (ע) – Vision, seeing", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-ayin" },
        { "title": "Pe (פ) – Speech, expression", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-pe" },
        { "title": "Tsade (צ) – Righteousness", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-tzade" },
        { "title": "Qof (ק) – Holiness, cycles", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-qof" },
        { "title": "Resh (ר) – Head, renewal", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-resh" },
        { "title": "Shin (ש) – Fire, transformation", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-shin" },
        { "title": "Tav (ת) – Completion, seal", "description": "See the letter glowing. Breathe in its sound and resonance.", "duration": 60, "frequencyId": "kabbalah-tav" }
      ]
    },
    { "id": "mirror-axis-root-crown", "title": "Root–Crown Axis", "categoryId": "brainwaves", "description": "Balances primal instincts with spiritual clarity. A 396 Hz carrier tone grounds the experience while a split binaural beat (111 Hz left, 999 Hz right) stimulates cross-hemispheric balance.", "advice": "This protocol uses a stable carrier tone to ground your energy, while playing two distinct frequencies in each ear to encourage brainwave synchronization between the left and right hemispheres. Headphones are required for the intended effect.", "steps": [{ "title": "Grounding & Ascension", "description": "Balancing the physical and spiritual.", "duration": 900, "frequencyId": "mirror-binaural-root-crown", "layer3FrequencyId": "solfeggio-396-liberation" }], "colors": mirrorAxisColors, "premium": true },
    { "id": "mirror-axis-shadow-light", "title": "Shadow–Light Axis", "categoryId": "brainwaves", "description": "Clears subconscious blocks and activates love resonance. A 528 Hz carrier tone provides a transformative core while a split binaural beat (174 Hz left, 852 Hz right) bridges the subconscious and superconscious.", "advice": "This protocol uses a stable carrier tone to ground your energy, while playing two distinct frequencies in each ear to encourage brainwave synchronization between the left and right hemispheres. Headphones are required for the intended effect.", "steps": [{ "title": "Emotional Release & Heart Coherence", "description": "Transmuting shadow into light.", "duration": 900, "frequencyId": "mirror-binaural-shadow-light", "layer3FrequencyId": "solfeggio-528-repair" }], "colors": mirrorAxisColors, "premium": true },
    { "id": "mirror-axis-mind-mystic", "title": "Mind–Mystic Axis", "categoryId": "brainwaves", "description": "Cleanses mental fog and unlocks creative solutions. A 417 Hz carrier facilitates change while a split binaural beat (285 Hz left, 741 Hz right) connects healing with expression.", "advice": "This protocol uses a stable carrier tone to ground your energy, while playing two distinct frequencies in each ear to encourage brainwave synchronization between the left and right hemispheres. Headphones are required for the intended effect.", "steps": [{ "title": "Mental Clarity & Inner Alchemy", "description": "Bridging logic and intuition.", "duration": 900, "frequencyId": "mirror-binaural-mind-mystic", "layer3FrequencyId": "solfeggio-417-change" }], "colors": mirrorAxisColors, "premium": true },
    { "id": "mirror-axis-pineal-thymus", "title": "Pineal–Thymus Axis", "categoryId": "brainwaves", "description": "Supports DNA activation and inner knowing. A 432 Hz carrier creates universal harmony while a split binaural beat (639 Hz left, 963 Hz right) connects the heart's intuition to divine oneness.", "advice": "This protocol uses a stable carrier tone to ground your energy, while playing two distinct frequencies in each ear to encourage brainwave synchronization between the left and right hemispheres. Headphones are required for the intended effect.", "steps": [{ "title": "Intuition & Cellular Harmony", "description": "Connecting the third eye and high heart.", "duration": 900, "frequencyId": "mirror-binaural-pineal-thymus", "layer3FrequencyId": "hz-432-universal-tuning" }], "colors": mirrorAxisColors, "premium": true },
    { "id": "mirror-axis-inner-outer-vision", "title": "Inner–Outer Vision Axis", "categoryId": "brainwaves", "description": "Enhances self-awareness and manifestation. A 444 Hz carrier provides energetic protection while a split binaural beat (222 Hz left, 888 Hz right) aligns personal trust with infinite abundance.", "advice": "This protocol uses a stable carrier tone to ground your energy, while playing two distinct frequencies in each ear to encourage brainwave synchronization between the left and right hemispheres. Headphones are required for the intended effect.", "steps": [{ "title": "Perception & Projection", "description": "Aligning what you see with what you create.", "duration": 900, "frequencyId": "mirror-binaural-inner-outer-vision", "layer3FrequencyId": "angel-444" }], "colors": mirrorAxisColors, "premium": true },
    { "id": "mirror-axis-cosmic-earth", "title": "Cosmic–Earth Axis", "categoryId": "brainwaves", "description": "Bridges ethereal visions with earthly embodiment. A 285 Hz carrier promotes healing while a split binaural beat (333 Hz left, 777 Hz right) channels divine support into tangible luck.", "advice": "This protocol uses a stable carrier tone to ground your energy, while playing two distinct frequencies in each ear to encourage brainwave synchronization between the left and right hemispheres. Headphones are required for the intended effect.", "steps": [{ "title": "Multidimensional Anchoring", "description": "Bringing heavenly insights into physical reality.", "duration": 900, "frequencyId": "mirror-binaural-cosmic-earth", "layer3FrequencyId": "solfeggio-285-healing" }], "colors": mirrorAxisColors, "premium": true },
    { "id": "mirror-axis-solar-lunar", "title": "Solar–Lunar Axis", "categoryId": "brainwaves", "description": "Balances masculine-feminine energetics for emotional flow. A 528 Hz carrier facilitates transformation while a split binaural beat (396 Hz left, 639 Hz right) integrates grounding with heart-centered connection.", "advice": "This protocol uses a stable carrier tone to ground your energy, while playing two distinct frequencies in each ear to encourage brainwave synchronization between the left and right hemispheres. Headphones are required for the intended effect.", "steps": [{ "title": "Yin-Yang Emotional Flow", "description": "Harmonizing action and receptivity.", "duration": 900, "frequencyId": "mirror-binaural-solar-lunar", "layer3FrequencyId": "solfeggio-528-repair" }], "colors": mirrorAxisColors, "premium": true },
    { "id": "mirror-axis-mirror-gate", "title": "Mirror Gate Axis", "categoryId": "brainwaves", "description": "Navigates memory loops and karmic clarity. A 444 Hz carrier offers protection while a reflective split binaural beat (321 Hz left, 123 Hz right) encourages a new perspective on the past.", "advice": "This protocol uses a stable carrier tone to ground your energy, while playing two distinct frequencies in each ear to encourage brainwave synchronization between the left and right hemispheres. Headphones are required for the intended effect.", "steps": [{ "title": "Time Reversal & Reflection", "description": "Clearing the past to open the future.", "duration": 900, "frequencyId": "mirror-binaural-mirror-gate", "layer3FrequencyId": "angel-444" }], "colors": mirrorAxisColors, "premium": true },
    { "id": "mirror-axis-soma-spirit", "title": "Soma–Spirit Axis", "categoryId": "brainwaves", "description": "Integrates bodily and soul awareness for full embodiment. A 432 Hz carrier ensures universal harmony while a split binaural beat (288 Hz left, 864 Hz right) connects physical sensation with higher consciousness.", "advice": "This protocol uses a stable carrier tone to ground your energy, while playing two distinct frequencies in each ear to encourage brainwave synchronization between the left and right hemispheres. Headphones are required for the intended effect.", "steps": [{ "title": "Embodiment of Higher Self", "description": "Uniting body consciousness with soul wisdom.", "duration": 900, "frequencyId": "mirror-binaural-soma-spirit", "layer3FrequencyId": "hz-432-universal-tuning" }], "colors": mirrorAxisColors, "premium": true },
    { "id": "mirror-axis-golden-tri", "title": "Golden Tri-Mirror", "categoryId": "brainwaves", "description": "Opens creative insight, energy flow & quantum expansion. A 111 Hz angelic carrier tone sets the stage for a Tesla-inspired split binaural beat (369 Hz left, 639 Hz right) that connects insight with heart coherence.", "advice": "This protocol uses a stable carrier tone to ground your energy, while playing two distinct frequencies in each ear to encourage brainwave synchronization between the left and right hemispheres. Headphones are required for the intended effect.", "steps": [{ "title": "Tesla Code Activation", "description": "Unlocking the code of creation.", "duration": 900, "frequencyId": "mirror-binaural-golden-tri", "layer3FrequencyId": "angel-111" }], "colors": mirrorAxisColors, "premium": true }
  ],
  "featured_candidates": [ "vagus-lymph-reset", "metabolic-harmony-protocol", "adhd-focus-protocol", "ultimate-deep-sleep", "chakra-balancing-journey", "solfeggio-528-repair", "beta", "gamma-40hz-precise", "solfeggio-1782-alchemy", "cosmic-thread-alignment", "cosmic-threshold", "phi-axis-harmonic-balance" ],
  "initial_frequencies": [
    {
      "id": "delta",
      "name": "Delta Waves",
      "range": "0.5 - 4 Hz",
      "baseFrequency": 136.1,
      "binauralFrequency": 2.5,
      "description": "The frequency of deep, dreamless sleep and profound physical restoration. Delta waves are essential for healing, regeneration, and accessing the unconscious mind.",
      "category": BenefitCategory.COGNITIVE,
      "categoryId": "brainwaves",
      "defaultMode": "BINAURAL",
      "availableModes": ["BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#d8b4fe", "secondary": "#e9d5ff", "accent": "#c084fc" },
      "premium": false
    },
    {
      "id": "theta",
      "name": "Theta Waves",
      "range": "4 - 8 Hz",
      "baseFrequency": 136.1,
      "binauralFrequency": 6,
      "description": "The state of deep meditation, creativity, and intuition. Theta waves are the gateway to learning, memory, and vivid visualization. The 'flow state' frequency.",
      "category": BenefitCategory.COGNITIVE,
      "categoryId": "brainwaves",
      "defaultMode": "BINAURAL",
      "availableModes": ["BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#d8b4fe", "secondary": "#e9d5ff", "accent": "#c084fc" },
      "premium": false
    },
    {
      "id": "alpha",
      "name": "Alpha Waves",
      "range": "8 - 12 Hz",
      "baseFrequency": 136.1,
      "binauralFrequency": 10,
      "description": "The frequency of relaxed, focused awareness. Alpha waves are present during light meditation and daydreaming, promoting calm and reducing stress.",
      "category": BenefitCategory.COGNITIVE,
      "categoryId": "brainwaves",
      "defaultMode": "BINAURAL",
      "availableModes": ["BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#d8b4fe", "secondary": "#e9d5ff", "accent": "#c084fc" },
      "premium": true
    },
    {
      "id": "beta",
      "name": "Beta Waves",
      "range": "12 - 38 Hz",
      "baseFrequency": 136.1,
      "binauralFrequency": 20,
      "description": "The state of normal waking consciousness. Beta waves are associated with logical thinking, problem-solving, and focused, alert attention.",
      "category": BenefitCategory.COGNITIVE,
      "categoryId": "brainwaves",
      "defaultMode": "BINAURAL",
      "availableModes": ["BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#d8b4fe", "secondary": "#e9d5ff", "accent": "#c084fc" },
      "premium": true
    },
    {
      "id": "gamma",
      "name": "Gamma Waves",
      "range": "38 - 100 Hz",
      "baseFrequency": 136.1,
      "binauralFrequency": 60,
      "description": "The frequency of peak performance and high-level information processing. Gamma waves are associated with intense focus, insight, and expanded consciousness.",
      "category": BenefitCategory.COGNITIVE,
      "categoryId": "brainwaves",
      "defaultMode": "BINAURAL",
      "availableModes": ["BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#d8b4fe", "secondary": "#e9d5ff", "accent": "#c084fc" },
      "premium": true
    },
    {
      "id": "gamma-40hz-precise",
      "name": "40 Hz Gamma (Precise)",
      "range": "40 Hz",
      "baseFrequency": 136.1,
      "binauralFrequency": 40,
      "description": "A specific Gamma frequency linked in research to enhanced cognitive function, memory recall, and potential benefits for brain health.",
      "category": BenefitCategory.COGNITIVE,
      "categoryId": "brainwaves",
      "defaultMode": "ISOCHRONIC",
      "availableModes": ["BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#d8b4fe", "secondary": "#e9d5ff", "accent": "#c084fc" },
      "premium": true
    },
    {
      "id": "solfeggio-174-pain-relief",
      "name": "174 Hz - Pain & Stress Relief",
      "range": "174 Hz",
      "baseFrequency": 174,
      "binauralFrequency": 0,
      "description": "The foundational Solfeggio tone. This frequency acts as a natural anesthetic, helping to relieve pain and providing your organs with a sense of security and love.",
      "category": BenefitCategory.HEALING,
      "categoryId": "solfeggio",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fcd34d", "secondary": "#fdba74", "accent": "#fde047" },
      "premium": false
    },
    {
      "id": "solfeggio-285-healing",
      "name": "285 Hz - Tissue & Organ Healing",
      "range": "285 Hz",
      "baseFrequency": 285,
      "binauralFrequency": 0,
      "description": "This frequency helps to heal and regenerate tissues by sending a message to the body's cells and organs, encouraging them to return to their original, healthy state.",
      "category": BenefitCategory.HEALING,
      "categoryId": "solfeggio",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fcd34d", "secondary": "#fdba74", "accent": "#fde047" },
      "premium": false
    },
    {
      "id": "solfeggio-396-liberation",
      "name": "396 Hz - Liberation from Fear",
      "range": "396 Hz",
      "baseFrequency": 396,
      "binauralFrequency": 0,
      "description": "Release guilt and fear. This frequency helps to cleanse subconscious blockages, liberating you from negative beliefs and empowering you to achieve your goals.",
      "category": BenefitCategory.HEALING,
      "categoryId": "solfeggio",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fcd34d", "secondary": "#fdba74", "accent": "#fde047" },
      "premium": true
    },
    {
      "id": "solfeggio-417-change",
      "name": "417 Hz - Facilitating Change",
      "range": "417 Hz",
      "baseFrequency": 417,
      "binauralFrequency": 0,
      "description": "Clear traumatic experiences and destructive influences. This frequency cleanses negative energy and facilitates conscious and subconscious change.",
      "category": BenefitCategory.HEALING,
      "categoryId": "solfeggio",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fcd34d", "secondary": "#fdba74", "accent": "#fde047" },
      "premium": true
    },
    {
      "id": "hz-432-universal-tuning",
      "name": "432 Hz - Universal Tuning",
      "range": "432 Hz",
      "baseFrequency": 432,
      "binauralFrequency": 8,
      "description": "Often called 'Verdi's A' or the Universal Tuning, 432 Hz is believed to be mathematically consistent with the universe. It's said to promote a sense of peace and well-being, resonating in harmony with nature.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "solfeggio",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fcd34d", "secondary": "#fdba74", "accent": "#fde047" },
      "premium": false
    },
    {
      "id": "solfeggio-528-repair",
      "name": "528 Hz - Transformation & Miracles",
      "range": "528 Hz",
      "baseFrequency": 528,
      "binauralFrequency": 0,
      "description": "The 'miracle' tone for transformation and DNA repair. This frequency is associated with increased life force, clarity, and spiritual enlightenment.",
      "category": BenefitCategory.HEALING,
      "categoryId": "solfeggio",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fcd34d", "secondary": "#fdba74", "accent": "#fde047" },
      "premium": true
    },
    {
      "id": "solfeggio-639-harmony",
      "name": "639 Hz - Harmonizing Relationships",
      "range": "639 Hz",
      "baseFrequency": 639,
      "binauralFrequency": 0,
      "description": "Connect and harmonize relationships. This frequency fosters love, tolerance, and understanding, enhancing communication with others.",
      "category": BenefitCategory.HEALING,
      "categoryId": "solfeggio",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fcd34d", "secondary": "#fdba74", "accent": "#fde047" },
      "premium": true
    },
    {
      "id": "solfeggio-741-expression",
      "name": "741 Hz - Awakening Intuition",
      "range": "741 Hz",
      "baseFrequency": 741,
      "binauralFrequency": 0,
      "description": "Cleanse the cells from toxins. This frequency aids in self-expression, problem-solving, and purifying the body and mind.",
      "category": BenefitCategory.HEALING,
      "categoryId": "solfeggio",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fcd34d", "secondary": "#fdba74", "accent": "#fde047" },
      "premium": true
    },
    {
      "id": "solfeggio-852-intuition",
      "name": "852 Hz - Returning to Spiritual Order",
      "range": "852 Hz",
      "baseFrequency": 852,
      "binauralFrequency": 0,
      "description": "Awaken intuition and return to spiritual order. This frequency helps you connect with a higher power and your own inner vision.",
      "category": BenefitCategory.HEALING,
      "categoryId": "solfeggio",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fcd34d", "secondary": "#fdba74", "accent": "#fde047" },
      "premium": true
    },
    {
      "id": "solfeggio-963-oneness",
      "name": "963 Hz - Divine Oneness",
      "range": "963 Hz",
      "baseFrequency": 963,
      "binauralFrequency": 0,
      "description": "The frequency of divine oneness. This tone awakens any system to its original, perfect state, connecting you to the unity of all things.",
      "category": BenefitCategory.HEALING,
      "categoryId": "solfeggio",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fcd34d", "secondary": "#fdba74", "accent": "#fde047" },
      "premium": true
    },
    {
      "id": "solfeggio-1782-alchemy",
      "name": "1782 Hz - Soul Star Alchemy",
      "range": "1782 Hz",
      "baseFrequency": 1782,
      "binauralFrequency": 0,
      "description": "The frequency of alchemy and transmutation. Associated with the Soul Star chakra, it is the gateway to higher dimensions, ruling over eternal change, metamorphosis, and the ability to transform matter and energy.",
      "category": BenefitCategory.HEALING,
      "categoryId": "solfeggio",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fcd34d", "secondary": "#fdba74", "accent": "#fde047" },
      "premium": true
    },
    {
      "id": "angel-111",
      "name": "111 Hz - Angelic Connection",
      "range": "111 Hz",
      "baseFrequency": 111,
      "binauralFrequency": 0,
      "description": "The frequency of angelic connection and spiritual guidance. Resonates with the flow of the universe and divine timing.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "angel",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fbcfe8", "secondary": "#fda4af", "accent": "#f9a8d4" },
      "premium": false
    },
    {
      "id": "angel-222",
      "name": "222 Hz - Trust & Harmony",
      "range": "222 Hz",
      "baseFrequency": 222,
      "binauralFrequency": 0,
      "description": "A frequency of trust, balance, and harmony. Encourages you to have faith in your journey and the path you are on.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "angel",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fbcfe8", "secondary": "#fda4af", "accent": "#f9a8d4" },
      "premium": false
    },
    {
      "id": "angel-333",
      "name": "333 Hz - Divine Support",
      "range": "333 Hz",
      "baseFrequency": 333,
      "binauralFrequency": 0,
      "description": "A powerful frequency indicating that your spiritual guides are near, offering love, support, and encouragement.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "angel",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fbcfe8", "secondary": "#fda4af", "accent": "#f9a8d4" },
      "premium": true
    },
    {
      "id": "angel-444",
      "name": "444 Hz - Protection & Shielding",
      "range": "444 Hz",
      "baseFrequency": 444,
      "binauralFrequency": 0,
      "description": "The frequency of protection and spiritual shielding. A sign that you are on the right path and surrounded by divine protection.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "angel",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fbcfe8", "secondary": "#fda4af", "accent": "#f9a8d4" },
      "premium": true
    },
    {
      "id": "angel-555",
      "name": "555 Hz - Major Life Changes",
      "range": "555 Hz",
      "baseFrequency": 555,
      "binauralFrequency": 0,
      "description": "A frequency that signals major life changes are on the horizon. Encourages you to embrace transformation and release the old.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "angel",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fbcfe8", "secondary": "#fda4af", "accent": "#f9a8d4" },
      "premium": true
    },
    {
      "id": "angel-666",
      "name": "666 Hz - Realign Your Thoughts",
      "range": "666 Hz",
      "baseFrequency": 666,
      "binauralFrequency": 0,
      "description": "A call to re-examine and realign your thoughts with your spiritual truth. A frequency for finding balance between the material and spiritual.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "angel",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fbcfe8", "secondary": "#fda4af", "accent": "#f9a8d4" },
      "premium": true
    },
    {
      "id": "angel-777",
      "name": "777 Hz - Luck & Divine Magic",
      "range": "777 Hz",
      "baseFrequency": 777,
      "binauralFrequency": 0,
      "description": "The frequency of luck, miracles, and divine magic. A sign that you are in alignment with the universe and good fortune is on its way.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "angel",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fbcfe8", "secondary": "#fda4af", "accent": "#f9a8d4" },
      "premium": true
    },
    {
      "id": "angel-888",
      "name": "888 Hz - Infinite Abundance",
      "range": "888 Hz",
      "baseFrequency": 888,
      "binauralFrequency": 0,
      "description": "The frequency of infinite abundance and prosperity. Resonates with financial blessings and the flow of universal wealth.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "angel",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fbcfe8", "secondary": "#fda4af", "accent": "#f9a8d4" },
      "premium": true
    },
    {
      "id": "angel-999",
      "name": "999 Hz - Completion",
      "range": "999 Hz",
      "baseFrequency": 999,
      "binauralFrequency": 0,
      "description": "The frequency of completion. Signals the end of a chapter in your life, preparing you for a new beginning.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "angel",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fbcfe8", "secondary": "#fda4af", "accent": "#f9a8d4" },
      "premium": true
    },
    {
      "id": "schumann-resonance",
      "name": "Schumann Resonance",
      "range": "7.83 Hz",
      "baseFrequency": 136.1,
      "binauralFrequency": 7.83,
      "description": "The Earth's natural frequency, or 'heartbeat.' This grounding frequency promotes balance, calm, and a deep connection to the planet.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "celestial",
      "defaultMode": "BINAURAL",
      "availableModes": ["BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" },
      "premium": false
    },
    {
      "id": "celestial-sun",
      "name": "Sun",
      "range": "126.22 Hz",
      "baseFrequency": 126.22,
      "binauralFrequency": 4.1,
      "description": "The frequency of vitality, life force, and the self. The Sun's energy promotes confidence, radiance, and personal power.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "celestial",
      "defaultMode": "BINAURAL",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" },
      "premium": false
    },
    {
      "id": "celestial-moon",
      "name": "Moon",
      "range": "210.42 Hz",
      "baseFrequency": 210.42,
      "binauralFrequency": 4.2,
      "description": "The frequency of emotion, intuition, and the subconscious. The Moon's energy enhances receptivity and psychic awareness.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "celestial",
      "defaultMode": "BINAURAL",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" },
      "premium": true
    },
    {
      "id": "celestial-venus",
      "name": "Venus",
      "range": "221.23 Hz",
      "baseFrequency": 221.23,
      "binauralFrequency": 8.1,
      "description": "The frequency of love, beauty, and harmony. Venus's energy fosters connection, compassion, and appreciation for art and nature.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "celestial",
      "defaultMode": "BINAURAL",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" },
      "premium": true
    },
    {
      "id": "celestial-mars",
      "name": "Mars",
      "range": "144.72 Hz",
      "baseFrequency": 144.72,
      "binauralFrequency": 4,
      "description": "The frequency of action, drive, and courage. Mars's energy boosts motivation, determination, and physical stamina.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "celestial",
      "defaultMode": "BINAURAL",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" },
      "premium": true
    },
    {
      "id": "celestial-jupiter",
      "name": "Jupiter",
      "range": "183.58 Hz",
      "baseFrequency": 183.58,
      "binauralFrequency": 5.9,
      "description": "The frequency of expansion, abundance, and wisdom. Jupiter's energy promotes growth, optimism, and good fortune.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "celestial",
      "defaultMode": "BINAURAL",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" },
      "premium": true
    },
    {
      "id": "celestial-saturn",
      "name": "Saturn",
      "range": "147.85 Hz",
      "baseFrequency": 147.85,
      "binauralFrequency": 4.5,
      "description": "The frequency of discipline, structure, and karma. Saturn's energy supports responsibility, focus, and long-term goals.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "celestial",
      "defaultMode": "BINAURAL",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" },
      "premium": true
    },
    {
      "id": "celestial-uranus",
      "name": "Uranus",
      "range": "207.36 Hz",
      "baseFrequency": 207.36,
      "binauralFrequency": 8.2,
      "description": "The frequency of innovation, rebellion, and sudden change. Uranus's energy sparks breakthroughs and liberation from old patterns.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "celestial",
      "defaultMode": "BINAURAL",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" },
      "premium": true
    },
    {
      "id": "celestial-pluto",
      "name": "Pluto",
      "range": "140.25 Hz",
      "baseFrequency": 140.25,
      "binauralFrequency": 4,
      "description": "The frequency of transformation, death, and rebirth. Pluto's energy supports deep healing and the transmutation of shadow aspects.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "celestial",
      "defaultMode": "BINAURAL",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" },
      "premium": true
    },
    {
      "id": "celestial-mercury",
      "name": "Mercury",
      "range": "141.27 Hz",
      "baseFrequency": 141.27,
      "binauralFrequency": 4.1,
      "description": "The frequency of communication, intellect, and reason. Mercury's energy enhances mental clarity, speeds up thought processes, and facilitates clear expression.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "celestial",
      "defaultMode": "BINAURAL",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" },
      "premium": true
    },
    {
      "id": "celestial-neptune",
      "name": "Neptune",
      "range": "211.44 Hz",
      "baseFrequency": 211.44,
      "binauralFrequency": 5.1,
      "description": "The frequency of intuition, dreams, and the subconscious mind. Neptune's energy dissolves boundaries, enhances creativity, and connects you to the mystical.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "celestial",
      "defaultMode": "BINAURAL",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" },
      "premium": true
    },
    {
      "id": "cosmic-constant-137",
      "name": "137 Hz - The Cosmic Constant",
      "range": "137 Hz",
      "baseFrequency": 137,
      "binauralFrequency": 7,
      "description": "Often called the 'magic number' in physics from the fine-structure constant, 137 Hz is seen as a bridge between matter and spirit. It's associated with higher knowledge, cosmic order, and the fundamental structure of the universe.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "celestial",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" },
      "premium": true
    },
    {
      "id": "om-resonance",
      "name": "OM Resonance",
      "range": "136.1 Hz",
      "baseFrequency": 136.1,
      "binauralFrequency": 0,
      "description": "The 'cosmic drone' of Indian classical music, this frequency aligns with the Earth's orbit around the Sun. It opens the body to stillness, presence, and inner cosmic attunement.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "celestial",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" },
      "premium": true
    },
    {
      "id": "alpha-bridge-8hz",
      "name": "Alpha Bridge (8 Hz)",
      "range": "8 Hz",
      "baseFrequency": 136.1,
      "binauralFrequency": 8,
      "description": "An 8 Hz Alpha wave binaural beat. This frequency bridges intellectual insight and intuitive calm, promoting a state of relaxed awareness.",
      "category": BenefitCategory.COGNITIVE,
      "categoryId": "brainwaves",
      "defaultMode": "BINAURAL",
      "availableModes": ["BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#d8b4fe", "secondary": "#e9d5ff", "accent": "#c084fc" },
      "premium": true
    },
    {
      "id": "golden-mean-phi",
      "name": "Golden Mean (Phi)",
      "range": "161.8 Hz",
      "baseFrequency": 161.8,
      "binauralFrequency": 0,
      "description": "Represents the divine proportion found throughout nature. Introduces coherence and symmetry across physical and subtle bodies.",
      "category": BenefitCategory.SPIRITUAL,
      "categoryId": "celestial",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#fcd34d", "secondary": "#fdba74", "accent": "#fde047" },
      "premium": true
    },
    {
      "id": "mirror-axis-phi",
      "name": "Mirror Axis (Phi)",
      "range": "61.8 Hz Binaural",
      "baseFrequency": 100,
      "binauralFrequency": 61.8,
      "description": "Creates a binaural differential of 61.8 Hz, mirroring the golden ratio in psychoacoustic space to encourage neural cross-hemisphere entrainment.",
      "category": BenefitCategory.COGNITIVE,
      "categoryId": "brainwaves",
      "defaultMode": "BINAURAL",
      "availableModes": ["BINAURAL"],
      "colors": { "primary": "#d8b4fe", "secondary": "#e9d5ff", "accent": "#c084fc" },
      "premium": true
    },
    {
      "id": "harmonic-grounding-81hz",
      "name": "81 Hz - Harmonic Grounding",
      "range": "81 Hz",
      "baseFrequency": 81,
      "binauralFrequency": 0,
      "description": "A deep, resonant tone (a harmonic of the Schumann resonance) for integration and grounding.",
      "category": BenefitCategory.WELLNESS,
      "categoryId": "celestial",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a5b4fc", "secondary": "#93c5fd", "accent": "#a78bfa" },
      "premium": true
    },
    {
      "id": "rife-727",
      "name": "727 Hz - General Vitality",
      "range": "727 Hz",
      "baseFrequency": 727,
      "binauralFrequency": 0,
      "description": "A foundational Rife frequency often used as a general tonic to support overall vitality, energy levels, and systemic balance.",
      "category": BenefitCategory.HEALING,
      "categoryId": "rife",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a7f3d0", "secondary": "#bbf7d0", "accent": "#6ee7b7" },
      "premium": false
    },
    {
      "id": "rife-880",
      "name": "880 Hz - Neural & Allergy Support",
      "range": "880 Hz",
      "baseFrequency": 880,
      "binauralFrequency": 0,
      "description": "A Rife frequency commonly associated with supporting the nervous system and providing energetic relief for allergy symptoms.",
      "category": BenefitCategory.HEALING,
      "categoryId": "rife",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a7f3d0", "secondary": "#bbf7d0", "accent": "#6ee7b7" },
      "premium": false
    },
    {
      "id": "rife-inflammation",
      "name": "Inflammation Support",
      "range": "1.5 Hz + 2720 Hz",
      "baseFrequency": 2720,
      "binauralFrequency": 1.5,
      "description": "A protocol combining Rife frequencies associated with reducing inflammation to support the body's natural healing response.",
      "category": BenefitCategory.HEALING,
      "categoryId": "rife",
      "defaultMode": "BINAURAL",
      "availableModes": ["BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a7f3d0", "secondary": "#bbf7d0", "accent": "#6ee7b7" },
      "premium": true
    },
    {
      "id": "rife-pain-relief",
      "name": "Pain Relief",
      "range": "3040 Hz",
      "baseFrequency": 3040,
      "binauralFrequency": 0,
      "description": "A set of Rife frequencies designed to energetically address pain signals and support the body's natural pain-relief mechanisms.",
      "category": BenefitCategory.HEALING,
      "categoryId": "rife",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a7f3d0", "secondary": "#bbf7d0", "accent": "#6ee7b7" },
      "premium": true
    },
    {
      "id": "rife-eye-health",
      "name": "Vision Restoration",
      "range": "360 Hz",
      "baseFrequency": 360,
      "binauralFrequency": 10,
      "description": "A frequency to support the intricate systems of the eye, promoting clarity and long-term health.",
      "category": BenefitCategory.HEALING,
      "categoryId": "rife",
      "defaultMode": "BINAURAL",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a7f3d0", "secondary": "#bbf7d0", "accent": "#6ee7b7" },
      "premium": true
    },
    {
      "id": "rife-fascia",
      "name": "Fascia Release",
      "range": "480 Hz",
      "baseFrequency": 480,
      "binauralFrequency": 10,
      "description": "A frequency designed to energetically release tension in the body's fascial network, promoting flexibility and relieving stiffness.",
      "category": BenefitCategory.HEALING,
      "categoryId": "rife",
      "defaultMode": "BINAURAL",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a7f3d0", "secondary": "#bbf7d0", "accent": "#6ee7b7" },
      "premium": true
    },
    {
      "id": "rife-633hz-vitality",
      "name": "633 Hz - Radiant Vitality",
      "range": "633 Hz",
      "baseFrequency": 633,
      "binauralFrequency": 0,
      "description": "A unique frequency associated with radiant vitality, energy, and a vibrant bio-field.",
      "category": BenefitCategory.HEALING,
      "categoryId": "rife",
      "defaultMode": "PURE",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a7f3d0", "secondary": "#bbf7d0", "accent": "#6ee7b7" },
      "premium": true
    },
    {
      "id": "rife-metabolism-support",
      "name": "Metabolic Support",
      "range": "1550 Hz",
      "baseFrequency": 1550,
      "binauralFrequency": 10,
      "description": "A frequency used to support a healthy and balanced metabolism, targeting the thyroid and adrenal systems.",
      "category": BenefitCategory.WELLNESS,
      "categoryId": "rife",
      "defaultMode": "BINAURAL",
      "availableModes": ["PURE", "BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a7f3d0", "secondary": "#bbf7d0", "accent": "#6ee7b7" },
      "premium": true
    },
    {
      "id": "rife-lymph-support",
      "name": "Lymphatic Support",
      "range": "15.2 Hz Pulse",
      "baseFrequency": 250,
      "binauralFrequency": 15.2,
      "description": "A low-frequency pulse to support the body's lymphatic system, encouraging gentle detoxification and flow. Delivered with an audible carrier wave.",
      "category": BenefitCategory.WELLNESS,
      "categoryId": "rife",
      "defaultMode": "ISOCHRONIC",
      "availableModes": ["BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a7f3d0", "secondary": "#bbf7d0", "accent": "#6ee7b7" },
      "premium": true
    },
    {
      "id": "rife-parasite-cleanse",
      "name": "Parasite Cleanse",
      "range": "20 Hz + 440 Hz",
      "baseFrequency": 440,
      "binauralFrequency": 20,
      "description": "A protocol utilizing frequencies (20Hz, 440Hz, 727Hz) traditionally associated in Rife research with creating an inhospitable environment for systemic parasites.",
      "category": BenefitCategory.WELLNESS,
      "categoryId": "rife",
      "defaultMode": "BINAURAL",
      "availableModes": ["BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a7f3d0", "secondary": "#bbf7d0", "accent": "#6ee7b7" },
      "premium": true
    },
    {
      "id": "nad-plus-booster",
      "name": "NAD+ Booster",
      "range": "255.5 Hz",
      "baseFrequency": 255.5,
      "binauralFrequency": 1.05,
      "description": "A Rife-inspired frequency designed to support the body's natural production of NAD+, a crucial coenzyme for cellular energy, repair, and longevity.",
      "category": BenefitCategory.WELLNESS,
      "categoryId": "rife",
      "defaultMode": "BINAURAL",
      "availableModes": ["BINAURAL", "ISOCHRONIC"],
      "colors": { "primary": "#a7f3d0", "secondary": "#bbf7d0", "accent": "#6ee7b7" },
      "premium": true
    },
    {
      "id": "noise-white",
      "name": "White Noise",
      "range": "Full Spectrum",
      "baseFrequency": 0,
      "binauralFrequency": 0,
      "description": "A sound containing all frequencies at equal intensity. Excellent for masking distracting background noises to improve focus or sleep.",
      "category": BenefitCategory.AMBIENCE,
      "categoryId": "noise",
      "defaultMode": "AMBIENCE",
      "availableModes": ["AMBIENCE"],
      "colors": { "primary": "#e7e5e4", "secondary": "#d6d3d1", "accent": "#cbd5e1" },
      "premium": false
    },
    {
      "id": "ambient-rain",
      "name": "Gentle Rain",
      "range": "Natural Soundscape",
      "baseFrequency": 0,
      "binauralFrequency": 0,
      "description": "The soothing, rhythmic sound of gentle rain. Perfect for relaxation, meditation, or creating a calm atmosphere for sleep.",
      "category": BenefitCategory.AMBIENCE,
      "categoryId": "noise",
      "defaultMode": "AMBIENCE",
      "availableModes": ["AMBIENCE"],
      "colors": { "primary": "#e7e5e4", "secondary": "#d6d3d1", "accent": "#cbd5e1" },
      "premium": false
    },
    {
      "id": "noise-pink",
      "name": "Pink Noise",
      "range": "Balanced Spectrum",
      "baseFrequency": 0,
      "binauralFrequency": 0,
      "description": "A balanced sound with more power in the lower frequencies. Softer than white noise, it's ideal for sustained focus and relaxation.",
      "category": BenefitCategory.AMBIENCE,
      "categoryId": "noise",
      "defaultMode": "AMBIENCE",
      "availableModes": ["AMBIENCE"],
      "colors": { "primary": "#e7e5e4", "secondary": "#d6d3d1", "accent": "#cbd5e1" },
      "premium": true
    },
    {
      "id": "noise-brown",
      "name": "Brown Noise",
      "range": "Low Spectrum",
      "baseFrequency": 0,
      "binauralFrequency": 0,
      "description": "A deep, rumbling sound with dominant low frequencies. Highly effective for deep relaxation and blocking out intrusive noises.",
      "category": BenefitCategory.AMBIENCE,
      "categoryId": "noise",
      "defaultMode": "AMBIENCE",
      "availableModes": ["AMBIENCE"],
      "colors": { "primary": "#e7e5e4", "secondary": "#d6d3d1", "accent": "#cbd5e1" },
      "premium": true
    },
    {
      "id": "ambient-sea",
      "name": "Ocean Waves",
      "range": "Natural Soundscape",
      "baseFrequency": 0,
      "binauralFrequency": 0,
      "description": "The calming ebb and flow of ocean waves. A deeply relaxing soundscape that connects you to the rhythm of nature.",
      "category": BenefitCategory.AMBIENCE,
      "categoryId": "noise",
      "defaultMode": "AMBIENCE",
      "availableModes": ["AMBIENCE"],
      "colors": { "primary": "#e7e5e4", "secondary": "#d6d3d1", "accent": "#cbd5e1" },
      "premium": true
    }
  ],
  "inspirational_quotes": [
    { "quote": "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.", "author": "Nikola Tesla" },
    { "quote": "The body is held together by sound. The presence of disease indicates that some of the sounds have gone out of tune.", "author": "Deepak Chopra" },
    { "quote": "Everything is energy and that is all there is to it. Match the frequency of the reality you want and you cannot help but get that reality.", "author": "Albert Einstein (attr.)" },
    { "quote": "At the root of all power and motion, there is music and rhythm, the play of patterned frequencies against the matrix of time.", "author": "George Leonard" },
    { "quote": "The sound of the external world is a vibration. The sound of the internal world is also a vibration. The two are inseparably linked.", "author": "Amit Ray" },
    { "quote": "Vibrate the cosmos. The cosmos shall clear the path.", "author": "Yogi Bhajan" },
    { "quote": "The knower of the mystery of sound knows the mystery of the whole universe.", "author": "Hazrat Inayat Khan" },
    { "quote": "Change your frequency, change your life.", "author": "Anonymous" },
    { "quote": "Music is the mediator between the spiritual and the sensual life.", "author": "Ludwig van Beethoven" }
  ]
};

const kabbalahColors = appContentData.categories.kabbalah.colors;
const kabbalahFrequencies: Frequency[] = [
    // Sephirot
    { id: "kabbalah-keter", name: "Keter (Crown – Unity)", range: "972 Hz", baseFrequency: 972, binauralFrequency: 0, description: "The frequency of unity and the unmanifest potential of the Crown.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-chokhmah", name: "Chokhmah (Wisdom – Expansion)", range: "864 Hz", baseFrequency: 864, binauralFrequency: 0, description: "Expansive Sound, associated with dynamic bursts of inspiration.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-binah", name: "Binah (Understanding – Structure)", range: "792 Hz", baseFrequency: 792, binauralFrequency: 0, description: "The frequency of structure and form, where wisdom becomes order.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-chesed", name: "Chesed (Loving-Kindness)", range: "672 Hz", baseFrequency: 672, binauralFrequency: 0, description: "A warm tone representing flow, expansion, and generosity.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-gevurah", name: "Gevurah (Strength, Boundaries)", range: "648 Hz", baseFrequency: 648, binauralFrequency: 0, description: "A sharp, resonant frequency of power and discipline.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-tiferet", name: "Tiferet (Harmony, Beauty)", range: "594 Hz", baseFrequency: 594, binauralFrequency: 0, description: "The balance point and heart center, resonating with harmony.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-netzach", name: "Netzach (Endurance, Flow)", range: "528 Hz", baseFrequency: 528, binauralFrequency: 0, description: "A frequency linked to perseverance, passion, and drive.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-hod", name: "Hod (Splendor, Intellect)", range: "504 Hz", baseFrequency: 504, binauralFrequency: 0, description: "The resonance of precision, analysis, and intellectual clarity.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-yesod", name: "Yesod (Foundation)", range: "444 Hz", baseFrequency: 444, binauralFrequency: 0, description: "The frequency of the subconscious and the foundation of manifestation.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-malkuth", name: "Malkhut (Kingdom – Earth)", range: "396 Hz", baseFrequency: 396, binauralFrequency: 0, description: "A grounding frequency that connects to the physical world.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    // Mother Letters
    { id: "kabbalah-aleph", name: "Aleph (א) - Breath of life", range: "432 Hz", baseFrequency: 432, binauralFrequency: 0, description: "Element: Air/Spirit. Symbolic Meaning: Balance, mediation, life force.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: false },
    { id: "kabbalah-mem", name: "Mem (מ) - Water, renewal", range: "315 Hz", baseFrequency: 315, binauralFrequency: 0, description: "Element: Water. Symbolic Meaning: Flow, womb, gestation, subconscious.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: false },
    { id: "kabbalah-shin", name: "Shin (ש) - Fire, transformation", range: "285 Hz", baseFrequency: 285, binauralFrequency: 0, description: "Element: Fire. Symbolic Meaning: Energy, transformation, purification.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: false },
    // Double Letters
    { id: "kabbalah-bet", name: "Bet (ב) - House, structure", range: "360 Hz", baseFrequency: 360, binauralFrequency: 0, description: "Planet: Saturn. Dual Aspect: Wisdom / Foolishness.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-gimel", name: "Gimel (ג) - Giving, generosity", range: "342 Hz", baseFrequency: 342, binauralFrequency: 0, description: "Planet: Jupiter. Dual Aspect: Wealth / Poverty.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-dalet", name: "Dalet (ד) - Door, opening", range: "324 Hz", baseFrequency: 324, binauralFrequency: 0, description: "Planet: Mars. Dual Aspect: Peace / War.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-kaf", name: "Kaf (כ) - Palm, potential", range: "234 Hz", baseFrequency: 234, binauralFrequency: 0, description: "Planet: Sun. Dual Aspect: Life / Death.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-pe", name: "Pe (פ) - Speech, expression", range: "180 Hz", baseFrequency: 180, binauralFrequency: 0, description: "Planet: Venus. Dual Aspect: Grace / Ugliness.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-resh", name: "Resh (ר) - Head, renewal", range: "153 Hz", baseFrequency: 153, binauralFrequency: 0, description: "Planet: Mercury. Dual Aspect: Dominion / Servitude.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-tav", name: "Tav (ת) - Completion, seal", range: "126 Hz", baseFrequency: 126, binauralFrequency: 0, description: "Planet: Moon. Dual Aspect: Grace / Ugliness.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    // Simple Letters
    { id: "kabbalah-he", name: "He (ה) - Expansion, divine breath", range: "117 Hz", baseFrequency: 117, binauralFrequency: 0, description: "Zodiac: Aries. Faculty: Speech.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-vav", name: "Vav (ו) - Connection, bridge", range: "108 Hz", baseFrequency: 108, binauralFrequency: 0, description: "Zodiac: Taurus. Faculty: Thought.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-zayin", name: "Zayin (ז) - Spark, movement", range: "99 Hz", baseFrequency: 99, binauralFrequency: 0, description: "Zodiac: Gemini. Faculty: Movement.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-chet", name: "Chet (ח) - Life force", range: "90 Hz", baseFrequency: 90, binauralFrequency: 0, description: "Zodiac: Cancer. Faculty: Sight.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-tet", name: "Tet (ט) - Hidden good", range: "81 Hz", baseFrequency: 81, binauralFrequency: 0, description: "Zodiac: Leo. Faculty: Hearing.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-yod", name: "Yod (י) - Point of creation", range: "72 Hz", baseFrequency: 72, binauralFrequency: 0, description: "Zodiac: Virgo. Faculty: Action.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-lamed", name: "Lamed (ל) - Learning, ascent", range: "63 Hz", baseFrequency: 63, binauralFrequency: 0, description: "Zodiac: Libra. Faculty: Desire.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-nun", name: "Nun (נ) - Continuity, humility", range: "54 Hz", baseFrequency: 54, binauralFrequency: 0, description: "Zodiac: Scorpio. Faculty: Smell.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-samekh", name: "Samekh (ס) - Support, circle", range: "45 Hz", baseFrequency: 45, binauralFrequency: 0, description: "Zodiac: Sagittarius. Faculty: Sleep.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-ayin", name: "Ayin (ע) - Vision, seeing", range: "36 Hz", baseFrequency: 36, binauralFrequency: 0, description: "Zodiac: Capricorn. Faculty: Anger.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-tzade", name: "Tsade (צ) - Righteousness", range: "27 Hz", baseFrequency: 27, binauralFrequency: 0, description: "Zodiac: Aquarius. Faculty: Taste/Eating.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true },
    { id: "kabbalah-qof", name: "Qof (ק) - Holiness, cycles", range: "18 Hz", baseFrequency: 18, binauralFrequency: 0, description: "Zodiac: Pisces. Faculty: Laughter.", category: BenefitCategory.SPIRITUAL, categoryId: "kabbalah", defaultMode: "PURE", availableModes: ["PURE"], colors: kabbalahColors, premium: true }
];

const codexFrequencies: Frequency[] = codexData.map(node => ({
    id: `codex-${node.modulus}`,
    name: `${node.note} - ${node.archetype}`,
    range: `${node.frequency.toFixed(2)} Hz`,
    baseFrequency: node.frequency,
    binauralFrequency: 0,
    description: node.tag,
    category: BenefitCategory.SPIRITUAL,
    categoryId: 'codex',
    defaultMode: 'PURE',
    availableModes: ['PURE', 'BINAURAL', 'ISOCHRONIC'],
    colors: { primary: node.color, secondary: node.color, accent: node.color },
    premium: true,
}));


const harmonicElementFrequencies: Frequency[] = harmonicElements.map(element => ({
  id: element.id,
  name: element.name,
  range: `${element.frequency} Hz`,
  baseFrequency: element.frequency,
  binauralFrequency: 0, // Pure tones by default
  description: element.description,
  category: BenefitCategory.WELLNESS, // Or a more specific category if applicable
  categoryId: 'elements',
  defaultMode: 'PURE',
  availableModes: ['PURE', 'BINAURAL', 'ISOCHRONIC'],
  colors: { primary: "#a5f3fc", secondary: "#e0f2fe", accent: "#22d3ee" },
  premium: true, // Assuming elements are premium
  atomicNumber: element.atomicNumber,
  materialUses: element.materialUses,
  biologicalAssociation: element.biologicalAssociation,
  energeticAssociation: element.energeticAssociation,
  sacredGeometry: element.sacredGeometry,
  planetaryAssociation: element.planetaryAssociation,
  zodiacAssociation: element.zodiacAssociation,
  row: element.row,
}));

// Combine all frequencies
appContentData.initial_frequencies.push(
    ...harmonicElementFrequencies,
    ...codexFrequencies,
    ...kabbalahFrequencies,
    ...mirrorAxisFrequencies,
);

// To avoid having duplicate frequencies when content processor is run multiple times
const uniqueFrequencies = Array.from(new Map(appContentData.initial_frequencies.map(item => [item.id, item])).values());
appContentData.initial_frequencies = uniqueFrequencies;

export const processedAppContent = appContentData;