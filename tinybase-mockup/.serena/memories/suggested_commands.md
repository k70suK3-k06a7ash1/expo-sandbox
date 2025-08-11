# Essential Development Commands

## Development Server
- `npm start` - Start Expo development server (shows QR code)
- `npm run android` - Start on Android emulator/device
- `npm run ios` - Start on iOS simulator/device  
- `npm run web` - Start web development server

## Testing
- `npm test` or `npm run test` - Run tests in watch mode
- `npm run test:run` - Run all tests once
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:watch` - Run tests in watch mode (explicit)

## Code Quality
- `npm run lint` - Run ESLint to check code quality
- `npx tsc --noEmit` - Run TypeScript type checking without emitting files

## Utilities  
- `npm run reset-project` - Reset project to initial state using custom script

## Git Hooks (Lefthook)
Pre-commit hooks automatically run:
- Linting (`npm run lint`)
- Tests (`npm run test:run`)
- Type checking (`npx tsc --noEmit`)

## Coverage Thresholds
Vitest is configured with 80% coverage thresholds for branches, functions, lines, and statements.