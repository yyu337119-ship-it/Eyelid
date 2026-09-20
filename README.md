# 系统评价小鼠眼睑异常表型

后续三篇文献加进来之前的网页版总结。文献编号为【1】Widjaja、【2】Dong。

公开阅读：**https://yyu337119-ship-it.github.io/Eyelid/**

## 在网页上改完怎么保存，别人才能看到

「编辑正文」只是打开编辑；「退出编辑」**不会**发布。必须点右上角绿色的 **保存到公开页**，别人刷新公开页才能看到。

1. 打开 https://yyu337119-ship-it.github.io/Eyelid/
2. 点 **编辑正文**，改字或换图。
3. 点绿色 **保存到公开页**。
4. 第一次会弹出令牌框。到 [新建 fine-grained token](https://github.com/settings/personal-access-tokens/new) 创建：
   - Resource owner：`yyu337119-ship-it`
   - 只勾仓库 **Eyelid**
   - Repository permissions → **Contents: Read and write**
   - Generate 后复制，粘贴进网页，点 **保存令牌并发布**
5. 令牌只存在你这个浏览器里，不会写进网页源码。换电脑或清站点数据后要再贴一次。
6. GitHub Actions 大约 1 分钟重建公开页。刷新后别人就能看到这次修改。

未点保存的修改只会留在当前浏览器的未保存草稿里。

## 文献

- 【1】Widjaja-Adhi MAK, et al. *IOVS* 2026; 67(6):34.
- 【2】Dong F, et al. *Developmental Biology* 2015; 406(2):147–157.

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开 [http://127.0.0.1:43127](http://127.0.0.1:43127)。
