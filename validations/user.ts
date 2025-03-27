import { z } from 'zod'
import {
  kunPasswordRegex,
  kunValidMailConfirmCodeRegex
} from '~/utils/validate'

export const avatarSchema = z.object({
  avatar: z.any()
})

export const bioSchema = z.object({
  bio: z
    .string()
    .trim()
    .min(1, { message: '您的签名最少需要 1 个字符' })
    .max(107, { message: '签名不能超过 107 个字符' })
})

export const usernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: '您的用户名最少需要 1 个字符' })
    .max(17, { message: '用户名长度不能超过 17 个字符' })
})

export const resetEmailSchema = z.object({
  email: z.string().email({ message: '请输入合法的邮箱格式' }),
  code: z
    .string()
    .regex(kunValidMailConfirmCodeRegex, { message: '邮箱验证码格式无效' })
})

export const sendResetEmailVerificationCodeSchema = z.object({
  email: z.string().email({ message: '请输入合法的邮箱格式' }),
  captcha: z.string().max(5000)
})

export const passwordSchema = z.object({
  oldPassword: z.string().trim().regex(kunPasswordRegex, {
    message:
      '旧密码格式非法, 密码的长度为 6 到 1007 位，必须包含至少一个英文字符和一个数字，可以选择性的包含 @!#$%^&*()_-+=\\/ 等特殊字符'
  }),
  newPassword: z.string().trim().regex(kunPasswordRegex, {
    message:
      '新密码格式非法, 密码的长度为 6 到 1007 位，必须包含至少一个英文字符和一个数字，可以选择性的包含 @!#$%^&*()_-+=\\/ 等特殊字符'
  })
})

export const updateUserSchema = z.object({
  name: z.string().min(1).max(17).optional(),
  email: z.string().email().max(1007).optional(),
  password: z.string().min(6).max(1007).optional(),
  avatar: z.string().max(233).optional(),
  bio: z.string().max(107).optional()
})

export const getUserInfoSchema = z.object({
  uid: z.coerce.number().min(1).max(9999999),
  page: z.coerce.number().min(1).max(9999999),
  limit: z.coerce.number().min(1).max(20)
})

export const searchUserSchema = z.object({
  query: z.string().min(1).max(20, { message: '非法的用户名长度' })
})
