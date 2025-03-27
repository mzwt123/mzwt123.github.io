import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { kunParseGetQuery } from '~/app/api/utils/parseQuery'
import { prisma } from '~/prisma/index'
import { getMessageSchema } from '~/validations/message'
import { verifyHeaderCookie } from '~/middleware/_verifyHeaderCookie'
import type { Message } from '~/types/api/message'

export const getMessage = async (
  input: z.infer<typeof getMessageSchema>,
  uid: number
) => {
  const { type, page, limit } = input
  const offset = (page - 1) * limit

  const where = type
    ? { recipient_id: uid, type }
    : {
        recipient_id: uid
        // type: { in: ['like', 'favorite', 'comment', 'pr'] }
      }

  const [data, total] = await Promise.all([
    prisma.user_message.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { created: 'desc' },
      skip: offset,
      take: limit
    }),
    prisma.user_message.count({ where })
  ])

  const messages: Message[] = data.map((msg) => ({
    id: msg.id,
    patchUniqueId: msg.patch_unique_id,
    type: msg.type,
    content: msg.content,
    status: msg.status,
    created: msg.created,
    sender: msg.sender
  }))

  return { messages, total }
}

export const GET = async (req: NextRequest) => {
  const input = kunParseGetQuery(req, getMessageSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }
  const payload = await verifyHeaderCookie(req)
  if (!payload) {
    return NextResponse.json('用户未登录')
  }

  const response = await getMessage(input, payload.uid)
  return NextResponse.json(response)
}
