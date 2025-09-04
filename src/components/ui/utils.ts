// Simple utility function
export function cn(...inputs: any[]): string {
  return inputs.filter(Boolean).join(' ').trim();
}