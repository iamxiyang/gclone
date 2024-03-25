# gclone

<a href="./README_CN.md">中文说明</a>

`gclone` is a tool for cloning Git projects. It not only performs basic `git clone` operations but also automatically performs additional tasks after cloning, such as modifying Git configurations, installing dependencies, and opening an editor.

## Key Features

- Automatically applies different configurations based on different Git environments.
- Optionally installs project dependencies automatically after cloning.
- Optionally opens the VSCode editor automatically after cloning.

## How to Use?

### Installation Steps

- Using npm:

  ```bash
  npm i -g @iamxiyang/gclone
  ```

- Using pnpm:

  ```bash
  pnpm add -g @iamxiyang/gclone
  ```

### Configuration Settings

Run the following command to open the configuration file and modify it as needed. You can repeat this command to make further changes.

```bash
gclone-config
```

Example configuration file:

```json5
{
  // Default configuration, applicable to all cases
  '.': {
    git: {
      name: '', // Default Git author
      email: '', // Default Git author email
    },
    node: {
      install: false, // Whether to automatically install dependencies
      package: 'npm', // Package management tool to use when a package.json is present in the project; leave empty to auto-detect
    },
    editor: {
      vscode: true, // Whether to automatically open the project with VS Code
    },
  },
  // Configuration applicable only to GitHub addresses
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
  // Configuration applicable only to xx.com addresses
  'xx.com': {},
}
```

### Usage Example

Use `gclone` instead of `git clone` to clone a project. `gclone` supports all parameters of `git clone`.

```bash
gclone https://github.com/iamxiyang/glone.git [other parameters]
```

With these steps, you can easily clone projects using `gclone` and perform additional tasks as needed.
