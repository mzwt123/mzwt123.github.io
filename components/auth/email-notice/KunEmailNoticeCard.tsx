'use client'

import { useState } from 'react'
import { kunMoyuMoe } from '~/config/moyu-moe'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Snippet,
  Alert
} from '@nextui-org/react'
import { kunFetchPost } from '~/utils/kunFetch'
import { Mail } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { kunErrorHandler } from '~/utils/kunErrorHandler'
import toast from 'react-hot-toast'

export const KunEmailNoticeCard = () => {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || kunMoyuMoe.domain.main
  const code = searchParams.get('code') || kunMoyuMoe.domain.main

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const handleDisableEmailNotice = async () => {
    setLoading(true)
    const res = await kunFetchPost<KunResponse<{}>>(
      `/auth/email-notice/disable`,
      { email, validateEmailCode: code }
    )
    setLoading(false)
    kunErrorHandler(res, () => {
      setSuccess(true)
      toast.success('取消邮件订阅成功!')
    })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardBody className="gap-4">
        <Alert
          title="提示"
          description="您可以在收到邮件的七天内取消邮件订阅, 如果取消失败, 请您登陆后在用户设置页面取消邮件订阅"
          color="secondary"
          variant="faded"
        />

        <div className="overflow-auto">
          <Snippet
            disableCopy
            symbol=""
            size="lg"
            className="w-full overflow-auto"
            color="primary"
            copyIcon={<Mail />}
          >
            {email}
          </Snippet>
        </div>
      </CardBody>

      <CardFooter className="justify-center">
        <Button
          size="lg"
          color={success ? 'success' : 'primary'}
          variant="shadow"
          onPress={handleDisableEmailNotice}
          isDisabled={loading || success}
          isLoading={loading}
        >
          {success ? '取消订阅成功' : '取消邮件订阅'}
        </Button>
      </CardFooter>
    </Card>
  )
}
