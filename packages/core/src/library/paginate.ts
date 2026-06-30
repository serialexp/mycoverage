export interface PaginateArgs {
  skip: number
  take: number
}

export interface PaginateResult<T> {
  items: T
  nextPage: PaginateArgs | null
  hasMore: boolean
  count: number
}

// Drop-in replacement for Blitz's `paginate`: runs a count and a windowed query,
// and reports whether another page exists. `query` receives the resolved
// skip/take so callers don't have to thread defaults through themselves.
export async function paginate<T>(input: {
  skip?: number
  take?: number
  count: () => Promise<number>
  query: (args: PaginateArgs) => Promise<T>
}): Promise<PaginateResult<T>> {
  const skip = input.skip ?? 0
  const take = input.take ?? 0
  const count = await input.count()
  const items = await input.query({ skip, take })
  const hasMore = skip + take < count
  const nextPage = hasMore ? { take, skip: skip + take } : null
  return { items, nextPage, hasMore, count }
}
