#!/usr/bin/env node
import 'zx/globals'
import path from 'path'
import { fileURLToPath } from 'url'
import updateNotifier from 'update-notifier'
import { readConfig } from './config.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = fs.readJSONSync(__dirname + '/../package.json')

// 检测升级
updateNotifier({ pkg }).notify({ isGlobal: true })

// 读取参数
const argv = process.argv.splice(2)

// 读取配置
const allConfig = await readConfig()
const argvStr = argv.join(' ')
const configKey =
  Object.keys(allConfig).find((url) => {
    if (url === '.') return false
    return argvStr.includes(url)
  }) || '.'
const config = allConfig[configKey] || {}

// 执行 git clone
let gitProjectPath = ''
try {
  const log = await $`git clone ${argv}`
  gitProjectPath = (log.stdout || log.stderr || log).replace(/Cloning\sinto\s'(.+)'.../, '$1').trim()
  if (!gitProjectPath) {
    echo('没有识别出项目路径')
  }
} catch (p) {}

// 进入项目
if (!gitProjectPath) {
  process.exit()
}
cd(gitProjectPath)

// 执行git config
if (config?.git?.email) {
  await $`git config --local user.email "${config?.git?.email}"`
}
if (config?.git?.name) {
  await $`git config --local user.name "${config?.git?.name}" `
}

const finPackageManager = async () => {
  const LOCKS = {
    'bun.lockb': 'bun',
    'pnpm-lock.yaml': 'pnpm',
    'yarn.lock': 'yarn',
    'package-lock.json': 'npm',
    'npm-shrinkwrap.json': 'npm',
  }
  const files = await glob(Object.keys(LOCKS), {
    absolute: false,
    markDirectories: true,
    deep: 1,
  })
  return LOCKS[files?.[0]]
}

// 执行 code .
if (config?.editor?.vscode) {
  await $`code .`
}

// 安装依赖
if (config?.node?.install) {
  // 判断是不是node项目
  const files = await glob(['package.json'], {
    absolute: false,
    markDirectories: true,
    deep: 1,
  })
  if (!files?.[0]) {
    process.exit()
  }
  console.log('依赖安装时间较长，请耐心等待，也可以终止进程手动安装')

  switch (config?.node?.package || (await finPackageManager())) {
    case 'bun':
      await $`bun install`
      break
    case 'pnpm':
      await $`pnpm install`
      break
    case 'yarn':
      await $`yarn add`
      break
    default:
      await $`npm i`
  }
}
