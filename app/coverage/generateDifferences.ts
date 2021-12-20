import { FileCoverage } from "db"

export interface Diff {
  base?: FileCoverage
  next?: FileCoverage
}
export type CoverageDifference = Diff[]

export function fixName(name: string) {
  return name.replace(/\./g, "/")
}

export function generateDifferences(base: any, next: any) {
  const changedFiles: CoverageDifference = []

  console.log(base.length, next.length)

  if (base && next) {
    base.forEach((basePackage) => {
      const nextPackage = next.find((p) => p.name === basePackage.name)
      //if (!nextPackage) return
      if (!nextPackage) {
        console.log("missing package", basePackage)
      }

      basePackage.FileCoverage.forEach((baseFile) => {
        const nextFile = nextPackage?.FileCoverage.find((p) => p.name === baseFile.name)
        if (nextFile && baseFile.coveredPercentage !== nextFile.coveredPercentage) {
          changedFiles.push({
            base: { ...baseFile, name: fixName(basePackage.name) + "/" + baseFile.name },
            next: { ...nextFile, name: fixName(nextPackage.name) + "/" + nextFile.name },
          })
        } else if (!nextFile) {
          console.log(
            `cannot find ${baseFile.name} in ${basePackage.name}`,
            nextPackage?.FileCoverage.map((i) => i.name)
          )
          changedFiles.push({
            base: { ...baseFile, name: fixName(basePackage.name) + "/" + baseFile.name },
          })
        }
      })
    })
    //console.log("packagecoverage", base.PackageCoverage)
    next.forEach((nextPackage) => {
      const basePackage = base.find((p) => p.name === nextPackage.name)
      //console.log("base", basePackage?.name, "next", nextPackage.name)

      nextPackage.FileCoverage.forEach((nextFile) => {
        const baseFile = basePackage?.FileCoverage.find((p) => p.name === nextFile.name)
        //console.log("next", nextFile.name, "base", baseFile?.name)
        if (
          baseFile &&
          (baseFile.coveredPercentage !== nextFile.coveredPercentage ||
            baseFile.elements !== nextFile.elements)
        ) {
          changedFiles.push({
            base: { ...baseFile, name: fixName(basePackage?.name) + "/" + baseFile.name },
            next: { ...nextFile, name: fixName(nextPackage.name) + "/" + nextFile.name },
          })
        } else if (!baseFile) {
          nextFile.name = nextPackage.name + "/" + nextFile.name
          changedFiles.push({
            base: undefined,
            next: { ...nextFile, name: fixName(nextPackage.name) + "/" + nextFile.name },
          })
        }
      })
    })
  }

  changedFiles.sort((a, b) => {
    if (a.next && !b.next) {
      return -1
    }
    if (b.next && !a.next) {
      return 1
    }
    if (!a.next || !b.next) return 0
    return a.next.coveredPercentage > b.next.coveredPercentage ? -1 : 1
  })

  return changedFiles
}
