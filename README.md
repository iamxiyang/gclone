# gclone

替代`git clone`，克隆 Git 项目的同时完成一些额外操作。  

# 特点
* 使用方式和`git clone`几乎一样。
* 不同 Git 环境自动使用不同的配置。
* 克隆完成自动安装项目依赖（可选）。
* 克隆完成自动打开VS Code（可选）。

# 安装

1. 全局安装

```bash
#npm
npm i -g @iamxiyang/gclone
#pnpm
pnpm add -g @iamxiyang/gclone
```

2. 完成配置

```bash
# 键入以下命令打开配置文件，后续如需修改配置，重复执行该命令
gclone-config
```

```jsonc
{
  // 默认生效规则，不符合其他规则时使用该规则
  ".": {
    "git": {
      "name": "", // Git作者
      "email": "" // Git作者email
    },
    "node": {
      "install": false, // 项目中存在package.json时克隆完成自动安装依赖
      "package": "npm" // npm/pnpm/yarn/bun，留空则自动分析项目适合的包管理工具
    },
    "editor": {
      "vscode": true // 克隆完成自动通过vscode打开
    }
  },
  // 只有git仓库地址包含github.com才生效
  "github.com": {
    "git": {
      "name": "",
      "email": ""
    },
    "node": {
      "install": false,
      "package": ""
    },
    "editor": {
      "vscode": false
    }
  },
  // 只有git仓库地址包含xx.com才生效
  "xx.com": {}
}
```

3. 克隆项目时使用 `gclone` 替代 `git clone`

```bash
# 之前
git clone https://github.com/iamxiyang/glone.git [其他参数]
# 之后
gclone https://github.com/iamxiyang/glone.git [其他参数]
```

# 为什么要做？

电脑中有很多 Git 项目，Git 配置项是不同的，比如公司内项目提交作者是真实姓名、开源项目是网名。

检出新项目时经常忘记修改项目内的 Git 配置，一直以来也没有发现很好的方案（如果你有好的方案请告诉我），突发奇想尝试写一个脚本来解决这个问题。欢迎参与贡献~