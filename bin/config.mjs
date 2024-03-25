#!/usr/bin/env node
import path from 'path'
import os from 'os'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import JSON5 from 'json5'
import shelljs from 'shelljs'

import { getMessage } from './language.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 配置文件路径
const CONFIG_FILE_NAME = '.gclone-config.jsonc'
const CONFIG_PATH = path.join(os.homedir() || '~/', CONFIG_FILE_NAME)

// 初始化配置
export const initConfig = async () => {
  const defaultConfig = await fs.readFile(path.join(`${__dirname}${path.sep}..${path.sep}`, CONFIG_FILE_NAME))
  await fs.outputFile(CONFIG_PATH, defaultConfig)
}

// 打开配置
export const openConfig = async () => {
  try {
    fs.accessSync(CONFIG_PATH)
  } catch (err) {
    await initConfig()
  }
  shelljs.exec(`code ${CONFIG_PATH}`)
  console.log(getMessage('configPathManualOpen', CONFIG_PATH))
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
    console.log(getMessage('missingConfigPleaseCompleteBeforeUse'))
    process.exit()
  }
}
