"use client"

import { Navigation } from '@/components/common/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Search, ArrowLeft, Zap, Shuffle } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  const popularTools = [
    { name: "Random Number Generator", href: "/numbers/integers", icon: "123" },
    { name: "Password Generator", href: "/lists/passwords", icon: "🔒" },
    { name: "Name Generator", href: "/lists/names", icon: "👤" },
    { name: "Color Generator", href: "/design/colors", icon: "🎨" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* 404动画数字 */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <div className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text mb-4">
              404
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block"
            >
              <Zap className="h-16 w-16 text-yellow-400 mx-auto" />
            </motion.div>
          </motion.div>

          {/* 错误信息 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-xl text-slate-300 mb-6">
              The page you're looking for seems to have vanished into the digital void. 
              But don't worry, we have plenty of other random treasures waiting for you!
            </p>
          </motion.div>

          {/* 操作按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Link href="/">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8">
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.history.back()}
              className="border-white/20 text-white hover:bg-white/10 px-8"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </Button>
            <Link href="/search">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Tools
              </Button>
            </Link>
          </motion.div>

          {/* 推荐工具 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Popular Random Generators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularTools.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <Link href={tool.href}>
                    <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                          {tool.icon}
                        </div>
                        <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">
                          {tool.name}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 随机建议 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 p-6 bg-white/5 border border-white/10 rounded-xl"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shuffle className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Random Suggestion</h3>
            </div>
            <p className="text-slate-300">
              While you're here, why not try generating some random numbers? 
              It's scientifically proven to make lost pages 73.2% less disappointing!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 