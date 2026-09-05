Для сборки продакшен версии запускать надо  npm run build

если есть проблемы с node-gyp
https://github.com/octalmage/robotjs/issues/398#issuecomment-392380641

# UniElectron (TQ Reactor)

Десктопное приложение (HMI) для управления химическим реактором: редактор протокола процесса, запуск и остановка процесса по аппаратной части, ручное управление клапанами и мешалкой, графики в реальном времени.

## Возможности

- **Редактор протокола** — canvas-таймлайн с линиями управления (GV1–GV6, HV1–HV3, RPM, TC, AUX1/AUX2): добавление/правка/удаление элементов по времени, зум колесом, панорамирование, миникарта, точный ввод времени, вставка/вырезание интервалов (Insert Space / Remove Space), контекстное меню выделения.
- **Запуск процесса** — серверная часть проигрывает протокол с шагом 1 с, отправляя команды контроллеру по serial; прогресс отображается на таймлайне.
- **Схема реактора** — SVG-схема (дозаторы, баллон инертного газа, реакционная камера, мешалка, клапаны); клик по схеме открывает ручное управление.
- **Ручное управление** — модалка с переключением каждого клапана, вводом оборотов мешалки (0–2500) и опросом фактического состояния клапанов контроллером.
- **Графики** (recharts) — фактические RPM против уставок из протокола, зум/панорама по времени.
- **Протоколы** — сохранение/загрузка JSON-файлов (через диалоги Electron), 8 «быстрых» слотов пресетов (левый клик — загрузить, правый клик — выбрать файл; хранятся в localStorage), WYSIWYG-редактор описания протокола (draft-js).

## Архитектура

Приложение состоит из двух процессов Electron:

```
┌──────────────────────────── main process ────────────────────────────┐
│ app/main.ts                                                          │
│  • BrowserWindow (1400×1200, nodeIntegration, contextIsolation: off) │
│  • Express-сервер на PORT=8000                                       │
│  │   ├─ production: отдаёт HTML с инъектированным бандлом renderer │
│  │   └─ development: webpack-dev-middleware (HMR) + app/index.html  │
│  ├─ socket.io (serveClient: false) — управление процессом            │
│  │   └─ Controller: проигрывание протокола, Serial, Thermostat       │
│  ├─ serial.ts    — SerialPort (Arduino/ATmega)                       │
│  ├─ termex.ts    — термостат TERMEX по USB HID                       │
│  └─ ipcMain: download-button / load-button / temporary-load-button   │
└──────────────────────────────────────────────────────────────────────┘
                    ▲ socket.io (http://localhost:8000)
                    │
┌──────────────────────────── renderer ────────────────────────────────┐
│ React 16 + TypeScript                                                │
│  Main → FormChoserComponent + AppForms                               │
│   ├─ MainForm — состояние протокола, все обработчики                 │
│   └─ Graphs   — recharts (RPM факт vs уставка)                       │
└──────────────────────────────────────────────────────────────────────┘
```

Renderer подключается к main-процессу не через IPC напрямую, а по **socket.io** (`http://localhost:8000`) — тот же сервер отдаёт HTML в production. Исключение — сохранение/загрузка файлов: диалоги открываются через `electron.remote.dialog`, чтение/запись делает main через `ipcRenderer`/`ipcMain`.

Окно создаётся один раз; при новом socket-соединении предыдущий serial-порт отключается, а объект `Controller` переиспользуется (состояние синхронизируется событием `MAKE_CHANGE`).

## Стек

| Часть | Технологии |
|---|---|
| Десктоп | Electron 12, electron-builder |
| UI | React 16, TypeScript, CSS-modules, recharts, react-draft-wysiwyg (draft-js) |
| Сервер в main-процессе | Express + socket.io (порт 8000) |
| Аппаратная связь | serialport (Arduino/ATmega, 500000 baud), node-hid / usb (термостат TERMEX) |
| Сборка | Webpack 4 (main + renderer), Babel, ts-node для dev |

## Структура проекта

```
app/
├── main.ts                     # Electron main: окно, Express+socket.io сервер, IPC save/load файлов
├── start.ts                    # dev-точка входа (spawn npm run main-dev)
├── declaration.d.ts            # декларации типов (socket.io-client и пр.)
├── index.html                  # HTML для dev (загружается через express)
├── config/
│   ├── socket.config.ts        # имена socket-событий, тип startSignal
│   ├── error.config.ts         # имена ошибок (THERMO_STAT_INIT_ERROR, CONNECTION_ERROR)
│   ├── webpack.config.main.prod.babel.js     # сборка main (entry: main.preprod.ts)
│   ├── webpack.config.renderer.prod.babel.js # сборка renderer → app/build/
│   └── webpack.config.renderer.dev.babel.js  # dev-сборка renderer (HMR)
├── server/
│   ├── index.ts                # создание socket.io сервера
│   ├── serial.ts               # SerialPort: поиск порта, подключение (ждёт "CONNECTED"), отправка данных
│   ├── termex.ts               # термостат TERMEX по USB HID (вкл/выкл, уставка, температура, аварии)
│   ├── middlewares/webpack.js  # webpack-dev-middleware для dev
│   └── socketHandlers/
│       ├── connection.ts       # подписки на события каждого клиента, синхронизация MAKE_CHANGE
│       ├── controller.ts       # логика проигрывания протокола: таймер, сборка команд, RPM, термостат
│       └── serialMessages.ts   # коды состояния клапанов от контроллера (C0C/C0O … CS2C/CS2O)
├── src/                        # renderer (React)
│   ├── index.tsx               # точка входа (react-hot-loader)
│   ├── utils.ts                # форматирование времени (сек → дн/ч/мин/с), интервалы для таймлайна
│   └── components/
│       ├── Main/               # корневой компонент: выбор формы (MainForm / Graphs)
│       ├── FormChoserComponent/# переключатель форм (кнопки закомментированы)
│       ├── AppForms/           # создаёт socket.io-клиент, держит MainForm и Graphs, модалка ошибок
│       ├── MainForm/           # основная форма: state протокола + все обработчики
│       │   ├── MainFormInterfaces.ts   # типы: ValveLineType, Change, ShortNames …
│       │   ├── initialConfig.ts        # initialState (демо-протокол) / resetedState (пустые линии GV1…AUX2)
│       │   ├── MainForm.tsx            # контейнер: start/stop/connect, save/load, модалки, Insert/Remove Space
│       │   └── MainFormComponent/
│       │       ├── MainFormComponent.tsx        # layout: sidebar (схема + редактор), canvas, кнопки, пресеты
│       │       ├── ProcessSheetComponent/      # canvas-редактор таймлайна
│       │       │   ├── CanvasProcessSheetComponent2.tsx  # рендер, зум/панорама, выбор, контекстное меню
│       │       │   ├── CanvasConstants.ts      # размеры: LINE_HEIGHT=30, MAX_SCALE_FACTOR=15 и т.д.
│       │       │   ├── useElements.ts          # построение drawable-элементов из lineFormer
│       │       │   ├── CanvasElements/         # ChangeElement, TimeLine, ProcessSelection,
│       │       │   │                           # ContextMenu, Cover (миникарта), HoverLine, SideCover …
│       │       │   ├── Options/                # кнопка options → «Follow time line» (автопрокрутка)
│       │       │   └── TimeLineComponent/      # шкала времени, ввод времени, контекстное меню
│       │       └── ValveTimeComponentAdder/    # кнопки добавления элементов на линии
│       ├── ReactionFlowComponent/  # SVG-схема реактора (клик → ручное управление)
│       ├── Modal/              # ValveLineModal, RMPModal, TempModal, ManualControlModal,
│       │                       # InsertSpaceModal, RemoveSpaceModal, SearchingBoardModal …
│       ├── Graphs/             # recharts: RPM факт vs уставка
│       ├── Canvas/             # обёртка над <canvas> (requestAnimationFrame-рендер)
│       └── HOC/                # withCondition (модалки по условию), withOutSideClick
└── helpers/generators/         # генератор компонентов (npm run create-component)
```

В корне лежат справочные материалы по аппаратной части: даташит ATmega, PDF приводов BLD-120A / BLD-300B, `Reactor scheme.svg`.

## Запуск и сборка

Требуется Node.js и установленные зависимости (`npm install`; postinstall собирает нативные модули через `electron-builder install-app-deps`).

| Команда | Описание |
|---|---|
| `npm start` | Dev-режим: Electron + webpack-dev-middleware (HMR), сервер на `PORT=8000` |
| `npm run build` | Production-сборка: renderer → `app/build/`, инъекция бандла в main (`buildMainProd.js` → `main.preprod.ts`) → webpack main → `app/main.prod.js` + `electron-builder --dir` |
| `npm run pack` | Только упаковка каталога (electron-builder --dir) |
| `npm run dist` | Полный дистрибутив (Windows: nsis, msi) |
| `npm run create-component` | Генератор нового компонента |
| `npm run fix` | eslint --fix |

Для сборки продакшен-версии запускать надо `npm run build`.

### Dev-режим (`npm start`)

1. `ts-node app/start.ts` спавнит `npm run main-dev` → `electron -r babel-register-ts app/main.ts`.
2. В main создаётся Express + socket.io на `PORT=8000`; renderer отдаётся через webpack-dev-middleware (HMR), HTML — `app/index.html`.
3. Окно загружает `http://localhost:8000`.

### Production-сборка (`npm run build`)

1. `build-render` — webpack (renderer.prod) → `app/build/renderer.prod.js` + `app/build/styles.css`.
2. `generate-main-prod` — `buildMainProd.js` подставляет бандл и стили в HTML-шаблон из `main.ts` → `app/main.preprod.ts`.
3. `build-main-pack` — webpack (main.prod, entry `main.preprod.ts`, externals: `serialport`, `node-hid`) → `app/main.prod.js`, затем `electron-builder --dir` → `release/`.

В production окно загружает `http://localhost:8000` и разворачивается на весь экран; сервер отдаёт HTML с инъектированным скриптом.

## Интерфейс

### Layout

- **Левый сайдбар** — SVG-схема реактора (`ReactionFlowComponent`) + WYSIWYG-редактор описания протокола (draft-js, сохраняется в JSON вместе с протоколом).
- **Центр** — canvas-таймлайн протокола: слева имена линий и кнопки добавления элементов, справа — рабочее поле.
- **Под таймлайном** — кнопки `Insert Space`, `Remove Space`, `Manual Control`.
- **Панель управления** — `Connect`, `Start`, `Stop` (неактивна без serial), `Reset`, `Save`, `Load`, `Open/Close valves` (HV1–HV3 вместе).
- **Protocol Set Buttons** — 8 слотов пресетов: левый клик загружает сохранённый в localStorage протокол, правый клик открывает диалог выбора JSON-файла (имя файла становится именем слота).

### Редактор протокола (canvas)

Реализован на Canvas 2D (`CanvasProcessSheetComponent2` + `useElements`), перерисовка через requestAnimationFrame. Координаты мира — секунды, экран = мир × scale − offset.

| Действие | Результат |
|---|---|
| ЛКМ по элементу (прямоугольнику на линии) | открывается модалка редактирования (время, значение RPM/температуры, `waitForValue`) |
| Наведение на элемент | подсветка (HoverLine) |
| Перетаскивание пустой области (ЛКМ) | панорамирование |
| Колесо мыши | зум ×1…×15 (шаг 1), относительно курсора |
| Перетаскивание по шкале времени | выделение интервала (ProcessSelection) |
| ПКМ по выделенному интервалу | контекстное меню: **Remove all** / **Remove changes** / **Insert space** + OK/Cancel |
| Двойной клик по шкале | сброс выделения |
| Клик по метке времени на шкале | точный ввод времени (ChangeTimeForm) |
| Перетаскивание рамки выделения / краёв | перемещение / изменение границ интервала |
| Minimap (Cover) в легенде снизу | перетаскивание — прыжок по таймлайну |
| Кнопка `options` → «Follow time line» | автопрокрутка рабочего поля за прогрессом во время проигрывания |

Редактирование времени валидируется: если интервал пересекает соседний, выставляется `crossingValueStart/End` и предупреждение (`wrongSign`) — сохранение заблокировано. `allTime` пересчитывается как максимум endTime по всем линиям.

### Схема реактора (SVG)

Схема показывает дозаторы (левый/правый), баллон инертного газа, реакционную камеру с мешалкой и все клапаны; во время проигрывания элементы подсвечиваются по текущему времени (`time`). Клик по элементу открывает модалку ручного управления.

### Ручное управление (ManualControlModal)

- Тумблеры GV1–GV6, HV1–HV3 — отправляют `SWITCH_VALVES` в контроллер.
- Поле оборотов мешалки (0–2500, целое) + кнопка запуска/остановки — `SET_RPM_VALUE`.
- Кнопка опроса состояния — `CHECK_VALVES`; фактические состояния приходят событием `VALVE_ACTION` (`C0C/C0O … CS2C/CS2O`) и обновляют тумблеры.

### Графики (Graphs)

recharts ComposedChart: линия фактических RPM (событие `rpmChange`, 1 раз в секунду во время проигрывания) и ступенчатая линия уставок из протокола (строится из изменений линии RPM при `start`). Есть Brush для зума/панорамы по времени. Событие `tempChange` подписано, но график температуры пока не реализован (только логирование).

## Проигрывание процесса (server)

Класс `Controller` (`app/server/socketHandlers/controller.ts`):

- **START** `{lineFormer, allTime}`:
  - если в протоколе есть изменения на линии TC → термостат включается (`RUN WR 1`), ожидание ~7 с;
  - затем запускается интервал с шагом `1000 / velocity` мс (velocity = 1).
- **Каждую секунду**:
  - эмитится `rpmChange` — фактические обороты мешалки, прочитанные из serial;
  - проверка аварий термостата (`ALM.STATUS RD`): при аварии процесс останавливается и уходит `THERMO_STAT_INIT_ERROR`;
  - для каждого изменения с `startTime === currentTime` формируется команда открытия (клапаны `VxY|`, RPM `R9{value}|`, температура → запись в TERMEX), с `endTime === currentTime` — закрытия (`VxN|`, `R90|`);
  - все команды такта собираются в одну строку, эмитируются событием `SERIAL_SENDING` (видны в UI) и отправляются в контроллер.
- **Конец** (`currentTime >= allTime`): отправка `S`, эмит `protocolFinish`, остановка таймера.
- **PAUSE** — останавливает таймер, UI сохраняет прогресс (`distance = 100 · currentTime / allTime`).
- **STOP** — очистка таймеров, отправка `S`, выключение термостата (если был включён) и повторная инициализация HID-устройства через 2 с (после перехода в off-состояние дескриптор HID недоступен).

## Аппаратная часть и протоколы обмена

### Serial-контроллер (Arduino/ATmega)

Подключение: `serialport`, **500000 baud**, parity none, разделитель строк `\n\r`.
Поиск порта (`Connect`): перебираются последний и первый порты из `SerialPort.list()`, порт считается рабочим, если контроллер отвечает `CONNECTED` (таймаут ~3 с).

Команды, отправляемые в контроллер (разделитель `|`, конец строки `\n`):

| Команда | Назначение |
|---|---|
| `V0Y| … V5Y|` / `V0N| … V5N|` | открыть/закрыть газовые клапаны GV1–GV6 |
| `V6Y|…V8Y|` / `V6N|…V8N|` | открыть/закрыть гидравлические клапаны HV1–HV3 |
| `R9{обороты}|` (напр. `R9500|`) | задать обороты мешалки |
| `R90|` | остановить мешалку |
| `S\n` | стоп процесса |
| `C0|C1|C2|C3|C4|C5|CS0|CS1|CS2|\n` | запросить фактическое состояние клапанов |

Ответы контроллера: `CONNECTED`, коды состояния клапанов `C0C`/`C0O` … `C5C`/`C5O` (GV1–GV6), `CS0C`/`CS0O` … `CS2C`/`CS2O` (HV1–HV3) — ретранслируются в UI событием `VALVE_ACTION`. Текущие обороты мешалки контроллер передаёт по serial и используются для графика (`rpmChange`).

> ⚠️ Известный дефект: остановка мешалки из ручного управления шлёт `R90}|\n` (лишний символ `}`) — см. `controller.ts`, `rpmStart`.

### Термостат TERMEX (USB HID, node-hid)

Ищется среди HID-устройств по `manufacturer === 'TERMEX'`. Команды шлются в формате `:{serialNumber} <КОМАНДА>`:

| Команда | Назначение |
|---|---|
| `RUN WR 1` / `RUN WR 0` | включить/выключить термостат |
| `RUN RD` | прочитать состояние (при инициализации) |
| `SET.VAL WR {t}` | задать температуру (строка TC протокола) |
| `DAT.T.2 RD` | прочитать текущую температуру |
| `ALM.STATUS RD` | статус аварий (`000000` — норма); при аварии процесс останавливается с ошибкой |

Термостат включается автоматически при старте, если в протоколе есть изменения на линии TC; после остановки HID-устройство инициализируется заново (с задержкой). Ошибки чтения/связи обрабатываются `ErrorHandler`: во время включения/выключения контроллер пересоздаётся через 3 с, иначе ошибка уходит в UI (`THERMO_STAT_INIT_ERROR`).

### События socket.io

Клиент → сервер:

| Событие | Payload | Назначение |
|---|---|---|
| `START` | `{lineFormer, allTime}` | начать проигрывание протокола |
| `PAUSE` / `STOP` | — | пауза / остановка |
| `CONNECT` | — | поиск и подключение serial-порта |
| `SWITCH_HV` | `boolean` | открыть/закрыть HV1–HV3 разом |
| `SET_RPM_VALUE` | `number` | задать обороты мешалки (ручное управление) |
| `SWITCH_VALVES` | `{shorName, value}` | переключить один клапан (ручное управление) |
| `CHECK_VALVES` | — | запросить фактическое состояние клапанов |
| `MAKE_CHANGE` | полное состояние формы | синхронизация состояния между клиентами |

Сервер → клиент:

| Событие | Payload | Назначение |
|---|---|---|
| `CONNECTED` | `boolean` | serial подключён/отключён |
| `SEARCHING_SERIAL` | `boolean` | идёт поиск порта (модалка SearchingBoard) |
| `SERIAL_CLOSED` | — | порт закрыт |
| `SERIAL_SENDING` | `string` | команда, уходящая в контроллер (показ в UI) |
| `start` | `{distance, time}, lineFormer` | старт: прогресс + протокол (для графиков) |
| `pause` / `stop` | `{currentTime}` / счётчик | пауза/стоп и прогресс |
| `rpmChange` | `{data, time}` | фактические обороты мешалки |
| `tempChange` | `{temperature, time}` | температура (каждые 5 с) |
| `VALVE_ACTION` | `C0C … CS2O` | фактическое состояние клапана |
| `protocolFinish` | — | протокол отыгран до конца |
| `THERMO_STAT_INIT_ERROR` / `CONNECTION_ERROR` | `{name, message}` | ошибки термостата/связи (модалка в AppForms) |

## Формат протокола (JSON)

```jsonc
{
  "lineFormer": [
    {
      "name": "ValveLine",        // ValveLine | RPMSetter | TempSetter | AUX
      "id": 0,                    // V0..V8 / R9 / T10 / A11 / A12
      "shortName": "GV1",
      "description": "Reactor gas inlet",
      "changes": [
        { "startTime": 20, "endTime": 39, "changeId": 0, "duration": 19 }
      ]
    },
    { "name": "RPMSetter", "id": 9, "shortName": "RPM", "changes": [
        { "startTime": 0, "endTime": 50, "value": 500, "changeId": 0, "waitForValue": false }
    ]},
    { "name": "TempSetter", "id": 10, "shortName": "TC", "changes": [
        { "startTime": 0, "endTime": 30, "value": 32, "changeId": 0, "waitForValue": false }
    ]}
  ],
  "allTime": 350,                 // общая длительность, сек
  "editorState": { /* raw draft-js: описание протокола */ }
}
```

Линии по умолчанию (id фиксирован, используется в командах serial):

| id | shortName | name | Назначение | Команда |
|---|---|---|---|---|
| 0–5 | GV1–GV6 | ValveLine | газовые клапаны реактора и дозаторов (in/out) | `V0`–`V5` |
| 6–8 | HV1–HV3 | ValveLine | гидравлика (левый/правый дозатор, слив реактора) | `V6`–`V8` |
| 9 | RPM | RPMSetter | мешалка | `R9{обороты}` |
| 10 | TC | TempSetter | термостат TERMEX | `SET.VAL WR {t}` |
| 11–12 | AUX1/AUX2 | AUX | вспомогательные линии | `A11`/`A12` |

Поля изменения (`Change`): `startTime`/`endTime` (сек), `changeId`, `duration`, `value` (обороты или температура, для RPM/TC), `waitForValue` (ожидание достижения значения RPM — недоработано), `crossingValueStart/End` (служебные: пересечение с соседним интервалом при редактировании).

## Известные задачи

(из `notes.txt.txt`)

1. Поправить просмотр (скролл) при узком экране.
2. Доделать `waitForValue` (ожидание достижения значения RPM перед продолжением).
3. Ввести масштабирование временной шкалы рабочего поля.

Дополнительно замечено при изучении кода:

4. `waitForValue` не срабатывает вовсе: в `controller.ts` проверяется `line.idname === 'R8'`, а у линии RPM idname — `R9`; кроме того, `checkingValues` после достижения значения не возобновляет проигрывание.
5. Остановка мешалки из ручного управления шлёт `R90}|\n` (лишний символ `}`) — `rpmStart`.
6. График температуры не реализован: `tempChange` в Graphs только логируется.
