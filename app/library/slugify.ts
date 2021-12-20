export function slugify(data: string) {
  return data.replace(/[^a-z0-9A-Z]/g, "-").toLowerCase()
}
