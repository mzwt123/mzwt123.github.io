'use client'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react'
import { useSettingStore } from '~/store/settingStore'
import { Ban, ShieldCheck, CircleSlash } from 'lucide-react'
import type { JSX } from 'react'

const themeIconMap: Record<string, JSX.Element> = {
  sfw: <ShieldCheck className="size-5" />,
  nsfw: <Ban className="size-5" />,
  all: <CircleSlash className="size-5" />
}

export const NSFWSwitcher = () => {
  const settings = useSettingStore((state) => state.data)
  const setData = useSettingStore((state) => state.setData)

  const themeIcon = themeIconMap[settings.kunNsfwEnable] || themeIconMap['all']

  return (
    <Dropdown className="min-w-0">
      <DropdownTrigger>
        <div className="flex justify-between">
          <span>网站内容显示</span>
          <span className="text-default-700">{themeIcon}</span>
        </div>
      </DropdownTrigger>

      <DropdownMenu
        disallowEmptySelection
        selectedKeys={new Set([settings.kunNsfwEnable])}
        selectionMode="single"
        onSelectionChange={(key) => {
          setData({ kunNsfwEnable: key.anchorKey ?? 'sfw' })
          location.reload()
        }}
      >
        {['sfw', 'nsfw', 'all'].map((key) => (
          <DropdownItem
            startContent={themeIconMap[key]}
            textValue={key}
            key={key}
            className="text-default-700"
          >
            {key === 'sfw' && '仅显示 SFW (内容安全) 的文章'}
            {key === 'nsfw' && '仅显示 NSFW (可能含有 R18) 的文章'}
            {key === 'all' && '同时显示 SFW 和 NSFW 的文章'}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
