'use client'

import { useEffect } from 'react'

import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core'
import { Milkdown, useEditor } from '@milkdown/react'
import { commonmark } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'
import { history } from '@milkdown/plugin-history'
import { prism, prismConfig } from '@milkdown/plugin-prism'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { clipboard } from '@milkdown/plugin-clipboard'
import { indent } from '@milkdown/plugin-indent'
import { trailing } from '@milkdown/plugin-trailing'
import { upload, uploadConfig } from '@milkdown/plugin-upload'
import { automd } from '@milkdown/plugin-automd'
import { replaceAll } from '@milkdown/utils'

import { remarkDirective } from './plugins/components/remarkDirective'
import { KunMilkdownPluginsMenu } from './plugins/Menu'
import {
  kunUploader,
  kunUploadWidgetFactory
} from './plugins/components/uploader'
import {
  kunVideoRemarkDirective,
  insertKunVideoCommand,
  videoInputRule,
  videoNode
} from './plugins/components/video/videoPlugin'
import {
  kunImageRemarkDirective,
  insertKunLinkCommand,
  kunLinkInputRule,
  kunLinkNode
} from './plugins/components/link/linkPlugin'
import {
  mentionsPlugin,
  mentionsPluginOptions
} from './plugins/components/mention/mentionPlugin'
import { MentionsListDropdown } from './plugins/components/mention/MentionsListDropdown'
import {
  stopLinkCommand,
  linkCustomKeymap
} from './plugins/components/stop-link/stopLinkPlugin'
import {
  placeholderPlugin,
  placeholderCtx
} from './plugins/components/placeholder/placeholderPlugin'
import { KunLoading } from '../Loading'
import '~/styles/editor.scss'
import { useKunMilkdownStore } from '~/store/milkdownStore'

import bash from 'refractor/lang/bash'
import c from 'refractor/lang/c'
import cpp from 'refractor/lang/cpp'
import csharp from 'refractor/lang/csharp'
import css from 'refractor/lang/css'
import go from 'refractor/lang/go'
import haskell from 'refractor/lang/haskell'
import python from 'refractor/lang/python'
import java from 'refractor/lang/java'
import javascript from 'refractor/lang/javascript'
import jsx from 'refractor/lang/jsx'
import json from 'refractor/lang/json'
import kotlin from 'refractor/lang/kotlin'
import r from 'refractor/lang/r'
import rust from 'refractor/lang/rust'
import scala from 'refractor/lang/scala'
import sql from 'refractor/lang/sql'
import tsx from 'refractor/lang/tsx'
import typescript from 'refractor/lang/typescript'
import markdown from 'refractor/lang/markdown'

type Props = {
  valueMarkdown: string
  saveMarkdown: (markdown: string) => void
  disableUserKey?: boolean
  placeholder?: string
}

export const EditorProvider = ({
  valueMarkdown,
  saveMarkdown,
  disableUserKey = false,
  placeholder
}: Props) => {
  const refreshContentStatus = useKunMilkdownStore(
    (state) => state.data.refreshContentStatus
  )

  const mentions = mentionsPlugin()

  const editor = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, valueMarkdown)
        ctx.set(placeholderCtx.key, placeholder ?? '')

        const listener = ctx.get(listenerCtx)
        listener.markdownUpdated((_, markdown) => {
          saveMarkdown(markdown)
        })

        ctx.update(mentionsPluginOptions.key, (prev) => ({
          ...prev,
          view: MentionsListDropdown
        }))

        ctx.update(uploadConfig.key, (prev) => ({
          ...prev,
          uploader: kunUploader,
          uploadWidgetFactory: kunUploadWidgetFactory
        }))

        ctx.set(prismConfig.key, {
          configureRefractor: (refractor) => {
            refractor.register(c)
            refractor.register(bash)
            refractor.register(cpp)
            refractor.register(csharp)
            refractor.register(css)
            refractor.register(go)
            refractor.register(haskell)
            refractor.register(python)
            refractor.register(markdown)
            refractor.register(java)
            refractor.register(javascript)
            refractor.register(json)
            refractor.register(jsx)
            refractor.register(kotlin)
            refractor.register(r)
            refractor.register(rust)
            refractor.register(scala)
            refractor.register(sql)
            refractor.register(tsx)
            refractor.register(typescript)
          }
        })
      })
      .use(history)
      .use(commonmark)
      .use(gfm)
      .use(prism)
      .use(listener)
      .use(clipboard)
      .use(indent)
      .use(trailing)
      .use(upload)
      .use(automd)
      .use([remarkDirective].flat())
      .use(
        [
          kunVideoRemarkDirective,
          videoNode,
          insertKunVideoCommand,
          videoInputRule
        ].flat()
      )
      .use(
        [
          kunImageRemarkDirective,
          insertKunLinkCommand,
          kunLinkInputRule,
          kunLinkNode
        ].flat()
      )
      .use(
        [
          stopLinkCommand,
          linkCustomKeymap,
          mentions,
          placeholderCtx,
          placeholderPlugin
        ].flat()
      )
  )

  useEffect(
    () => editor.get()?.action(replaceAll(valueMarkdown, true)),
    [refreshContentStatus]
  )

  return (
    <div className="w-full min-h-64" onClick={(e) => e.stopPropagation()}>
      <KunMilkdownPluginsMenu
        editorInfo={editor}
        disableUserKey={disableUserKey}
      />

      <div className="relative">
        <Milkdown />
      </div>

      {editor.loading && (
        <KunLoading className="min-h-48" hint="正在加载编辑器" />
      )}
    </div>
  )
}
