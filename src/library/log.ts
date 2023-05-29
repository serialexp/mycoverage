export function log(message: string, ...args: any[]) {
	console.log(JSON.stringify({ message, meta: args }));
}
