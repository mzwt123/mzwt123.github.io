import { Calendar, Clock, Link, RefreshCw } from 'lucide-react'
import { formatDate } from '~/utils/time'
import type { PatchIntroduction } from '~/types/api/patch'

interface Props {
  intro: PatchIntroduction
}

export const Info = ({ intro }: Props) => {
  return (
    <>
      <div className="grid gap-4 mt-6 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm text-default-500">
          <Clock className="size-4" />
          <span>
            发布时间: {formatDate(intro.created, { isShowYear: true })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-default-500">
          <RefreshCw className="size-4" />
          <span>
            更新时间: {formatDate(intro.updated, { isShowYear: true })}
          </span>
        </div>
        {intro.released && (
          <div className="flex items-center gap-2 text-sm text-default-500">
            <Calendar className="size-4" />
            <span>发售时间: {intro.released}</span>
          </div>
        )}
        {intro.vndbId && (
          <div className="flex items-center gap-2 text-sm text-default-500">
            <Link className="size-4" />
            <span>VNDB ID: {intro.vndbId}</span>
          </div>
        )}
      </div>

      {intro.alias.length > 0 && (
        <>
          <h2 className="pt-8 mt-12 text-2xl border-t border-default-200">
            游戏别名
          </h2>
          <ul className="text-sm list-disc list-inside text-default-500">
            {intro.alias.map((alias) => (
              <li key={Math.random()}>{alias}</li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
