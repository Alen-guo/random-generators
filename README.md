# 🎲 Random Generators - Free Online Random Generator Tools

![Random Generators Logo](https://random-generators.org/og-image.png)

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Random Generators is a comprehensive collection of free online random generator tools designed for developers, researchers, designers, and anyone who needs truly random data. From simple number generators to complex password creators, we've got you covered.

## ✨ Features

### 🔢 Number Generators
- **Random Integers**: Generate random whole numbers within any range
- **Random Decimals**: Precise decimal number generation
- **Prime Numbers**: Generate cryptographically secure prime numbers
- **Number Sequences**: Create arithmetic and geometric sequences

### 🔐 Security Tools
- **Password Generator**: Create secure passwords with customizable criteria
- **API Key Generator**: Generate secure API keys for development
- **Security Checker**: Analyze password strength and security

### 👤 Identity Generators
- **Name Generator**: Generate names from 15+ cultural backgrounds
- **Quote Generator**: Inspirational quotes from famous personalities
- **Facts Generator**: Interesting facts across multiple categories

### 🎨 Design Tools
- **Color Generator**: Generate colors in HEX, RGB, HSL, HSV, CMYK formats
- **Gradient Generator**: Create beautiful CSS gradients
- **Font Pairing**: Discover perfect font combinations

### 🎮 Gaming Tools
- **Dice Roller**: Virtual dice for tabletop games
- **Card Shuffler**: Shuffle and deal playing cards
- **Lottery Generator**: Generate lottery numbers for various games
- **Tournament Bracket**: Create single/double elimination brackets

### 🛠️ Developer Tools
- **JSON Generator**: Create realistic test data
- **Regex Generator**: Generate and test regular expressions
- **IP Generator**: Create IPv4/IPv6 addresses for testing

### 🎯 Decision Tools
- **Decision Maker**: Yes/No/Maybe decision generator
- **Random Picker**: Pick from custom lists

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or later
- npm 8.0 or later

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/random-generators/random-generators.git
   cd random-generators
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🏗️ Production Deployment

### Environment Variables

Create a `.env.production` file with the following variables:

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://random-generators.org
NEXT_PUBLIC_GA_MEASUREMENT_ID=GA_MEASUREMENT_ID
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```

### Build Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm start

# Analyze bundle size
npm run analyze
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/random-generators/random-generators)

1. Click the "Deploy" button above
2. Connect your GitHub account
3. Configure environment variables
4. Deploy!

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/random-generators/random-generators)

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── numbers/           # Number generators
│   ├── lists/             # List generators
│   ├── design/            # Design tools
│   ├── games/             # Gaming tools
│   ├── web/               # Developer tools
│   └── decisions/         # Decision tools
├── components/            
│   ├── ui/                # Base UI components
│   ├── generators/        # Generator components
│   ├── common/            # Shared components
│   └── landing/           # Landing page components
├── lib/
│   ├── generators/        # Core generator logic
│   └── utils/            # Utility functions
├── types/                 # TypeScript type definitions
└── hooks/                # Custom React hooks
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#8B5CF6)
- **Secondary**: Blue (#06B6D4)
- **Accent**: Pink (#EC4899)
- **Background**: Slate (#0F172A)

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: Responsive scale from 12px to 72px

### Components
All components follow the atomic design methodology and are built with accessibility in mind.

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:turbo        # Start with Turbopack (faster)

# Quality Assurance
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Build & Deploy
npm run build            # Build for production
npm run start            # Start production server
npm run analyze          # Analyze bundle size

# Utilities
npm run lighthouse       # Run Lighthouse audit
npm run sitemap          # Generate sitemap
```

### Code Quality

We use several tools to maintain code quality:

- **ESLint**: Linting JavaScript/TypeScript
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Lint-staged**: Run linters on staged files
- **TypeScript**: Static type checking

### Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new random color generator
fix: resolve password generation issue
docs: update README with deployment guide
style: format code with prettier
refactor: optimize number generation algorithm
test: add tests for password generator
chore: update dependencies
```

## 🚀 Performance

### Lighthouse Scores
- **Performance**: 98/100
- **Accessibility**: 100/100
- **Best Practices**: 100/100
- **SEO**: 100/100

### Optimizations
- Static site generation (SSG)
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Tree shaking for smaller bundles
- Compression and caching headers

## 🔒 Security

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- Referrer-Policy

### Data Privacy
- No user data collection
- No tracking without consent
- GDPR compliant
- No cookies for core functionality

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'feat: add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Vercel](https://vercel.com/) for hosting and deployment
- All contributors who help make this project better

## 📞 Support

- 📧 Email: support@random-generators.org
- 🐦 Twitter: [@randomgenerators](https://twitter.com/randomgenerators)
- 💬 Discord: [Join our community](https://discord.gg/randomgenerators)
- 🐛 Issues: [GitHub Issues](https://github.com/random-generators/random-generators/issues)

---

<div align="center">
  <strong>Made with ❤️ by the Random Generators Team</strong>
  <br>
  <a href="https://random-generators.org">https://random-generators.org</a>
</div>
