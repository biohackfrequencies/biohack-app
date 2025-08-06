import type { CodexNode } from '../types';

// Curated color palette derived from the app's theme for a cohesive look.
const codexPalette = [
    '#C18D52', // brand-gold
    '#D1A378', // lighter gold
    '#96CDB0', // brand-sage
    '#ADC9BB', // lighter sage
    '#a78bfa', // celestial purple
    '#c4b5fd', // lighter purple
    '#fb923c', // brand-orange
    '#fdac72', // lighter orange
    '#60a5fa', // blue
    '#93c5fd', // lighter blue
    '#f87171', // soft red
    '#fca5a5', // lighter red
    '#C18D52', // brand-gold
    '#D1A378', // lighter gold
    '#96CDB0', // brand-sage
    '#ADC9BB', // lighter sage
    '#a78bfa', // celestial purple
    '#c4b5fd', // lighter purple
    '#fb923c', // brand-orange
    '#fdac72', // lighter orange
    '#60a5fa', // blue
    '#93c5fd', // lighter blue
    '#f87171', // soft red
    '#fca5a5', // lighter red
];

export const codexData: CodexNode[] = [
  { modulus: 0, note: "A4", frequency: 432.00, archetype: "Unity, Origin Point", tag: "The starting frequency of pure alignment. Often used to reset and center the mind.", geometry: "Golden Spiral", color: codexPalette[0] },
  { modulus: 1, note: "A#4/Bb4", frequency: 458.72, archetype: "Threshold, Opening", tag: "The point of entry into a new phase or awareness.", geometry: "Gateway", color: codexPalette[1] },
  { modulus: 2, note: "B4", frequency: 486.67, archetype: "Completion, Rest", tag: "A tone of integration and closure before a new cycle.", geometry: "Circle", color: codexPalette[2] },
  { modulus: 3, note: "C5", frequency: 528.00, archetype: "Seed, New Beginning", tag: "The planting of intention; initiation of growth.", geometry: "Seed of Life", color: codexPalette[3] },
  { modulus: 4, note: "C#5/Db5", frequency: 544.29, archetype: "Alignment, Gatekeeper", tag: "The moment of alignment; the passage into a new harmonic field.", geometry: "Vesica Piscis", color: codexPalette[4] },
  { modulus: 5, note: "D5", frequency: 576.00, archetype: "Momentum, Builder", tag: "Driving force that sustains and advances creation.", geometry: "Triangle", color: codexPalette[5] },
  { modulus: 6, note: "D#5/Eb5", frequency: 610.00, archetype: "Reflection, Analysis", tag: "The space to observe, assess, and refine direction.", geometry: "Mirrored Crystal", color: codexPalette[6] },
  { modulus: 7, note: "E5", frequency: 648.00, archetype: "Illumination, Teacher", tag: "The tone of clarity, insight, and the passing of wisdom.", geometry: "Sunburst", color: codexPalette[7] },
  { modulus: 8, note: "F5", frequency: 688.00, archetype: "Compassion, Heart", tag: "Softens the field; opens space for empathy and connection.", geometry: "Heart Torus", color: codexPalette[8] },
  { modulus: 9, note: "F#5/Gb5", frequency: 728.00, archetype: "Dynamic Change, Turning Point", tag: "The frequency of pivotal moments and breakthroughs.", geometry: "Lightning Bolt", color: codexPalette[9] },
  { modulus: 10, note: "G5", frequency: 772.00, archetype: "Structure, Order", tag: "Brings form and stability; the architecture of the cycle.", geometry: "Hexagon", color: codexPalette[10] },
  { modulus: 11, note: "G#5/Ab5", frequency: 816.00, archetype: "Vision, Horizon", tag: "Expands perception and reveals what lies ahead.", geometry: "Infinity Loop", color: codexPalette[11] },
  { modulus: 12, note: "A5", frequency: 864.00, archetype: "Doubling, Expansion", tag: "An octave to Unity; magnifies and amplifies intent.", geometry: "Double Helix", color: codexPalette[12] },
  { modulus: 13, note: "A#5/Bb5", frequency: 915.38, archetype: "Catalyst, Initiator", tag: "The spark that ignites movement.", geometry: "Starburst", color: codexPalette[13] },
  { modulus: 14, note: "B5", frequency: 972.00, archetype: "Integration, Rest", tag: "Absorbs lessons and prepares the next leap.", geometry: "Mandala", color: codexPalette[14] },
  { modulus: 15, note: "C6", frequency: 1024.00, archetype: "New Cycle, Rebirth", tag: "The turning of the wheel; the start of a renewed phase.", geometry: "Ouroboros", color: codexPalette[15] },
  { modulus: 16, note: "C#6/Db6", frequency: 1088.57, archetype: "Precision, Focus", tag: "Sharpening intent; refining the expression.", geometry: "Crystal Lens", color: codexPalette[16] },
  { modulus: 17, note: "D6", frequency: 1152.00, archetype: "Adaptation, Flexibility", tag: "Responding to change with grace and resourcefulness.", geometry: "Flowing Wave", color: codexPalette[17] },
  { modulus: 18, note: "D#6/Eb6", frequency: 1220.00, archetype: "Inner Vision, Depth", tag: "Going inward to source clarity.", geometry: "Eye", color: codexPalette[18] },
  { modulus: 19, note: "E6", frequency: 1296.00, archetype: "Radiance, Expression", tag: "Shining truth outward without fear.", geometry: "Radiant Star", color: codexPalette[19] },
  { modulus: 20, note: "F6", frequency: 1376.00, archetype: "Nurture, Healing", tag: "Care for the self and others; restoration.", geometry: "Lotus", color: codexPalette[20] },
  { modulus: 21, note: "F#6/Gb6", frequency: 1452.00, archetype: "Dynamic Change, Turning Point", tag: "The frequency of pivotal moments and breakthroughs.", geometry: "Tesseract", color: codexPalette[21] },
  { modulus: 22, note: "G6", frequency: 1544.00, archetype: "Universal Law, Structure", tag: "Alignment with foundational principles.", geometry: "Metatron's Cube", color: codexPalette[22] },
  { modulus: 23, note: "G#6/Ab6", frequency: 1632.00, archetype: "Imagination, Beyond", tag: "Breaking limits; accessing the unseen.", geometry: "Nebula", color: codexPalette[23] }
];