export const format = {
  formatter: new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }),
  format: (nr?: number) => {
    if (!nr) return "?"
    return format.formatter.format(nr)
  },
}
