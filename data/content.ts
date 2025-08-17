import type { AppContentData, Frequency, HarmonicElement, CodexNode } from '../types';
import { BenefitCategory } from '../types';
import { harmonicElements } from './elements';
import { codexData } from './codex';

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
      "colors": { "primary": "#e9d5ff", "secondary": "#c4b5fd", "accent": "#a855f7" }
    },
    "guided": {
      "title": "Guided Protocols",
      "description": "Follow sequenced audio protocols that transition through different frequencies to support specific neuro-acoustic goals.",
      "colors": { "primary": "#a7f3d0", "secondary": "#93c5fd", "accent": "#6ee7b7" }
    },
    "brainwaves": {
      "title": "Brainwave Entrainment",
      "description": "Use rhythmic sound patterns designed to encourage shifts in brainwave activity for focus, relaxation, rest, or creative states.",
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
      "id": "earth-resonance-grounding", "title": "Earth Resonance Grounding", "categoryId": "guided", "description": "A deeply grounding protocol that combines the Earth's Schumann Resonance with calming Alpha waves and gentle rain sounds to align your bio-field.", "steps": [ { "title": "Calm & Settle", "description": "Ease into a state of relaxation with gentle alpha waves and the soothing sound of rain.", "duration": 300, "frequencyId": "alpha", "layerFrequencyId": "ambient-rain" }, { "title": "Earth Attunement", "description": "Tune into the planet's heartbeat with the 7.83Hz Schumann Resonance, layered with the magnetic pulse of Iron to deeply anchor your energy and promote core stability.", "duration": 300, "frequencyId": "schumann-resonance", "layerFrequencyId": "iron" }, { "title": "Harmonize & Integrate", "description": "Combine alpha waves and the Schumann Resonance, grounded by the foundational energy of Carbon, to harmonize your energy field and integrate the benefits.", "duration": 300, "frequencyId": "alpha", "layerFrequencyId": "carbon" } ], "colors": { "primary": "#86efac", "secondary": "#bbf7d0", "accent": "#4ade80" }, "premium": false
    },
    {
      "id": "vagus-lymph-reset", "title": "Vagus Nerve & Lymph Flow Reset", "categoryId": "guided", "description": "Stimulate your vagus nerve and support lymphatic flow with this calming protocol designed to activate your body's 'rest and digest' system.", "steps": [ { "title": "Vagal Toning", "description": "Use the Earth's Schumann Resonance, soothed by the calming frequency of Lithium, to gently stimulate the vagus nerve and induce a deep parasympathetic state.", "duration": 300, "frequencyId": "schumann-resonance", "layerFrequencyId": "lithium" }, { "title": "Lymphatic Flow", "description": "A low-frequency pulse, infused with the purifying resonance of Oxygen, to encourage gentle movement and drainage within the lymphatic system.", "duration": 300, "frequencyId": "rife-lymph-support", "layerFrequencyId": "oxygen" }, { "title": "System Reset", "description": "Conclude with deep Delta waves to allow for profound physical rest and integration.", "duration": 300, "frequencyId": "delta" } ], "colors": { "primary": "#cffafe", "secondary": "#a5f3fc", "accent": "#67e8f9" }, "premium": true
    },
    {
      "id": "metabolic-harmony-protocol", "title": "Metabolic Harmony Protocol", "categoryId": "guided", "description": "A session to support a healthy metabolism, reduce stress-related cravings, and encourage a positive mindset towards your wellness goals.", "steps": [ { "title": "Reduce Cortisol", "description": "Begin with calming Alpha waves, enhanced by the restorative frequency of Magnesium, to lower stress—a key factor in metabolic balance.", "duration": 300, "frequencyId": "alpha", "layerFrequencyId": "magnesium" }, { "title": "Metabolic Resonance", "description": "Focus on the 1550 Hz Rife frequency, harmonized with the balancing energy of Chromium, to support thyroid and adrenal function.", "duration": 300, "frequencyId": "rife-metabolism-support", "layerFrequencyId": "chromium" }, { "title": "Mindful Motivation", "description": "Conclude with the 417 Hz Solfeggio frequency to facilitate positive change and reinforce healthy habits.", "duration": 300, "frequencyId": "solfeggio-417-change" } ], "colors": { "primary": "#fed7aa", "secondary": "#fde047", "accent": "#fb923c" }, "premium": true
    },
    {
      "id": "pre-workout-ignition", "title": "Pre-Workout Ignition", "categoryId": "guided", "description": "An energizing protocol using Beta waves and the driving frequency of Mars to prime your mind and body for peak physical performance.", "steps": [ { "title": "Awaken Focus", "description": "Start with Beta waves to bring sharp, focused energy to your mind.", "duration": 300, "frequencyId": "beta" }, { "title": "Ignite Drive", "description": "Introduce the resonant frequency of Mars, layered with the grounding strength of Iron, to boost motivation and physical drive.", "duration": 300, "frequencyId": "celestial-mars", "layerFrequencyId": "iron" } ], "colors": { "primary": "#fecaca", "secondary": "#fca5a5", "accent": "#ef4444" }, "premium": true
    },
    {
      "id": "peak-performance-endurance", "title": "Peak Performance Endurance", "categoryId": "guided", "description": "A session for maintaining focus and energy during your workout. Combines Beta and Gamma waves for sustained concentration and peak performance.", "steps": [ { "title": "Sustained Focus", "description": "Lock in with a steady Beta wave protocol, infused with the vital energy of Oxygen, to maintain alertness and cellular respiration.", "duration": 600, "frequencyId": "beta", "layerFrequencyId": "oxygen" }, { "title": "Peak Performance", "description": "Layer in 40Hz Gamma waves to sharpen cognitive processing and push your limits.", "duration": 600, "frequencyId": "beta", "layerFrequencyId": "gamma-40hz-precise" } ], "colors": { "primary": "#fdba74", "secondary": "#fb923c", "accent": "#f97316" }, "premium": true
    },
    {
      "id": "post-workout-recovery", "title": "Post-Workout Recovery", "categoryId": "guided", "description": "A cool-down protocol to ease muscle soreness, reduce inflammation, and shift your nervous system into a restorative state.", "steps": [ { "title": "Inflammation Reduction", "description": "Use a targeted Rife frequency for inflammation, combined with the foundational energy of Carbon, to begin the recovery process.", "duration": 480, "frequencyId": "rife-inflammation", "layerFrequencyId": "carbon" }, { "title": "Deep Relaxation", "description": "Transition to Theta waves to promote deep physical and mental relaxation, allowing your body to repair.", "duration": 600, "frequencyId": "theta" } ], "colors": { "primary": "#93c5fd", "secondary": "#a5b4fc", "accent": "#60a5fa" }, "premium": true
    },
    {
      "id": "oxygenation-circulation-flow", "title": "Oxygenation & Circulation Flow", "categoryId": "guided", "description": "A session using specific frequencies to support healthy blood flow, oxygenation, and cellular vitality.", "steps": [ { "title": "Circulation Support", "description": "Use the 727 Hz Rife frequency, a general tonic for vitality, layered with the magnetic pulse of Iron to support blood health.", "duration": 450, "frequencyId": "rife-727", "layerFrequencyId": "iron" }, { "title": "Cellular Oxygenation", "description": "Conclude with the vibrant and purifying frequency of Oxygen to enhance cellular respiration and energy.", "duration": 450, "frequencyId": "oxygen" } ], "colors": { "primary": "#fecaca", "secondary": "#fda4af", "accent": "#f87171" }, "premium": true
    },
    {
      "id": "mitochondrial-energy-protocol", "title": "Mitochondrial Energy Protocol", "categoryId": "guided", "description": "A protocol designed to support your cellular powerhouses, the mitochondria, for enhanced energy and vitality.", "steps": [ { "title": "Cellular Resonance", "description": "A broad-spectrum Rife frequency to stimulate general cellular vitality.", "duration": 360, "frequencyId": "rife-880" }, { "title": "Energetic Charge", "description": "Combine the 528 Hz 'Miracle Tone' with the vital spark of Hydrogen to charge your cells with life force.", "duration": 360, "frequencyId": "solfeggio-528-repair", "layerFrequencyId": "hydrogen" } ], "colors": { "primary": "#fde047", "secondary": "#facc15", "accent": "#eab308" }, "premium": true
    },
    {
      "id": "red-light-synergy", "title": "Red Light Therapy Synergy", "categoryId": "guided", "description": "An audio protocol to complement your Red Light Therapy sessions, promoting collagen production and enhancing cellular absorption of light.", "steps": [ { "title": "Cellular Repair", "description": "The 285 Hz Solfeggio frequency supports tissue healing and cellular regeneration.", "duration": 450, "frequencyId": "solfeggio-285-healing" }, { "title": "Structural Support", "description": "The Rife frequency for fascia helps support the skin's underlying structural matrix, enhancing the effects of light therapy.", "duration": 450, "frequencyId": "rife-fascia" } ], "colors": { "primary": "#fca5a5", "secondary": "#f87171", "accent": "#ef4444" }, "premium": true
    },
    {
      "id": "post-procedure-recovery", "title": "Post-Procedure Recovery", "categoryId": "guided", "description": "A gentle session to support the body's natural healing process after cosmetic procedures, helping to reduce inflammation and promote tissue repair.", "steps": [ { "title": "Soothe & Calm", "description": "Begin with a Rife frequency for inflammation, layered with the calming properties of Lithium.", "duration": 600, "frequencyId": "rife-inflammation", "layerFrequencyId": "lithium" }, { "title": "Tissue Repair", "description": "Use the 285 Hz Solfeggio frequency, associated with tissue healing, to support cellular regeneration.", "duration": 600, "frequencyId": "solfeggio-285-healing" } ], "colors": { "primary": "#d8b4fe", "secondary": "#c084fc", "accent": "#a855f7" }, "premium": true
    },
    {
      "id": "cellular-longevity-protocol", "title": "Cellular Longevity Protocol", "categoryId": "guided", "description": "A session to support graceful aging by targeting NAD+ levels and promoting deep cellular restoration during Delta wave states.", "steps": [ { "title": "NAD+ Boost", "description": "A specialized frequency protocol designed to support the body's natural production of NAD+, a key molecule in longevity.", "duration": 720, "frequencyId": "nad-plus-booster" }, { "title": "Deep Restoration", "description": "Enter a deep Delta wave state, the brain's primary state for physical repair and cellular cleansing (autophagy).", "duration": 600, "frequencyId": "delta" } ], "colors": { "primary": "#a5f3fc", "secondary": "#67e8f9", "accent": "#22d3ee" }, "premium": true
    },
    {
      "id": "adhd-focus-protocol", "title": "ADHD Focus Protocol", "categoryId": "guided", "description": "A protocol that starts with calming Theta waves to quiet a busy mind and then transitions to Beta waves to support sustained, focused attention.", "steps": [ { "title": "Calm the Mind", "description": "Begin with Theta waves to reduce mental chatter and create a state of relaxed awareness.", "duration": 600, "frequencyId": "theta" }, { "title": "Engage Focus", "description": "Transition to a steady Beta wave frequency to promote alertness and concentration.", "duration": 900, "frequencyId": "beta" } ], "colors": { "primary": "#e0e7ff", "secondary": "#c7d2fe", "accent": "#818cf8" }, "premium": true
    },
    {
      "id": "neurogenesis-support-protocol", "title": "Neurogenesis Support Protocol", "categoryId": "guided", "description": "A session combining 40Hz Gamma waves and specific Rife frequencies to support brain health and the creation of new neural pathways.", "steps": [ { "title": "Gamma Stimulation", "description": "40Hz Gamma waves to stimulate cognitive function and brain activity.", "duration": 600, "frequencyId": "gamma-40hz-precise" }, { "title": "Neural Support", "description": "A Rife frequency (880 Hz) associated with general neural health.", "duration": 600, "frequencyId": "rife-880" } ], "colors": { "primary": "#c4b5fd", "secondary": "#a78bfa", "accent": "#8b5cf6" }, "premium": true
    },
    {
      "id": "dopamine-release-protocol", "title": "Dopamine Release Protocol", "categoryId": "guided", "description": "A dynamic session using Beta and Gamma waves to naturally support dopamine, enhancing motivation, focus, and mood.", "steps": [ { "title": "Cognitive Priming", "description": "Beta waves combined with the driving frequency of Mars to sharpen focus and build motivation.", "duration": 450, "frequencyId": "beta", "layerFrequencyId": "celestial-mars" }, { "title": "Peak State Activation", "description": "High-frequency Gamma waves layered with the Sun's vital energy to stimulate reward centers and elevate mood.", "duration": 450, "frequencyId": "gamma", "layerFrequencyId": "celestial-sun" } ], "colors": { "primary": "#fde047", "secondary": "#facc15", "accent": "#eab308" }, "premium": true
    },
    {
      "id": "serotonin-boost-protocol", "title": "Serotonin Boost Protocol", "categoryId": "guided", "description": "A calming session using Alpha waves to create a relaxed, positive mental state conducive to natural serotonin production.", "steps": [ { "title": "Release & Prepare", "description": "Begin with 396 Hz to release subconscious stressors, set to the backdrop of gentle rain.", "duration": 600, "frequencyId": "solfeggio-396-liberation", "layerFrequencyId": "ambient-rain" }, { "title": "Cultivate Calm", "description": "A 10 Hz Alpha wave, layered with Lithium's balancing frequency, induces a state of serene positivity.", "duration": 600, "frequencyId": "alpha", "layerFrequencyId": "lithium" } ], "colors": { "primary": "#93c5fd", "secondary": "#60a5fa", "accent": "#3b82f6" }, "premium": true
    },
    {
      "id": "oxytocin-love-protocol", "title": "Oxytocin 'Love' Protocol", "categoryId": "guided", "description": "A heart-centered session using frequencies for harmony and connection to cultivate feelings of empathy and love.", "steps": [ { "title": "Opening the Heart", "description": "Gentle Alpha waves layered with the frequency of Venus create a receptive state of peace and harmony.", "duration": 450, "frequencyId": "alpha", "layerFrequencyId": "celestial-venus" }, { "title": "Deepening Connection", "description": "The 639 Hz frequency, grounded by the Earth's Schumann Resonance, fosters profound connection and compassion.", "duration": 450, "frequencyId": "solfeggio-639-harmony", "layerFrequencyId": "schumann-resonance" } ], "colors": { "primary": "#f9a8d4", "secondary": "#f472b6", "accent": "#ec4899" }, "premium": true
    },
    {
      "id": "endorphin-bliss-protocol", "title": "Endorphin Bliss Protocol", "categoryId": "guided", "description": "A session that uses Alpha-to-Theta transitions to mimic states of deep relaxation and meditation, which can support the natural release of endorphins.", "steps": [ { "title": "Alpha-Theta Bridge", "description": "Gently guide your mind from a relaxed Alpha state to a deeper, meditative Theta state.", "duration": 900, "frequencyId": "theta" } ], "colors": { "primary": "#a7f3d0", "secondary": "#6ee7b7", "accent": "#34d399" }, "premium": true
    },
    {
      "id": "mindful-start", "title": "Mindful Start", "categoryId": "guided", "description": "Begin your day with this session combining gentle Alpha waves and Solfeggio frequencies to clear your mind and set a positive intention.", "steps": [ { "title": "Release & Center", "description": "396 Hz to release fear and subconscious blockages.", "duration": 300, "frequencyId": "solfeggio-396-liberation" }, { "title": "Calm Awareness", "description": "Alpha waves to foster a state of relaxed, present-moment awareness.", "duration": 300, "frequencyId": "alpha" } ], "colors": { "primary": "#fde047", "secondary": "#fcd34d", "accent": "#facc15" }, "premium": true
    },
    {
      "id": "deep-relaxation", "title": "Deep Relaxation", "categoryId": "guided", "description": "Unwind completely with this journey from Alpha to Theta brainwaves, perfect for melting away stress and anxiety after a long day.", "steps": [ { "title": "Stress Release", "description": "Start with Alpha waves to calm the nervous system.", "duration": 600, "frequencyId": "alpha" }, { "title": "Enter Deep Calm", "description": "Transition to Theta waves for profound mental and physical relaxation.", "duration": 600, "frequencyId": "theta" } ], "colors": { "primary": "#c7d2fe", "secondary": "#a5b4fc", "accent": "#818cf8" }, "premium": true
    },
    {
      "id": "yoga-savasana-relaxation", "title": "Yoga & Savasana Relaxation", "categoryId": "guided", "description": "A session to enhance your Savasana or cool-down. Deep Theta waves help integrate your practice and guide you into a state of profound rest.", "steps": [ { "title": "Deep Integration", "description": "Theta waves to deepen relaxation and help the body absorb the benefits of your yoga practice.", "duration": 900, "frequencyId": "theta" } ], "colors": { "primary": "#d8b4fe", "secondary": "#c084fc", "accent": "#a855f7" }, "premium": true
    },
    {
      "id": "ultimate-deep-sleep", "title": "Ultimate Deep Sleep", "categoryId": "guided", "description": "This protocol guides you from a relaxed Theta state into deep, restorative Delta sleep, enhanced by the grounding frequency of Brown Noise.", "steps": [ { "title": "Mind Quieting", "description": "Theta waves to slow down brain activity and prepare for sleep.", "duration": 900, "frequencyId": "theta", "layerFrequencyId": "noise-brown" }, { "title": "Restorative Sleep", "description": "Deep Delta waves to promote physical repair and dreamless sleep.", "duration": 900, "frequencyId": "delta", "layerFrequencyId": "noise-brown" } ], "colors": { "primary": "#a5b4fc", "secondary": "#818cf8", "accent": "#6366f1" }, "premium": true
    },
    {
      "id": "focus-10-protocol", "title": "Focus 10 Protocol", "categoryId": "guided", "description": "A protocol inspired by Hemi-Sync to achieve the 'mind awake, body asleep' state, ideal for deep meditation and inner exploration.", "steps": [ { "title": "Relaxation", "description": "Transition from Beta to Alpha to calm the body.", "duration": 300, "frequencyId": "alpha" }, { "title": "Deepening", "description": "Move into Theta for profound physical relaxation.", "duration": 300, "frequencyId": "theta" }, { "title": "Focus 10 State", "description": "A specific combination of frequencies to keep the mind alert while the body is in a state of deep stillness.", "duration": 600, "frequencyId": "beta", "layerFrequencyId": "theta" } ], "colors": { "primary": "#e9d5ff", "secondary": "#c4b5fd", "accent": "#d8b4fe" }, "premium": false
    },
    {
      "id": "focus-12-protocol", "title": "Focus 12 Protocol", "categoryId": "guided", "description": "A journey to Focus 12, a state of expanded awareness beyond the five physical senses, used for creative problem solving and insight.", "steps": [ { "title": "Enter Focus 10", "description": "Establish the 'mind awake, body asleep' foundation.", "duration": 600, "frequencyId": "beta", "layerFrequencyId": "theta" }, { "title": "Expanded Awareness", "description": "Introduce specific frequencies to broaden perception and access deeper levels of consciousness.", "duration": 900, "frequencyId": "gamma", "layerFrequencyId": "alpha" } ], "colors": { "primary": "#c4b5fd", "secondary": "#a78bfa", "accent": "#a855f7" }, "premium": true
    },
    {
      "id": "pineal-gland-activation", "title": "Pineal Gland Activation", "categoryId": "guided", "description": "A session using specific Solfeggio frequencies associated with activating the 'third eye' for enhanced intuition and spiritual connection.", "steps": [ { "title": "Intuitive Gateway", "description": "Theta waves, paired with the Moon's frequency, open the gateway to deep, intuitive states of mind.", "duration": 450, "frequencyId": "theta", "layerFrequencyId": "celestial-moon" }, { "title": "Oneness Attunement", "description": "The 963 Hz frequency, layered with 852 Hz, works to activate the pineal gland and connect you to unity consciousness.", "duration": 450, "frequencyId": "solfeggio-963-oneness", "layerFrequencyId": "solfeggio-852-intuition" } ], "colors": { "primary": "#d8b4fe", "secondary": "#c084fc", "accent": "#a855f7" }, "premium": true
    },
    {
      "id": "vision-restoration", "title": "Vision Restoration Protocol", "categoryId": "guided", "description": "A protocol using specific Rife frequencies associated with eye health to support and maintain healthy vision.", "steps": [ { "title": "Relax & Oxygenate", "description": "Calming Alpha waves reduce eye strain while the frequency of Oxygen supports cellular health in the visual system.", "duration": 600, "frequencyId": "alpha", "layerFrequencyId": "oxygen" }, { "title": "Targeted Support", "description": "A targeted Rife frequency for eye wellness, layered with Selenium's protective resonance, to support visual acuity.", "duration": 600, "frequencyId": "rife-eye-health", "layerFrequencyId": "selenium" } ], "colors": { "primary": "#93c5fd", "secondary": "#60a5fa", "accent": "#3b82f6" }, "premium": true
    },
    {
      "id": "lucid-dream-induction", "title": "Lucid Dream Induction", "categoryId": "guided", "description": "A session combining Theta and Gamma waves to create the ideal brain state for lucid dreaming—deeply relaxed yet consciously aware.", "steps": [ { "title": "Relax into Theta", "description": "Enter the dream-like Theta state.", "duration": 900, "frequencyId": "theta" }, { "title": "Awaken Awareness", "description": "Introduce Gamma waves to promote conscious awareness within the dream state.", "duration": 600, "frequencyId": "gamma", "layerFrequencyId": "theta" } ], "colors": { "primary": "#c4b5fd", "secondary": "#a78bfa", "accent": "#8b5cf6" }, "premium": true
    },
    {
      "id": "chakra-balancing-journey", "title": "Chakra Balancing Journey", "categoryId": "guided", "description": "A journey through the seven primary Solfeggio frequencies, each corresponding to a major energy center (chakra) for a full-system energetic tune-up.", "steps": [ { "title": "Root Chakra (396 Hz)", "description": "Grounding and releasing fear.", "duration": 300, "frequencyId": "solfeggio-396-liberation" }, { "title": "Sacral Chakra (417 Hz)", "description": "Facilitating positive change.", "duration": 300, "frequencyId": "solfeggio-417-change" }, { "title": "Solar Plexus (528 Hz)", "description": "Transformation and empowerment.", "duration": 300, "frequencyId": "solfeggio-528-repair" }, { "title": "Heart Chakra (639 Hz)", "description": "Connection and love.", "duration": 300, "frequencyId": "solfeggio-639-harmony" }, { "title": "Throat Chakra (741 Hz)", "description": "Expression and truth.", "duration": 300, "frequencyId": "solfeggio-741-expression" }, { "title": "Third Eye Chakra (852 Hz)", "description": "Intuition and inner vision.", "duration": 300, "frequencyId": "solfeggio-852-intuition" }, { "title": "Crown Chakra (963 Hz)", "description": "Spiritual oneness.", "duration": 300, "frequencyId": "solfeggio-963-oneness" } ], "colors": { "primary": "#fde047", "secondary": "#facc15", "accent": "#eab308" }, "premium": true
    },
    {
      "id": "abundance-matrix-attunement", "title": "Abundance Matrix Attunement", "categoryId": "guided", "description": "A session using the 777 Hz 'luck' frequency combined with the magnetic properties of Gold to align your energy field with prosperity and abundance.", "steps": [ { "title": "Attune to Abundance", "description": "777 Hz layered with the frequency of Gold.", "duration": 900, "frequencyId": "angel-777", "layerFrequencyId": "gold" } ], "colors": { "primary": "#fcd34d", "secondary": "#fbbf24", "accent": "#f59e0b" }, "premium": true
    },
    {
      "id": "astral-projection-gateway", "title": "Astral Projection Gateway", "categoryId": "guided", "description": "An advanced protocol that guides you to the Focus 12 state of expanded awareness, designed to create the ideal conditions for out-of-body experiences.", "steps": [ { "title": "Body Asleep", "description": "Deep Theta relaxation to quiet the physical body.", "duration": 900, "frequencyId": "theta" }, { "title": "Mind Awake & Expanded", "description": "A blend of frequencies to enter Focus 12.", "duration": 900, "frequencyId": "gamma", "layerFrequencyId": "alpha" } ], "colors": { "primary": "#e9d5ff", "secondary": "#c4b5fd", "accent": "#d8b4fe" }, "premium": true
    },
    {
      "id": "heart-coherence-journey", "title": "Heart Coherence Journey", "categoryId": "guided", "description": "A journey combining the 639 Hz 'love' frequency with Alpha waves and the Earth's Schumann resonance to bring your heart and brain into a state of harmonious coherence.", "steps": [ { "title": "Heart-Brain Sync", "description": "Alpha waves to bridge heart and mind.", "duration": 450, "frequencyId": "alpha", "layerFrequencyId": "solfeggio-639-harmony" }, { "title": "Ground in Love", "description": "Combine 639 Hz with the Schumann Resonance.", "duration": 450, "frequencyId": "solfeggio-639-harmony", "layerFrequencyId": "schumann-resonance" } ], "colors": { "primary": "#f9a8d4", "secondary": "#f472b6", "accent": "#ec4899" }, "premium": true
    },
    {
      "id": "systemic-parasite-cleanse", "title": "Systemic Parasite Cleanse", "categoryId": "rife", "description": "A Rife protocol using frequencies traditionally associated with addressing systemic parasites to support a healthy internal environment.", "steps": [ { "title": "Parasite Frequency Protocol", "description": "A sequence of Rife frequencies for cleansing.", "duration": 1200, "frequencyId": "rife-parasite-cleanse" } ], "colors": { "primary": "#a7f3d0", "secondary": "#bbf7d0", "accent": "#6ee7b7" }, "premium": true
    },
    {
      "id": "beauty-facelift",
      "title": "Acoustic Face Lift",
      "categoryId": "guided",
      "description": "A session using Solfeggio, Alpha, and Delta waves to support facial muscle tone and skin vitality.",
      "steps": [
        { "title": "Cellular Preparation", "description": "Begin with the 528 Hz 'Miracle Tone', layered with calming Alpha waves, to prepare skin cells for rejuvenation by reducing stress.", "duration": 300, "frequencyId": "solfeggio-528-repair", "layerFrequencyId": "alpha" },
        { "title": "Harmonize & Tone", "description": "Introduce 639 Hz to promote intercellular harmony, layered with Delta waves to encourage deep cellular regeneration and toning.", "duration": 300, "frequencyId": "solfeggio-639-harmony", "layerFrequencyId": "delta" }
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
        { "title": "Deep Relaxation & Priming", "description": "Start with deep Delta waves, layered with the 285 Hz tissue healing frequency, to put the body in an optimal restorative state.", "duration": 360, "frequencyId": "delta", "layerFrequencyId": "solfeggio-285-healing" },
        { "title": "Structural Resonance", "description": "Introduce the Rife frequency for fascia, layered with Carbon's foundational energy, to support the skin's structural matrix.", "duration": 360, "frequencyId": "rife-fascia", "layerFrequencyId": "carbon" }
      ],
      "colors": { "primary": "#fda4af", "secondary": "#fca5a5", "accent": "#f9a8d4" },
      "premium": false
    },
    {
      "id": "beauty-hair-growth",
      "title": "Hair Growth & Restoration",
      "categoryId": "guided",
      "description": "A session with Rife and Solfeggio frequencies to support scalp circulation and healthy hair follicle function.",
      "steps": [
        { "title": "Scalp Circulation Support", "description": "Use a Rife frequency for vitality (727 Hz), layered with Iron's magnetic energy, to support healthy blood flow to the scalp.", "duration": 300, "frequencyId": "rife-727", "layerFrequencyId": "iron" },
        { "title": "Follicle Energizing", "description": "The 528 Hz 'Miracle Tone', paired with Oxygen's purifying resonance, supports cellular repair and energizes hair follicles.", "duration": 300, "frequencyId": "solfeggio-528-repair", "layerFrequencyId": "oxygen" }
      ],
      "colors": { "primary": "#fda4af", "secondary": "#fca5a5", "accent": "#f9a8d4" },
      "premium": true
    }
  ],
  "featured_candidates": [ "vagus-lymph-reset", "metabolic-harmony-protocol", "adhd-focus-protocol", "ultimate-deep-sleep", "chakra-balancing-journey", "solfeggio-528-repair", "beta", "gamma-40hz-precise", "solfeggio-1782-alchemy" ],
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

const elementFrequencies: Frequency[] = harmonicElements.map((el: HarmonicElement) => ({
    id: el.id,
    name: el.name,
    range: `${el.frequency} Hz`,
    baseFrequency: el.frequency,
    binauralFrequency: 4 + (el.row - 1),
    description: el.description,
    category: BenefitCategory.SPIRITUAL,
    categoryId: 'elements',
    defaultMode: 'PURE',
    availableModes: ['PURE', 'BINAURAL', 'ISOCHRONIC'],
    colors: appContentData.categories.elements.colors,
    premium: false,
    // Pass through the enriched data
    atomicNumber: el.atomicNumber,
    materialUses: el.materialUses,
    biologicalAssociation: el.biologicalAssociation,
    energeticAssociation: el.energeticAssociation,
    sacredGeometry: el.sacredGeometry,
    planetaryAssociation: el.planetaryAssociation,
    zodiacAssociation: el.zodiacAssociation,
    row: el.row,
}));

const codexFrequencies: Frequency[] = codexData.map((node: CodexNode) => ({
    id: `codex-${node.modulus}`,
    name: `${node.note} (${node.archetype})`,
    range: `${node.frequency.toFixed(2)} Hz`,
    baseFrequency: node.frequency,
    binauralFrequency: 0,
    description: node.tag,
    category: BenefitCategory.SPIRITUAL,
    categoryId: 'codex',
    defaultMode: 'PURE',
    availableModes: ['PURE', 'BINAURAL', 'ISOCHRONIC'],
    colors: appContentData.categories.codex.colors,
    premium: true,
}));

export const processedAppContent: AppContentData = {
    ...appContentData,
    initial_frequencies: [...appContentData.initial_frequencies, ...elementFrequencies, ...codexFrequencies],
};