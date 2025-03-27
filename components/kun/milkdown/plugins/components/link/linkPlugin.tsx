'use client'

import { $command, $inputRule, $node, $remark } from '@milkdown/utils'
import { Node } from '@milkdown/prose/model'
import { InputRule } from '@milkdown/prose/inputrules'
import directive from 'remark-directive'
import { createRoot } from 'react-dom/client'
import { KunLink } from './KunLink'

interface InsertKunLinkCommandPayload {
  href: string
  text: string
}

export const kunImageRemarkDirective = $remark('kun-link', () => directive)

export const kunLinkNode = $node('kun-link', () => ({
  content: 'block*',
  group: 'block',
  selectable: true,
  draggable: true,
  marks: '',
  attrs: {
    href: { default: '' },
    text: { default: '' }
  },
  parseDOM: [
    {
      tag: 'div[data-kun-link]',
      getAttrs: (dom) => ({
        href: dom.getAttribute('data-href'),
        text: dom.getAttribute('data-text')
      })
    }
  ],
  toDOM: (node: Node) => {
    const container = document.createElement('div')
    container.setAttribute('data-kun-link', '')
    container.setAttribute('data-href', node.attrs.href)
    container.setAttribute('data-text', node.attrs.text)
    container.setAttribute('contenteditable', 'false')

    const root = createRoot(container)
    root.render(<KunLink href={node.attrs.href} text={node.attrs.text} />)

    return container
  },
  parseMarkdown: {
    match: (node) => node.name === 'kun-link',
    runner: (state, node, type) => {
      const { href, text } = node.attributes as InsertKunLinkCommandPayload
      state.addNode(type, {
        href,
        text
      })
    }
  },
  toMarkdown: {
    match: (node) => node.type.name === 'kun-link',
    runner: (state, node) => {
      state.addNode('leafDirective', undefined, node.attrs.text, {
        name: 'kun-link',
        attributes: node.attrs
      })
    }
  }
}))

export const insertKunLinkCommand = $command(
  'InsertKunLink',
  (ctx) =>
    (payload: InsertKunLinkCommandPayload = { href: '', text: '' }) =>
    (state, dispatch) => {
      if (!dispatch) return true

      const { href = '', text = '' } = payload
      const node = kunLinkNode.type(ctx).create({ href, text })

      if (!node) return true

      dispatch(state.tr.replaceSelectionWith(node).scrollIntoView())
      return true
    }
)

export const kunLinkInputRule = $inputRule(
  (ctx) =>
    new InputRule(
      // Matches format: [[text]](url)
      /\[\[(?<text>[^\]]+)\]\]\((?<href>[^)]+)\)/,
      (state, match, start, end) => {
        const [matched, text = '', href = ''] = match
        const { tr } = state

        if (matched) {
          return tr.replaceWith(
            start - 1,
            end,
            kunLinkNode.type(ctx).create({ href, text })
          )
        }
        return null
      }
    )
)
