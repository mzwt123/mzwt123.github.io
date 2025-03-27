import { Container } from '~/components/tag/Container'
import { kunMetadata } from './metadata'
import { kunGetActions } from './actions'
import { ErrorComponent } from '~/components/error/ErrorComponent'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const revalidate = 3

export const metadata: Metadata = kunMetadata

export default async function Kun() {
  const response = await kunGetActions({
    page: 1,
    limit: 100
  })
  if (typeof response === 'string') {
    return <ErrorComponent error={response} />
  }

  return (
    <Suspense>
      <Container initialTags={response.tags} initialTotal={response.total} />
    </Suspense>
  )
}
