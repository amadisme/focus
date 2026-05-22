# 打包发布指南

## 使用 Electron Builder 打包

### 1. 安装 electron-builder

```bash
npm install --save-dev electron-builder
```

### 2. 更新 package.json

在 `package.json` 中添加以下配置：

```json
{
  "scripts": {
    "start": "electron .",
    "dev": "electron . --inspect=5858",
    "pack": "electron-builder --dir",
    "dist": "electron-builder"
  },
  "build": {
    "appId": "com.smartantisedentary.app",
    "productName": "Smart Anti-Sedentary",
    "mac": {
      "category": "public.app-category.healthcare-fitness",
      "icon": "src/assets/icon.png",
      "target": [
        "dmg",
        "zip"
      ]
    },
    "win": {
      "icon": "src/assets/icon.png",
      "target": [
        "nsis",
        "portable"
      ]
    },
    "linux": {
      "icon": "src/assets/icon.png",
      "target": [
        "AppImage",
        "deb"
      ],
      "category": "Utility"
    }
  }
}
```

### 3. 打包命令

#### macOS
```bash
npm run dist -- --mac
```

输出：
- `dist/Smart Anti-Sedentary-1.0.0.dmg`
- `dist/Smart Anti-Sedentary-1.0.0-mac.zip`

#### Windows
```bash
npm run dist -- --win
```

输出：
- `dist/Smart Anti-Sedentary Setup 1.0.0.exe`
- `dist/Smart Anti-Sedentary 1.0.0.exe` (portable)

#### Linux
```bash
npm run dist -- --linux
```

输出：
- `dist/Smart Anti-Sedentary-1.0.0.AppImage`
- `dist/smart-anti-sedentary_1.0.0_amd64.deb`

### 4. 测试打包（不生成安装包）

```bash
npm run pack
```

这会在 `dist` 目录生成未打包的应用，可以快速测试。

## 使用 Electron Packager 打包（轻量级）

### 1. 安装 electron-packager

```bash
npm install --save-dev electron-packager
```

### 2. 添加打包脚本

在 `package.json` 中添加：

```json
{
  "scripts": {
    "package-mac": "electron-packager . SmartAntiSedentary --platform=darwin --arch=x64 --icon=src/assets/icon.png --out=dist --overwrite",
    "package-win": "electron-packager . SmartAntiSedentary --platform=win32 --arch=x64 --icon=src/assets/icon.png --out=dist --overwrite",
    "package-linux": "electron-packager . SmartAntiSedentary --platform=linux --arch=x64 --icon=src/assets/icon.png --out=dist --overwrite"
  }
}
```

### 3. 打包

```bash
npm run package-mac    # macOS
npm run package-win    # Windows
npm run package-linux  # Linux
```

## 图标要求

### macOS (.icns)
需要创建 .icns 文件：
```bash
# 使用 iconutil (macOS内置)
mkdir icon.iconset
sips -z 16 16 src/assets/icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32 src/assets/icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32 src/assets/icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64 src/assets/icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128 src/assets/icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256 src/assets/icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256 src/assets/icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512 src/assets/icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512 src/assets/icon.png --out icon.iconset/icon_512x512.png
iconutil -c icns icon.iconset -o src/assets/icon.icns
```

### Windows (.ico)
使用在线工具或 ImageMagick：
```bash
convert src/assets/icon.png -define icon:auto-resize=256,128,64,48,32,16 src/assets/icon.ico
```

## 发布清单

- [ ] 更新版本号（package.json）
- [ ] 创建合适的图标（.icns, .ico）
- [ ] 测试所有平台的打包
- [ ] 签名应用（macOS/Windows）
- [ ] 创建发布说明
- [ ] 上传到 GitHub Releases 或其他平台

## 代码签名（可选但推荐）

### macOS
需要 Apple Developer 账号：
```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name (TEAM_ID)"
    }
  }
}
```

### Windows
需要代码签名证书：
```json
{
  "build": {
    "win": {
      "certificateFile": "path/to/cert.pfx",
      "certificatePassword": "password"
    }
  }
}
```

## 自动更新（可选）

使用 electron-updater：

```bash
npm install electron-updater
```

在 main.js 中添加：
```javascript
const { autoUpdater } = require('electron-updater');

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

## 文件大小优化

1. 排除不必要的文件：
```json
{
  "build": {
    "files": [
      "src/**/*",
      "package.json"
    ],
    "extraFiles": []
  }
}
```

2. 使用 asar 打包：
```json
{
  "build": {
    "asar": true
  }
}
```

## 测试打包后的应用

打包完成后，务必测试：
- [ ] 应用是否正常启动
- [ ] 闲置时间检测是否工作
- [ ] 系统托盘是否显示
- [ ] 通知是否正常
- [ ] 重置功能是否正常
- [ ] 在干净的系统上测试（无开发环境）
