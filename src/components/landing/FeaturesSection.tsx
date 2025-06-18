"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Hash, 
  Lock, 
  Palette, 
  Users, 
  Gamepad2,
  Code,
  Shield,
  Zap,
  Clock,
  Globe,
  Star,
  ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Cryptographically Secure",
      description: "True randomness powered by atmospheric noise and advanced algorithms",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate thousands of random values in milliseconds",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Available 24/7 from anywhere in the world with 99.9% uptime",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "RESTful API, multiple formats, and extensive documentation",
      color: "from-purple-500 to-pink-500"
    }
  ]

  const tools = [
    {
      icon: Hash,
      title: "Number Generators",
      description: "Random integers, decimals, sequences, and statistical distributions",
      href: "/numbers/integers",
      gradient: "from-blue-500 to-cyan-500",
      stats: "15+ Tools"
    },
    {
      icon: Lock,
      title: "Password Generator",
      description: "Ultra-secure passwords with customizable complexity",
      href: "/lists/passwords",
      gradient: "from-red-500 to-pink-500",
      stats: "Military Grade"
    },
    {
      icon: Users,
      title: "Name Generator",
      description: "Realistic names from 50+ cultures and origins",
      href: "/lists/names",
      gradient: "from-green-500 to-blue-500",
      stats: "50+ Origins"
    },
    {
      icon: Palette,
      title: "Color Generator",
      description: "Beautiful colors and palettes for design projects",
      href: "/design/colors",
      gradient: "from-pink-500 to-purple-500",
      stats: "All Formats"
    },
    {
      icon: Gamepad2,
      title: "Game Tools",
      description: "Dice, cards, wheels, and lottery number generators",
      href: "/games/dice",
      gradient: "from-orange-500 to-red-500",
      stats: "10+ Games"
    },
    {
      icon: Code,
      title: "Developer Tools",
      description: "UUIDs, JSON data, APIs, and testing utilities",
      href: "/web/uuid",
      gradient: "from-indigo-500 to-purple-500",
      stats: "API Ready"
    }
  ]

  return (
    <div id="features" className="py-24 bg-slate-900/50">
      <div className="container mx-auto px-4">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Why Choose
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {" "}Random Hub
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            The most comprehensive suite of random generation tools, built for professionals 
            who demand quality, security, and reliability.
          </p>
        </motion.div>

        {/* 核心特性 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mx-auto mb-4 flex items-center justify-center`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* 工具展示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              50+ Professional Tools
            </h3>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              From simple number generation to complex data creation, 
              we have the tools you need to get the job done.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon
              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-xl flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full">
                          {tool.stats}
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {tool.title}
                      </h4>
                      <p className="text-slate-400 mb-4 flex-1">
                        {tool.description}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-300 hover:text-white hover:bg-purple-500/20 p-0 h-auto font-medium group"
                        onClick={() => window.open(tool.href, '_blank')}
                      >
                        Try Now
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* 用例展示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-8">
            Trusted by Professionals Worldwide
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { label: "Developers", icon: Code },
              { label: "Researchers", icon: Star },
              { label: "Designers", icon: Palette },
              { label: "Gamers", icon: Gamepad2 }
            ].map((use, index) => {
              const IconComponent = use.icon
              return (
                <motion.div
                  key={use.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-purple-300" />
                  </div>
                  <div className="text-white font-medium">{use.label}</div>
                </motion.div>
              )
            })}
          </div>

          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-xl"
            onClick={() => window.open('/', '_blank')}
          >
            Start Using Random Hub
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}