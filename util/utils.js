export function formatCurrency(cents) {
  const dollars = Math.round(cents) / 100;
  return `${dollars.toFixed(2)}`;
}
