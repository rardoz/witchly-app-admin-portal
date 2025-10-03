# Witchly App Admin Portal

A modern **Next.js 15** admin portal built with **TypeScript**, **Tailwind CSS v4**, and a comprehensive development workflow featuring automated code quality enforcement.

## 🚀 Tech Stack

- **Next.js 15.5.4** with App Router and Turbopack
- **React 19** with TypeScript 5
- **Tailwind CSS v4** (alpha) for styling
- **Biome** for lightning-fast linting and formatting
- **Jest** with React Testing Library for testing
- **Husky + lint-staged** for automated git hooks

## 📋 Prerequisites

- **Node.js 22.18.0** (use `nvm use` to switch to the correct version)
- **npm** (comes with Node.js)

## 🛠️ Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your actual values
# The file is gitignored for security
```

### 3. Start Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧪 Code Quality & Testing

This project enforces code quality through multiple automated layers:

### **Biome - Lightning Fast Linting & Formatting**

[Biome](https://biomejs.dev/) replaces ESLint and Prettier with a single, faster tool.

```bash
# Check code quality (linting only)
npm run lint

# Format and fix issues automatically
npm run format
```

**What Biome does:**
- ⚡ **Formatting**: Consistent code style (indentation, quotes, etc.)
- 🔍 **Linting**: Catches bugs, unused variables, and code issues
- 📦 **Import sorting**: Organizes imports automatically
- 🏃 **Speed**: 10x faster than ESLint/Prettier combo

### **Jest - Comprehensive Testing**

Testing strategy focuses on co-located tests for better organization:

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Quick tests (silent, used in git hooks)
npm run test:quick
```

**Test Organization:**
- **Co-located tests**: `component.test.tsx` next to `component.tsx`
- **Example**: `app/page.tsx` → `app/page.test.tsx`
- **Integration tests**: Use `__tests__/` directory
- **Mocking**: Next.js fonts and navigation pre-configured

### **Automated Git Hooks (Husky + lint-staged)**

**Every commit automatically:**

1. **🔧 Formats code** with Biome
2. **🔍 Fixes linting issues** automatically
3. **🧪 Runs related tests** only for changed files
4. **❌ Blocks commit** if any step fails

```bash
# This happens automatically on every commit:
git add .
git commit -m "feat: add new component"

# Behind the scenes:
# ✅ Biome formats and fixes your code
# ✅ Tests run for related files only
# ✅ Code gets committed with perfect quality
```

**What this means for you:**
- Write code in any style → commit → gets perfectly formatted
- No need to remember `npm run format` 
- Broken code cannot enter the repository
- Tests run smartly (only for changed files)

## 📁 Project Structure

```
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with fonts
│   ├── layout.test.tsx      # Layout tests
│   ├── page.tsx             # Homepage
│   ├── page.test.tsx        # Homepage tests
│   ├── globals.css          # Tailwind v4 + CSS variables
│   ├── components/          # Page-specific components
│   └── providers/           # Context providers
├── components/              # Shared components
│   └── ui/                  # Reusable UI components
├── lib/                     # Utilities and configurations
├── .github/
│   ├── workflows/ci.yml     # GitHub Actions CI
│   └── copilot-instructions.md # AI coding guidelines
├── .husky/                  # Git hooks
├── jest.config.ts           # Jest configuration
├── jest.setup.ts            # Global test setup
├── biome.json              # Biome configuration
└── .env.example            # Environment variables template
```

## 🎨 Styling with Tailwind CSS v4

This project uses **Tailwind CSS v4** (alpha) with modern features:

```css
/* app/globals.css */
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
}
```

**Key differences from v3:**
- `@import "tailwindcss"` syntax
- `@theme inline` directive for theming
- CSS custom properties integration

## 🔄 CI/CD Pipeline

GitHub Actions automatically run on every push and pull request:

1. **Lint Check**: Runs `npm run lint`
2. **Test Suite**: Runs `npm run test:coverage` 
3. **Coverage Reports**: Uploads test coverage artifacts
4. **Quality Gates**: Prevents merging broken code

View results in the **Actions** tab of your GitHub repository.

## 📊 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build production application |
| `npm run start` | Start production server |
| `npm run lint` | Run Biome linter (check only) |
| `npm run format` | Format code with Biome |
| `npm test` | Run full Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |
| `npm run test:quick` | Fast, silent tests (for git hooks) |

## 🔐 Environment Variables

See `.env.example` for all available variables. Key patterns:

- **Server-only**: `DATABASE_URL`, `API_SECRET_KEY`
- **Client-accessible**: `NEXT_PUBLIC_APP_NAME` (browser-safe)

## 🚀 Deployment

This project is optimized for deployment on **Vercel**, **Railway**, or any Node.js hosting platform.

**Environment Setup:**
1. Set environment variables in your hosting platform
2. Ensure Node.js 22.18.0 compatibility
3. Build command: `npm run build`
4. Start command: `npm run start`

## 🤝 Contributing

1. **Code Quality**: Enforced automatically via git hooks
2. **Testing**: Write tests for new features (co-located preferred)
3. **Commits**: Use conventional commit format
4. **CI**: All checks must pass before merging

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Biome Documentation](https://biomejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Jest Testing Framework](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
