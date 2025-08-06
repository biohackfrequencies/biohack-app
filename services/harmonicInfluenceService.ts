import { codexData } from '../data/codex';
import { dailyGuidance } from '../data/dailyGuidance';
import { HarmonicInfluenceMap } from '../types';

/**
 * Sums the digits of a number (e.g., 1968 becomes 1+9+6+8=24).
 * This is a common practice in numerology to get the root vibrational number.
 * @param n The number to sum.
 * @returns The sum of its digits.
 */
function sumDigits(n: number): number {
    return String(n).split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
}

export function calculateHarmonicInfluence(birthYear: number, birthMonth: number, birthDay: number, currentDate: Date = new Date()): HarmonicInfluenceMap | null {
  if (!birthYear || !birthMonth || !birthDay) return null;

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  // Numerology-style calculation: sum the digits of each component.
  // This provides more distinct and meaningful results, fixing previous bugs with duplicate moduli.
  const birthMod = (sumDigits(birthYear) + sumDigits(birthMonth) + sumDigits(birthDay)) % 24;
  const annualMod = (sumDigits(currentYear) + sumDigits(birthMonth) + sumDigits(birthDay)) % 24;
  const monthlyMod = (sumDigits(currentYear) + sumDigits(currentMonth) + sumDigits(birthDay)) % 24;
  const dailyMod = (sumDigits(currentYear) + sumDigits(currentMonth) + sumDigits(currentDay)) % 24;
  
  const result = {
    coreBlueprint: { ...codexData[birthMod], modulus: birthMod, guidance: dailyGuidance[birthMod] },
    yearlyModulation: { ...codexData[annualMod], modulus: annualMod, guidance: dailyGuidance[annualMod] },
    monthlyOverlay: { ...codexData[monthlyMod], modulus: monthlyMod, guidance: dailyGuidance[monthlyMod] },
    dailyResonance: { ...codexData[dailyMod], modulus: dailyMod, guidance: dailyGuidance[dailyMod] },
    suggestedPath: [codexData[birthMod].note, codexData[annualMod].note, codexData[monthlyMod].note, codexData[dailyMod].note],
    suggestedPathModuli: [birthMod, annualMod, monthlyMod, dailyMod]
  };

  return result;
}