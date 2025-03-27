'use server'

import { z } from 'zod'
import { safeParseSchema } from '~/utils/actions/safeParseSchema'
import { getMessageSchema } from '~/validations/message'
import { verifyHeaderCookie } from '~/utils/actions/verifyHeaderCookie'
import { getMessage } from '~/app/api/message/all/route'

export const kunGetActions = async (
  params: z.infer<typeof getMessageSchema>
) => {
  const input = safeParseSchema(getMessageSchema, params)
  if (typeof input === 'string') {
    return input
  }
  const payload = await verifyHeaderCookie()
  if (!payload) {
    return '用户登陆失效'
  }

  const response = await getMessage(input, payload.uid)
  return response
}
