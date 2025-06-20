"use client"

import { ReactNode, ElementType, forwardRef } from 'react'
import { useTranslationProtection } from '@/hooks/useTranslationProtection'

interface Props {
  children: ReactNode
  className?: string
  as?: ElementType
}

/**
 * 翻译保护包装组件
 * 用于包装需要保护免受谷歌翻译干扰的内容
 */
export function TranslationProtectedWrapper({ 
  children, 
  className = '', 
  as: Component = 'div' 
}: Props) {
  const containerRef = useTranslationProtection()

  const ComponentToRender = Component as ElementType

  return (
    <ComponentToRender 
      ref={containerRef}
      className={`${className} notranslate`}
      translate="no"
      data-protected="true"
    >
      {children}
    </ComponentToRender>
  )
} 