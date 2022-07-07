export const format = {
  formatter: new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }),
  format: (nr?: number | bigint, zeroOk = false) => {
    if (!nr && zeroOk) return nr
    if (!nr) return "?"
    return format.formatter.format(nr)
  },
}

export const shortFormat = {
  formatter: new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }),
  format: (nr?: number | bigint) => {
    if (!nr) return "?"
    return format.formatter.format(nr)
  },
}
