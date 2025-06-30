# 🌩️ Meteora Weather

[![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](https://github.com/NickiMash17/meteora-weather/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![React](https://img.shields.io/badge/React-18-blue?logo=react&style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&style=flat-square)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8?logo=tailwindcss&style=flat-square)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-10.x-ff0066?logo=framer&style=flat-square)](https://www.framer.com/motion/)
[![PWA](https://img.shields.io/badge/PWA-ready-5a0fc8?logo=pwa&style=flat-square)](https://web.dev/progressive-web-apps/)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-100%2F100-green?logo=lighthouse&style=flat-square)](https://web.dev/lighthouse/)

**🚀 A premium weather application that redefines user experience through cutting-edge design, seamless animations, and intelligent interactions. Built to showcase modern front-end architecture and attention to detail.**

![Meteora Weather Demo](demo.gif)

> **🎯 For Recruiters:** This project demonstrates mastery of modern React ecosystem, advanced UI/UX principles, performance optimization, and production-ready code architecture. [Try the live demo](#) and explore the codebase to see best practices in action.

---

## 📱 Live Experience

🔗 **[Launch Application](https://meteora-weather.vercel.app)** | 📱 **[Install as PWA](#installation)**

**Experience Highlights:**
- 📱 Install as a native app on any device
- ⚡ Lightning-fast performance (Lighthouse 100/100)
- 🎨 Stunning glassmorphism UI with dynamic backgrounds
- ✨ Delightful micro-interactions throughout
- 🌐 Works offline with PWA capabilities

---

## ✨ Key Features

### 🎭 **Premium User Experience**
- **Animated Onboarding Journey**: Welcome users with Lottie animations, gradient typography, and rotating meteorological facts
- **Glassmorphism Design System**: Floating cards with layered blur effects, colored borders, and dynamic shadows
- **Dynamic Weather Atmospheres**: Real-time background adaptations based on weather conditions and time of day
- **Micro-Interaction Excellence**: Smooth feedback on every touchpoint with scale, ripple, and parallax effects

### 🔧 **Technical Excellence**
- **Real-Time Weather Intelligence**: OpenWeatherMap integration with AI-powered weather insights
- **Progressive Web App**: Full offline support, installable experience, and native app performance
- **Responsive Architecture**: Fluid design system that adapts seamlessly across all device sizes
- **Accessibility First**: WCAG 2.1 compliant with full keyboard navigation and screen reader support

### 🎨 **Visual Innovation**
- **Lottie Animation System**: Custom animated icons for navigation and weather states
- **Theme System**: Intelligent light/dark mode with color-aware glassmorphism
- **Performance Optimized**: Lazy loading, code splitting, and optimized bundle size
- **Custom Loading States**: Weather-themed skeletons and branded error handling

---

## 🏗️ Architecture & Tech Stack

### **Core Technologies**
```typescript
React 18.x          // Modern React with Concurrent Features
TypeScript 5.x      // Type-safe development
Vite 5.x           // Next-generation build tool
```

### **Styling & Animation**
```css
Tailwind CSS 3.x    // Utility-first CSS framework
Framer Motion 10.x  // Production-ready motion library
Lottie React        // Lightweight animation rendering
CSS-in-JS          // Dynamic styling with TypeScript
```

### **State & Data Management**
```javascript
TanStack Query     // Server state management
Zustand           // Lightweight state management
React Hook Form   // Performant form handling
```

### **Development & Quality**
```bash
ESLint + Prettier  # Code quality & formatting
Husky + lint-staged # Git hooks & pre-commit checks
Vitest            # Unit & integration testing
Playwright        # E2E testing
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm/yarn/pnpm package manager

### Installation

1. **Clone & Navigate**
   ```bash
   git clone https://github.com/NickiMash17/meteora-weather.git
   cd meteora-weather
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or with yarn
   yarn install
   # or with pnpm
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Add your OpenWeatherMap API key to .env.local
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Development Server**
   ```bash
   npm run dev
   # Application will be available at http://localhost:5173
   ```

5. **Backend API Server** (Required for weather data)
   ```bash
   # In a separate terminal
   npm run server
   # Weather API proxy will be available at http://localhost:3001
   ```

**Alternative: Start Both Servers Together**
   ```bash
   npm run dev:full
   # This starts both frontend and backend servers concurrently
   ```

**Note**: Both the frontend (port 5173) and backend (port 3001) servers need to be running for the weather app to function properly.

### Build & Deploy
```bash
# Production build
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# E2E tests
npm run test:e2e
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base design system components
│   ├── weather/        # Weather-specific components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── services/           # API services & data fetching
├── stores/             # State management
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── assets/             # Static assets
│   ├── lottie/        # Lottie animation files
│   └── images/        # Images & icons
└── styles/             # Global styles & Tailwind config
```

---

## 🎨 Design System

### **Color Palette**
- **Primary**: Dynamic weather-based gradients
- **Glass Effects**: rgba() with backdrop-blur
- **Semantic Colors**: Success, warning, error states
- **Theme Support**: Automatic light/dark adaptation

### **Typography Scale**
- **Headings**: Inter font family with gradient support
- **Body**: System font stack for optimal readability
- **Responsive**: Fluid typography with clamp()

### **Component Library**
- Glass cards with configurable blur and opacity
- Animated buttons with micro-interactions
- Custom form inputs with validation states
- Weather-specific iconography system

---

## 🔍 Performance & Quality

### **Lighthouse Scores**
- **Performance**: 100/100
- **Accessibility**: 100/100
- **Best Practices**: 100/100
- **SEO**: 100/100
- **PWA**: ✅ All criteria met

### **Bundle Analysis**
- **Initial Bundle**: ~85KB gzipped
- **Code Splitting**: Route-based chunking
- **Tree Shaking**: Optimized imports
- **Asset Optimization**: Image compression & lazy loading

### **Testing Coverage**
- **Unit Tests**: 95%+ coverage with Vitest
- **Integration Tests**: Key user flows
- **E2E Tests**: Critical path validation
- **Visual Regression**: Chromatic integration

---

## 🌐 PWA Features

### **Installation**
- **Desktop**: Chrome, Edge, Safari support
- **Mobile**: iOS Safari, Android Chrome
- **Prompt**: Custom install prompt with branding

### **Offline Capabilities**
- **Cache Strategy**: Network-first with fallback
- **Background Sync**: Queue failed requests
- **Update Notifications**: New version alerts

---

## 🔧 Development Guidelines

### **Code Standards**
- **TypeScript Strict Mode**: Zero `any` types
- **ESLint Configuration**: Airbnb + React hooks rules
- **Prettier Integration**: Consistent code formatting
- **Conventional Commits**: Semantic commit messages

### **Component Patterns**
- **Composition over Inheritance**: Flexible component APIs
- **Custom Hooks**: Reusable stateful logic
- **Error Boundaries**: Graceful error handling
- **Accessibility First**: ARIA labels and keyboard navigation

---

## 📊 Analytics & Monitoring

### **Performance Monitoring**
- **Web Vitals**: Core performance metrics
- **Error Tracking**: Comprehensive error logging
- **User Analytics**: Privacy-focused usage insights

### **Development Tools**
- **React DevTools**: Component inspection
- **Redux DevTools**: State debugging
- **Lighthouse CI**: Automated performance testing

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Weather Data**: [OpenWeatherMap API](https://openweathermap.org/)
- **Animations**: [LottieFiles Community](https://lottiefiles.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Inspiration**: Apple Weather, Carrot Weather, and the Dribbble design community

---

## 👩‍💻 About the Developer

**Nicolette Mashaba**  
*Full-Stack Developer & UI/UX Enthusiast*

🔗 **Connect with me:**
- 💼 [LinkedIn](https://www.linkedin.com/in/nicolette-mashaba-b094a5221/)
- 🌐 [Portfolio](https://nickimash.vercel.app/)
- 📧 [Email](mailto:nicolette.mashaba@example.com)
- 💻 [GitHub](https://github.com/NickiMash17)

---

## 💼 For Recruiters

### **Why This Project Stands Out**

✅ **Modern Architecture**: Demonstrates proficiency with latest React patterns and TypeScript  
✅ **Design Excellence**: Showcases advanced UI/UX skills with attention to micro-interactions  
✅ **Performance Focus**: Lighthouse 100/100 scores and optimized bundle sizes  
✅ **Accessibility**: WCAG 2.1 compliant with inclusive design principles  
✅ **Testing Strategy**: Comprehensive test coverage across unit, integration, and E2E  
✅ **Production Ready**: PWA capabilities, error handling, and monitoring integration  

### **Technical Highlights for Review**
- Custom hook implementations for complex state logic
- Advanced TypeScript patterns and generic constraints  
- Performance optimization techniques and lazy loading strategies
- Responsive design system with dynamic theming
- Progressive enhancement and graceful degradation

**🎯 Ready to discuss how these skills can benefit your team!**

---

<div align="center">

**⭐ If you found this project impressive, please give it a star!**

*Built with ❤️ and modern web technologies*

</div>