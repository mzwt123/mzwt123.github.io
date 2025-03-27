import { z } from 'zod'
import { prisma } from '~/prisma/index'
import { patchCommentUpdateSchema } from '~/validations/patch'

export const updateComment = async (
  input: z.infer<typeof patchCommentUpdateSchema>,
  uid: number,
  userRole: number
) => {
  const { commentId, content } = input

  const comment = await prisma.patch_comment.findUnique({
    where: { id: commentId }
  })
  if (!comment) {
    return '未找到该评论'
  }
  const commentUserUid = comment.user_id
  if (comment.user_id !== uid && userRole < 3) {
    return '您没有权限更改该评论'
  }

  await prisma.patch_comment.update({
    where: { id: commentId, user_id: commentUserUid },
    data: {
      content,
      edit: Date.now().toString()
    },
    include: {
      user: true,
      like_by: {
        include: {
          user: true
        }
      }
    }
  })
  return {}
}
