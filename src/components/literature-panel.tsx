import { sources } from "@/data/content"

export function LiteraturePanel() {
  return <main id="literature" className="literature-panel">
    <header className="literature-heading">
      <p>SHEET 02 / LITERATURE OVERVIEW</p>
      <h2>文献思路概览</h2>
      <div>从研究背景、核心问题与动物模型，理解两篇文献的研究思路。</div>
    </header>
    <div className="literature-table-wrap" tabIndex={0} role="region" aria-label="文献思路概览，可横向滚动">
      <table className="literature-table">
        <caption className="sr-only">两篇眼睑与眼表研究文献的思路对照</caption>
        <thead><tr><th scope="col">编号</th><th scope="col">文献题目</th><th scope="col">研究背景</th><th scope="col">研究问题/主要发现</th><th scope="col">主要动物模型</th></tr></thead>
        <tbody>
          <tr>
            <th scope="row">[1]</th>
            <td><a href={sources.paper1.doiUrl} target="_blank" rel="noreferrer">{sources.paper1.title}</a><strong className="literature-theme">干预睑脂生成</strong><small>Widjaja-Adhi MAK, et al. · IOVS, 2026</small></td>
            <td><p>1、SOAT1是介导睑板腺胆固醇酯合成的关键酶。</p><p>2、ATR101抑制SOAT1，可改善睑脂流动性。</p></td>
            <td>在<strong>蒸发过强型干眼症（EDE）小鼠模型</strong>中，验证抑制SOAT1是否改善睑脂的理化性质，从而减缓EDE的进展。</td>
            <td><p>① Awat2−/− ATR101治疗小鼠</p><p>② Awat2−/− DMSO溶剂对照小鼠</p><p>③ WT</p></td>
          </tr>
          <tr>
            <th scope="row">[2]</th>
            <td><a href={sources.paper2.doiUrl} target="_blank" rel="noreferrer">{sources.paper2.title}</a><strong className="literature-theme literature-theme-cyan">MG发育</strong><small>Dong F, et al. · Dev Biol, 2015</small></td>
            <td>既往研究发现TGFα参与眼睑发育。</td>
            <td>探究眼周<strong>间充质细胞</strong>异位表达TGFα会如何影响眼睑发育？</td>
            <td>Kera-rtTA/tetO-TGFα（KR/TG）双转基因小鼠；多西环素诱导眼睑间充质TGFα过表达。</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="literature-footnote">点击文献题目查看原文。编号 [1]、[2] 与“03眼睑、眼表表型”中的参考文献对应。</p>
  </main>
}
