import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { kunParseGetQuery } from '~/app/api/utils/parseQuery'
import { prisma } from '~/prisma/index'
import { verifyHeaderCookie } from '~/middleware/_verifyHeaderCookie'
import type { FloatingCardUser } from '~/types/api/user'

const uidSchema = z.object({
  uid: z.coerce.number().min(1).max(9999999)
})

export const getUserFloatingProfile = async (
  input: z.infer<typeof uidSchema>,
  currentUserUid: number
) => {
  const data = await prisma.user.findUnique({
    where: { id: input.uid },
    include: {
      _count: {
        select: {
          follower: true,
          patch: true,
          patch_resource: true
        }
      },
      following: true
    }
  })
  if (!data) {
    return '未找到用户'
  }

  const followerUserUid = data.following.map((f) => f.follower_id)

  const user: FloatingCardUser = {
    id: data.id,
    name: data.name,
    avatar: data.avatar,
    bio: data.bio,
    moemoepoint: data.moemoepoint,
    role: data.role,
    isFollow: followerUserUid.includes(currentUserUid),
    _count: data._count
  }

  return user
}

export async function GET(req: NextRequest) {
  const input = kunParseGetQuery(req, uidSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }
  const payload = await verifyHeaderCookie(req)

  const user = await getUserFloatingProfile(input, payload?.uid ?? 0)
  return NextResponse.json(user)
}
