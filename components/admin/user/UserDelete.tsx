'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/react'
import { Trash2 } from 'lucide-react'
import { kunFetchDelete } from '~/utils/kunFetch'
import { kunErrorHandler } from '~/utils/kunErrorHandler'
import { useUserStore } from '~/store/userStore'
import type { AdminUser } from '~/types/api/admin'

interface Props {
  user: AdminUser
}

export const UserDelete = ({ user }: Props) => {
  const currentUser = useUserStore((state) => state.user)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [deleting, setDeleting] = useState(false)
  const handleUpdateUserInfo = async () => {
    setDeleting(true)
    const res = await kunFetchDelete<KunResponse<{}>>('/admin/user', {
      uid: user.id
    })
    kunErrorHandler(res, () => {
      toast.success('永久删除用户成功')
    })
    setDeleting(false)
    onClose()
  }

  return (
    <>
      {currentUser.role === 4 && (
        <Button
          isIconOnly
          size="sm"
          color="danger"
          variant="light"
          onPress={onOpen}
          isDisabled={currentUser.role < 3}
        >
          <Trash2 size={16} />
        </Button>
      )}

      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>删除用户: {user.name}</ModalHeader>
          <ModalBody>
            <div>
              <h2 className="text-2xl text-danger">严重警告</h2>
              <p>您确定要永久删除用户 {user.name} 吗?</p>
              <p>该操作将会抹消用户的一切痕迹, 该操作不可撤销</p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              取消
            </Button>
            <Button
              color="primary"
              isDisabled={deleting}
              isLoading={deleting}
              onPress={handleUpdateUserInfo}
            >
              永久删除用户
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
