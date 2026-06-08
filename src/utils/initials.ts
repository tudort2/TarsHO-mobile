export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(w => /^[A-Za-z]/.test(w));
  if (words.length === 0) return '?';
  const first = words[0][0].toUpperCase();
  const last  = words.length > 1 ? words[words.length - 1][0].toUpperCase() : '';
  return first + last;
}
