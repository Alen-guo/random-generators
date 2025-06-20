import { useEffect, useRef } from 'react'

/**
 * 自定义Hook：保护组件免受谷歌翻译插件的干扰
 * 通过在关键元素上添加translate="no"属性来防止翻译
 */
export function useTranslationProtection() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current) {
            // 为容器添加 translate="no" 属性
            containerRef.current.setAttribute('translate', 'no')

            // 为所有按钮和表单元素添加 translate="no" 属性
            const protectedElements = containerRef.current.querySelectorAll(
                'button, input, select, textarea, [data-result], [data-interactive]'
            )

            protectedElements.forEach(element => {
                element.setAttribute('translate', 'no')
                // 添加 notranslate 类作为额外保护
                element.classList.add('notranslate')
            })

            // 监听DOM变化，为新添加的元素也加上保护
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                const element = node as Element
                                if (element.matches('button, input, select, textarea, [data-result], [data-interactive]')) {
                                    element.setAttribute('translate', 'no')
                                    element.classList.add('notranslate')
                                }

                                // 为子元素也添加保护
                                const childElements = element.querySelectorAll(
                                    'button, input, select, textarea, [data-result], [data-interactive]'
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

            observer.observe(containerRef.current, {
                childList: true,
                subtree: true
            })

            return () => {
                observer.disconnect()
            }
        }
    }, [])

    return containerRef
}

/**
 * 为整个页面添加翻译保护
 */
export function usePageTranslationProtection() {
    useEffect(() => {
        // 为 body 添加类和属性
        document.body.classList.add('notranslate')
        document.body.setAttribute('translate', 'no')

        // 为 html 标签添加属性
        document.documentElement.setAttribute('translate', 'no')

        // 添加 meta 标签禁止翻译
        const existingMeta = document.querySelector('meta[name="google"]')
        if (!existingMeta) {
            const meta = document.createElement('meta')
            meta.name = 'google'
            meta.content = 'notranslate'
            document.head.appendChild(meta)
        }

        return () => {
            document.body.classList.remove('notranslate')
            document.body.removeAttribute('translate')
            document.documentElement.removeAttribute('translate')
        }
    }, [])
} 