# 系统评价小鼠眼睑异常表型

按解剖部位整理小鼠眼睑/眼表异常的系统评价路径，编号与核心文献汇报 PPT 首页一致：

1. **MG 及其分泌物**
   - 1、MG　①腺体形态与组织学　②分子标志物
   - 2、睑脂　①大体外观与排出　②组分与物理性状
2. **角膜和泪膜、泪液**
3. **结膜**
4. **眼睑相关肌肉**

每个检测分支固定写出：**检测手段/仪器、分子标志物、观察结果、原文图表**。一级、二级、三级标题后均标注文献【1】～【5】。打开页面即可在每张图下方「替换图片」或「添加图表」。点「编辑正文」可改文字。修改保存在本机浏览器，导出 JSON 会带上替换图。

## 文献

- 【1】Gardon DJ, et al. *Developmental Biology* 2026; 534:209–214. DOI 10.1016/j.ydbio.2026.03.010. K6⁺ 中央导管敲除 Abca12，过度角化诱发干眼。
- 【2】Widjaja-Adhi MAK, et al. *IOVS* 2026; 67(6):34. Awat2−/− 睑脂组分与蒸发性干眼。
- 【3】Tchegnon E, et al. *JCI Insight* 2021; 6(20):e151078. KROX20 标记 MG 干/祖细胞。
- 【4】Zhu X, et al. *Nature Communications* 2025; 16:1663. MG 干细胞群、Hedgehog 与衰老。
- 【5】Dong F, et al. *Developmental Biology* 2015; 406(2):147–157. 眼睑基质过表达 TGFα 扰乱 MG 与睑板形态发生。

## 本地运行

需要 Node.js 18+。

```bash
npm install
npm run dev
```

浏览器打开 [http://127.0.0.1:43127](http://127.0.0.1:43127)。

## 发布到公网

站点是静态导出，内容与本地预览相同。访客打开链接即可阅读；「编辑正文 / 替换图片」仍只保存在每位访客自己的浏览器里。

```bash
npm install
npm run build
npx vercel deploy out --prod --yes
```

也可把 `out/` 拖到 [Netlify Drop](https://app.netlify.com/drop) 或 [Cloudflare Pages](https://pages.cloudflare.com)。
