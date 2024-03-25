export const format = {
	formatter: new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }),
	format: (nr?: number | bigint, zeroOk = false): string => {
		if (!nr && zeroOk) return "0"
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

export const timeAgo = (date: Date): string => {
	const now = new Date()
	const diff = now.getTime() - date.getTime()
	if (diff < 1000 * 60) return "just now"
	if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m ago`
	if (diff < 1000 * 60 * 60 * 24)
		return `${Math.floor(diff / (1000 * 60 * 60))}h ago`
	if (diff < 1000 * 60 * 60 * 24 * 7)
		return `${Math.floor(diff / (1000 * 60 * 60 * 24))}d ago`
	return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 7))}w ago`
}
