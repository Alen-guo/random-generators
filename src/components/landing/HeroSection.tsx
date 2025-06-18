"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, ArrowDown, Hash, Lock, User, Palette, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function HeroSection() {
  const [activeDemo, setActiveDemo] = useState(0)
  const [demoResults, setDemoResults] = useState({
    number: 42,
    password: 'K9#mN2$pQ7@x',
    name: 'Alexandra Chen',
    color: '#8B5CF6'
  })

  // 轮播演示
  const demos = [
    { 
      icon: Hash, 
      title: 'Random Numbers', 
      subtitle: 'Cryptographically Secure',
      value: demoResults.number,
      action: () => setDemoResults(prev => ({ ...prev, number: Math.floor(Math.random() * 1000) + 1 }))
    },
    { 
      icon: Lock, 
      title: 'Secure Passwords', 
      subtitle: 'Military-Grade Security',
      value: demoResults.password,
      action: () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
        const newPassword = Array.from({length: 12}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
        setDemoResults(prev => ({ ...prev, password: newPassword }))
      }
    },
    { 
      icon: User, 
      title: 'Random Names', 
      subtitle: '15+ Cultural Origins',
      value: demoResults.name,
      action: () => {
        const names = ['Emma Rodriguez', 'James Chen', 'Sophia Kim', 'Oliver Singh', 'Isabella Wang']
        setDemoResults(prev => ({ ...prev, name: names[Math.floor(Math.random() * names.length)] }))
      }
    },
    { 
      icon: Palette, 
      title: 'Color Palettes', 
      subtitle: 'Designer-Quality',
      value: demoResults.color,
      action: () => {
        const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5A2B']
        setDemoResults(prev => ({ ...prev, color: colors[Math.floor(Math.random() * colors.length)] }))
      }
    }
  ]

  // 自动切换演示
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo(prev => (prev + 1) % demos.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [demos.length])

  // 统计数据
  const stats = [
    { label: 'Random Generators', value: '50+' },
    { label: 'Users Worldwide', value: '100K+' },
    { label: 'Countries Served', value: '180+' },
    { label: 'Security Rating', value: '99.9%' }
  ]

  return (
    <div className="relative overflow-hidden">
      {/* 背景动画 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        {/* 浮动粒子效果 */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 8 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 左侧：标题和内容 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* 主标题 */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-200 text-sm font-medium mb-6"
              >
                <Zap className="h-4 w-4" />
                True Random Generation
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-7xl font-bold text-white leading-tight"
              >
                Random
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Generators
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-slate-300 mt-6 max-w-xl"
              >
                The world&apos;s most comprehensive collection of cryptographically secure random generators. 
                Trusted by developers, researchers, and creatives worldwide.
              </motion.p>
            </div>

            {/* 统计数据 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA 按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8">
                Explore Tools
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                View API Docs
              </Button>
            </motion.div>
          </motion.div>

          {/* 右侧：交互式演示 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
              <CardContent className="p-0">
                <div className="space-y-6">
                  {/* 演示标题 */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Live Demo</h3>
                    <p className="text-slate-400 text-sm">Click to generate new results</p>
                  </div>

                  {/* 演示区域 */}
                  <div className="grid grid-cols-2 gap-4">
                    {demos.map((demo, index) => {
                      const IconComponent = demo.icon
                      const isActive = index === activeDemo
                      
                      return (
                        <motion.div
                          key={demo.title}
                          className={`p-4 rounded-lg border transition-all cursor-pointer ${
                            isActive 
                              ? 'bg-purple-500/20 border-purple-400/50' 
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                          onClick={demo.action}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <IconComponent className={`h-4 w-4 ${isActive ? 'text-purple-300' : 'text-slate-400'}`} />
                            <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>
                              {demo.title}
                            </span>
                          </div>
                          <div className={`text-xs ${isActive ? 'text-purple-200' : 'text-slate-500'} mb-2`}>
                            {demo.subtitle}
                          </div>
                          <div className={`font-mono text-sm ${isActive ? 'text-white' : 'text-slate-300'} truncate`}>
                            {demo.title === 'Color Palettes' ? (
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded border border-white/20" 
                                  style={{ backgroundColor: demo.value }}
                                />
                                {demo.value}
                              </div>
                            ) : (
                              demo.value
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* 生成按钮 */}
                  <div className="text-center">
                    <Button 
                      onClick={() => demos[activeDemo].action()}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    >
                      Generate New
                      <Zap className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 滚动指示器 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/60"
          >
            <span className="text-sm">Scroll to explore</span>
            <ArrowDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}