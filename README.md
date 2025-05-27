# Radio App

A modern web application for streaming radio stations built with React, TypeScript, and Vite.

## Features

- 🎵 Stream radio stations from around the world
- ⭐ Save favorite stations
- 📱 Responsive design for all devices
- 🎚️ Volume control
- 🌙 Dark/Light theme support
- 🔄 Recent stations history
- ⚙️ User preferences
- 🔐 User authentication

## Tech Stack

- **Frontend Framework**: React + TypeScript + Vite
- **UI Library**: Material-UI
- **State Management**: Zustand
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/radio-app.git
cd radio-app/client
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the client directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
client/
├── src/
│   ├── components/     # React components
│   │   ├── Player.tsx  # Audio player component
│   │   ├── StationList.tsx
│   │   └── ...
│   ├── contexts/       # React contexts
│   │   └── AuthContext.tsx
│   ├── services/       # API services
│   │   ├── radioService.ts
│   │   └── preferencesService.ts
│   ├── store/         # State management
│   │   └── radioStore.ts
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── public/            # Static files
└── package.json       # Dependencies
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### ESLint Configuration

The project uses TypeScript-aware ESLint rules. You can extend the configuration in `eslint.config.js`:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

## Deployment

The application is configured for deployment on Vercel:

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI:
```bash
npm install -g vercel
```

3. Deploy to Vercel:
```bash
vercel
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Radio Browser API](https://api.radio-browser.info/) for radio station data
- [Material-UI](https://mui.com/) for the UI components
- [Supabase](https://supabase.io/) for backend services
- [Vite](https://vitejs.dev/) for the build tool
