import { Chip } from '@nextui-org/chip'
import { Card, CardBody } from '@nextui-org/card'
import { Image } from '@nextui-org/image'
import { formatDistanceToNow } from '~/utils/formatDistanceToNow'
import Link from 'next/link'
import { KunPatchAttribute } from '~/components/kun/PatchAttribute'

import type { UserResource as UserResourceType } from '~/types/api/user'

interface Props {
  resource: UserResourceType
}

export const UserResourceCard = ({ resource }: Props) => {
  const bannerImageSrc = resource.patchBanner
    ? resource.patchBanner.replace(/\.avif$/, '-mini.avif')
    : '/touchgal.avif'

  return (
    <Card
      isPressable
      as={Link}
      href={`/${resource.patchUniqueId}`}
      className="w-full"
    >
      <CardBody className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative w-full sm:h-auto sm:w-40">
            <Image
              src={bannerImageSrc}
              alt={resource.patchName}
              className="object-cover rounded-lg size-full max-h-52"
              radius="lg"
            />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <h2 className="text-lg font-semibold transition-colors line-clamp-2 hover:text-primary-500">
                {resource.patchName}
              </h2>
              <Chip variant="flat">
                {formatDistanceToNow(resource.created)}
              </Chip>
            </div>

            <KunPatchAttribute
              types={resource.type}
              languages={resource.language}
              platforms={resource.platform}
              size="sm"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
