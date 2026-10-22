import { TradeProject } from '../types/offert';

export interface CalculationResult {
  workSubtotal: number;
  materialSubtotal: number;
  subtotalExMoms: number;
  momsAmount: number;
  totalIncMoms: number;
  rotEligibleBase: number;
  rotDeduction: number;
  customerPayable: number;
}

export function calculateProjectTotals(project: TradeProject): CalculationResult {
  const workSubtotal = project.lineItems
    .filter((item) => item.category === 'arbete')
    .reduce((sum, item) => sum + item.volume * item.unitPrice, 0);

  const materialSubtotal = project.lineItems
    .filter((item) => item.category === 'material')
    .reduce((sum, item) => sum + item.volume * item.unitPrice, 0);

  const subtotalExMoms = workSubtotal + materialSubtotal;
  const momsAmount = Math.round(subtotalExMoms * (project.momsPercent / 100));
  const totalIncMoms = subtotalExMoms + momsAmount;

  // In the mockups:
  // Underlag arbete: 31 200 kr
  // ROT 30%: 31 200 * 0.30 = 9 360 kr
  // Arbete & Material: 39 650 kr, Moms 25%: 9 912 kr, Total: 49 562 kr
  // 49 562 kr - 9 360 kr = 40 202 kr!
  const rotEligibleBase = project.lineItems
    .filter((item) => item.category === 'arbete' && item.isRotEligible)
    .reduce((sum, item) => sum + item.volume * item.unitPrice, 0);

  const rotDeduction = project.rotEnabled
    ? Math.round(rotEligibleBase * (project.rotPercent / 100))
    : 0;

  const customerPayable = totalIncMoms - rotDeduction;

  return {
    workSubtotal,
    materialSubtotal,
    subtotalExMoms,
    momsAmount,
    totalIncMoms,
    rotEligibleBase,
    rotDeduction,
    customerPayable,
  };
}

export function formatKr(amount: number): string {
  return amount.toLocaleString('sv-SE') + ' kr';
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
