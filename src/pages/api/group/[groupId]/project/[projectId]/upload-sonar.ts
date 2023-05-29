import handler from "./upload-sonarqube";

export default handler;

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "25mb",
		},
	},
};
