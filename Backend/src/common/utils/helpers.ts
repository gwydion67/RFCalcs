// Helper function to validate number is finite and within safe range
export function validateNumber(value: number, name: string): number {
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid ${name}: Result is not a finite number`);
  }
  // Check if number is within safe integer range
  if (Math.abs(value) > Number.MAX_SAFE_INTEGER) {
    throw new Error(`${name} exceeds safe number range`);
  }
  return value;
}
