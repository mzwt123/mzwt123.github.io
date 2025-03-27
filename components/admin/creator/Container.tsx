'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'
import { useState } from 'react'
import { RenderCell } from './RenderCell'
import type { AdminCreator } from '~/types/api/admin'

interface Props {
  initialCreators: AdminCreator[]
  total: number
}

const columns = [
  { name: '申请人', uid: 'sender' },
  { name: '状态', uid: 'status' },
  { name: '时间', uid: 'created' },
  { name: '操作', uid: 'actions' }
]

export const Creator = ({ initialCreators, total }: Props) => {
  const [creators, setCreators] = useState<AdminCreator[]>(initialCreators)

  return (
    <div className="space-y-6">
      <h1 className="mb-6 text-2xl font-bold">创作者管理</h1>
      <Table aria-label="创作者管理">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {creators.map((creator) => (
            <TableRow key={creator.id}>
              {(columnKey) => (
                <TableCell>
                  {RenderCell({
                    creator,
                    columnKey: columnKey.toString()
                  })}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
