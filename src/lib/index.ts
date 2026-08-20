/** Formats a number as USD currency string. e.g. 299.99 → "$299.99" */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

/** Formats milliseconds remaining into "MM:SS" string. e.g. 61000 → "01:01" */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Returns an axios-friendly error message from an API error response */
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const resp = (error as { response?: { data?: { error?: string } } }).response;
    return resp?.data?.error ?? 'An unexpected error occurred.';
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}

/** Returns an axios error code for machine-readable handling */
export function getErrorCode(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const resp = (error as { response?: { data?: { code?: string } } }).response;
    return resp?.data?.code ?? 'UNKNOWN';
  }
  return 'UNKNOWN';
}