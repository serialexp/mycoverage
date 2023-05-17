import path from "path"

export const executeForEachSubpath = (
  originalPath: string,
  callback: (subPath: string) => void
) => {
  const parts = originalPath.split("/")
  let currentPath: string[] = []
  parts.forEach((part) => {
    currentPath.push(part)
    const stringPath = path.join(...currentPath)

    callback(stringPath)
  })
}
