export function slugify(data: string | undefined): string {
  if (data) {
    return data.replace(/[^a-z0-9A-Z]/g, "-").toLowerCase()
  }
  throw new Error("No data to slugify")
}
