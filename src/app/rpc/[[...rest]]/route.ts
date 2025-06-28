import { RPCHandler } from '@orpc/server/fetch'
import { appRouter } from '@/server/routes'
import { createContext } from '@/server/lib/context'

const handler = new RPCHandler(appRouter)

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: '/rpc',
    context: await createContext({ context: request })
  })

  return response ?? new Response('Not found', { status: 404 })
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest