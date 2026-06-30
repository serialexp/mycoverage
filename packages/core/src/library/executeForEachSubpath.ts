import path from "node:path"

export const executeForEachSubpath = (
  originalPath: string,
  callback: (subPath: string) => void,
) => {
  const parts = originalPath.split("/")
  const currentPath: string[] = []
  for (const part of parts) {
    currentPath.push(part)
    const stringPath = path.join(...currentPath)

    callback(stringPath)
  }
}
