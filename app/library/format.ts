export const format = {
  formatter: new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }),
  format: (nr?: number, zeroOk = false) => {
    if (!nr && zeroOk) return nr
    if (!nr) return "?"
    return format.formatter.format(nr)
  },
}

export const shortFormat = {
  formatter: new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }),
  format: (nr?: number) => {
    if (!nr) return "?"
    return format.formatter.format(nr)
  },
}
