# 系统评价小鼠眼睑异常表型

后续三篇文献加进来之前的网页版总结。文献编号为【1】Widjaja、【2】Dong。

公开阅读：**https://yyu337119-ship-it.github.io/Eyelid/**

目录四级：**一、** → **1、** → **①** → **（1）**。点「编辑正文」后，左侧目录的编号和标题也可以改；改完点 **保存到公开页**，别人刷新就能看到。

## 在网页上改完怎么保存，别人才能看到

「编辑正文」只是打开编辑；「退出编辑」**不会**发布。必须点右上角绿色的 **保存到公开页**，别人刷新公开页才能看到。

1. 打开 https://yyu337119-ship-it.github.io/Eyelid/
2. 点 **编辑正文**，改正文、换图，或直接改左侧目录的四级标题。
3. 点绿色 **保存到公开页**。
4. 第一次会弹出令牌框。必须用账号 **yyu337119-ship-it** 登录。GitHub **没有**一条叫「Repository permissions → Contents：Read and write」的选项。那是：
   - 打开[预填好 Contents 的新建页](https://github.com/settings/personal-access-tokens/new?name=Eyelid%20handbook%20save&description=Commit%20live.json%20to%20the%20public%20handbook&target_name=yyu337119-ship-it&contents=write)
   - Resource owner 选 `yyu337119-ship-it`
   - Repository access 选 **Only select repositories**，再选 **Eyelid**
   - 往下滚到 **Permissions**（中文：「权限」），点开 **Repository permissions**（「存储库权限」）
   - 找到 **Contents**（「内容」）这一行，右侧下拉从 No access 改成 **Read and write**（「读取和写入」）
   - Generate 后复制，粘贴进网页，点 **保存令牌并发布**
   - 如果还是没有 Contents 这一行：改用 [经典令牌](https://github.com/settings/tokens/new?description=Eyelid%20handbook%20save&scopes=public_repo)，勾选 **public_repo** 即可
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
