#!/usr/bin/env node
import 'zx/globals'
import path from 'path'
import { fileURLToPath } from 'url'
import JSON5 from 'json5'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 配置文件路径
const CONFIG_FILE_NAME = '.gclone-config.jsonc'
const CONFIG_PATH = path.join(os.homedir() || '~/', CONFIG_FILE_NAME)

// 初始化配置
export const initConfig = async () => {
  const defaultConfig = await fs.readFile(path.join(__dirname + '/../', CONFIG_FILE_NAME))
  await fs.outputFile(CONFIG_PATH, defaultConfig)
}

// 打开配置
export const openConfig = async () => {
  try {
    fs.accessSync(CONFIG_PATH)
  } catch (err) {
    await initConfig()
  }
  await $`code ${CONFIG_PATH}`
  echo(`配置文件路径 ${CONFIG_PATH} ，如果没有自动打开，请手动打开编辑`)
}

if (process.argv[1].endsWith('config.mjs')) {
  openConfig()
}

// 读取配置
export const readConfig = async () => {
  try {
    fs.accessSync(CONFIG_PATH)
    const data = await fs.readFile(CONFIG_PATH)
    return JSON5.parse(data)
  } catch (err) {
    console.log(err)
    await initConfig()
    console.log(`缺少配置，请完成配置后使用。如有问题请参考使用文档`)
    process.exit()
  }
}
