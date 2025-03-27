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
import { Edit2, Trash2 } from 'lucide-react'
import { useUserStore } from '~/store/userStore'
import { kunFetchDelete } from '~/utils/kunFetch'
import { EditResourceDialog } from '~/components/patch/resource/edit/EditResourceDialog'
import type { AdminResource } from '~/types/api/admin'

interface Props {
  initialResource: AdminResource
}

// TODO: Reactivity
export const ResourceEdit = ({ initialResource }: Props) => {
  const currentUser = useUserStore((state) => state.user)

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit
  } = useDisclosure()

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete
  } = useDisclosure()
  const [deleting, setDeleting] = useState(false)
  const handleDeleteResource = async () => {
    setDeleting(true)

    const res = await kunFetchDelete<KunResponse<{}>>('/admin/resource', {
      resourceId: initialResource.id
    })
    if (typeof res === 'string') {
      toast.error(res)
    } else {
      toast.success('删除资源链接成功')
    }

    setDeleting(false)
    onCloseDelete()
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          isDisabled={currentUser.role < 3}
          onPress={onOpenEdit}
        >
          <Edit2 size={16} />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          color="danger"
          isDisabled={currentUser.role < 3}
          onPress={onOpenDelete}
        >
          <Trash2 size={16} />
        </Button>
      </div>

      <Modal
        size="3xl"
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        scrollBehavior="outside"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <EditResourceDialog
          onClose={onCloseEdit}
          resource={initialResource}
          onSuccess={onCloseEdit}
          type="admin"
        />
      </Modal>

      <Modal isOpen={isOpenDelete} onClose={onCloseDelete} placement="center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            删除资源链接
          </ModalHeader>
          <ModalBody>
            <p>您确定要删除这条资源链接吗, 该操作不可撤销</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCloseDelete}>
              取消
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteResource}
              disabled={deleting}
              isLoading={deleting}
            >
              删除
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
