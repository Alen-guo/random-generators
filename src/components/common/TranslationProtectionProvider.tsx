"use client"

import { useEffect } from 'react'

/**
 * 翻译保护提供者组件
 * 在客户端为整个应用提供翻译保护
 */
export function TranslationProtectionProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  useEffect(() => {
    // 智能翻译保护 - 只保护关键交互元素
    const protectCriticalElements = () => {
      // 只保护关键交互元素，不阻止整体翻译
      const criticalElements = document.querySelectorAll(
        'button[data-interactive], input[data-interactive], [data-result], canvas, .notranslate'
      )
      
      criticalElements.forEach(element => {
        element.setAttribute('translate', 'no')
        element.classList.add('notranslate')
      })

      // 监听DOM变化，为新添加的元素也加上保护
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element
                
                // 检查是否是关键交互元素
                if (element.matches('button[data-interactive], input[data-interactive], [data-result], canvas')) {
                  element.setAttribute('translate', 'no')
                  element.classList.add('notranslate')
                }
                
                // 为子元素也添加保护
                const childElements = element.querySelectorAll(
                  'button[data-interactive], input[data-interactive], [data-result], canvas'
                )
                childElements.forEach(child => {
                  child.setAttribute('translate', 'no')
                  child.classList.add('notranslate')
                })
              }
            })
          }
        })
      })
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
      })
      
      return observer
    }

    // 页面加载完成后执行保护
    const timer = setTimeout(() => {
      const observer = protectCriticalElements()
      
      // 清理函数
      return () => {
        if (observer) {
          observer.disconnect()
        }
      }
    }, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  // 添加React错误边界来捕获翻译相关的错误
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const error = event.error
      if (error && (
        error.message?.includes('removeChild') ||
        error.message?.includes('Node') ||
        error.message?.includes('not a child')
      )) {
        console.warn('Translation-related DOM error detected and handled:', error.message)
        event.preventDefault()
        
        // 尝试强制重新渲染受影响的组件
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    }

    window.addEventListener('error', handleError)
    
    return () => {
      window.removeEventListener('error', handleError)
    }
  }, [])

  return <>{children}</>
} 