# UniElectron — правила для агента

## Git
- Коммит начинается со слова «Добавлено:» (пример: «Добавлено: self-healing для TERMEX»)
- Язык сообщений — русский, кратко о сути изменения
- Коммит и push — только по явному запросу пользователя; без запросов не инициировать
- Перед коммитом: `git status` + `git diff` — в индексе только предназначенные файлы
- Не коммитить временные файлы (test-*.js, *.log), секреты и ключи
- Не делать force-push, не менять git config

## Сборка и проверка
- Проверка типов: `./node_modules/.bin/tsc --noEmit -p tsconfig.json` — базовый уровень 45 ошибок (skipLibCheck включён); успех = не больше 45 и без новых категорий
- ESLint в проекте недоступен (не запускать)

## CI / GitHub Actions
- Воркфлоу: `.github/workflows/build-linux.yml`, `build-windows.yml` — запуск по тегу `v*` или вручную (workflow_dispatch); на обычные push сборки не идут
- Релиз = поднять версию в package.json + коммит + тег `v<та же версия>` + push; по тегу electron-builder сам публикует GitHub Release (фид для автообновления)
- Автообновление: electron-updater в main.ts, фид — GitHub Releases; работает только в packaged-сборке и только для NSIS (Windows) / AppImage (Linux), не для deb
- Артефакты прогонов: `linux-build` / `windows-build` (каталог release/)
- CI: Node 20, `npm install --ignore-scripts`, electron-builder сам пересобирает нативные модули (node-hid, serialport) под Electron; сборка с `NODE_OPTIONS=--openssl-legacy-provider` (webpack 4)
- Linux-раннер требует системные зависимости для нативных модулей (сейчас libusb/libudev) — шаг в воркфлоу; при добавлении новых нативных зависимостей обновлять его
- Проверка прогонов — MCP github: list_workflow_runs → логи упавших джоб; повтор — rerun_failed_jobs; ручной запуск — workflow_dispatch (actions_run_trigger)

## Запуск и тестирование
- Приложение: `npm start` (dev-сервер, HMR для renderer; серверные правки требуют полного перезапуска)
- Нативные модули (node-hid, serialport) работают только под Electron: тесты — `./node_modules/.bin/electron -r babel-register-ts --no-sandbox <script>`, системный Node падает ERR_DLOPEN_FAILED
- Скрипты должны лежать внутри проекта (для резолва node_modules) и завершаться process.exit()

## Аппарат
- TERMEX: USB HID, VID ffff / PID 0003, /dev/hidraw*; CH340 serial: /dev/ttyUSB0, 500000 baud
- Права на USB — через udev (правила в README, раздел «Доступ к USB-устройствам»)

## Осторожность
- Пользователь правит файлы параллельно (WIP): перед правкой перечитывать файл; чужие незавершённые изменения не откатывать
