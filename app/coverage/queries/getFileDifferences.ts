import { Ctx } from "blitz"
import db, { FileCoverage } from "db"

export default async function getFileDifferences(
  args: { baseTestId?: number; testId?: number },
  { session }: Ctx
) {
  if (!args.baseTestId || !args.testId) return null

  const base = await db.test.findFirst({
    where: { id: args.baseTestId },
    include: {
      PackageCoverage: {
        include: {
          FileCoverage: true,
        },
      },
    },
  })
  console.log("base", base)

  const next = await db.test.findFirst({
    where: { id: args.testId },
    include: {
      PackageCoverage: {
        include: {
          FileCoverage: true,
        },
      },
    },
  })

  const changedFiles: { base?: FileCoverage; next: FileCoverage }[] = []

  if (base && next) {
    base.PackageCoverage.forEach((basePackage) => {
      const nextPackage = next.PackageCoverage.find((p) => p.name === basePackage.name)
      if (!nextPackage) return

      basePackage.FileCoverage.forEach((baseFile) => {
        const nextFile = nextPackage.FileCoverage.find((p) => p.name === baseFile.name)
        if (nextFile && baseFile.coveredPercentage !== nextFile.coveredPercentage) {
          changedFiles.push({
            base: { ...baseFile, name: basePackage.name + "." + baseFile.name },
            next: { ...nextFile, name: nextPackage.name + "." + nextFile.name },
          })
        }
      })
    })
    //console.log("packagecoverage", base.PackageCoverage)
    next.PackageCoverage.forEach((nextPackage) => {
      const basePackage = base.PackageCoverage.find((p) => p.name === nextPackage.name)
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
            base: { ...baseFile, name: basePackage?.name + "." + baseFile.name },
            next: { ...nextFile, name: nextPackage.name + "." + nextFile.name },
          })
        } else if (!baseFile) {
          nextFile.name = nextPackage.name + "." + nextFile.name
          changedFiles.push({
            base: undefined,
            next: { ...nextFile, name: nextPackage.name + "." + nextFile.name },
          })
        }
      })
    })
  }

  changedFiles.sort((a, b) => {
    return a.next.coveredPercentage > b.next.coveredPercentage ? -1 : 1
  })

  return changedFiles
}
