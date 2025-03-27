'use server'

import { z } from 'zod'
import { safeParseSchema } from '~/utils/actions/safeParseSchema'
import { getTagById } from '~/app/api/tag/get'
import { getPatchByTag } from '~/app/api/tag/galgame/route'
import { getNSFWHeader } from '~/utils/actions/getNSFWHeader'
import { getTagByIdSchema, getPatchByTagSchema } from '~/validations/tag'

export const kunGetTagByIdActions = async (
  params: z.infer<typeof getTagByIdSchema>
) => {
  const input = safeParseSchema(getTagByIdSchema, params)
  if (typeof input === 'string') {
    return input
  }

  const response = await getTagById(input)
  return response
}

export const kunTagGalgameActions = async (
  params: z.infer<typeof getPatchByTagSchema>
) => {
  const input = safeParseSchema(getPatchByTagSchema, params)
  if (typeof input === 'string') {
    return input
  }

  const nsfwEnable = await getNSFWHeader()

  const response = await getPatchByTag(input, nsfwEnable)
  return response
}
