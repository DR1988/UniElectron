const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

function git(cmd, capture) {
  const out = execSync(`git ${cmd}`, { stdio: capture ? "pipe" : "inherit" })
  return out == null ? "" : out.toString()
}

function fail(msg) {
  console.error(`\nОШИБКА: ${msg}`)
  process.exit(1)
}

const target = (process.argv.slice(2).find(a => !a.startsWith("-")) || "").replace(/^v/, "")
if (!target) {
  console.log("Использование: npm run release <версия>   (пример: npm run release 1.0.3)")
  process.exit(1)
}

const parts = target.split(".")
if (parts.length !== 3 || parts.some(p => !/^\d+$/.test(p))) {
  fail(`"${target}" — не semver в формате X.Y.Z`)
}

const pkgPath = path.join(__dirname, "package.json")
const raw = fs.readFileSync(pkgPath, "utf8")
const m = raw.match(/^(\s*)"version":\s*"([^"]+)"/m)
if (!m) fail("не найдено поле version в package.json")
const current = m[2]

const cur = current.split(".").map(Number)
const nxt = parts.map(Number)
const greater =
  nxt[0] > cur[0] ||
  (nxt[0] === cur[0] && nxt[1] > cur[1]) ||
  (nxt[0] === cur[0] && nxt[1] === cur[1] && nxt[2] > cur[2])
if (!greater) fail(`версия ${target} не больше текущей ${current}`)

let tagExists = false
try {
  git(`rev-parse -q --verify refs/tags/v${target}`, true)
  tagExists = true
} catch (e) {}
if (tagExists) fail(`тег v${target} уже существует`)

const branch = git("rev-parse --abbrev-ref HEAD", true).trim()
if (branch !== "master") {
  console.warn(`\nВНИМАНИЕ: текущая ветка "${branch}", не master — тег будет создан на этом коммите\n`)
}

const status = git("status --porcelain", true)
if (status.trim()) {
  console.warn("\nВНИМАНИЕ: есть незакоммиченные изменения — в коммит попадёт только package.json:\n" + status.trim() + "\n")
}

fs.writeFileSync(pkgPath, raw.replace(m[0], `${m[1]}"version": "${target}"`))

git(`add package.json`)
git(`commit -m "Добавлено: бамп версии до ${target} для релиза"`)
git("push")
git(`tag v${target}`)
git(`push origin v${target}`)

console.log(`\nРелиз v${target}: тег опубликован. CI соберёт и опубликует GitHub Release (~5–7 мин).`)
