# Witchly App Admin Portal - AI Coding Guide

## Project Overview
This is a **Next.js 15** admin portal built with **App Router**, **TypeScript**, and **Tailwind CSS v4**. The project emphasizes code quality with automated testing, formatting, and git hooks.

## Tech Stack & Key Dependencies
- **Next.js 15.5.4** with App Router (`app/` directory structure)
- **React 19** with TypeScript 5
- **Tailwind CSS v4** (latest alpha - note the `@import "tailwindcss"` syntax in `globals.css`)
- **Biome** for linting and formatting (replaces ESLint/Prettier)
- **Turbopack** enabled for faster builds (`--turbopack` flag in scripts)
- **Jest** for testing with React Testing Library
- **Husky** + **lint-staged** for automated git hooks

## Development Workflow

### Essential Commands
```bash
npm run dev        # Start dev server with Turbopack
npm run build      # Production build with Turbopack
npm run lint       # Run Biome linter (check only)
npm run format     # Format code with Biome
npm test           # Run full Jest test suite
npm run test:watch # Run tests in watch mode
npm run test:quick # Fast tests (silent mode)
npm run test:coverage # Tests with coverage report
```

### Node Version
Always use **Node.js 22.18.0** (specified in `.nvmrc`). Run `nvm use` before development.

## Automated Quality Gates

### Git Hooks (Husky + lint-staged)
**Every commit automatically:**
1. **Formats code** with `biome check --write` (formatting + linting + import sorting)
2. **Runs related tests** using `jest --findRelatedTests --passWithNoTests`
3. **Blocks commit** if any step fails

**What this means for you:**
- Write code with any formatting → commit → code gets perfectly formatted automatically
- Tests run only for files you changed (smart and fast)
- No need to remember `npm run format` before commits
- Broken code cannot be committed

### Testing Strategy

**Test Location Pattern:**
- **Co-located tests**: Place `component.test.tsx` next to `component.tsx`
- **Example**: `app/page.tsx` has test at `app/page.test.tsx`
- **Global tests**: Use `__tests__/` directory for integration tests

**Jest Configuration:**
- **Environment**: jsdom for React component testing
- **Path aliases**: `@/*` maps to project root
- **Mocks**: Next.js fonts and navigation pre-configured
- **Coverage**: Targets `app/**` and `components/**` directories

## Project Structure & Patterns

### Directory Organization
```
app/                    # Next.js App Router pages
├── layout.tsx         # Root layout with Geist fonts
├── page.tsx          # Dashboard homepage
├── page.test.tsx     # Co-located test for page
├── layout.test.tsx   # Co-located test for layout
├── globals.css       # Tailwind v4 + CSS custom properties
├── components/       # Page-specific components
└── providers/        # Context providers

components/             # Shared/reusable components
└── ui/               # UI component library
```

### Styling Approach
- **Tailwind CSS v4** with inline theme configuration in `globals.css`
- CSS custom properties for theming:
  - `--background: #0a0a0a` (dark theme)
  - `--foreground: #ededed`
  - Font variables: `--font-geist-sans`, `--font-geist-mono`
- Use the `@theme inline` directive for Tailwind theme customization

### Code Quality Tools

**Biome Configuration:**
- **Single command**: `biome check --write` does formatting + linting + import sorting
- **File patterns**: Handles JS/TS/JSX/TSX/JSON/CSS/MD files
- **Git integration**: Respects .gitignore files
- **Rules**: React/Next.js specific linting enabled

### Component Patterns
- Use **default exports** for pages (see `app/page.tsx`)
- **Named function components** with descriptive names (e.g., `Dashboard` not anonymous)
- **Metadata exports** for SEO in layouts and pages
- **Test co-location** - keep tests next to components

## Key Files to Understand
- `app/layout.tsx` - Root layout with font loading and metadata
- `biome.json` - All code quality rules and formatting preferences
- `jest.config.ts` - Test configuration with Next.js integration
- `jest.setup.ts` - Global test setup and mocks
- `.husky/pre-commit` - Git hook that runs lint-staged
- `package.json` - lint-staged configuration for automated workflows

## When Adding Features
1. **Create component** in appropriate directory (`app/` for pages, `components/` for shared)
2. **Add co-located test** (e.g., `Button.test.tsx` next to `Button.tsx`)
3. **Write failing test first** (TDD approach encouraged)
4. **Implement feature** - formatting and linting happen automatically on commit
5. **Commit** - automated hooks ensure quality before code enters repo

## Testing Guidelines
- **Unit tests**: Test component behavior and props
- **Integration tests**: Test page interactions and routing
- **Use Testing Library**: Query by text, role, or accessible elements
- **Mock external dependencies**: Use Jest mocks for APIs, next/navigation, etc.
- **Test file naming**: `*.test.tsx` for components, `*.test.ts` for utilities

## Performance Notes
- **Turbopack**: Used for both dev and build for faster iteration
- **Smart testing**: `--findRelatedTests` runs only tests for changed files
- **lint-staged**: Processes only staged files, not entire codebase
- **Biome**: Single-pass formatting + linting vs multiple tools

This setup ensures consistent code quality, comprehensive testing, and smooth developer experience while maintaining high performance.