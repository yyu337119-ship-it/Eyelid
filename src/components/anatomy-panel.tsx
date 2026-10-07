"use client"

import { useRef, useState } from "react"
import { ArrowUpRight, BookOpen, Search, X, Languages } from "lucide-react"
import { FigureBlock } from "@/components/figure-block"
import { EditableText } from "@/components/editable-text"
import { AnatomyToc } from "@/components/anatomy-toc"
import { useHandbook } from "@/lib/handbook-store"

const glossary = [
  ["UL", "Upper eyelid", "上睑", "大体解剖、结膜定位图"],
  ["LL", "Lower eyelid", "下睑", "大体解剖、结膜定位图"],
  ["MG", "Meibomian gland", "睑板腺", "腺体、支撑结构"],
  ["MCJ", "Mucocutaneous junction", "皮肤黏膜交界", "皮肤和黏膜、睑板腺"],
  ["LG", "Lacrimal gland", "泪腺", "Extraorbital：眶外；Intraorbital：眶内"],
  ["CD", "Central duct", "中央导管", "睑板腺组织图"],
  ["DO", "Duct orifice", "导管开口 / 腺口", "睑板腺组织图"],
  ["G", "", "图中 G 标记", "原 Word 未提供释义，暂不推定"],
  ["TP", "Tarsal plate", "睑板", "Masson 三色染色图"],
  ["TM", "Tarsal muscle", "睑板肌", "Masson 三色染色图"],
  ["CPF", "Capsulopalpebral fascia", "囊睑筋膜", "下睑缩肌相关结构"],
  ["LP", "Levator palpebrae", "上睑提肌", "图中以英文全称标注"],
  ["SR", "Superior rectus", "上直肌", "图中以英文全称标注"],
  ["C", "Conjunctiva / Central", "结膜 / 中央区", "扫描电镜：结膜；杯状细胞分区图：中央区"],
  ["M", "Meibomian gland / Marginal", "睑板腺 / 睑缘区", "冠状切片：睑板腺；杯状细胞分区图：睑缘区"],
  ["F", "Fornical", "穹窿区", "杯状细胞分区图；其他图中的 F 也可能是面板编号"],
  ["E", "Epithelium", "上皮", "角膜图 C：角膜上皮；图 D：结膜上皮"],
  ["S", "Stroma", "基质", "角膜组织图"],
  ["TFBUT", "Tear film breakup time", "泪膜破裂时间", "评价泪膜稳定性"],
  ["GVHD", "Graft-versus-host disease", "移植物抗宿主病", "泪膜图上排的干眼模型"],
  ["PAS", "Periodic acid–Schiff", "过碘酸–希夫染色", "显示结膜杯状细胞"],
  ["P15", "Postnatal day 15", "出生后第 15 天", "睑板染色图"],
  ["KR", "Kera-rtTA", "Kera-rtTA 转基因标记", "睑板图中的 KR 组；对应表型页原文"],
  ["TGFα", "Transforming growth factor alpha", "转化生长因子 α", "睑板来源文献标题"],
  ["*", "", "星号：依子图区分", "眼睑图 A：睫毛毛囊；图 B：睑板腺导管"],
  ["acini", "Acini", "腺泡", "睑板腺组织图"],
  ["Orbicularis oculi", "", "眼轮匝肌", "闭眼；受面神经（Ⅶ）支配"],
  ["Meibocytes", "", "睑板腺细胞", "睑板腺分泌单位"],
  ["Duct / Ductule", "", "导管 / 导管小管", "睑板腺分泌单位"],
  ["Epidermis", "", "表皮", "眼轮匝肌组织图"],
  ["Sebaceous glands", "", "皮脂腺", "眼轮匝肌组织图"],
  ["Harderian gland", "", "哈德氏腺", "上睑提肌与上直肌图"],
  ["Cornea / Conjunctiva", "", "角膜 / 结膜", "解剖总览及组织图"],
  ["Goblet cell", "", "杯状细胞", "解剖总览"],
  ["Orifice / Tear film", "", "腺口 / 泪膜", "解剖总览"],
  ["Glands of Zeis", "", "Zeis 腺", "睫毛毛囊的小型皮脂腺"],
  ["Wolfring’s glands", "", "Wolfring 腺", "解剖总览中的图内标注"],
  ["Riolan’s muscle", "", "Riolan 肌", "解剖总览中的图内标注"],
]

function Glossary() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const toggle = useRef<HTMLButtonElement>(null)
  const matches = glossary.filter(row => row.join(" ").toLowerCase().includes(query.trim().toLowerCase()))
  return <div className="anatomy-glossary" onKeyDown={e => { if (e.key === "Escape") { setOpen(false); toggle.current?.focus() } }}>
    {open && <section id="abbreviation-panel" aria-label="缩写与图内标记对照" className="glossary-panel">
      <div className="glossary-heading"><div><small>READING COMPANION</small><h2>缩写与图内标记</h2></div><button aria-label="收起缩写窗" onClick={() => { setOpen(false); toggle.current?.focus() }}><X size={18}/></button></div>
      <label className="glossary-search"><Search size={16}/><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索缩写、中文或英文…" aria-label="搜索缩写"/></label>
      <p className="glossary-tip">同一字母可能有不同含义，请结合图名对照。</p>
      <dl className="glossary-results">{matches.map(([abbr,en,zh,context]) => <div key={abbr}><dt>{abbr}</dt><dd><strong>{zh}</strong>{en && <span>{en}</span>}<small>{context}</small></dd></div>)}{!matches.length && <p className="p-5 text-sm">未找到匹配项，请尝试中文名称。</p>}</dl>
    </section>}
    <button ref={toggle} className="glossary-toggle" aria-expanded={open} aria-controls="abbreviation-panel" onClick={() => setOpen(!open)}><Languages size={19}/>{open ? "收起对照" : "缩写对照"}<span>Aa</span></button>
  </div>
}

export function AnatomyPanel({ active }: { active: boolean }) {
  const { anatomy, updateAnatomyBlock, updateAnatomySection, editMode } = useHandbook()
  const [directoryOpen, setDirectoryOpen] = useState(false)
  const [selected, setSelected] = useState("")
  const directory = <AnatomyToc selected={selected} />
  return <>
    <div className="anatomy-layout" onClick={event => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#anatomy"]')
      if (!link) return
      event.preventDefault()
      const id = link.hash.slice(1)
      setSelected(id)
      setDirectoryOpen(false)
      requestAnimationFrame(() => {
        const target = document.getElementById(id)
        if (!target) return
        const offset = (document.querySelector("header")?.getBoundingClientRect().height ?? 140) + 24
        window.history.replaceState(null, "", `#${id}`)
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: "instant" })
      })
    }}>
    <aside className="anatomy-sidebar"><div className="anatomy-sidebar-sticky"><p><BookOpen size={15}/> 正常解剖与生理 · 目录</p>{directory}</div></aside>
    <div className="anatomy-mobile-directory"><button aria-expanded={directoryOpen} aria-controls="anatomy-mobile-toc" onClick={() => setDirectoryOpen(!directoryOpen)}><BookOpen size={16}/>{directoryOpen ? "收起解剖目录" : "展开解剖目录"}</button>{directoryOpen && <div id="anatomy-mobile-toc">{directory}</div>}</div>
    <main className="anatomy-main" id="anatomy">
      <section className="anatomy-intro">
        <div><p className="anatomy-eyebrow">SHEET 01 / ANATOMY & PHYSIOLOGY</p><h2>从结构出发，<br/>理解眼睑与眼表。</h2><p className="anatomy-lead">正常解剖与生理</p><p className="anatomy-description">眼睑、腺体与支撑结构，以及角膜、结膜和泪膜。<br className="hidden sm:block"/>沿着解剖顺序阅读，在图像与文字之间建立联系。</p></div>
        <nav className="anatomy-index" aria-label="解剖模块目录">{anatomy.map((section,i) => <a key={section.id} href={`#${section.id}`}><span>0{i+1}</span><div><strong>{section.title}</strong><small>{section.english}</small></div><ArrowUpRight size={20}/></a>)}</nav>
      </section>
      <div className="anatomy-reading-note"><BookOpen size={17}/><span>图文按原文顺序排列 · 点击图片放大 · 右下角查阅缩写</span></div>
      {anatomy.map(section => <section key={section.id} id={section.id} className="anatomy-section">
        <div className="anatomy-section-title"><div><p><EditableText value={section.english} onChange={english => updateAnatomySection(section.id,{english})}/></p><h2><EditableText value={section.title} onChange={title => updateAnatomySection(section.id,{title})}/></h2></div><span>{section.blocks.reduce((n,b) => n+b.figures.length,0)} 幅图</span></div>
        <div className="anatomy-section-grid">{section.blocks.map(block => <article className={`anatomy-card ${block.kind === "group" ? "anatomy-group-heading" : block.figures.length ? "with-figure" : "text-only"}`} id={block.id} key={block.id}>
          <div className="anatomy-copy"><h3><EditableText value={block.title} onChange={title => updateAnatomyBlock(block.id,{title})}/></h3>
            <div className="anatomy-paragraphs">{block.paragraphs.map((paragraph,i) => <p key={i}><EditableText multiline value={paragraph} onChange={value => updateAnatomyBlock(block.id,{paragraphs:block.paragraphs.map((p,n) => n===i ? value : p)})}/></p>)}</div>
          </div>
          {block.figures.map((figure,i) => <div key={figure.id} className="anatomy-figure"><FigureBlock figure={figure} onPaperFigChange={paperFig => updateAnatomyBlock(block.id,{figures:block.figures.map((f,n) => n===i ? {...f,paperFig} : f)})} onCaptionChange={caption => updateAnatomyBlock(block.id,{figures:block.figures.map((f,n) => n===i ? {...f,caption} : f)})}/></div>)}
          {(block.sources.length > 0 || editMode) && <footer className="anatomy-source"><span>来源</span><div>{(block.sources.length ? block.sources : [""]).map((source,i) => <p key={i}><EditableText multiline value={source} placeholder="填写文献或书籍来源" onChange={value => { const sources=[...block.sources]; sources[i]=value; updateAnatomyBlock(block.id,{sources}) }}/></p>)}</div></footer>}
        </article>)}</div>
      </section>)}
      <footer className="anatomy-end"><span>正常解剖与生理</span><a href="#anatomy">返回本页顶部 ↑</a></footer>
    </main>
    </div>
    {active && <Glossary/>}
  </>
}
