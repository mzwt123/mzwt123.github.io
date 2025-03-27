import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { kunParsePostBody } from '~/app/api/utils/parseQuery'
import { prisma } from '~/prisma/index'
import { verifyHeaderCookie } from '~/middleware/_verifyHeaderCookie'
import { adminSendEmailSchema } from '~/validations/admin'
import { sendEmailHTML } from './_send'

export const sendBulkEmail = async (
  input: z.infer<typeof adminSendEmailSchema>,
  uid: number
) => {
  const admin = await prisma.user.findUnique({ where: { id: uid } })
  if (!admin) {
    return '未找到该管理员'
  }

  const { templateId, variables } = input

  const users = await prisma.user.findMany({
    where: { enable_email_notice: true },
    select: { email: true }
  })

  const emailList = users.map((user) => user.email)

  const batchSize = 100
  for (let i = 0; i < emailList.length; i += batchSize) {
    const batch = emailList.slice(i, i + batchSize)

    await Promise.all(
      batch.map((email) => sendEmailHTML(templateId, variables, email))
    )
  }

  await prisma.admin_log.create({
    data: {
      type: 'create',
      user_id: uid,
      content: `管理员 ${admin.name} 向全体用户发送了邮件\n\n${JSON.stringify(variables)}`
    }
  })

  return { count: emailList.length }
}

export const POST = async (req: NextRequest) => {
  const input = await kunParsePostBody(req, adminSendEmailSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }
  const payload = await verifyHeaderCookie(req)
  if (!payload) {
    return NextResponse.json('用户未登录')
  }
  if (payload.role < 4) {
    return NextResponse.json('本页面仅超级管理员可访问')
  }

  const response = await sendBulkEmail(input, payload.uid)
  return NextResponse.json(response)
}
