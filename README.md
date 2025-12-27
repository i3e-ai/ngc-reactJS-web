# NGC ReactJS Web Application

A modern, responsive web application built with Next.js 15, React 19, TypeScript, and LESS for styling. Features comprehensive error handling, optimized fonts/images, and BEM architecture.

## 🚀 Quick Start

First, install dependencies and run the development server:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Tech Stack

- **Framework**: Next.js 15.5.4 with React 19.1.0
- **Language**: TypeScript (strict mode)
- **Styling**: LESS with global variables & BEM architecture
- **Fonts**: Optimized with `next/font` (Sora, Geist)
- **Images**: Next.js Image optimization (AVIF/WebP)
- **Error Handling**: React Error Boundaries + Suspense

## 🏗️ Project Structure

```
src/app/
├── blocks/           # Main UI blocks (Header, Footer, Navigation, etc.)
├── components/       # Reusable components (ErrorBoundary, Loading, etc.)
├── data/            # Static data (navigation, content)
├── hooks/           # Custom React hooks
├── styles/          # Global LESS variables & base styles
└── utils/           # Utility functions
```

## 🎨 Component Architecture

### BEM Naming Convention

All components use BEM (Block Element Modifier) structure:

```css
.block {
}
.block__element {
}
.block__element--modifier {
}
```

### Global LESS Variables

```less
// Typography
@font-primary: var(--font-sora), sans-serif;
@font-secondary: var(--font-geist), sans-serif;
```

## 📱 Key Features

- **Responsive Design**: Mobile-first approach with optimized navigation
- **Performance Optimized**: Font preloading, image optimization, lazy loading
- **Error Boundaries**: Comprehensive error handling with fallback UI
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Development server with hot reload
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint code checking
npm run less-watch   # Watch LESS files for changes
```

### Development Workflow

1. **Styling**: Edit `.less` files → Auto-compiles to `.css`
2. **Components**: Follow BEM naming + TypeScript interfaces
3. **Images**: Add to `/public/assets/` → Use `OptimizedImage` component
4. **Error Testing**: Use `ErrorBoundary` wrapper for async components

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual Build

```bash
npm run build
npm start
# Serves on http://localhost:3000
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Follow** BEM naming conventions for CSS classes
4. **Add** TypeScript interfaces for all props/data
5. **Test** error boundaries around async operations
6. **Commit** with conventional messages: `feat:`, `fix:`, `docs:`
7. **Push** and create Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Follow provided configuration
- **BEM**: Use `.block__element--modifier` structure
- **LESS**: Utilize global variables from `styles.less`
- **Commits**: Use conventional commit format

## 📚 Key Dependencies

```json
{
  "next": "15.5.4",
  "react": "19.1.0",
  "typescript": "5.7.2",
  "@types/node": "22.10.1"
}
```

## 📄 License

This project is licensed under the MIT License.

---
