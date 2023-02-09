export function equals(a: number, b: number, tolerance: number): boolean {
  if (Math.abs(b - a) <= tolerance) {
    return true;
  }
  if (Math.abs(a - b) <= tolerance) {
    return true;
  }
  return false;
}
