import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://random-generators.org'
    const currentDate = new Date()

    // 生成器工具页面
    const generatorRoutes = [
        // 数字生成器
        { path: '/numbers/integers', priority: 0.9 },
        { path: '/numbers/decimals', priority: 0.8 },
        { path: '/numbers/fractions', priority: 0.7 },
        { path: '/numbers/primes', priority: 0.7 },
        { path: '/numbers/sequences', priority: 0.7 },

        // 列表生成器
        { path: '/lists/passwords', priority: 0.9 },
        { path: '/lists/names', priority: 0.8 },
        { path: '/lists/words', priority: 0.8 },
        { path: '/lists/quotes', priority: 0.7 },
        { path: '/lists/facts', priority: 0.7 },
        { path: '/lists/music', priority: 0.7 },

        // 设计工具
        { path: '/design/colors', priority: 0.8 },
        { path: '/design/gradients', priority: 0.7 },
        { path: '/design/fonts', priority: 0.7 },
        { path: '/design/icons', priority: 0.7 },

        // 游戏工具
        { path: '/games/dice', priority: 0.7 },
        { path: '/games/cards', priority: 0.7 },
        { path: '/games/lottery', priority: 0.7 },
        { path: '/games/bracket', priority: 0.7 },
        { path: '/games/spinner', priority: 0.7 },

        // 开发工具
        { path: '/web/api-keys', priority: 0.7 },
        { path: '/web/json', priority: 0.7 },
        { path: '/web/regex', priority: 0.7 },
        { path: '/web/ip', priority: 0.7 },
        { path: '/web/security', priority: 0.7 },

        // 决策工具
        { path: '/decisions/maker', priority: 0.7 },
        { path: '/decisions/picker', priority: 0.7 }
    ]

    // 静态页面
    const staticRoutes = [
        { path: '/', priority: 1.0, changeFreq: 'weekly' as const },
        { path: '/landing', priority: 0.9, changeFreq: 'monthly' as const },
        { path: '/about', priority: 0.5, changeFreq: 'yearly' as const },
        { path: '/privacy', priority: 0.3, changeFreq: 'yearly' as const },
        { path: '/terms', priority: 0.3, changeFreq: 'yearly' as const },
        { path: '/contact', priority: 0.4, changeFreq: 'yearly' as const },
        { path: '/api-docs', priority: 0.4, changeFreq: 'monthly' as const }
    ]

    // 合并所有路由
    const allRoutes = [
        // 静态页面
        ...staticRoutes.map(route => ({
            url: `${baseUrl}${route.path}`,
            lastModified: currentDate,
            changeFrequency: route.changeFreq || ('monthly' as const),
            priority: route.priority,
        })),
        // 生成器页面
        ...generatorRoutes.map(route => ({
            url: `${baseUrl}${route.path}`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: route.priority,
        }))
    ]

    return allRoutes
} 