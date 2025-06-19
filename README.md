# Daily Macros Tracking Application

A React TypeScript application for tracking daily macronutrients (protein, carbs, fats) and calories.

## Features

- User authentication (login/signup)
- Macro target setting
- Meal logging and tracking
- Dashboard with progress visualization
- Responsive design

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components (buttons, cards, etc.)
│   └── figma/          # Figma-specific components
├── pages/              # Page components
│   ├── LoginScreen.tsx
│   ├── LoginForm.tsx
│   ├── SignupScreen.tsx
│   ├── Dashboard.tsx
│   ├── MacroTargets.tsx
│   └── MealLogging.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── index.ts
├── hooks/              # Custom React hooks (future use)
├── assets/             # Images, icons, etc. (future use)
├── styles/             # Global styles and Tailwind CSS
│   └── globals.css
├── App.tsx             # Main application component
└── main.tsx            # React entry point
```

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts (for data visualization)
- Lucide React (for icons)
- Shadcn/ui components
- Radix UI primitives 