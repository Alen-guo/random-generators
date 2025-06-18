"use client"

import React, { useState } from 'react'
import { Navigation } from '@/components/common/Navigation'
import { NumberGenerator } from '@/components/generators/NumberGenerator'
import { PasswordGenerator } from '@/components/generators/PasswordGenerator'
import { NameGenerator } from '@/components/generators/NameGenerator'
import { ColorGenerator } from '@/components/generators/ColorGenerator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Dices, 
  Hash, 
  Users, 
  Palette, 
  Lock, 
  Calendar,
  MapPin,
  Code,
  Star,
  Zap,
  ShuffleIcon,
  Timer,
  Mail,
  Phone,
  Image,
  FileText,
  QrCode,
  BarChart3,
  RotateCcw,
  Spade,
  Grid3X3,
  Trophy,
  HelpCircle,
  MousePointer,
  MessageCircle,
  CheckSquare,
  User,
  Dice1,
  Shield,
  Download,
  Heart,
  Globe,
  Database,
  Music,
  Gamepad,
  Calculator,
  PenTool,
  Clock,
  Key,
  RefreshCw,
  Target,
  CreditCard,
  Award
} from 'lucide-react'

interface Tool {
  name: string
  description: string
  href: string
  icon: any
  category: string
  popular?: boolean
}

const popularTools = [
  {
    name: "Random Numbers",
    description: "Generate true random numbers",
    href: "/numbers/integers",
    icon: Hash
  },
  {
    name: "Passwords",
    description: "Secure password generator",
    href: "/lists/passwords", 
    icon: Lock
  },
  {
    name: "Names",
    description: "Random name generator",
    href: "/lists/names",
    icon: User
  },
  {
    name: "Colors",
    description: "Random color palettes",
    href: "/design/colors",
    icon: Palette
  },
  {
    name: "Dice Roller",
    description: "Virtual dice rolling",
    href: "/games/dice",
    icon: Dice1
  },
  {
    name: "API Keys",
    description: "Generate API keys",
    href: "/web/api",
    icon: Code
  }
]

const categories = ['All', 'Numbers', 'Lists', 'Design', 'Games', 'Web Dev']

const tools: Tool[] = [
  // Numbers
  { name: "Random Integers", description: "Generate random whole numbers within any range", href: "/numbers/integers", icon: Hash, category: "Numbers", popular: true },
  { name: "Random Decimals", description: "Generate precise decimal numbers", href: "/numbers/decimals", icon: Calculator, category: "Numbers" },
  { name: "Prime Numbers", description: "Generate cryptographically secure primes", href: "/numbers/primes", icon: Shield, category: "Numbers" },
  { name: "Number Sequences", description: "Create arithmetic and geometric sequences", href: "/numbers/sequences", icon: Target, category: "Numbers" },
  
  // Lists
  { name: "Password Generator", description: "Create secure passwords with custom criteria", href: "/lists/passwords", icon: Lock, category: "Lists", popular: true },
  { name: "Name Generator", description: "Generate names from 15+ cultural backgrounds", href: "/lists/names", icon: User, category: "Lists", popular: true },
  { name: "Random Words", description: "Generate random words and vocabulary", href: "/lists/strings", icon: FileText, category: "Lists" },
  { name: "Random Quotes", description: "Inspirational quotes from famous people", href: "/lists/quotes", icon: Heart, category: "Lists" },
  { name: "Random Facts", description: "Interesting facts across multiple categories", href: "/lists/facts", icon: Globe, category: "Lists" },
  { name: "Email Generator", description: "Generate realistic email addresses", href: "/lists/emails", icon: Mail, category: "Lists" },
  { name: "Phone Generator", description: "Generate phone numbers by country", href: "/lists/phones", icon: Phone, category: "Lists" },
  { name: "Address Generator", description: "Generate random addresses worldwide", href: "/lists/coordinates", icon: MapPin, category: "Lists" },
  
  // Design  
  { name: "Color Generator", description: "Generate colors in multiple formats", href: "/design/colors", icon: Palette, category: "Design", popular: true },
  { name: "Color Palettes", description: "Create harmonious color schemes", href: "/design/palettes", icon: PenTool, category: "Design" },
  { name: "Gradient Generator", description: "Create beautiful CSS gradients", href: "/design/gradients", icon: Image, category: "Design" },
  { name: "Random Images", description: "Generate placeholder images", href: "/design/images", icon: Image, category: "Design" },
  
  // Games
  { name: "Dice Roller", description: "Roll virtual dice for games", href: "/games/dice", icon: Dice1, category: "Games", popular: true },
  { name: "Card Generator", description: "Draw random playing cards", href: "/games/cards", icon: CreditCard, category: "Games" },
  { name: "Random Wheel", description: "Spin a customizable decision wheel", href: "/games/wheel", icon: RefreshCw, category: "Games" },
  { name: "Team Generator", description: "Create random teams from lists", href: "/games/teams", icon: Users, category: "Games" },
  { name: "Lottery Numbers", description: "Generate lottery number combinations", href: "/games/lottery", icon: Award, category: "Games" },
  
  // Web Dev
  { name: "API Key Generator", description: "Generate secure API keys", href: "/web/api", icon: Key, category: "Web Dev", popular: true },
  { name: "JSON Generator", description: "Create realistic test data", href: "/web/json", icon: Database, category: "Web Dev" },
  { name: "UUID Generator", description: "Generate unique identifiers", href: "/web/uuid", icon: Code, category: "Web Dev" },
  { name: "Hash Generator", description: "Generate various hash types", href: "/web/hash", icon: Shield, category: "Web Dev" },
  { name: "IP Generator", description: "Generate IPv4/IPv6 addresses", href: "/web/ip", icon: Globe, category: "Web Dev" },
  { name: "Timestamp Generator", description: "Generate random timestamps", href: "/web/timestamp", icon: Clock, category: "Web Dev" }
]

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredTools = activeCategory === 'All' 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 导航栏 */}
      <Navigation />
      
      {/* 主内容区域 */}
      <div className="container mx-auto px-4 py-8">
        {/* Hero 区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* 左侧：介绍文本 (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 公告栏 */}
            <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                <strong>Advisory:</strong> Our random number generators use cryptographically secure algorithms to ensure true randomness for all your needs.
              </p>
            </div>

            {/* 主标题 */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                What&apos;s this fuss about <em className="text-purple-300">true</em> randomness?
              </h1>
              
              <div className="prose prose-invert max-w-none space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Perhaps you have wondered how predictable machines like computers can generate randomness. In 
                  reality, most random numbers used in computer programs are <em className="italic">pseudo-random</em>, which means they are 
                  generated in a predictable fashion using a mathematical formula. This is fine for many purposes, but it 
                  may not be random in the way you expect if you&apos;re used to dice rolls and lottery drawings.
                </p>
                
                <p>
                  RANDOM GENERATORS offers <em className="italic text-purple-300">true</em> random numbers to anyone on the Internet. The randomness comes from 
                  atmospheric noise, which for many purposes is better than the pseudo-random number algorithms 
                  typically used in computer programs. People use RANDOM GENERATORS for holding drawings, lotteries and 
                  sweepstakes, to drive online games, for scientific applications and for art and music. The service has 
                  existed since 2024 and provides high-quality randomness for developers, researchers, and everyday users.
                </p>
              </div>
            </div>

            {/* 热门工具快速链接 */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-400" />
                Popular Tools
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {popularTools.map((tool) => {
                  const IconComponent = tool.icon
                  return (
                    <Card key={tool.name} className="bg-white/10 border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-4">
                        <a href={tool.href} className="block">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                              <IconComponent className="h-5 w-5 text-purple-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-white text-sm truncate">{tool.name}</h3>
                              <p className="text-xs text-slate-400 truncate">{tool.description}</p>
                            </div>
                          </div>
                        </a>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 右侧：随机数生成器 (1/3) */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 border-white/20 sticky top-24">
              <CardHeader className="text-center bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                <CardTitle className="text-white">True Random Number Generator</CardTitle>
                <CardDescription className="text-slate-300">
                  Generate cryptographically secure random numbers
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <NumberGenerator />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 生成器展示区域 */}
        <div className="space-y-12 mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Generators</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Try our most popular random generators right here on the homepage. 
              Generate secure passwords, random names, and beautiful color palettes instantly.
            </p>
          </div>

          {/* 密码生成器 */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Password Generator</h3>
              <p className="text-slate-400">Create cryptographically secure passwords for your accounts</p>
            </div>
            <PasswordGenerator />
          </div>

          {/* 姓名生成器 */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Name Generator</h3>
              <p className="text-slate-400">Generate realistic names from various cultures and origins</p>
            </div>
            <NameGenerator />
          </div>

          {/* 颜色生成器 */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Color Generator</h3>
              <p className="text-slate-400">Create beautiful random colors and palettes for your designs</p>
            </div>
            <ColorGenerator />
          </div>
        </div>

        {/* 所有工具展示区域 */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">All Random Generators</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Explore our comprehensive collection of random generators and tools. From simple number generation 
              to complex data creation, we have everything you need.
            </p>
          </div>

          {/* 分类过滤器 */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                  : 'border-white/20 text-white hover:bg-white/10'
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* 工具网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <Card key={tool.name} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all group cursor-pointer">
                  <CardContent className="p-6">
                    <a href={tool.href} className="block h-full">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          {tool.popular && (
                            <div className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-medium rounded-full">
                              Popular
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-slate-400 text-sm flex-1">
                          {tool.description}
                        </p>
                        <div className="mt-3 text-xs text-purple-300 font-medium">
                          {tool.category}
                        </div>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* 底部 CTA */}
        <div className="text-center mt-16 py-12 border-t border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Need More Randomness?</h2>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            Explore our complete collection of random generators, or bookmark this page for quick access to your favorites.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8">
              Browse All Tools
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8">
              API Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
