import { UserFavorite } from '~/components/user/favorite/Container'
import { kunGetActions } from './actions'
import { ErrorComponent } from '~/components/error/ErrorComponent'

export const revalidate = 3

interface Props {
  params: Promise<{ id: string }>
}

export default async function Kun({ params }: Props) {
  const { id } = await params

  const response = await kunGetActions({
    uid: Number(id),
    page: 1,
    limit: 20
  })
  if (typeof response === 'string') {
    return <ErrorComponent error={response} />
  }

  return (
    <UserFavorite
      favorites={response.favorites}
      total={response.total}
      uid={Number(id)}
    />
  )
}
