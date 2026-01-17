export function sanitizeFileName(name: string) {
  return name
    .trim()
    .replace(/[\\/:*?"<>|]/g, '') // illegal chars
    .replace(/\s+/g, ' ')
    .substring(0, 80);
}
