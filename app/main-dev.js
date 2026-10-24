// Dev-вход для Electron >= 28: entry с import-синтаксисом уходит в ESM-лоадер,
// минуя require.extensions (babel-register-ts). CJS-shim возвращает main.ts
// в классический require-пайплайн, где babel транслирует TS.
require('./main.ts')
