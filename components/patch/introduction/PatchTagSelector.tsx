'use client'

import { useEffect, useReducer, useState } from 'react'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Chip } from '@nextui-org/chip'
import { Checkbox } from '@nextui-org/checkbox'
import { ScrollShadow } from '@nextui-org/scroll-shadow'
import { Link } from '@nextui-org/link'
import { Tag } from 'lucide-react'
import { useMounted } from '~/hooks/useMounted'
import { kunFetchGet, kunFetchPost, kunFetchPut } from '~/utils/kunFetch'
import { useDebounce } from 'use-debounce'
import { SearchTags } from './SearchTag'
import { KunLoading } from '~/components/kun/Loading'
import { useRouter } from 'next-nprogress-bar'
import type { Tag as TagType } from '~/types/api/tag'
import toast from 'react-hot-toast'

interface Props {
  patchId: number
  initialTags: TagType[]
  onTagChange: (tags: TagType[]) => void
}

type State = {
  selectedTags: number[]
  removedTags: number[]
  existingTags: number[]
  isLoading: boolean
}

type Action =
  | { type: 'SET_SELECTED_TAGS'; payload: number[] }
  | { type: 'SET_REMOVED_TAGS'; payload: number[] }
  | { type: 'SET_EXISTING_TAGS'; payload: number[] }
  | { type: 'SET_LOADING'; payload: boolean }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_SELECTED_TAGS':
      return { ...state, selectedTags: action.payload }
    case 'SET_REMOVED_TAGS':
      return { ...state, removedTags: action.payload }
    case 'SET_EXISTING_TAGS':
      return { ...state, existingTags: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

export const PatchTagSelector = ({
  patchId,
  initialTags,
  onTagChange
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [tags, setTags] = useState<TagType[]>([])
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 500)
  const [searching, setSearching] = useState(false)
  const isMounted = useMounted()

  useEffect(() => {
    if (isOpen) {
      const commonIds = initialTags.map((tag) => tag.id)
      dispatch({ type: 'SET_EXISTING_TAGS', payload: commonIds })
      dispatch({ type: 'SET_SELECTED_TAGS', payload: [] })
      dispatch({ type: 'SET_REMOVED_TAGS', payload: [] })
    }
  }, [isOpen, initialTags])

  const [state, dispatch] = useReducer(reducer, {
    selectedTags: [],
    removedTags: [],
    existingTags: [],
    isLoading: false
  })

  const fetchTags = async () => {
    if (!isOpen) {
      return
    }

    dispatch({ type: 'SET_LOADING', payload: true })

    const response = await kunFetchGet<{
      tags: TagType[]
      total: number
    }>('/tag/all', { page: 1, limit: 100 })
    setTags(response.tags)

    const commonIds = initialTags
      .map((tag) => tag.id)
      .filter((id) => response.tags.some((tag) => tag.id === id))
    dispatch({ type: 'SET_EXISTING_TAGS', payload: commonIds })
    dispatch({ type: 'SET_LOADING', payload: false })
  }

  useEffect(() => {
    if (isMounted && isOpen) {
      fetchTags()
    }
  }, [isMounted, isOpen])

  useEffect(() => {
    if (debouncedQuery) {
      handleSearch()
    } else {
      fetchTags()
    }
  }, [debouncedQuery])

  const handleSearch = async () => {
    if (!query.trim()) return

    setSearching(true)
    const response = await kunFetchPost<TagType[]>('/tag/search', {
      query: query.split(' ').filter(Boolean)
    })
    setTags(response)
    setSearching(false)
  }

  const toggleTagSelection = (tagId: number, isSelected: boolean) => {
    if (isSelected) {
      if (state.existingTags.includes(tagId)) {
        dispatch({
          type: 'SET_REMOVED_TAGS',
          payload: state.removedTags.filter((id) => id !== tagId)
        })
      } else {
        dispatch({
          type: 'SET_SELECTED_TAGS',
          payload: [...state.selectedTags, tagId]
        })
      }
    } else {
      if (state.existingTags.includes(tagId)) {
        dispatch({
          type: 'SET_REMOVED_TAGS',
          payload: [...state.removedTags, tagId]
        })
      } else {
        dispatch({
          type: 'SET_SELECTED_TAGS',
          payload: state.selectedTags.filter((id) => id !== tagId)
        })
      }
    }
  }

  const router = useRouter()
  const handleSubmit = async () => {
    if (!state.selectedTags.length && !state.removedTags.length) return

    dispatch({ type: 'SET_LOADING', payload: true })

    if (state.removedTags.length) {
      await kunFetchPut<{}>('/patch/introduction/tag', {
        patchId,
        tagId: state.removedTags
      })
    }

    if (state.selectedTags.length) {
      await kunFetchPost<{}>('/patch/introduction/tag', {
        patchId,
        tagId: state.selectedTags
      })
    }

    const updatedTags = initialTags
      .filter((tag) => !state.removedTags.includes(tag.id))
      .concat(tags.filter((tag) => state.selectedTags.includes(tag.id)))
    onTagChange(updatedTags)
    router.refresh()
    toast.success('更改标签成功')

    dispatch({ type: 'SET_SELECTED_TAGS', payload: [] })
    dispatch({ type: 'SET_REMOVED_TAGS', payload: [] })
    onClose()
    dispatch({ type: 'SET_LOADING', payload: false })
  }

  return (
    <div>
      <Button
        onPress={onOpen}
        color="primary"
        variant="bordered"
        startContent={<Tag size={20} />}
      >
        更改标签
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>更改这个 Galgame 的标签</ModalHeader>
          <ModalBody>
            <SearchTags
              query={query}
              setQuery={setQuery}
              handleSearch={handleSearch}
              searching={searching}
            />
            {!searching && (
              <ScrollShadow className="max-h-[400px]">
                {state.isLoading ? (
                  <KunLoading hint="正在获取标签数据..." />
                ) : (
                  <div className="space-y-2">
                    {tags.map((tag) => (
                      <div
                        key={tag.id}
                        className="flex items-start gap-2 p-2 rounded-lg hover:bg-default-100"
                      >
                        <Checkbox
                          isSelected={
                            state.selectedTags.includes(tag.id) ||
                            (!state.removedTags.includes(tag.id) &&
                              state.existingTags.includes(tag.id))
                          }
                          onValueChange={(checked) =>
                            toggleTagSelection(tag.id, checked)
                          }
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{tag.name}</span>
                              <Chip size="sm" variant="flat">
                                {tag.count} 个游戏
                              </Chip>
                            </div>
                          </div>
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollShadow>
            )}
          </ModalBody>
          <ModalFooter className="flex-col">
            <div className="ml-auto space-x-2">
              <Button variant="flat" onPress={onClose}>
                取消
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={state.isLoading}
                isDisabled={state.isLoading}
              >
                确定更改
              </Button>
            </div>
            <div>
              没有您想要的标签?{' '}
              <Link color="primary" showAnchorIcon href="/tag">
                去创建标签
              </Link>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
