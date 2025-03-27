import { z } from 'zod'
import { prisma } from '~/prisma/index'
import { patchResourceUpdateSchema } from '~/validations/patch'
import type { PatchResource } from '~/types/api/patch'

export const updatePatchResource = async (
  input: z.infer<typeof patchResourceUpdateSchema>,
  uid: number,
  userRole: number
) => {
  const { resourceId, patchId, content, ...resourceData } = input
  const resource = await prisma.patch_resource.findUnique({
    where: { id: resourceId }
  })
  if (!resource) {
    return '未找到该资源'
  }

  const resourceUserUid = resource.user_id
  if (resource.user_id !== uid && userRole < 3) {
    return '您没有权限更改该资源'
  }

  return await prisma.$transaction(async (prisma) => {
    const newResource = await prisma.patch_resource.update({
      where: { id: resourceId, user_id: resourceUserUid },
      data: {
        ...resourceData
      },
      include: {
        user: {
          include: {
            _count: {
              select: { patch_resource: true }
            }
          }
        },
        patch: {
          select: {
            unique_id: true
          }
        }
      }
    })

    const currentPatch = await prisma.patch.findUnique({
      where: { id: patchId },
      select: {
        type: true,
        language: true,
        platform: true
      }
    })
    if (currentPatch) {
      const updatedTypes = [
        ...new Set(currentPatch.type.concat(resourceData.type))
      ]
      const updatedLanguages = [
        ...new Set(currentPatch.language.concat(resourceData.language))
      ]
      const updatedPlatforms = [
        ...new Set(currentPatch.platform.concat(resourceData.platform))
      ]

      await prisma.patch.update({
        where: { id: patchId },
        data: {
          resource_update_time: new Date(),
          type: { set: updatedTypes },
          language: { set: updatedLanguages },
          platform: { set: updatedPlatforms }
        }
      })
    }

    const resource: PatchResource = {
      id: newResource.id,
      name: newResource.name,
      section: newResource.section,
      uniqueId: newResource.patch.unique_id,
      storage: newResource.storage,
      size: newResource.size,
      type: newResource.type,
      language: newResource.language,
      note: newResource.note,
      hash: newResource.hash,
      content: newResource.content,
      code: newResource.code,
      password: newResource.password,
      platform: newResource.platform,
      likeCount: 0,
      isLike: false,
      status: newResource.status,
      userId: newResource.user_id,
      patchId: newResource.patch_id,
      created: String(newResource.created),
      user: {
        id: newResource.user.id,
        name: newResource.user.name,
        avatar: newResource.user.avatar,
        patchCount: newResource.user._count.patch_resource
      }
    }

    return resource
  })
}
