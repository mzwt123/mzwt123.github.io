'use client'

import { useEffect, useState } from 'react'
import { Pagination } from '@nextui-org/pagination'
import { kunFetchGet } from '~/utils/kunFetch'
import { ResourceCard } from './ResourceCard'
import { KunMasonryGrid } from '~/components/kun/MasonryGrid'
import { FilterBar } from './FilterBar'
import { useMounted } from '~/hooks/useMounted'
import { KunLoading } from '~/components/kun/Loading'
import { KunHeader } from '../kun/Header'
import { useRouter, useSearchParams } from 'next/navigation'
import type { SortDirection, SortOption } from './_sort'
import type { PatchResource } from '~/types/api/resource'

interface Props {
  initialResources: PatchResource[]
  initialTotal: number
}

export const CardContainer = ({ initialResources, initialTotal }: Props) => {
  const [resources, setResources] = useState<PatchResource[]>(initialResources)
  const [total, setTotal] = useState(initialTotal)
  const [loading, setLoading] = useState(false)
  const [sortField, setSortField] = useState<SortOption>('created')
  const [sortOrder, setSortOrder] = useState<SortDirection>('desc')
  const isMounted = useMounted()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)

  const fetchData = async () => {
    setLoading(true)

    const { resources } = await kunFetchGet<{
      resources: PatchResource[]
      total: number
    }>('/resource', {
      sortField,
      sortOrder,
      page,
      limit: 50
    })

    setResources(resources)
    setTotal(total)
    setLoading(false)
  }

  useEffect(() => {
    if (!isMounted) {
      return
    }
    fetchData()
  }, [sortField, sortOrder, page])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    const params = new URLSearchParams(window.location.search)
    params.set('page', newPage.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="container mx-auto my-4 space-y-6">
      <KunHeader
        name="Galgame 补丁资源"
        description="这里展示了所有的 Galgame 补丁资源列表"
      />

      <FilterBar
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {loading ? (
        <KunLoading hint="正在获取 Galgame 补丁资源数据..." />
      ) : (
        <KunMasonryGrid columnWidth={256} gap={24}>
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </KunMasonryGrid>
      )}

      {total > 50 && (
        <div className="flex justify-center">
          <Pagination
            total={Math.ceil(total / 50)}
            page={page}
            onChange={handlePageChange}
            showControls
            color="primary"
            size="lg"
          />
        </div>
      )}
    </div>
  )
}
