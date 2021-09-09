import db from "../db"

console.log("started")

const execute = async () => {
  const result = await db.$queryRaw`SELECT DISTINCT t1.id
                                    FROM \`Commit\` t1
                                           INNER JOIN \`Commit\` t2
                                    WHERE t1.id < t2.id
                                      AND t1.\`ref\` = t2.\`ref\` LIMIT 100;`

  if (result.length > 0) {
    console.log(
      "deleting",
      result.map((row) => row.id)
    )

    const ids = result.map((row) => row.id).join(",")
    const query = `DELETE FROM \`Commit\` WHERE id IN(${ids});`
    console.log(query)
    const res = await db.$executeRaw(query)

    console.log("deleted", res)
    execute()
  } else {
    process.exit(0)
  }
}

execute()

export {}
