import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { Navigation } from '@/components/common/Navigation'

export const metadata = {
  title: 'Random Hub - Professional Random Generation Tools',
  description: 'The world\'s most comprehensive random generation platform. Cryptographically secure random numbers, passwords, names, colors, and more. Trusted by 100,000+ users worldwide.',
  keywords: 'random generator, random number, password generator, name generator, color generator, cryptographically secure',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <FAQSection />
      
      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold text-white mb-4">RANDOM HUB</h3>
              <p className="text-slate-300 mb-4 max-w-md">
                The world's most comprehensive random generation platform. 
                Trusted by developers, researchers, and creatives worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  GitHub
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Discord
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="/numbers/integers" className="hover:text-white transition-colors">Number Generator</a></li>
                <li><a href="/lists/passwords" className="hover:text-white transition-colors">Password Generator</a></li>
                <li><a href="/lists/names" className="hover:text-white transition-colors">Name Generator</a></li>
                <li><a href="/design/colors" className="hover:text-white transition-colors">Color Generator</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Random Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 