# 月下塔罗 · Moonlit Tarot

一个无需安装依赖的中文塔罗网页，适配电脑与手机。

## 打开

直接打开 `dist/index.html` 即可离线使用。也可安装 Node.js 后，在本目录运行 `npm start`，访问 http://127.0.0.1:4173。

## 内容

- 完整 78 张牌，原创 SVG 象征插画与预先编写的正逆位参考牌义。
- 165 个主题入口：11 个常见牌阵、100 个生活主题、22 个大牌主题、24 个星座新月与满月主题、8 个月相主题。主题变体可以共享布局。
- 自由抽牌、自建牌阵、分支探索、补充说明、双人轮抽、多人故事、盲解练习、牌义挑战、随机推荐、实体牌录入。
- 搜索、按张数筛选、收藏、可编辑的抽牌手记、JSON 备份导入与导出。
- 双人和多人采用同一设备轮流操作；没有远程房间、账户、云同步或 AI 解读服务。

## 随机规则

`crypto.getRandomValues()` 提供密码学安全随机数。拒绝采样消除取模偏差，Fisher–Yates 生成牌序。每轮开始时独立确定正逆位，启用时各 50%；本轮所有选牌、分支和补充都从同一剩余牌组移除，不重复抽取。输入的问题不参与抽牌算法。

这不宣称物理来源的真随机。浏览器若不提供安全随机接口，系统会报错而不会降级到 `Math.random()`。

## 本机数据

数据保存在当前浏览器的 localStorage。更换浏览器、设备或清理站点数据后不会自动恢复，请使用“我的手记 → 导出全部备份”保存记录。备份含有私人笔记，请妥善保管。

## 检查

`npm test` 检查牌组、165 个主题的有效性、拒绝采样边界、正逆位、完整牌组耗尽与粗略分布。

`npm run test:browser` 在 Windows 的 Microsoft Edge 无界面浏览器中检查页面、全部十种模式、笔记和数据备份。测试需要允许启动本机浏览器，图片保存到 `qa-output/`。

## 参考

- [Labyrinthos 牌阵资料](https://labyrinthos.co/pages/tarot-spreads-list)
- [Biddy Tarot 凯尔特十字](https://biddytarot.com/masterclass/celtic-cross/)
- [Tarot.com 十二宫牌阵](https://www.tarot.com/readings-reports/tarot-readings/horoscope-tarot)
- [W3C Web Crypto](https://www.w3.org/TR/webcrypto/#Crypto-method-getRandomValues)

牌面、中文说明与主题提问为本站编写；常见牌阵存在不同流派与牌位版本，以网页实际列出的含义为准。
