import { z } from 'zod'
import { deleteFileFromS3 } from '~/lib/s3'
import { prisma } from '~/prisma/index'

const resourceIdSchema = z.object({
  resourceId: z.coerce
    .number({ message: '资源 ID 必须为数字' })
    .min(1)
    .max(9999999)
})

export const deleteResource = async (
  input: z.infer<typeof resourceIdSchema>,
  uid: number,
  userRole: number
) => {
  const patchResource = await prisma.patch_resource.findUnique({
    where: { id: input.resourceId }
  })
  if (!patchResource) {
    return '未找到对应的资源'
  }

  const resourceUserUid = patchResource.user_id
  if (patchResource.user_id !== uid && userRole < 3) {
    return '您没有权限删除该资源'
  }

  if (patchResource.storage === 's3') {
    const fileName = patchResource.content.split('/').pop()
    const s3Key = `patch/${patchResource.patch_id}/${patchResource.hash}/${fileName}`
    await deleteFileFromS3(s3Key)
  }

  return await prisma.$transaction(async (prisma) => {
    await prisma.user.update({
      where: { id: resourceUserUid },
      data: { moemoepoint: { increment: -3 } }
    })

    await prisma.patch_resource.delete({
      where: { id: input.resourceId }
    })
    return {}
  })
}
