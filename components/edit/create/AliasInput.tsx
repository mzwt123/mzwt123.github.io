'use client'

import { useState } from 'react'
import { Button, Chip, Input } from '@nextui-org/react'
import { Plus } from 'lucide-react'
import { useCreatePatchStore } from '~/store/editStore'
import toast from 'react-hot-toast'

interface Props {
  errors: string | undefined
}

export const AliasInput = ({ errors }: Props) => {
  const { data, setData } = useCreatePatchStore()
  const [newAlias, setNewAlias] = useState<string>('')

  const addAlias = () => {
    const alias = newAlias.trim().toLowerCase()
    if (data.alias.includes(alias)) {
      toast.error('请不要使用重复的别名')
      return
    }
    if (newAlias.trim()) {
      setData({ ...data, alias: [...data.alias, alias] })
      setNewAlias('')
    }
  }

  const removeAlias = (index: number) => {
    setData({
      ...data,
      alias: data.alias.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl">游戏别名 (可选)</h2>
      <div className="flex gap-2">
        <Input
          labelPlacement="outside"
          placeholder="输入后点击加号添加"
          value={newAlias}
          onChange={(e) => setNewAlias(e.target.value)}
          className="flex-1"
          isInvalid={!!errors}
          errorMessage={errors}
          onKeyDown={(event) => {
            if (event.key === 'Enter') addAlias()
          }}
        />
        <Button
          color="primary"
          onPress={addAlias}
          className="self-end"
          isIconOnly
          aria-label="添加 Galgame 别名"
        >
          <Plus size={20} />
        </Button>
      </div>
      <p className="text-sm text-default-500">
        建议填写游戏的日语原名以便搜索, 我们强烈建议您将 Galgame 的日文原名,
        写为 <b>第一个</b> 别名。
      </p>
      <p className="text-sm text-default-500">
        游戏的第一个别名将会作为 SEO 信息加入 Galgame 详情页
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {data.alias.map((alias, index) => (
          <Chip
            key={index}
            onClose={() => removeAlias(index)}
            variant="flat"
            className="h-8"
          >
            {alias}
          </Chip>
        ))}
      </div>
    </div>
  )
}
