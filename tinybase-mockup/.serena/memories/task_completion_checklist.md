# Task Completion Checklist

## Before Committing Code
When a development task is completed, run these commands to ensure code quality:

### 1. Type Checking
```bash
npx tsc --noEmit
```
Ensures TypeScript types are correct with no compilation errors.

### 2. Linting  
```bash
npm run lint
```
Checks code style and potential issues using ESLint with Expo config.

### 3. Test Suite
```bash
npm run test:run
```
Runs the complete test suite to ensure nothing is broken.

### 4. Coverage Check (Optional)
```bash
npm run test:coverage
```
Verify code coverage meets the 80% threshold for all metrics.

## Git Hooks (Automatic)
The project uses Lefthook which automatically runs the above checks on `pre-commit`:
- Linting
- Type checking  
- Test execution

If any of these fail, the commit will be blocked until issues are resolved.

## Testing Best Practices
- Tests are located in `__tests__/` directories alongside source code
- Vitest environment: jsdom for React Native compatibility
- Coverage includes: `lib/`, `hooks/`, `components/` directories
- Excludes: test files, node_modules, build artifacts