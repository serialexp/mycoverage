export function log(message: string, ...args: unknown[]) {
  console.log(
    JSON.stringify({
      message,
      meta: args.map((arg) => {
        if (arg instanceof Error) {
          return {
            name: arg.name,
            message: arg.message,
            stack: arg.stack,
          }
        }
        return arg
      }),
    }),
  )
}
