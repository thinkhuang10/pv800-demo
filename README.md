# PV800 Demo (Angular)

这是一个 Angular 工程，包含“上传图片 UI”示例，并使用可复用方框组件实现页面中的所有方块。

## 功能说明

- 上传图片入口（文件选择按钮 + 文件名显示）
- 统一风格的方框 UI（与示例图一致）
- 每个方框都由 `ConfigBox` 组件实现
- 通过 `@Input` 配置颜色、尺寸和布局（行/列、分段颜色、文本等）

## 运行项目

```bash
npm install
npm start
```

启动后访问 `http://localhost:4200/`。

## 构建

```bash
npm run build
```

构建产物位于 `dist/pv800-demo/`。
