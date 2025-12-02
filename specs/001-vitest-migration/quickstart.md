# Quickstart: Running Vitest Tests

## Prerequisites
- Node.js 18+
- NPM 10+

## Installation
Dependencies are installed via the root `npm install`.

## Running Tests

### Run all tests (Chromium, Headless)
```bash
cd packages/nimble-components
npm run test
```

### Run in specific browser
```bash
npm run test -- --browser=firefox
npm run test -- --browser=webkit
```

### Run in UI Mode (Debugging)
```bash
npm run test -- --ui
```

### Watch Mode
```bash
npm run test -- --watch
```
