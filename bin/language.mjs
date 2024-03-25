const messages = {
  'en-US': {
    gitRepositoryUrlNotProvided: 'Git repository URL not provided.',
    successful: 'Successful ✅',
    projectPathNotFound: 'Git cloning completed, but the project path cannot be recognized. Please consider submitting feedback to the project author explaining the parameters you filled in during execution. You can create a new question here: https://github.com/iamxiyang/gclone/issues/new',
    longDependencyInstallation: 'Dependency installation may take a while. Please be patient.',
    configPathManualOpen: 'Configuration file path $1 not provided. If not automatically opened, please manually open for editing.',
    missingConfigPleaseCompleteBeforeUse: 'Missing configuration, please complete configuration before use. Refer to the usage documentation if you encounter any issues.',
  },
  'zh-CN': {
    gitRepositoryUrlNotProvided: '未提供 Git 仓库 URL。',
    successful: 'Successful ✅',
    projectPathNotFound: 'Git 克隆完成，但无法识别项目路径。请考虑向项目作者提交反馈，说明您执行时填写的参数。您可以在这里创建一个新的问题：https://github.com/iamxiyang/gclone/issues/new',
    longDependencyInstallation: '依赖安装可能需要较长时间，请耐心等待。',
    configPathManualOpen: '配置文件路径 $1 ，如果没有自动打开，请手动打开编辑',
    missingConfigPleaseCompleteBeforeUse: '缺少配置，请完成配置后使用。如有问题请参考使用文档',
  },
}

const userLocale = Intl.DateTimeFormat().resolvedOptions().locale

export function getMessage(key, ...params) {
  const message = messages[userLocale] || messages['en-US']
  const template = message[key]

  if (!template) {
    console.error(`Message key "${key}" not found in language "${userLocale}".`)
    return ''
  }

  let result = template
  params.forEach((param, index) => {
    result = result.replace(new RegExp(`\\$${index + 1}`, 'g'), param)
  })

  return result
}
