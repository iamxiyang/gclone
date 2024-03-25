# gclone

<a href="./README.md">English</a>

`gclone` 是一个用于克隆 Git 项目的工具。它不仅能执行基本的 `git clone` 操作，还能在克隆完成后自动进行额外的操作，比如自动修改 Git 配置、安装依赖、打开编辑器。

## 主要功能

- 自动根据不同的 Git 环境应用相应的配置。
- 可选择在克隆完成后自动安装项目依赖。
- 可选择在克隆完成后自动打开 VSCode 编辑器。

## 如何使用？

### 安装步骤

- 使用 npm 安装：

  ```bash
  npm i -g @iamxiyang/gclone
  ```

- 使用 pnpm 安装：

  ```bash
  pnpm add -g @iamxiyang/gclone
  ```

### 配置设置

运行以下命令以打开配置文件，并根据需要修改配置。如需修改配置，可重复执行此命令。

```bash
gclone-config
```

配置文件示例：

```json5
{
  // 默认配置，适用于所有情况
  '.': {
    git: {
      name: '', // 默认 Git 作者
      email: '', // 默认 Git 作者邮箱
    },
    node: {
      install: false, // 是否自动安装依赖
      package: 'npm', // 项目中存在 package.json 时使用的包管理工具，留空则自动检测
    },
    editor: {
      vscode: true, // 是否自动使用 VS Code 打开项目
    },
  },
  // 仅在 GitHub 地址下生效的配置
  'github.com': {
    git: {
      name: '',
      email: '',
    },
    node: {
      install: false,
      package: '',
    },
    editor: {
      vscode: false,
    },
  },
  // 仅在 xx.com 地址下生效的配置
  'xx.com': {},
}
```

### 使用示例

使用 `gclone` 替代 `git clone` 来克隆项目。`gclone` 支持 `git clone` 的全部参数。

```bash
gclone https://github.com/iamxiyang/glone.git [其他参数]
```

通过以上步骤，您可以轻松地使用 `gclone` 进行项目克隆，并根据需要自动执行额外的操作。
