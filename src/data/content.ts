export type SourceId = "paper1" | "paper2" | "paper3" | "paper4" | "paper5"

export type Marker = {
  name: string
  role: string
  change?: string
}

export type Figure = {
  id?: string
  src?: string
  paperFig: string
  caption: string
  pmcUrl?: string
}

export type Assay = {
  id: string
  title: string
  sources: SourceId[]
  instruments: string[]
  stains?: string[]
  markers?: Marker[]
  observations: string[]
  figures: Figure[]
  pending?: string[]
}

export type Topic = {
  id: string
  mark: string
  title: string
  assays: Assay[]
}

export type Section = {
  id: string
  index: string
  title: string
  topics: Topic[]
}

export type Category = {
  id: string
  roman: string
  title: string
  question: string
  summary: string
  sections: Section[]
}

export const sources = {
  paper1: {
    id: "paper1" as const,
    n: 1,
    cite: "【1】Gardon DJ, et al. Dev Biol, 2026",
    short: "Gardon DJ, et al. Dev Biol, 2026",
    title:
      "A mouse model of meibomian gland hyperkeratinization-induced dry eye",
    authors: "Gardon DJ, Liu CJ, Veniaminova NA, et al.",
    journal: "Developmental Biology",
    year: "2026",
    volume: "534: 209–214",
    doi: "10.1016/j.ydbio.2026.03.010",
    doiUrl: "https://doi.org/10.1016/j.ydbio.2026.03.010",
    noteMap: "副本1本首页 [1]",
    model:
      "Krt6a-iCreERT2;Abca12-flox;YFP：他莫昔芬诱导，在 K6⁺ 中央导管分化细胞中敲除 Abca12",
  },
  paper2: {
    id: "paper2" as const,
    n: 2,
    cite: "【2】Widjaja-Adhi MAK, et al. IOVS, 2026",
    short: "Widjaja-Adhi MAK, et al. IOVS, 2026",
    title:
      "Pharmacologic Alteration of Meibum Lipid Composition Alleviates Dry Eye Phenotype in Awat2−/− Mice",
    authors: "Widjaja-Adhi MAK, Chung C, Lapierre-Landry M, et al.",
    journal: "Investigative Ophthalmology & Visual Science",
    year: "2026",
    volume: "67(6): 34",
    doi: "10.1167/iovs.67.6.34",
    doiUrl: "https://doi.org/10.1167/iovs.67.6.34",
    noteMap: "副本1本首页 [2]；原笔记文献 [2]",
    model: "Awat2−/− 蒸发性干眼模型；ATR101（nevanimibe）抑制 SOAT1 / 胆固醇酯合成",
  },
  paper3: {
    id: "paper3" as const,
    n: 3,
    cite: "【3】Tchegnon E, et al. JCI Insight, 2021",
    short: "Tchegnon E, et al. JCI Insight, 2021",
    title:
      "Epithelial stem cell homeostasis in Meibomian gland development, dysfunction, and dry eye disease",
    authors: "Tchegnon E, Liao CP, Ghotbi E, et al.",
    journal: "JCI Insight",
    year: "2021",
    volume: "6(20): e151078",
    doi: "10.1172/jci.insight.151078",
    doiUrl: "https://doi.org/10.1172/jci.insight.151078",
    noteMap: "副本1本首页 [3]",
    model:
      "K14-Cre 介导上皮谱系敲除 Krox20；Krox20-Cre 谱系示踪；Krox20-DTA 发育期/成年期清除；与 Krox24 双敲比较",
  },
  paper4: {
    id: "paper4" as const,
    n: 4,
    cite: "【4】Zhu X, et al. Nat Commun, 2025",
    short: "Zhu X, et al. Nat Commun, 2025",
    title: "Identification of Meibomian gland stem cell populations and mechanisms of aging",
    authors: "Zhu X, Xu M, Portal C, et al.",
    journal: "Nature Communications",
    year: "2025",
    volume: "16: 1663",
    doi: "10.1038/s41467-025-56907-6",
    doiUrl: "https://doi.org/10.1038/s41467-025-56907-6",
    noteMap: "副本1本首页 [4]",
    model:
      "成年睑板腺干细胞谱系（Lrig1 / Lgr6 / Axin2 / Slc1a3 / Gli2）；Smo 敲除抑制 Hh；GLI2ΔN 激活 Hh；8 周 vs 21 月龄衰老比较",
  },
  paper5: {
    id: "paper5" as const,
    n: 5,
    cite: "【5】Dong F, et al. Dev Biol, 2015",
    short: "Dong F, et al. Dev Biol, 2015",
    title:
      "Perturbed meibomian gland and tarsal plate morphogenesis by excess TGFα in eyelid stroma",
    authors: "Dong F, Liu CY, Yuan Y, et al.",
    journal: "Developmental Biology",
    year: "2015",
    volume: "406(2): 147–157",
    doi: "10.1016/j.ydbio.2015.09.003",
    doiUrl: "https://doi.org/10.1016/j.ydbio.2015.09.003",
    pmcUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4996271/",
    noteMap: "副本1本首页 [5]；原笔记文献 [5]",
    model:
      "Kera-rtTA/tetO-TGFα（KR/TG）双转基因小鼠，P0–P15 多西环素诱导眼睑基质过表达 TGFα",
  },
} as const

export function formatCites(ids: SourceId[]) {
  return ids.map((id) => sources[id].cite).join("；")
}

export function uniqueSources(ids: SourceId[]): SourceId[] {
  const order: SourceId[] = ["paper1", "paper2", "paper3", "paper4", "paper5"]
  return order.filter((id) => ids.includes(id))
}

export function topicSources(topic: Topic): SourceId[] {
  return uniqueSources(topic.assays.flatMap((assay) => assay.sources))
}

export function sectionSources(section: Section): SourceId[] {
  return uniqueSources(
    section.topics.flatMap((topic) => topic.assays.flatMap((assay) => assay.sources))
  )
}

export const abbreviations = [
  { abbr: "MG", full: "睑板腺 Meibomian gland" },
  { abbr: "MCJ", full: "皮肤黏膜交界 mucocutaneous junction" },
  { abbr: "TM", full: "睑板肌 tarsal muscle" },
  { abbr: "CPF", full: "下睑囊筋膜 capsulopalpebral fascia" },
  { abbr: "TP", full: "睑板 tarsal plate" },
  { abbr: "OO", full: "眼轮匝肌 orbicularis oculi" },
  { abbr: "CE / FA", full: "胆固醇酯 / 脂肪酸" },
  { abbr: "TBUT / NIBUT", full: "荧光素泪膜破裂时间 / 非侵入性泪膜破裂时间" },
  { abbr: "K6 / Krt6a", full: "角蛋白 6，MG 中央导管分化细胞" },
  { abbr: "ABCA12", full: "ATP 结合盒脂质转运蛋白，维持导管脱屑" },
  { abbr: "KROX20 / EGR2", full: "锌指转录因子，标记 MG 上皮干/祖细胞" },
  { abbr: "Hh / GLI2 / Smo", full: "刺猬信号及其受体、转录因子" },
  { abbr: "PLIN2", full: "脂滴包被蛋白，睑脂细胞分化标志" },
]

export const categories: Category[] = [
  {
    id: "mg",
    roman: "一",
    title: "MG 及其分泌物",
    question: "腺体形态是否完整？导管是否阻塞？睑脂能否排出、成分是否异常？",
    summary:
      "先看活体/大体：腺体是否存在、导管是否被角化物或脂质堵塞。用 Ly6G 排除腺体本身的中性粒细胞性炎症堵塞。再落到 HE、Oil Red O 和三维重建量化导管。分子层先画 K6/K14/Abca12、KROX20/PPARγ、Slc1a3/Lrig1 等定位图，再判断角化、干细胞更新与脂质合成。裂隙灯看睑脂外观与排出。",
    sections: [
      {
        id: "mg-gland",
        index: "1",
        title: "MG",
        topics: [
      {
        id: "mg-morphology",
        mark: "①",
        title: "腺体形态与组织学",
        assays: [
          {
            id: "mg-abca12-duct",
            title: "K6⁺ 中央导管 Abca12 敲除：大体 + IF + HE + Oil Red O",
            sources: ["paper1"],
            instruments: [
              "Krt6a-iCreERT2;Abca12-flox;YFP 小鼠腹腔注射他莫昔芬，靶向敲除中央导管分化细胞中的 Abca12",
              "活体大体观察眼睑干燥与结痂",
              "免疫荧光：YFP 追踪 K6⁺ 细胞，K14 标上皮",
              "石蜡切片 H&E",
              "冰冻切片 Oil Red O 显示管腔/腺泡脂质",
            ],
            stains: ["H&E", "Oil Red O"],
            markers: [
              {
                name: "K6 / YFP",
                role: "中央导管分化细胞及其重组标记",
                change: "TAM 10 天：YFP⁺ K6⁺ 过度角化细胞填充导管；14 天：过度角化细胞脱落",
              },
              {
                name: "K14",
                role: "眼睑上皮 / MG 导管与腺泡轮廓",
                change: "用于定位表皮、结膜、中央导管（MD）和腺泡（Ac）",
              },
              {
                name: "Abca12",
                role: "导管脱屑所需的脂质转运蛋白",
                change: "在 K6⁺ 导管细胞中敲除后脱屑失败、角化物堆积",
              },
            ],
            observations: [
              "对照：K14 勾勒完整中央导管与腺泡，管腔通畅（A）。",
              "TAM 10 天 cKO：眼睑干燥、结痂（B 白箭头）；IF 显示导管被 YFP⁺ 过度角化细胞填充（C 白箭头）；HE 导管阻塞并扩张（D 黑箭头）；Oil Red O 显示脂质潴留在扩张管腔（E）。",
              "TAM 14 天：F 显示 K6⁺ 过度角化细胞从导管脱落。不直接靶向腺泡，仅破坏导管脱屑即可诱发过度角化相关干眼。",
            ],
            figures: [
              {
                src: "/figures/paper1-fig-phenotype.jpg",
                paperFig: "Fig. 表型组合（大体 / IF / HE / ORO）",
                caption:
                  "A：正常解剖，绿=YFP，红=K14。B：对照 vs cKO 眼睑结痂。C：YFP/K14，cKO 导管被角化细胞填充。D：HE 导管阻塞扩张。E：Oil Red O 脂质潴留。F：14 天角化栓脱落。",
              },
            ],
          },
          {
            id: "mg-ly6g-exclude",
            title: "Ly6G：排除 MG 腺体中性粒细胞性炎症堵塞",
            sources: ["paper1"],
            instruments: [
              "免疫荧光：Ly6G 标中性粒细胞，K14 勾勒 MG 导管、腺泡和睑缘上皮",
              "分别计数紧贴腺体的 Ly6G⁺ 细胞，以及选定视野内总数",
            ],
            markers: [
              {
                name: "Ly6G",
                role: "中性粒细胞",
                change: "Abca12 cKO 与对照无显著差异，MG 导管堵塞不是腺体中性粒细胞浸润造成的",
              },
            ],
            observations: [
              "读片焦点在腺体：中央导管（MD）、腺泡（Ac）及其紧邻间质，而不是结膜充血。",
              "对照和 cKO 紧贴腺体的 Ly6G⁺ 细胞都很少，选定视野内总数也不升高。",
              "因此本模型的导管阻塞应归为角化栓 / 脂质潴留，而不是 MG 腺体化脓性炎症堵塞。评价腺体阻塞时要把炎症、角化、脂质作为竞争机制分开记录。",
            ],
            figures: [
              {
                src: "/figures/paper1-fig-ly6g.jpg",
                paperFig: "Fig. Ly6G / 细胞计数",
                caption:
                  "A：绿=Ly6G，红=K14，标注 Epi / MD / Ac / Conj。计数分 Contacting gland 与 boxed area。cKO 不高于对照。",
              },
            ],
          },
          {
            id: "mg-krox20-absent",
            title: "Krox20 缺失或谱系清除后睑板腺是否存在",
            sources: ["paper3"],
            instruments: [
              "Krox20fl/fl;K14-Cre（Krox20-cKO）vs Krox20fl/fl 对照",
              "Krox20-DTA;K14-Cre：P6 清除 K14 谱系中的 KROX20⁺ 细胞",
              "Krox20-Cre;R26-rtTA;Tet-DTA：P20 起多西环素诱导，成年期清除已形成腺体中的谱系细胞",
              "石蜡切片 H&E；免疫荧光 K14 / PPARγ / KROX20",
            ],
            stains: ["H&E"],
            markers: [
              {
                name: "K14",
                role: "MG 导管和腺泡上皮轮廓",
                change: "cKO、发育期 DTA、成年期清除后腺体结构信号缺失",
              },
              {
                name: "PPARγ",
                role: "腺泡睑脂细胞分化",
                change: "腺体缺失时 PPARγ 信号消失",
              },
              {
                name: "KROX20",
                role: "MG 干/祖细胞标志",
                change: "cKO 和 DTA 清除后信号消失，证实靶细胞被去掉",
              },
            ],
            observations: [
              "Fig. 2E：2.5 月龄 Krox20-cKO 睑板腺结构完全缺失（虚线区空），对照腺体完整。所有 cKO 小鼠均缺腺体。",
              "Fig. 5：P6 DTA 清除后 KROX20⁺ 细胞消失，H&E 无腺体，K14/PPARγ 缺失。",
              "Fig. 6：成年期清除已形成的腺体，H&E 显示腺体丢失，并继发角膜病变。",
              "Fig. 8：Krox24 单敲保留正常腺体；Krox20-cKO 和双敲均无腺体。Krox20 而非 Krox24 决定腺体结构形成。",
            ],
            figures: [
              {
                src: "/figures/paper3-fig2-mg.jpg",
                paperFig: "Fig. 2E–J",
                caption:
                  "E：H&E，cKO 睑板腺缺失。F：K14/PPARγ 腺体标志消失。H–J：KROX20 与 K14 共染确认靶蛋白丢失。A–D 为角膜缘谱系，见角膜分支。",
              },
              {
                src: "/figures/paper3-fig5-dta.jpg",
                paperFig: "Fig. 5",
                caption:
                  "P6 清除 KROX20⁺ 上皮谱系。A：KROX20 消失。B：H&E 无腺体。C：K14/PPARγ 缺失。D：Oil Red O 无睑脂。",
              },
              {
                src: "/figures/paper3-fig6-adult.jpg",
                paperFig: "Fig. 6C–E",
                caption:
                  "成年期诱导清除。C：H&E 已形成腺体丢失。D：K14/PPARγ 缺失。E：KROX20 信号消失。A–B 为继发角膜病变。",
              },
              {
                src: "/figures/paper3-fig8-mg.jpg",
                paperFig: "Fig. 8B–F",
                caption:
                  "WT / Krox24-KO 保留腺体；Krox20-cKO 与双敲腺体缺失。E–F：Krox24-KO 仍表达 KROX20。",
              },
            ],
          },
          {
            id: "mg-zhu-morphology",
            title: "离体睑板腺形态与基底细胞 Ki-67 增殖",
            sources: ["paper4"],
            instruments: [
              "分离眼睑后观察整根 MG 形态（中央导管 CD、腺泡簇、睑缘开口）",
              "KRT14-CreERT2;Smofl/fl 抑制 Hh，或 Krt5-rtTA;tetO-GLI2ΔN 激活 Hh",
              "免疫组化：Ki-67 计数腺泡和导管基底细胞增殖比例",
            ],
            stains: ["IHC（Ki-67、PPARγ、FASN）"],
            markers: [
              {
                name: "Ki-67",
                role: "腺泡 / 导管基底细胞增殖",
                change: "Smo 敲除后腺泡和导管 Ki-67⁺ 比例显著下降；GLI2 激活后增殖升高",
              },
            ],
            observations: [
              "对照整腺：腺泡簇沿中央导管排列，开口朝向睑缘。",
              "抑制 Hh（Smo cKO）：腺体缩小、部分腺泡脱落（黄星），Ki-67⁺ 腺泡和导管基底细胞减少。",
              "评价衰老或干预时，要同时看腺体是否变小、腺泡是否脱落，以及基底增殖是否下降，避免只报一个形态指标。",
            ],
            figures: [
              {
                src: "/figures/paper4-fig3-smo.jpg",
                paperFig: "Fig. 3",
                caption:
                  "a–c：整腺形态，CD=中央导管，黄星=脱落腺泡。d–k：PPARγ、FASN、Ki-67。l–m：腺泡与导管基底 Ki-67⁺ 比例下降。",
              },
              {
                src: "/figures/paper4-fig4-gli2.jpg",
                paperFig: "Fig. 4",
                caption:
                  "激活 Hh / GLI2 后腺体增大、基底细胞扩增，与 Smo 敲除方向相反，构成双向遗传学证据。",
              },
            ],
          },
          {
            id: "mg-gross-he",
            title: "新鲜睑板纵切面大体成像联合 HE",
            sources: ["paper2"],
            instruments: [
              "Leica M205 C 体视显微镜：新鲜睑板纵切面大体宏观成像",
              "光学显微镜：睑板横切面 HE 染色",
            ],
            stains: ["H&E"],
            markers: [],
            observations: [
              "大体：DMSO 组中央导管扩张、管腔内脂质淤积（红线勾勒、红箭头），开口处可见堵塞物（绿箭头）；ATR101 组导管轮廓更规整、开口堵塞减轻。",
              "HE：重点看中央导管上皮是否角化，以及周围腺泡密度。DMSO 组导管上皮角化、管腔扩大（黑箭头），周围腺泡稀疏；ATR101 组角化与扩张减轻、腺泡更密。",
            ],
            figures: [
              {
                src: "/figures/paper2-fig7-mg.jpg",
                paperFig: "Fig. 7A",
                caption:
                  "上排 Awat2−/−/DMSO，下排 Awat2−/−/ATR101。左列纵切大体，右列 HE。红线标中央导管，绿箭头标开口堵塞。原图亦含 7B 核数与 7C RT-qPCR。",
              },
            ],
          },
          {
            id: "mg-nuclei-count",
            title: "连续 HE 横切面统计腺泡细胞核数",
            sources: ["paper2"],
            instruments: [
              "连续多张睑板横切面 HE 染色",
              "每只小鼠统计 32 张切片的腺泡细胞平均核数",
            ],
            stains: ["H&E"],
            observations: [
              "腺泡细胞核数：Awat2−/−/DMSO 最低，ATR101 治疗后回升，仍低于野生型。",
              "核数下降反映腺泡萎缩/丢失；回升提示腺体实质部分恢复。",
            ],
            figures: [
              {
                src: "/figures/paper2-fig7-mg.jpg",
                paperFig: "Fig. 7B",
                caption:
                  "Average meibocyte nuclei count。Awat2−/−/DMSO < ATR101 < WT。",
              },
            ],
          },
          {
            id: "mg-stereo-close",
            title: "体视显微镜观察眼睑闭合与 MG 大体形态",
            sources: ["paper5"],
            instruments: [
              "体视显微镜：活体/离体翻转眼睑，暴露结膜面观察 MG 排列",
            ],
            observations: [
              "Fig. 2A：对照 P11 眼睑仍闭合、外形正常；KR/TG 小鼠过早睁眼，上下睑肿胀，下睑更明显（Fig. 2B）。",
              "Fig. 3A–C：对照 MG 沿睑板平行排列、腺泡簇完整；重症转基因鼠腺体部分缺失、畸形/弯曲/缺损，下睑重于上睑；轻症大体差别小，但仍需切片确认间充质堆积。",
            ],
            figures: [
              {
                src: "/figures/paper5-fig2-eyelid.jpg",
                paperFig: "Fig. 2A–D",
                caption:
                  "P11。A：对照眼睑仍闭合；B：KR/TG 过早睁眼，上下睑肿胀，下睑更明显。C/D：HE 确认开睑与肿胀。",
              },
              {
                src: "/figures/paper5-fig3-mg.jpg",
                paperFig: "Fig. 3A–C",
                caption:
                  "P15 结膜面大体。对照 MG 平行排列完整；重症腺体部分缺失、畸形；轻症大体接近对照。",
              },
            ],
          },
          {
            id: "mg-he-acini",
            title: "眼球 HE：腺泡结构、导管扩张、开口位置与间充质",
            sources: ["paper5"],
            instruments: ["石蜡切片 HE，光学显微镜"],
            stains: ["H&E"],
            observations: [
              "对照（3D、3G）：腺泡沿中央导管成簇，开口位于 MCJ 前方。",
              "重症（3E、3H）：腺泡紊乱、导管明显扩张、开口异位到皮肤侧，腺体周围大量间充质细胞堆积。",
              "轻症（3F、3I）：大体接近对照，切片仍可见腺体周围间充质增多。",
              "2B 同时记录上下睑肿胀。",
            ],
            figures: [
              {
                src: "/figures/paper5-fig3-mg.jpg",
                paperFig: "Fig. 3D–I",
                caption:
                  "HE：对照腺泡成簇、开口在 MCJ 前方；重症导管扩张、开口异位到皮肤侧、间充质堆积；轻症大体接近对照但间充质仍增多。",
              },
            ],
          },
          {
            id: "mg-3d-duct",
            title: "三维虚拟组织学重建测量中央导管最大直径",
            sources: ["paper2"],
            instruments: [
              "连续组织切片重新上色，模拟上眼睑 H&E",
              "Amira 软件三维重建：导管标红、腺泡标绿",
              "以结膜表面为 Z 轴零点，测量每根中央导管最大直径",
            ],
            stains: ["H&E（虚拟上色）"],
            observations: [
              "DMSO 组中央导管明显增粗、管腔扩张；ATR101 组最大直径显著小于溶剂对照，仍大于野生型。",
              "样本量：WT 3 只小鼠共 3 个眼睑；Awat2−/−/DMSO 4 只共 8 个眼睑；Awat2−/−/ATR101 5 只共 10 个眼睑。",
              "三维容积重建与二维测量方向一致：抑制 CE 合成后导管扩张减轻。",
            ],
            figures: [
              {
                src: "/figures/paper2-fig6-3d.jpg",
                paperFig: "Fig. 6A–C",
                caption:
                  "A：不同 Z 深度切片，黑箭头标导管。B：三维渲染，红=导管、绿=腺泡。C：中央导管最大直径箱线图。",
              },
            ],
          },
          {
            id: "mg-terminal-duct",
            title: "裂隙灯图像测量末端导管厚度",
            sources: ["paper2"],
            instruments: [
              "裂隙灯导出带比例尺照片",
              "ImageJ：沿垂直于导管长轴方向，测外部可视横向宽度（导管 + 管腔内淤积脂质的整体外观厚度）",
            ],
            observations: [
              "治疗 10 天和 14 天，ATR101 组末端导管厚度均显著下降。",
              "厚度下降反映开口附近阻塞缓解，腺体形态部分恢复。",
            ],
            figures: [
              {
                src: "/figures/paper2-fig5-mg-duct.jpg",
                paperFig: "Fig. 5B",
                caption:
                  "B：MG terminal duct thickness (Dx−Do)/Do。ATR101 组在 Day 10、Day 14 均低于溶剂对照。A 为同一批裂隙灯导管图像。",
              },
            ],
          },
        ],
      },
      {
        id: "mg-markers",
        mark: "②",
        title: "分子标志物",
        assays: [
          {
            id: "mg-krox20-lineage",
            title: "KROX20 定位、发育时间窗与谱系示踪",
            sources: ["paper3"],
            instruments: [
              "Krox20-GFP 敲入报告小鼠：GFP 指示正在表达 Krox20 的细胞",
              "Krox20-Cre;R26-tdTomato：永久标记表达过 Krox20 的细胞及其后代",
              "时间点：P1–P15、1.5–10 月龄",
              "免疫荧光共染 K14、PPARγ、KROX20",
            ],
            markers: [
              {
                name: "KROX20 / GFP",
                role: "当前表达的 MG 干/祖细胞",
                change:
                  "P3–P6 在腺泡形成前的上皮索；P11 后集中于导管上基底层，持续至成年。与 PPARγ⁺ 腺泡细胞基本不共定位",
              },
              {
                name: "tdTomato（Krox20 谱系）",
                role: "KROX20⁺ 细胞及其后代",
                change: "从发育早期铺满整个睑板腺，与 K14、PPARγ 重叠，说明谱系可形成导管和腺泡",
              },
              {
                name: "PPARγ",
                role: "腺泡睑脂细胞",
                change: "局限于腺泡区，用于和导管区 KROX20 对照",
              },
            ],
            observations: [
              "先看当前表达（GFP/KROX20），再看谱系（tdTomato）。前者告诉干细胞住在导管上基底层，后者证明它们能生成完整腺体。",
              "角膜和 K15⁺ 角膜缘无 tdTomato（Fig. 2A–D），支持角膜病变是睑板腺缺失的继发后果，而不是角膜自身敲除。",
            ],
            figures: [
              {
                src: "/figures/paper3-fig3-krox20.jpg",
                paperFig: "Fig. 3",
                caption:
                  "A：P3 至 9 月龄 KROX20（绿）与 K14（红）。成熟后 KROX20 在导管上基底层。B：KROX20 与 PPARγ 分区，几乎不重叠。",
              },
              {
                src: "/figures/paper3-fig4-lineage.jpg",
                paperFig: "Fig. 4",
                caption:
                  "A：P1–10 月龄 tdTomato 铺满腺体。B：与 K14 重叠。C：与 PPARγ 重叠，谱系可生成腺泡细胞。",
              },
              {
                src: "/figures/paper3-fig2-mg.jpg",
                paperFig: "Fig. 2A–D",
                caption:
                  "Krox20-Cre;R26-tdTomato。角膜和 K15⁺ 角膜缘无 Tom 信号（白/绿箭头），用于把角膜病变判为继发。",
              },
            ],
          },
          {
            id: "mg-zhu-stem",
            title: "snRNA-seq + RNAscope + 谱系追踪鉴定 MG 干细胞群",
            sources: ["paper4"],
            instruments: [
              "单细胞核 RNA-seq 和 RNA velocity / 拟时序，预测导管与腺泡分化轨迹",
              "RNAscope 原位验证候选干细胞基因的空间位置",
              "P50 他莫昔芬诱导：Lrig1 / Lgr6 / Axin2 / Slc1a3 / Gli2-CreERT2;Rosa26mTmG，2 天看标记位置，90–120 天看克隆扩展",
              "PLIN2 免疫荧光标记已分化睑脂细胞",
            ],
            markers: [
              {
                name: "Slc1a3",
                role: "腺泡干细胞",
                change: "谱系主要补充腺泡 / PLIN2⁺ 睑脂细胞，不广泛标记导管",
              },
              {
                name: "Lrig1、Lgr6、Axin2",
                role: "导管小管 / 导管基底干细胞",
                change: "2 天标记导管；长期可同时贡献导管和腺泡，支持导管小管是干细胞储库",
              },
              {
                name: "Gli2",
                role: "Hh 通路转录因子，标记有 Hh 活性的干细胞",
                change: "2 天可见于导管和腺泡基底；长期形成扩增克隆",
              },
              {
                name: "PLIN2",
                role: "分化睑脂细胞脂滴包被蛋白",
                change: "用于判断谱系细胞是否进入产脂分化；癌组织中 PLIN2 可缺失",
              },
            ],
            observations: [
              "UMAP 把 MG 分成开口细胞、导管上基底、导管基底、导管细胞、腺泡基底、分化中/已分化睑脂细胞，并与结膜、毛囊、骨骼肌/平滑肌分开。",
              "评价时成对看：短时间标记回答“干细胞住在哪”，长时间克隆回答“它补充谁”。",
            ],
            figures: [
              {
                src: "/figures/paper4-fig1-umap.jpg",
                paperFig: "Fig. 1",
                caption:
                  "a：UMAP 细胞分群。b：导管–腺泡结构示意图。c–d：RNA velocity 与拟时序，导管基底和腺泡基底走向分化睑脂细胞。",
              },
              {
                src: "/figures/paper4-fig2-lineage.jpg",
                paperFig: "Fig. 2",
                caption:
                  "a：P50 诱导、2 天 vs 90/120 天。b–d：Lrig1/Lgr6/Axin2 从导管扩展。e：Gli2。f：Slc1a3 偏腺泡。绿/品红=谱系，红=PLIN2。",
              },
            ],
          },
          {
            id: "mg-zhu-hh-aging",
            title: "Hh / HBEGF–EGFR 与衰老微环境",
            sources: ["paper4"],
            instruments: [
              "诱导 GLI2ΔN 后激光捕获 MG，bulk RNA-seq + GO",
              "人正常睑板腺 vs 睑板腺癌：RNAscope GLI1/Ptch1，IF Ki-67 / 干细胞标志 / PLIN2",
              "8 周龄 vs 21 月龄小鼠：Ptch1、Gli2、GLI2 乙酰化相关 PLA",
              "CellChat；IHC p-ERK1/2；IF PGP9.5 神经纤维",
            ],
            markers: [
              {
                name: "GLI1 / Ptch1",
                role: "Hh 通路活性读出",
                change: "癌组织增强；老年小鼠减弱",
              },
              {
                name: "Ki-67 / PLIN2",
                role: "增殖 vs 睑脂分化",
                change: "癌：Ki-67↑、PLIN2 缺失；衰老：增殖不足",
              },
              {
                name: "Hbegf、p-ERK1/2",
                role: "HBEGF–EGFR 生长信号",
                change: "老年 Hbegf↓，p-ERK1/2↓，总 ERK 相近",
              },
              {
                name: "PGP9.5",
                role: "腺泡周围神经纤维",
                change: "老年腺泡周围神经减少，同时 I 型胶原相关表达降低",
              },
            ],
            observations: [
              "GLI2 激活：Hh 和增殖基因↑，脂质代谢/睑脂分化基因↓；Lrig1⁺、Lgr6⁺、Axin2⁺ 克隆扩增。",
              "腺体变小要拆成两问：是基底补充不足，还是产脂分化异常。衰老同时有 Hh 减弱、EGFR 信号减弱、神经和基质支持减少。",
            ],
            figures: [
              {
                src: "/figures/paper4-fig5-gli2-rna.jpg",
                paperFig: "Fig. 5",
                caption:
                  "GLI2 激活后转录组：增殖↑、脂质分化↓；Lrig1/Lgr6/Axin2 谱系参与腺体过生长。",
              },
              {
                src: "/figures/paper4-fig6-carcinoma.jpg",
                paperFig: "Fig. 6",
                caption: "人睑板腺癌：GLI1 增强，干细胞标志扩增，Ki-67↑、PLIN2 缺失。",
              },
              {
                src: "/figures/paper4-fig7-aging-hh.jpg",
                paperFig: "Fig. 7",
                caption: "21 月龄 vs 8 周：Ptch1⁺、Gli2⁺ 细胞减少，GLI2 乙酰化相关信号增强。",
              },
              {
                src: "/figures/paper4-fig8-egf.jpg",
                paperFig: "Fig. 8",
                caption:
                  "CellChat 显示老年 EGF 信息流下降。d–f：Hbegf 表达降低，p-ERK1/2 减少、总 ERK 相近。",
              },
              {
                src: "/figures/paper4-fig9-niche.jpg",
                paperFig: "Fig. 9",
                caption: "老年腺泡周围 PGP9.5⁺ 神经纤维减少，基质支持相关表达下降。",
              },
            ],
          },
          {
            id: "mg-rtqpcr",
            title: "睑板腺标志物基因 RT-qPCR",
            sources: ["paper2"],
            instruments: ["RT-qPCR，睑板组织 mRNA 定量"],
            markers: [
              {
                name: "Aldh1a3、Rarb、Rbp1",
                role: "视黄酸信号通路",
                change: "Aldh1a3、Rarb 表达下降",
              },
              {
                name: "Sprr1a、Krt14",
                role: "导管上皮角化 / 病理修复与过度增殖",
                change: "↓，提示过度角化与增殖通路活化程度下降",
              },
              {
                name: "Pparg",
                role: "腺细胞从基底祖细胞分化、脂质合成的核心转录因子",
                change: "↑，提示腺细胞成熟与脂质合成能力改善",
              },
            ],
            observations: [
              "将形态学上的导管阻塞缓解，落到角化、修复和分化三条分子轴上解读。",
              "Pparg 上调与腺泡核数回升方向一致，支持腺体功能而非仅管径变化。",
            ],
            figures: [
              {
                src: "/figures/paper2-fig7-mg.jpg",
                paperFig: "Fig. 7C",
                caption:
                  "睑板组织 RT-qPCR：Aldh1a3、Rarb、Rbp1、Sprr1a、Pparg、Krt14（相对 Gapdh）。ATR101 后角化/修复轴下降，Pparg 回升。",
              },
            ],
          },
          {
            id: "mg-pparg-pcna",
            title: "MG 腺泡分化、增殖与凋亡（PPARγ / PCNA / TUNEL）",
            sources: ["paper5"],
            instruments: [
              "石蜡切片免疫荧光",
              "TUNEL 凋亡检测",
              "P15 对照 vs KR/TG",
            ],
            markers: [
              {
                name: "PPARγ",
                role: "睑板腺腺泡分化 / 脂质代谢标志",
                change: "两组腺泡均阳性，过表达组仍保留分化标记",
              },
              {
                name: "PCNA",
                role: "增殖",
                change: "两组阳性细胞均在基底层，分布模式相似",
              },
              {
                name: "TUNEL",
                role: "凋亡",
                change: "两组腺泡内阳性细胞均很少",
              },
            ],
            observations: [
              "过量 TGFα 不直接改变睑板腺细胞的增殖、凋亡和分化。",
              "MG 形态异常主要来自睑板/肌腱微环境破坏，而不是腺细胞本身失分化。",
            ],
            figures: [
              {
                src: "/figures/paper5-fig8-pcna.jpg",
                paperFig: "Fig. 8Aa vs Ba",
                caption: "PCNA：两组阳性细胞均在 MG 基底层，分布模式相似。",
              },
              {
                src: "/figures/paper5-fig9-tunel.jpg",
                paperFig: "Fig. 9Aa vs Ba",
                caption: "TUNEL：两组腺泡内阳性细胞均很少。",
              },
              {
                src: "/figures/paper5-fig10-pparg-collagen.jpg",
                paperFig: "Fig. 10A–B",
                caption: "PPARγ：对照与 KR/TG 腺泡均阳性，过表达组仍保留分化标记。",
              },
            ],
          },
        ],
      },
        ],
      },
      {
        id: "mg-meibum",
        index: "2",
        title: "睑脂",
        topics: [
          {
            id: "meibum-look",
            mark: "①",
            title: "大体外观与排出",
            assays: [
          {
            id: "meibum-oro-gardon",
            title: "Oil Red O：导管脂质潴留 vs 排出受阻",
            sources: ["paper1"],
            instruments: ["冰冻切片 Oil Red O，对照 vs Abca12 cKO 中央导管和腺泡"],
            stains: ["Oil Red O"],
            observations: [
              "对照：脂质主要在腺泡，中央导管相对通畅。",
              "cKO：扩张导管内出现大片红染脂质潴留，对应脱屑失败后睑脂排不出，而不是腺泡不产脂。",
            ],
            figures: [
              {
                src: "/figures/paper1-fig-phenotype.jpg",
                paperFig: "Fig. E Oil Red O",
                caption: "对照 vs cKO。cKO 中央导管扩张并充满红染脂质。同图 A–D 为 IF/HE/大体。",
              },
            ],
          },
          {
            id: "meibum-oro-krox20",
            title: "Oil Red O：睑脂是否生成",
            sources: ["paper3"],
            instruments: ["Oil Red O 染色睑板腺区域，cKO 或 DTA 清除 vs 对照"],
            stains: ["Oil Red O"],
            observations: [
              "对照腺泡强红染，提示有睑脂。",
              "Krox20-cKO 和发育期 DTA 清除后红染消失，说明不是排出障碍，而是腺体未形成、无睑脂可分泌。",
              "与 Abca12 模型对照读：一个是管腔潴留，一个是脂质缺失。",
            ],
            figures: [
              {
                src: "/figures/paper3-fig2-mg.jpg",
                paperFig: "Fig. 2G",
                caption: "Oil Red O。上：cKO 无红染；下：对照腺泡充满睑脂。",
              },
              {
                src: "/figures/paper3-fig5-dta.jpg",
                paperFig: "Fig. 5D",
                caption: "发育期清除 KROX20⁺ 细胞后 Oil Red O 信号缺失。",
              },
            ],
          },
          {
            id: "meibum-appearance",
            title: "裂隙灯生物显微镜观察睑脂大体外观",
            sources: ["paper2"],
            instruments: [
              "裂隙灯生物显微镜约 40 倍：观察挤出睑脂的透明度、形态和粘稠外观",
            ],
            observations: [
              "DMSO 组挤出物呈不透明、卷曲的蜡样团块。",
              "ATR101 组挤出物更接近半透明小滴，提示睑脂物理性状改善。",
            ],
            figures: [
              {
                src: "/figures/paper2-fig2-meibum.jpg",
                paperFig: "Fig. 2D",
                caption:
                  "黄圈标挤出的睑脂。左：Awat2−/−/DMSO 蜡样不透明；右：ATR101 后更透明、体积更小。同图 B/C/E 为 CE、FA 与熔融温度。",
              },
            ],
          },
          {
            id: "meibum-expressibility",
            title: "裂隙灯下观察开口并挤压评估排出是否通畅",
            sources: ["paper2"],
            instruments: [
              "裂隙灯直接观察睑缘开口",
              "轻压睑板，比较挤压前后开口处脂质排出",
            ],
            observations: [
              "挤压前两组开口均可看到白色栓状物。",
              "挤压后 DMSO 组开口仍糊、排出差；ATR101 组开口更清晰，睑脂更易排出。",
            ],
            figures: [
              {
                src: "/figures/paper2-fig5-mg-duct.jpg",
                paperFig: "Fig. 5A",
                caption:
                  "裂隙灯观察上睑末端导管。Day 0 先挤出堵塞物，随后随访 Day 10 / 14。ATR101 组导管更清晰、阻塞减轻。",
              },
            ],
          },
            ],
          },
          {
            id: "meibum-comp",
            mark: "②",
            title: "组分与物理性状",
            assays: [
          {
            id: "meibum-gli2-lipid",
            title: "GLI2 激活后脂质代谢基因与 PLIN2",
            sources: ["paper4"],
            instruments: [
              "激光捕获睑板腺 bulk RNA-seq，看脂质代谢 / 睑脂分化基因",
              "免疫荧光 PLIN2 判断产脂分化是否被抑制",
            ],
            markers: [
              {
                name: "脂质代谢 / 睑脂分化基因",
                role: "产脂功能读出",
                change: "GLI2 激活后下调",
              },
              {
                name: "PLIN2",
                role: "分化睑脂细胞",
                change: "干细胞扩增同时分化受抑；人睑板腺癌中 PLIN2 缺失",
              },
            ],
            observations: [
              "Hh 过激活让腺体看起来变大，但转录组显示产脂程序被压下去，属于增殖↑、分化↓，不能当成功能恢复。",
            ],
            figures: [
              {
                src: "/figures/paper4-fig5-gli2-rna.jpg",
                paperFig: "Fig. 5C",
                caption: "GLI2 激活：Hh 与增殖相关基因上调，脂质代谢和睑脂分化相关基因下调。",
              },
            ],
          },
          {
            id: "meibum-biophysics",
            title: "睑脂熔融温度与 CE / FA 组分",
            sources: ["paper2"],
            instruments: [
              "LC-MS：睑脂胆固醇酯（CE）定量",
              "脂肪酸组成分析：饱和 / 单不饱和 FA 链长分布",
              "熔融温度测定：重复测量睑脂熔点曲线",
            ],
            markers: [
              { name: "CE（胆固醇酯）", role: "SOAT1 产物，过高则睑脂变黏、熔点升高", change: "ATR101 后 CE 显著下降" },
              { name: "饱和 FA ↓ / 单不饱和 FA ↑", role: "流动性相关脂酰组成", change: "治疗后饱和 FA 下降、单不饱和 FA 升高" },
            ],
            observations: [
              "Fig. 2B：Awat2−/−/DMSO 的 CE 最高，ATR101 后接近野生型。",
              "Fig. 2C：治疗后饱和脂肪酸下降、单不饱和脂肪酸升高，利于流动性。",
              "Fig. 2E：DMSO 组熔点约 49–55 °C，ATR101 组降至约 37–44 °C。",
            ],
            figures: [
              {
                src: "/figures/paper2-fig2-meibum.jpg",
                paperFig: "Fig. 2B、2C、2E",
                caption:
                  "B：CE 含量。C：饱和与单不饱和 FA。E：熔融温度重复测量。A 为给药方案，D 为大体外观。",
              },
            ],
          },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cornea-tear",
    roman: "二",
    title: "角膜和泪膜、泪液",
    question: "角膜屏障是否破损？上皮是否应激修复？泪膜是否稳定？",
    summary:
      "角膜先用大体和荧光素看破损与混浊，再用 HE 看上皮增厚、炎症和新生血管，最后用 K12 / K14 / K15 / K1 / loricrin 判断是否鳞状化生。泪膜用镜面光反射和 TBUT；泪液量、泪河仍待补。读片时先排除角膜本身是否表达致病基因，再判断是否继发于睑板腺缺失。",
    sections: [
      {
        id: "cornea",
        index: "1",
        title: "角膜",
        topics: [
          {
            id: "cornea-morphology",
            mark: "①",
            title: "形态与完整性",
            assays: [
          {
            id: "cornea-krox20-gross",
            title: "大体 + HE：干眼介导的角膜鳞状化生",
            sources: ["paper3"],
            instruments: [
              "活体眼表大体观察（1、3、6、12 月龄）",
              "离体眼球大体",
              "全眼球石蜡切片 H&E，观察上皮、基质、炎症和新生血管",
            ],
            stains: ["H&E"],
            observations: [
              "Krox20-cKO：眼表粗糙、角膜混浊；1–3 月龄出现，随年龄加重，发生率 100%。对照角膜透明。",
              "HE：上皮显著增厚并过度角化，基质增厚、疏松紊乱，散在深染炎症细胞核，可见管腔内含红细胞的新生血管。",
              "Krox24 单敲眼表正常；与 Krox20 双敲则病变更早、更快。先确认角膜本身无 Krox20 谱系标记，再把本表型记为睑板腺缺失的继发后果。",
            ],
            figures: [
              {
                src: "/figures/paper3-fig1-cornea.jpg",
                paperFig: "Fig. 1A–E",
                caption:
                  "A–B：活体和离体角膜混浊。C–D：HE 全层。E：1–12 月龄进展。F–I 标志物见下一分支。",
              },
              {
                src: "/figures/paper3-fig1-he-zoom.jpg",
                paperFig: "Fig. 1D 放大",
                caption:
                  "上：cKO 上皮增厚、过度角化，基质炎症和新生血管。下：对照薄而规则的角膜上皮。",
              },
              {
                src: "/figures/paper3-fig7-krox24.jpg",
                paperFig: "Fig. 7A–C",
                caption:
                  "WT 与 Krox24-KO 眼表正常；Krox20-cKO 和双敲出现炎症、过度角化和鳞状化生。",
              },
            ],
          },
          {
            id: "cornea-fluorescein",
            title: "荧光素染色裂隙灯评估角膜完整性",
            sources: ["paper2"],
            instruments: [
              "角膜荧光素染色",
              "裂隙灯钴蓝光采集代表性图像（双眼 OD/OS，Day 0 / 10 / 14）",
            ],
            stains: ["荧光素"],
            observations: [
              "着染面积增大表示上皮破损、屏障破坏。",
              "SOAT1 抑制后角膜上皮破损减少，角膜表面完整性改善。",
            ],
            figures: [
              {
                src: "/figures/paper2-fig3-tear-cornea.jpg",
                paperFig: "Fig. 3C–D",
                caption:
                  "C：钴蓝光下荧光素着染，Day 0 / 10 / 14。D：着染积分密度，ATR101 组显著低于 DMSO。",
              },
            ],
          },
          {
            id: "cornea-confocal",
            title: "在体共聚焦显微镜观察角膜上皮各层",
            sources: ["paper2"],
            instruments: ["在体共聚焦显微镜，分层采集表层、翼状、基底上皮细胞"],
            observations: [
              "看三点：细胞是否肥大、固缩核数量、是否出现鳞状化生和表层脱落。",
              "黄色箭头：表层上皮脱落 / 鳞状化生；红色箭头：固缩细胞核增多。",
              "DMSO 组表层细胞紊乱、固缩核多，基底细胞肥大；ATR101 组接近野生型，但仍可见少量固缩核。",
            ],
            figures: [
              {
                src: "/figures/paper2-fig4-cornea.jpg",
                paperFig: "Fig. 4A",
                caption:
                  "列：表层 / 翼状 / 基底上皮。行：WT、Awat2−/−/DMSO、Awat2−/−/ATR101。黄箭头脱落/鳞状化生，红箭头固缩核。",
              },
            ],
          },
            ],
          },
          {
            id: "cornea-markers-topic",
            mark: "②",
            title: "分子标志物",
            assays: [
          {
            id: "cornea-krox20-markers",
            title: "角膜分化标志：K12 vs 表皮样 K14 / K15 / K1 / loricrin",
            sources: ["paper3"],
            instruments: [
              "角膜切片免疫荧光共染色",
              "比较 Krox20-cKO、Krox24-KO、双敲与 WT",
            ],
            markers: [
              {
                name: "K12",
                role: "正常角膜上皮终末分化",
                change: "cKO 和双敲中缺失，被表皮样上皮取代",
              },
              {
                name: "K14",
                role: "基底/应激上皮；在本模型中与表皮化并存",
                change: "cKO 角膜异常表达，对照浅表以 K12 为主",
              },
              {
                name: "K15、K1、loricrin",
                role: "复层鳞状角化 / 表皮终末分化",
                change: "cKO 和双敲异位出现在角膜表面",
              },
            ],
            observations: [
              "正常：浅表 K12⁺，无 K1 / loricrin。鳞状化生：K12↓，K15 / K1 / loricrin↑。",
              "Krox24 单敲这些标志仍接近 WT；双敲与 Krox20-cKO 方向相同但出现更早。",
              "系统评价时把 K12 丢失和表皮标志出现绑在一起看，不要只报一个角蛋白。",
            ],
            figures: [
              {
                src: "/figures/paper3-fig1-cornea.jpg",
                paperFig: "Fig. 1F–I",
                caption:
                  "F：K14/K12，cKO 丢失 K12。G：K15。H：K1。I：loricrin。下排对照。",
              },
              {
                src: "/figures/paper3-fig7-krox24.jpg",
                paperFig: "Fig. 7D–G",
                caption:
                  "K12⁺ 角膜上皮被 K14、K15、K1 和 loricrin⁺ 角化表皮样上皮取代。",
              },
            ],
          },
          {
            id: "cornea-markers",
            title: "角膜上皮标志物：免疫荧光 + RT-qPCR",
            sources: ["paper2"],
            instruments: [
              "角膜切片免疫荧光（IF）",
              "RT-qPCR 定量标志物基因 mRNA",
            ],
            markers: [
              {
                name: "Krt14（红色）",
                role: "基底上皮祖细胞，具备增殖能力",
                change:
                  "应激后上调，并错误定位到浅表层；ATR101 后浅表异位减轻，mRNA 回落至接近 WT",
              },
              {
                name: "Krt12（绿色）",
                role: "终末分化的基底上层及浅表上皮",
                change: "损伤修复时下调；ATR101 后浅表 Krt12 信号部分恢复",
              },
              {
                name: "Sprr1a",
                role: "浅表上皮鳞状分化、角化包膜形成",
                change: "DMSO 组显著升高；ATR101 组下降但仍高于 WT",
              },
            ],
            observations: [
              "正常：Krt12 在浅表，Krt14 限于基底。损伤后角膜缘细胞迁入中央，Krt12↓、Krt14↑。",
              "Awat2−/− 中 Krt14 出现在浅表层（Fig. 4B 红箭头），提示上皮应激与修复活性升高。",
              "4C：Krt14 mRNA 在 ATR101 后与 WT 无显著差异；Sprr1a 仍部分残留，说明鳞状化生尚未完全消退。",
            ],
            figures: [
              {
                src: "/figures/paper2-fig4-cornea.jpg",
                paperFig: "Fig. 4B–C",
                caption:
                  "B：红=Krt14，绿=Krt12。DMSO 组浅表 Krt14 异位。C：Krt14、Sprr1a 相对 Gapdh 的 RT-qPCR。",
              },
            ],
          },
        ],
      },
        ],
      },
      {
        id: "tear",
        index: "2",
        title: "泪膜、泪液",
        topics: [
          {
            id: "tear-integrity",
            mark: "①",
            title: "泪膜完整性",
            assays: [
          {
            id: "tear-specular",
            title: "镜面光反射法评估泪膜完整性",
            sources: ["paper2"],
            instruments: [
              "体视显微镜：观察圆形 LED 光环在眼表的反射模式",
            ],
            observations: [
              "完整稳定泪膜：平滑、连续的环形反光。",
              "反光扭曲、不规则、碎裂：泪膜不稳定或眼表形态异常。",
              "DMSO 组光环断裂、扭曲；ATR101 组恢复为较完整圆环。",
            ],
            figures: [
              {
                src: "/figures/paper2-fig3-tear-cornea.jpg",
                paperFig: "Fig. 3A",
                caption:
                  "镜面光反射。DMSO 组环形反光碎裂、扭曲；ATR101 组恢复较完整圆环。标尺 200 μm。",
              },
            ],
          },
            ],
          },
          {
            id: "tear-quantity",
            mark: "②",
            title: "泪液与破裂时间",
            assays: [
          {
            id: "tear-tbut",
            title: "泪膜破裂时间（TBUT）",
            sources: ["paper2"],
            instruments: [
              "泪膜破裂时间定量（原文 Fig. 3B）：比较 Awat2−/−/DMSO、ATR101 与 WT",
            ],
            observations: [
              "DMSO 组 TBUT 最短；ATR101 治疗后显著延长，仍低于野生型。",
              "与 Fig. 3A 镜面反射一起读：反射看空间完整性，TBUT 看维持时间。",
            ],
            pending: [
              "泪液收集方法（毛细管 / 酚红棉线等）及定量结果",
              "泪膜脂质层干涉/厚度检测",
              "泪河高度测量",
              "NIBUT 的操作定义（原文报告的是侵入性/荧光素相关 TBUT）",
            ],
            figures: [
              {
                src: "/figures/paper2-fig3-tear-cornea.jpg",
                paperFig: "Fig. 3B",
                caption:
                  "Tear film break-up time。Awat2−/−/DMSO < ATR101 < WT。",
              },
            ],
          },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "conjunctiva",
    roman: "三",
    title: "结膜",
    question: "结膜上皮是否增生？杯状细胞是否改变？MCJ 分化边界是否错位？",
    summary:
      "结膜评价分三层：HE 看睑缘/结膜上皮厚度，PAS 看穹窿杯状细胞，免疫荧光用 Krt4（黏膜）和 Krt10（表皮）判断 MCJ 是否被表皮化。",
    sections: [
      {
        id: "conj-structure",
        index: "1",
        title: "上皮结构",
        topics: [
          {
            id: "conj-he-topic",
            mark: "①",
            title: "上皮增厚",
            assays: [
          {
            id: "conj-he",
            title: "睑板上皮 HE：结膜、皮肤黏膜移行上皮增厚",
            sources: ["paper5"],
            instruments: ["石蜡切片 HE"],
            stains: ["H&E"],
            observations: [
              "KR/TG 小鼠睑缘结膜上皮、皮肤黏膜移行上皮较对照增厚（Fig. 5A–D）。",
              "这是 TGFα 作为上皮有丝分裂原的直接效应，需与 MG 本身病变分开记录。",
            ],
            figures: [
              {
                src: "/figures/paper5-fig5-conjunctiva.jpg",
                paperFig: "Fig. 5A–D",
                caption:
                  "HE：对照 A、C vs 转基因 B、D。结膜上皮与皮肤黏膜移行上皮增厚。",
              },
            ],
          },
            ],
          },
          {
            id: "conj-pas-topic",
            mark: "②",
            title: "杯状细胞",
            assays: [
          {
            id: "conj-pas",
            title: "结膜 PAS 染色评估穹窿杯状细胞",
            sources: ["paper5"],
            instruments: ["PAS 染色，观察结膜穹窿"],
            stains: ["PAS"],
            markers: [
              {
                name: "PAS 阳性杯状细胞",
                role: "结膜黏液分泌细胞",
                change: "TGFα 过表达 15 天后穹窿杯状细胞增多",
              },
            ],
            observations: [
              "P0–P15 诱导后，结膜穹窿 PAS 阳性杯状细胞增加（Fig. 5E/5F）。",
              "杯状细胞增多提示黏液层代偿或上皮分化被重编程，不能单独等同于炎症。",
            ],
            figures: [
              {
                src: "/figures/paper5-fig5-conjunctiva.jpg",
                paperFig: "Fig. 5E–F",
                caption: "PAS：对照 vs TGFα 过表达 15 天，焦点在穹窿杯状细胞密度。",
              },
            ],
          },
        ],
      },
        ],
      },
      {
        id: "conj-markers",
        index: "2",
        title: "分子标志物",
        topics: [
          {
            id: "conj-krt-topic",
            mark: "①",
            title: "黏膜 / 表皮分化边界",
            assays: [
          {
            id: "conj-krt4",
            title: "Krt4：皮肤黏膜交界区黏膜上皮分化",
            sources: ["paper5"],
            instruments: ["免疫荧光"],
            markers: [
              {
                name: "Krt4（K4）",
                role: "黏膜上皮分化标志，正常应出现在 MCJ 黏膜侧",
                change: "转基因鼠 MCJ 处 Krt4 消失（5G/5H）",
              },
            ],
            observations: [
              "Krt4 丢失表示睑缘黏膜表型被削弱，MCJ 身份不稳定。",
            ],
            figures: [
              {
                src: "/figures/paper5-fig5-conjunctiva.jpg",
                paperFig: "Fig. 5G–H",
                caption: "免疫荧光：对照 MCJ 黏膜侧 Krt4 阳性，转基因鼠该信号消失。",
              },
            ],
          },
          {
            id: "conj-krt10",
            title: "Krt10：表皮分化标志越过 MCJ 进入结膜",
            sources: ["paper5"],
            instruments: ["免疫荧光"],
            markers: [
              {
                name: "Krt10（K10）",
                role: "表皮终末分化标志",
                change: "越过 MCJ，异位进入结膜上皮（Fig. 5I、J）",
              },
            ],
            observations: [
              "与 Krt4 丢失同时出现 Krt10 前移，说明睑缘发生表皮化。",
              "系统评价时应成对看 Krt4↓ + Krt10 越界，而不是只报一个角蛋白。",
            ],
            figures: [
              {
                src: "/figures/paper5-fig5-conjunctiva.jpg",
                paperFig: "Fig. 5I–J",
                caption: "Krt10 信号是否跨越 MCJ 进入结膜侧。",
              },
            ],
          },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "muscle",
    roman: "四",
    title: "眼睑相关肌肉",
    question:
      "睑板肌和眼轮匝肌是否存在？肌腱/睑板是否由神经嵴细胞过度增生而畸形？",
    summary:
      "先用 α-SMA 和骨骼肌肌球蛋白确认 TM、OO 本身大体正常，再用 Wnt1Cre 谱系追踪和马松三色看 CPF/TP 是否细胞堆积、胶原丢失。增殖（PCNA）、凋亡（TUNEL）和 EGFR / β-catenin / N-cadherin 解释肌腱细胞为何停在祖细胞状态。",
    sections: [
      {
        id: "muscle-identity",
        index: "1",
        title: "睑板肌与眼轮匝肌",
        topics: [
          {
            id: "muscle-sma-topic",
            mark: "①",
            title: "身份标志",
            assays: [
          {
            id: "muscle-sma-myosin",
            title: "α-SMA 与骨骼肌肌球蛋白：睑板肌 / 眼轮匝肌",
            sources: ["paper5"],
            instruments: ["免疫荧光"],
            markers: [
              {
                name: "α-SMA",
                role: "睑板肌（TM）",
                change: "整体与对照无明显差异；远端可因囊肿而局部中断",
              },
              {
                name: "骨骼肌肌球蛋白",
                role: "眼轮匝肌（OO）",
                change: "与对照总体无差异",
              },
            ],
            observations: [
              "眼睑开闭相关横纹肌/平滑肌并非本模型的主要靶点。",
              "下睑 CPF 与 TM 并行，囊肿可把 TM 远端顶断，属于占位效应而非肌纤维本身病变。",
            ],
            figures: [
              {
                src: "/figures/paper5-suppl-fig1-sma-myosin.jpg",
                paperFig: "补充图 1A、1B",
                caption:
                  "P15。红=α-SMA（TM），绿=骨骼肌肌球蛋白（OO），蓝=DAPI。KR 与 KR/TG 总体相似；远端可因囊肿局部中断。",
              },
            ],
          },
        ],
      },
        ],
      },
      {
        id: "muscle-tendon",
        index: "2",
        title: "肌腱与睑板",
        topics: [
          {
            id: "muscle-lineage",
            mark: "①",
            title: "发育来源",
            assays: [
          {
            id: "muscle-lineage-trace",
            title: "Wnt1Cre / Rosa26mTmG 谱系追踪",
            sources: ["paper5"],
            instruments: [
              "KR/TG 与 Wnt1Cre/Rosa26mTmG 杂交",
              "冰冻切片 DAPI，绿色荧光=神经嵴来源",
            ],
            markers: [
              {
                name: "膜结合 GFP（mG）",
                role: "神经嵴来源细胞",
                change: "下睑 CPF、TP 主要为绿色；TGFα 后 CPF↑、TP↑",
              },
            ],
            observations: [
              "CPF、TP：绿色荧光阳性，神经嵴来源；过表达后细胞数明显增加（Fig. 6B–G、B′–G′）。",
              "TM：同样神经嵴来源，但过表达后无明显变化（Fig. 6B–D、B′–D′）。",
              "上眼睑肌腱：绿色荧光少，神经嵴贡献少（补充 Fig. 2），可解释下睑表型更重。",
            ],
            figures: [
              {
                src: "/figures/paper5-fig6-lineage.jpg",
                paperFig: "Fig. 6A–G、A′–G′",
                caption:
                  "下睑。绿=神经嵴来源。对照 CPF/TP 为绿色；KR/TG 后 CPF、TP 明显增厚，TM 相对不受累。",
              },
              {
                src: "/figures/paper5-suppl-fig2-upper-lid.jpg",
                paperFig: "补充 Fig. 2",
                caption:
                  "上睑 P15。神经嵴来源细胞（绿）在上睑肌腱贡献少，可解释下睑表型更重。",
              },
            ],
          },
        ],
      },
          {
            id: "muscle-development",
            mark: "②",
            title: "发育过程",
            assays: [
          {
            id: "muscle-masson-adult",
            title: "马松三色：肌腱与睑板细胞 vs 胶原",
            sources: ["paper5"],
            instruments: [
              "眼睑石蜡切片马松三色",
              "红色=细胞质/细胞，蓝色=胶原",
            ],
            stains: ["Masson 三色"],
            observations: [
              "对照：肌腱、睑板仅少量细长梭形成纤维细胞，胞外基质胶原丰富（Fig. 4A、Aa、Ab）。",
              "转基因：细胞数量显著增多、胶原明显下降，睑板区可见囊肿（Fig. 4B 星号）；高倍下变为致密圆形细胞（4Ba、Bb）。",
              "缩写：TM 睑板肌；CPF 下睑囊筋膜；TP 睑板；MG 睑板腺。",
            ],
            figures: [
              {
                src: "/figures/paper5-fig4-masson.jpg",
                paperFig: "Fig. 4",
                caption:
                  "P0–P15 诱导后 P15 取材。对照胶原丰富、细胞稀少；转基因细胞增多、胶原下降，睑板区可见囊肿。",
              },
            ],
          },
          {
            id: "muscle-masson-time",
            title: "马松三色时间序列：对照 vs TGFα 过表达",
            sources: ["paper5"],
            instruments: ["P0、P5、P8、P11 眼睑石蜡切片马松三色"],
            stains: ["Masson 三色"],
            observations: [
              "对照正常发育：P0 眼睑呈融合薄褶皱，CPF 与 MG 原基已形成；P5 间充质凝集形成 CPF、TP，MG 开始延长；P8 MG 分支并伸入 TP；P11 腺泡簇形成。",
              "过表达组异常：P5 CPF 轻度增厚、睑尖间充质堆积、MG 内陷延长受阻；P8 大量细胞堆积，重症出现囊肿、开口异位；P11 CPF 显著增厚，基质间充质堆积加重。",
              "读片时分工：MG 看延长/分支/入 TP/腺泡簇/开口；CPF 看增厚与堆积；TP 看凝集、堆积和囊肿；表皮与结膜看增生。",
            ],
            figures: [
              {
                src: "/figures/paper5-fig7-time.jpg",
                paperFig: "Fig. 7A–G",
                caption:
                  "对照 A/B/D/F，转基因 C/E/G。P0–P11 马松三色。同一时间点左右对照，避免把发育阶段差异当成表型。",
              },
            ],
          },
        ],
      },
          {
            id: "muscle-signaling",
            mark: "③",
            title: "增殖、凋亡与分子标志物",
            assays: [
          {
            id: "muscle-pcna-tunel",
            title: "PCNA 与 TUNEL：CPF / TP 增殖和凋亡",
            sources: ["paper5"],
            instruments: ["免疫荧光 PCNA；TUNEL"],
            markers: [
              {
                name: "PCNA",
                role: "增殖",
                change: "对照散在；过表达组 CPF、TP 的 PCNA⁺ 细胞↑",
              },
              {
                name: "TUNEL",
                role: "凋亡",
                change: "对照少；过表达组 TUNEL⁺ 细胞↑",
              },
            ],
            observations: [
              "肌腱/睑板同时出现增殖增强和凋亡增多，是细胞堆积伴组织重塑，而不是单纯增生。",
              "与 MG 基底层 PCNA 模式不变、腺泡 TUNEL 很少形成对照。",
            ],
            figures: [
              {
                src: "/figures/paper5-fig8-pcna.jpg",
                paperFig: "Fig. 8Ab–Ac vs Bb–Bc",
                caption: "PCNA：过表达组 CPF、TP 阳性细胞增多；MG 基底层模式相对不变。",
              },
              {
                src: "/figures/paper5-fig9-tunel.jpg",
                paperFig: "Fig. 9Ab–Ac vs Bb–Bc",
                caption: "TUNEL：过表达组 CPF、TP 凋亡增多，与 MG 腺泡内很少形成对照。",
              },
            ],
          },
          {
            id: "muscle-collagen",
            title: "I / III 型胶原：睑板基质是否形成",
            sources: ["paper5"],
            instruments: ["免疫荧光"],
            markers: [
              {
                name: "I 型胶原",
                role: "肌腱/睑板成熟细胞外基质",
                change: "过表达组 CPF、TP 信号↓",
              },
              {
                name: "III 型胶原",
                role: "肌腱/睑板细胞外基质",
                change: "过表达组 CPF、TP 信号↓",
              },
            ],
            observations: [
              "细胞多但胶原少，说明肌腱细胞增殖却未完成分化，睑板支架变软、占位。",
            ],
            figures: [
              {
                src: "/figures/paper5-fig10-pparg-collagen.jpg",
                paperFig: "Fig. 10C–F",
                caption: "C–D 为 I 型胶原，E–F 为 III 型胶原。对照丰富，转基因 CPF/TP 明显减弱。",
              },
            ],
          },
          {
            id: "muscle-egfr",
            title: "EGFR / β-catenin / N-cadherin：CPF 细胞增殖与黏附",
            sources: ["paper5"],
            instruments: ["免疫荧光"],
            markers: [
              {
                name: "EGFR",
                role: "TGFα 受体，驱动增殖",
                change: "过表达组 CPF 信号↑",
              },
              {
                name: "β-catenin",
                role: "Wnt 通路 / 黏附，可核转位",
                change: "过表达组 CPF 信号↑并核转位",
              },
              {
                name: "N-cadherin",
                role: "间充质祖细胞黏附标志",
                change: "过表达组 CPF 信号↑",
              },
            ],
            observations: [
              "TGFα → EGFR 增强，同时 β-catenin 入核、N-cadherin 维持祖细胞表型。",
              "这解释了为何 TM（EGFR 低）不受累，而 CPF 肌腱细胞停在未分化状态并形成囊肿。",
            ],
            figures: [
              {
                src: "/figures/paper5-fig11-egfr.jpg",
                paperFig: "Fig. 11A–F",
                caption: "A–B EGFR，C–D β-catenin，E–F N-cadherin。焦点在 CPF 而非 MG。",
              },
            ],
          },
        ],
      },
        ],
      },
    ],
  },
]

export function withFigureIds(tree: Category[]): Category[] {
  return tree.map((category) => ({
    ...category,
    sections: category.sections.map((section) => ({
      ...section,
      topics: section.topics.map((topic) => ({
        ...topic,
        assays: topic.assays.map((assay) => ({
          ...assay,
          figures: assay.figures.map((figure, index) => ({
            ...figure,
            id: figure.id ?? `${assay.id}-fig-${index}`,
          })),
        })),
      })),
    })),
  }))
}

export function allAssays() {
  return categories.flatMap((category) =>
    category.sections.flatMap((section) =>
      section.topics.flatMap((topic) =>
        topic.assays.map((assay) => ({
          ...assay,
          categoryId: category.id,
          sectionId: section.id,
          topicId: topic.id,
        }))
      )
    )
  )
}
