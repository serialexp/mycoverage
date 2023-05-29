import db from "db";

export const getSetting = async (name: string) => {
	const row = await db.setting.findFirst({
		where: {
			name: name,
		},
	});
	return row?.value;
};

export const setSetting = async (name: string, value: string) => {
	return db.setting.upsert({
		where: {
			name: name,
		},
		create: {
			name: name,
			value: value,
		},
		update: {
			value: value,
		},
	});
};
