# threejs-run — AI 使用指南

> 配套类型声明：`index.d.ts` ｜ 对应版本：1.1.11 ｜ 生成：2026-10-22

## 一句话定位

Three.js 快速开发 3D 模型应用的三个类：`ThreeNormal`（常规模型自建几何体）、`ThreeGltf`（加载 glb/gltf 模型）、`ThreeGltfOperate`（相机飞行聚焦）。three 及所有控件**外部注入**，本包零运行时依赖。

## 何时用 / 何时不用

**用**：Vue3 页面快速搭 3D 模型查看器——轨道控制、glb 加载（含 draco 压缩）、点击拾取、窗口自适应、一键清理。
**不用**：Vue2（install 用 Vue3 的 globalProperties API）；同页多个 3D 实例（模块级共享状态，只允许每类 1 个）；React/非 Vue 项目；需要深度定制渲染管线（这是薄工具类，不是组件）。

## 安装与引入

```bash
npm i threejs-run three -S   # ⚠️ three 不是本包依赖，必须自己装
```
```ts
import ThreejsRun from 'threejs-run';
app.use(ThreejsRun);                              // 全局挂 $ThreeNormal / $ThreeGltf / $ThreeGltfOperate
const { ThreeNormal, ThreeGltf, ThreeGltfOperate } = ThreejsRun;   // 局部使用（named import 不可靠）
```

GLTF 场景另需 three 自带控件（随 three 安装）：
```ts
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
```
`@tweenjs/tween.js` 已打进产物，无需安装。无样式文件。

## API 语义速查

| 能力 | 用法 |
| --- | --- |
| 构造（Normal） | `new ThreeNormal(THREE, this, dom, w, h, { OrbitControls })` |
| 构造（Gltf） | `new ThreeGltf(THREE, this, dom, { baseUrl, gltfUrl, dracoUrl }, w, h)` |
| 初始化 | `threeD.init({ GLTFLoader, DRACOLoader, OrbitControls, initCamera?, initMaterial?, windowResize? })`（Normal 无前 3 参） |
| 生命周期 | `cleanThree()` 释放资源——**beforeUnmount 必须调** |
| 点击拾取 | `initClick(event, dom, (raycaster) => …)`（仅左键；回调里自行 `raycaster.intersectObjects(list)`） |
| 相机聚焦 | `ThreeGltfOperate.lookAt({ THREE, threeD, materialList, targetObserveDistance=30, distance=0 })` |
| 换素材 | `changeMaterial((scene) => …)` |
| 相机回正 | `cameraHz()` |

init 回调执行顺序（Normal）：`initMaterial(scene)` → `initLight(scene)` → `initCamera()` → `initWebGLRenderer(scene)` → `initControls(scene, windowResize)`；不传即用内置实现。Gltf 版在 glb **加载成功后**才走灯光/相机/渲染器。

## 最小可运行示例

```vue
<template>
  <!-- ⚠️ ref="webglBox" 必须有：内置 resize 硬编码读 $refs.webglBox -->
  <div ref="webglBox" id="webgl" style="width: 100%; height: 400px;"></div>
</template>
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import ThreejsRun from 'threejs-run';
const { ThreeNormal } = ThreejsRun;

export default {
  data() { return { threeD: null }; },
  mounted() {
    this.$nextTick(() => {
      const dom = document.getElementById('webgl');
      this.threeD = new ThreeNormal(THREE, this, dom,
        this.$refs.webglBox.offsetWidth, this.$refs.webglBox.offsetHeight,
        { OrbitControls });
      this.threeD.init({
        initMaterial: (scene) => {
          scene.add(new THREE.AxesHelper(50));
          scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
            [new THREE.MeshBasicMaterial({ color: 0x00ff00 })]));  // ⚠️ 材质传数组
        },
      });
    });
  },
  beforeUnmount() { this.threeD?.cleanThree(); },   // ⚠️ 必须调，否则 rAF 循环泄漏
};
</script>
```

## 典型组合（Gltf 加载 + 拾取 + 聚焦完整链路）

```js
this.threeD = new ThreeGltf(THREE, this, dom, {
  baseUrl: import.meta.env.BASE_URL, gltfUrl: '3d/test.glb', dracoUrl: 'draco/',
}, w, h);
this.threeD.init({
  GLTFLoader, DRACOLoader, OrbitControls,
  windowResize: () => this.threeD.windowResize(),   // ⚠️ Gltf 不传则完全不挂 resize
  initMaterial: (gltf) => {
    this.materialList = [];                          // 收集可点击/聚焦的 Object3D
    gltf.scene.traverse((child) => { if (child.isMesh) this.materialList.push(child); });
  },
});
// 点击：raycaster 拾取
const onClick = (event) => this.threeD.initClick(event, dom, (raycaster) => {
  const hits = raycaster.intersectObjects(this.materialList);
  if (hits.length && hits[0].object.visible) { /* 业务 */ }
});
window.addEventListener('mousedown', onClick);
// 聚焦：⚠️ 须在模型加载完成后再调（Gltf 的 controls 加载后才创建）
ThreeGltfOperate.lookAt({ THREE, threeD: this.threeD, materialList: [mesh], targetObserveDistance: 30 });
// 销毁
window.removeEventListener('mousedown', onClick);
this.threeD.cleanThree();
```

## 典型错误对照（错 → 对）

| ❌ 错误 | ✅ 正确 | 原因 |
| --- | --- | --- |
| `import { ThreeNormal } from 'threejs-run'` | `ThreejsRun.ThreeNormal`（default 后解构） | ESM 产物仅 default 导出，named import 依赖 CJS 互操作不可靠 |
| `<script setup>` 里 `new ThreeNormal(THREE, this, …)` | `getCurrentInstance().proxy` 或 Options API | `that` 要 Vue 实例（内部用 $nextTick/$refs），setup 语法无 this |
| 模板不写 `ref="webglBox"` | 加 `ref="webglBox"` | 内置 windowResize 硬编码 `_this.$refs.webglBox` |
| 同页 new 两个 ThreeGltf（或 Normal） | 每类只 1 个实例 | THREE/_this/scene 是模块级变量，多实例互相覆盖 |
| beforeUnmount 不调 cleanThree | 必调 | rAF 循环、WebGL 上下文不释放，切页内存泄漏 |
| `new THREE.Mesh(g, material)` 单材质 + cleanThree | 材质传数组 `[material]` | cleanThree 里 `materials.forEach` 假定 material 是数组，单材质抛 TypeError |
| ThreeGltf 不传 windowResize 以为有自适应 | 传 `windowResize: () => this.threeD.windowResize()` | Gltf 版**无内置回退**（Normal 版才有） |
| Gltf 传了 initCamera 却不建相机 | 回调里 `this.threeD.camera = new THREE.PerspectiveCamera(...)` | 传了就覆盖内置，相机须自建 |
| init 一完成就调 lookAt | 等 glb 加载完（initMaterial 之后/用户交互时） | Gltf 的 controls 是加载回调里才创建 |
| 装 `@tweenjs/tween.js` | 不用装 | 已打进产物 |
| `tools: { OrbitControls, GLTFLoader }` | 只需 `{ OrbitControls }` | Normal 代码只用 OrbitControls（README 多写） |

## 版本兼容与已知坑

- Vue3 only；Options / Setup 都行，但 `that` 参数必须是组件实例。
- `windowResize` 是**整体赋值** `window.onresize`（不是 addEventListener）：会顶掉页面其他 resize 监听，且组件销毁后旧闭包仍挂在 window 上，需自行恢复。
- `cleanThree()` 后实例属性全置 null，实例不可复用，重新 new。
- lookAt 落点是 `targetPosition + (30, 30, 30)` 各轴等值外推（`addScalar`），不是沿视线方向拉远——目标偏轴时落点会偏。
- `initClick` 仅响应左键，且每次调用会把 renderer 尺寸重设为 dom 的 `getBoundingClientRect()`。
- 版本 1.1.11 与 npm 线上一致；本地产物 index.js（ESM）/index.umd.cjs（UMD）同包，`"type": "module"`。
