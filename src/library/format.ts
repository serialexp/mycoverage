export const format = {
	formatter: new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 }),
	format: (nr?: number | bigint, zeroOk = false): string => {
		if (!nr && zeroOk) return "0";
		if (!nr) return "?";
		return format.formatter.format(nr);
	},
};

export const shortFormat = {
	formatter: new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }),
	format: (nr?: number | bigint) => {
		if (!nr) return "?";
		return format.formatter.format(nr);
	},
};
