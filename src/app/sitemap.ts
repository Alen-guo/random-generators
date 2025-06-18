import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://random-generators.org'
    const currentDate = new Date()

    // 实际存在的页面路由（基于构建输出的67个页面）
    const allRoutes = [
        // 主页和静态页面
        { path: '/', priority: 1.0, changeFreq: 'weekly' as const },
        { path: '/landing', priority: 0.9, changeFreq: 'monthly' as const },

        // 数字生成器 (高优先级 - 核心功能)
        { path: '/numbers/integers', priority: 0.9 },
        { path: '/numbers/decimals', priority: 0.8 },
        { path: '/numbers/bytes', priority: 0.7 },
        { path: '/numbers/dates', priority: 0.8 },
        { path: '/numbers/fibonacci', priority: 0.6 },
        { path: '/numbers/gaussian', priority: 0.7 },
        { path: '/numbers/primes', priority: 0.7 },
        { path: '/numbers/sequences', priority: 0.7 },
        { path: '/numbers/sets', priority: 0.6 },

        // 列表生成器 (高优先级 - 热门工具)
        { path: '/lists/passwords', priority: 0.9 },
        { path: '/lists/names', priority: 0.9 },
        { path: '/lists/emails', priority: 0.8 },
        { path: '/lists/phones', priority: 0.8 },
        { path: '/lists/coordinates', priority: 0.7 },
        { path: '/lists/dates', priority: 0.7 },
        { path: '/lists/facts', priority: 0.7 },
        { path: '/lists/lorem', priority: 0.8 },
        { path: '/lists/music', priority: 0.7 },
        { path: '/lists/quotes', priority: 0.7 },
        { path: '/lists/randomizer', priority: 0.8 },
        { path: '/lists/stories', priority: 0.7 },
        { path: '/lists/strings', priority: 0.8 },
        { path: '/lists/text', priority: 0.8 },
        { path: '/lists/times', priority: 0.7 },

        // 设计工具 (高优先级 - 创意工具)
        { path: '/design/colors', priority: 0.9 },
        { path: '/design/gradients', priority: 0.8 },
        { path: '/design/palettes', priority: 0.8 },
        { path: '/design/css', priority: 0.7 },
        { path: '/design/hex', priority: 0.7 },
        { path: '/design/hsl', priority: 0.7 },
        { path: '/design/rgb', priority: 0.7 },
        { path: '/design/images', priority: 0.7 },

        // 游戏工具 (中等优先级 - 娱乐功能)
        { path: '/games/dice', priority: 0.8 },
        { path: '/games/coin', priority: 0.8 },
        { path: '/games/cards', priority: 0.7 },
        { path: '/games/lottery', priority: 0.7 },
        { path: '/games/wheel', priority: 0.8 },
        { path: '/games/picker', priority: 0.8 },
        { path: '/games/decision', priority: 0.8 },
        { path: '/games/bingo', priority: 0.6 },
        { path: '/games/bracket', priority: 0.6 },
        { path: '/games/keno', priority: 0.6 },
        { path: '/games/questions', priority: 0.7 },
        { path: '/games/tasks', priority: 0.7 },
        { path: '/games/team-maker', priority: 0.7 },
        { path: '/games/teams', priority: 0.7 },

        // Web开发工具 (中等优先级 - 开发者工具)
        { path: '/web/api', priority: 0.7 },
        { path: '/web/json', priority: 0.8 },
        { path: '/web/regex', priority: 0.8 },
        { path: '/web/hash', priority: 0.7 },
        { path: '/web/uuid', priority: 0.8 },
        { path: '/web/ip', priority: 0.7 },
        { path: '/web/security', priority: 0.8 },
        { path: '/web/binary', priority: 0.6 },
        { path: '/web/csv', priority: 0.7 },
        { path: '/web/database', priority: 0.7 },
        { path: '/web/qr', priority: 0.8 },
        { path: '/web/snippets', priority: 0.7 },
        { path: '/web/sql', priority: 0.7 },
        { path: '/web/timestamp', priority: 0.7 }
    ]

    // 生成最终的sitemap
    return allRoutes.map(route => ({
        url: `${baseUrl}${route.path}`,
        lastModified: currentDate,
        changeFrequency: route.changeFreq || ('monthly' as const),
        priority: route.priority,
    }))
} 