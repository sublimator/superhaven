export function nonNullable<T>(value: T | null | undefined, msg?: string): T {
  if (value === null || value === undefined) {
    throw new Error(`value is null or undefined${msg ? ': ' + msg : ''}`)
  }
  return value
}
