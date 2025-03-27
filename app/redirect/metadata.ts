import { kunMoyuMoe } from '~/config/moyu-moe'
import type { Metadata } from 'next'

export const kunMetadata: Metadata = {
  title: '外部链接跳转',
  description: `外链跳转页面, 解析外链以保证安全`,
  openGraph: {
    title: '友情链接',
    description: `外链跳转页面, 解析外链以保证安全`,
    type: 'website',
    images: kunMoyuMoe.images
  },
  twitter: {
    card: 'summary_large_image',
    title: '友情链接',
    description: `外链跳转页面, 解析外链以保证安全`
  },
  alternates: {
    canonical: `${kunMoyuMoe.domain.main}/jump`
  }
}
