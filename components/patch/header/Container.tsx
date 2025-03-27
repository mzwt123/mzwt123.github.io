'use client'

import { useEffect, useState } from 'react'
import { Card, CardBody } from '@nextui-org/card'
import { Divider } from '@nextui-org/divider'
import { useRewritePatchStore } from '~/store/rewriteStore'
import { KunCardStats } from '~/components/kun/CardStats'
import { PatchHeader } from './Header'
import { PatchHeaderTabs } from './Tabs'
import { formatDistanceToNow } from '~/utils/formatDistanceToNow'
import { Tags } from './Tags'
import Image from 'next/image'
import { KunUser } from '~/components/kun/floating-card/KunUser'
import { KunAutoImageViewer } from '~/components/kun/image-viewer/AutoImageViewer'
import { ButtonList } from './ButtonList'
import type { Patch, PatchIntroduction } from '~/types/api/patch'

interface PatchHeaderProps {
  patch: Patch
  intro: PatchIntroduction
}

export const PatchHeaderContainer = ({ patch, intro }: PatchHeaderProps) => {
  const { setData } = useRewritePatchStore()
  const [selected, setSelected] = useState('introduction')

  useEffect(() => {
    setData({
      id: patch.id,
      uniqueId: patch.uniqueId,
      vndbId: patch.vndbId ?? '',
      name: patch.name,
      introduction: patch.introduction,
      alias: patch.alias,
      tag: patch.tags,
      contentLimit: patch.contentLimit,
      released: intro.released
    })
  }, [])

  return (
    <>
      <div className="relative h-[380px] sm:h-[512px] w-full">
        <KunAutoImageViewer />
        {/* Why use unoptimized? Production env unknown error */}
        <Image
          src={patch.banner}
          alt={patch.name}
          className="absolute top-0 left-0 object-cover size-full rounded-t-2xl rounded-b-3xl"
          fill
          sizes="100vw"
          priority
          unoptimized
        />

        <PatchHeader patch={patch} />

        <Card className="absolute bottom-0 w-full rounded-none shadow-lg rounded-b-2xl bg-background/70 backdrop-blur-xl">
          <CardBody>
            <ButtonList
              patch={patch}
              handleClickDownloadNav={() => setSelected('resources')}
            />

            <Divider className="my-4" />

            <div className="flex gap-6 text-sm">
              <KunUser
                user={patch.user}
                userProps={{
                  name: `${patch.user.name} - ${formatDistanceToNow(patch.created)}`,
                  description: (
                    <KunCardStats patch={patch} disableTooltip={false} />
                  ),
                  avatarProps: {
                    showFallback: true,
                    name: patch.user.name.charAt(0).toUpperCase(),
                    src: patch.user.avatar
                  }
                }}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2 sm:hidden">
        <Tags patch={patch} />
      </div>

      <PatchHeaderTabs
        id={patch.id}
        intro={intro}
        selected={selected}
        setSelected={setSelected}
      />
    </>
  )
}
