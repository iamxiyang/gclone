#!/usr/bin/env node
import shelljs from 'shelljs'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import updateNotifier from 'update-notifier'
import minimist from 'minimist'
import gitUrlParse from 'git-url-parse'
import { globby } from 'globby'

import { getMessage } from './language.mjs'
import { readConfig } from './config.mjs'

process.env.FORCE_COLOR = 3

// Check for updates
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = fs.readJSONSync(path.resolve(__dirname, '../package.json'))
updateNotifier({ pkg }).notify({ isGlobal: true })

// Parse arguments
const argv = minimist(process.argv.slice(2))
const argvStr = process.argv.slice(2).join(' ')

const gitUrl = argv['_'].shift()
if (!gitUrl) {
  console.error(getMessage('gitRepositoryUrlNotProvided'))
  process.exit(1)
}
const gitProject = gitUrlParse(gitUrl)
const gitProjectPath = argv['_'].at(-1) || gitProject.name

// Read configuration
const allConfig = await readConfig()
const configKey = Object.keys(allConfig).find((url) => url !== '.' && gitProject.href.includes(url)) || '.'
const config = allConfig[configKey] || {}

const cloneGitRepo = () => {
  const { code } = shelljs.exec(`git clone ${argvStr}`)
  if (code !== 0) {
    throw new Error('Git clone failed.')
  }
}

const checkProjectPath = () => {
  if (!gitProjectPath || !fs.existsSync(gitProjectPath)) {
    throw new Error(`${getMessage('projectPathNotFound')} ${gitProjectPath}`)
  }
}

const executeGitConfig = () => {
  if (config?.git?.email) {
    shelljs.exec(`git config --local user.email ${config.git.email}`, { cwd: gitProjectPath })
  }
  if (config?.git?.name) {
    shelljs.exec(`git config --local user.name ${config.git.name}`, { cwd: gitProjectPath })
  }
}

const findPackageManager = async () => {
  const LOCKS = {
    'bun.lockb': 'bun',
    'pnpm-lock.yaml': 'pnpm',
    'yarn.lock': 'yarn',
    'package-lock.json': 'npm',
    'npm-shrinkwrap.json': 'npm',
  }
  const files = await globby(Object.keys(LOCKS), {
    absolute: false,
    markDirectories: true,
    deep: 1,
    cwd: gitProjectPath,
  })
  return LOCKS[files?.[0]]
}

const openProjectInEditor = () => {
  if (config?.editor?.vscode) {
    shelljs.exec(`code ${gitProjectPath}`)
  }
}

const installDependencies = async () => {
  if (config?.node?.install) {
    const files = await globby(['package.json'], {
      absolute: false,
      markDirectories: true,
      deep: 1,
      cwd: gitProjectPath,
    })
    if (!files?.[0]) {
      process.exit()
    }
    console.log(getMessage('longDependencyInstallation'))
    const packageManager = config?.node?.package || (await findPackageManager())
    switch (packageManager) {
      case 'bun':
        shelljs.exec(`bun install`, { cwd: gitProjectPath })
        break
      case 'pnpm':
        shelljs.exec(`pnpm install`, { cwd: gitProjectPath })
        break
      case 'yarn':
        shelljs.exec(`yarn add`, { cwd: gitProjectPath })
        break
      default:
        shelljs.exec(`npm install`, { cwd: gitProjectPath })
        break
    }
  }
}

const main = async () => {
  try {
    cloneGitRepo()
    checkProjectPath()
    executeGitConfig()
    openProjectInEditor()
    await installDependencies()
    console.log(getMessage('successful'))
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

main()
