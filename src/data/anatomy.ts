import type { Figure } from "@/data/content"
export type AnatomyBlock = { id: string; title: string; parentId?: string; kind?: "group"; paragraphs: string[]; sources: string[]; figures: Figure[] }
export type AnatomySection = { id: string; title: string; english: string; outlineVersion?: number; blocks: AnatomyBlock[] }
export const defaultAnatomy: AnatomySection[] = [
  {
    "id": "anatomy-overview",
    "title": "解剖总览",
    "english": "ANATOMICAL OVERVIEW",
    "blocks": [
      {
        "id": "anatomy-overview-figure",
        "title": "眼睑与睑板腺分泌单位",
        "paragraphs": [],
        "sources": [
          "Meibomian gland stem/progenitor cells: The hunt for gland renewal.The Ocular Surface, 29:497–507."
        ],
        "figures": [
          {
            "id": "anatomy-figure-1",
            "src": "/figures/anatomy/image1.jpeg",
            "paperFig": "眼睑与睑板腺分泌单位",
            "caption": "眼睑结构及睑板腺分泌单位示意图。",
            "width": 1050,
            "height": 773
          }
        ]
      }
    ]
  },
  {
    "id": "anatomy-eyelid",
    "title": "Ⅰ. 眼睑",
    "english": "EYELID",
    "blocks": [
      {
        "id": "anatomy-gross",
        "title": "01 · 大体解剖",
        "paragraphs": [
          "眼睑是结构复杂的组织，由皮肤、黏膜、腺体、及其支撑结构睑板及肌肉共同构成。",
          "上睑（UL, upper eyelid;） 和下睑（LL, lower eyelid.）"
        ],
        "sources": [
          "Sundberg, J. P., Vogel, P., & Ward, J. M. (Eds.). (2021). Pathology of genetically engineered and other mutant mice. Wiley-Blackwell."
        ],
        "figures": [
          {
            "id": "anatomy-figure-2",
            "src": "/figures/anatomy/image2.png",
            "paperFig": "01 · 大体解剖",
            "caption": "UL：上睑；LL：下睑。",
            "width": 664,
            "height": 758
          }
        ]
      },
      {
        "id": "anatomy-skin",
        "title": "02 · 皮肤和黏膜",
        "paragraphs": [
          "从眼睑走向眼球：皮肤-MCJ-睑结膜。",
          "前后睑缘 · MCJ · 睫毛"
        ],
        "sources": [
          "Systematic Evaluation of the Mouse Eye: Anatomy, Pathology, and Biomethods P4"
        ],
        "figures": [
          {
            "id": "anatomy-figure-3",
            "src": "/figures/anatomy/image3.png",
            "paperFig": "02 · 皮肤和黏膜",
            "caption": "图 1.1 眼睑 —— 扫描电镜图。\n成年小鼠眼睑。方框内区域放大后见 B 图。 \n眼睑皮肤黏膜交界处。大量睫毛（箭头）自眼睑皮肤长出。睫毛之间的表皮表面可见角质碎屑。在皮肤黏膜交界后方，结膜（C）表面光滑。",
            "width": 1269,
            "height": 466
          }
        ]
      },
      {
        "id": "anatomy-mcj",
        "title": "皮肤黏膜交界 · MCJ",
        "paragraphs": [
          "眼睑 MCJ=皮肤黏膜交界"
        ],
        "sources": [
          "Systematic Evaluation of the Mouse Eye: Anatomy, Pathology, and Biomethods P5"
        ],
        "figures": [
          {
            "id": "anatomy-figure-4",
            "src": "/figures/anatomy/image4.png",
            "paperFig": "皮肤黏膜交界 · MCJ",
            "caption": "眼睑冠状切面。皮肤存在细微皱褶；而睑结膜面光滑，内含杯状细胞。睑板腺（M）紧贴睑结膜下方。毛囊（*）是位于皮肤黏膜交界处睫毛的生发结构。原始放大倍数 ×20。 \nB. 睑板腺（M）的分泌物进入导管（*），导管开口于眼睑皮肤黏膜交界的表面。原始放大倍数 ×50。",
            "width": 1269,
            "height": 466
          }
        ]
      },
      {
        "id": "anatomy-mg",
        "title": "03 · 腺体 / ① 睑板腺 MG",
        "paragraphs": [
          "①睑板腺 MG 睑板腺开口沿睑缘分布，紧邻皮肤黏膜移行缘后方；其分泌物可润滑眼睑，并参与构成泪膜。",
          "腺泡 → 导管小管 → 中央导管 → 腺口",
          "靠近腺体根部是分泌腺泡，腺泡内为睑板腺细胞；远端为导管."
        ],
        "sources": [],
        "figures": [
          {
            "id": "anatomy-figure-5",
            "src": "/figures/anatomy/image5.png",
            "paperFig": "03 · 腺体 / ① 睑板腺 MG",
            "caption": "睑板腺组织切片：MCJ、腺泡（acini）、中央导管（CD）及导管开口（DO）。",
            "width": 908,
            "height": 720
          }
        ]
      },
      {
        "id": "anatomy-lacrimal",
        "title": "② 泪腺和副泪腺",
        "paragraphs": [
          "小鼠具有两对泪腺，通过一条总导管开口于结膜囊。眶内泪腺体积较小，位于上睑外侧下方。眶外泪腺位于耳的前腹侧，毗邻腮腺。"
        ],
        "sources": [
          "Evaluation of Corneal Damage After Lacrimal Gland Excision in Male and Female Mice.2019，Investigative Ophthalmology & Visual Science（IOVS）"
        ],
        "figures": [
          {
            "id": "anatomy-figure-6",
            "src": "/figures/anatomy/image6.jpeg",
            "paperFig": "② 泪腺和副泪腺",
            "caption": "眶外泪腺（Extraorbital LG）与眶内泪腺（Intraorbital LG）的解剖位置及组织形态。",
            "width": 676,
            "height": 836
          }
        ]
      },
      {
        "id": "anatomy-zeis",
        "title": "③ Zeis 腺体",
        "paragraphs": [
          "睫毛与特化的大型皮脂腺（睑板腺）紧密相连，睑板腺开口沿皮肤黏膜移行缘，位于睫毛后方。睫毛毛囊附有小型皮脂腺（Zeis腺）。"
        ],
        "sources": [
          "Systematic Evaluation of the Mouse Eye: Anatomy, Pathology, and Biomethods P5"
        ],
        "figures": [
          {
            "id": "anatomy-figure-7",
            "src": "/figures/anatomy/image7.png",
            "paperFig": "③ Zeis 腺体",
            "caption": "*为睫毛毛囊，附有小型皮脂腺（Zeis腺）",
            "width": 946,
            "height": 646
          }
        ]
      },
      {
        "id": "anatomy-support",
        "title": "04 · 支撑结构：睑板与肌肉",
        "paragraphs": [
          "眼睑由睑板（致密胶原构成）和眼轮匝肌（横纹肌，面神经 Ⅶ 支配）支撑；眼轮匝肌的功能为闭眼。",
          "眼睑的支撑结构包括由致密胶原构成的睑板，以及起闭眼作用的横纹肌 —— 眼轮匝肌（受第 Ⅶ 对脑神经支配）。上睑由横纹肌上睑提肌抬起（图 1.3），该肌肉与上直肌联系紧密（见下文）³。眶内组织被一层膜状平滑肌包绕，称为眶肌。眶肌附着于上睑提肌以及眼眶骨壁。"
        ],
        "sources": [],
        "figures": []
      },
      {
        "id": "anatomy-tarsal",
        "title": "① 睑板",
        "paragraphs": [
          "Masson三色染色",
          "胶原纤维蓝色；肌纤维、细胞质红色；细胞核蓝黑色",
          "TP为睑板，TM为睑板肌，MG为睑板腺，CPF为下睑缩肌相关的囊睑筋膜"
        ],
        "sources": [
          "Perturbed meibomian gland and tarsal plate morphogenesis by excess TGFα in eyelid stroma.Developmental Biology, 406(2):147–157."
        ],
        "figures": [
          {
            "id": "anatomy-figure-8",
            "src": "/figures/anatomy/image8.png",
            "paperFig": "① 睑板",
            "caption": "Masson 三色染色显示睑板及周围结构。",
            "width": 984,
            "height": 536
          }
        ]
      },
      {
        "id": "anatomy-orbicularis",
        "title": "② 肌层 / 眼轮匝肌",
        "paragraphs": [
          "MG腺体位于眼轮匝肌下方、邻近结膜。"
        ],
        "sources": [
          "Meibomian gland stem/progenitor cells: The hunt for gland renewal.The Ocular Surface, 29:497–507."
        ],
        "figures": [
          {
            "id": "anatomy-figure-9",
            "src": "/figures/anatomy/image9.png",
            "paperFig": "② 肌层 / 眼轮匝肌",
            "caption": "Fig. 2B：小鼠眼睑矢状组织切片。",
            "width": 776,
            "height": 511
          }
        ]
      },
      {
        "id": "anatomy-levator",
        "title": "上睑提肌、上直肌",
        "paragraphs": [],
        "sources": [
          "Mouse Extraocular Muscles and the Musculotopic Organization of Their Innervation.The Anatomical Record, 302:1865–1885."
        ],
        "figures": [
          {
            "id": "anatomy-figure-10",
            "src": "/figures/anatomy/image10.png",
            "paperFig": "上睑提肌、上直肌",
            "caption": "Fig. 2F：上睑提肌（LP）、上直肌（SR）",
            "width": 730,
            "height": 566
          }
        ]
      },
      {
        "id": "anatomy-orbital",
        "title": "眶肌",
        "paragraphs": [
          "眶内容物被一层膜状平滑肌包绕，即眶肌。眶肌一端附着于提上睑肌，另一端连于眼眶骨壁；其结构部分对应灵长类的眶骨膜、洛克伍德韧带、惠特纳尔韧带以及睑板肌（Müller 肌）。"
        ],
        "sources": [],
        "figures": []
      }
    ]
  },
  {
    "id": "anatomy-surface",
    "title": "Ⅱ. 眼表",
    "english": "OCULAR SURFACE",
    "blocks": [
      {
        "id": "anatomy-cornea",
        "title": "01 · 角膜",
        "paragraphs": [
          "角膜由五层结构组成：上皮层、鲍曼层、基质层、后弹力层（德斯密膜）以及内皮层。"
        ],
        "sources": [
          "Systematic Evaluation of the Mouse Eye: Anatomy, Pathology, and Biomethods P8"
        ],
        "figures": [
          {
            "id": "anatomy-figure-11",
            "src": "/figures/anatomy/image11.png",
            "paperFig": "01 · 角膜",
            "caption": "C正常角膜上皮（E）厚度为 5～6 层。常可观察到细胞分裂（箭头尖），分裂活动一般局限于基底层。鲍曼层（箭头）无细胞成分。角膜基质（S）的胶原呈有序板层排列，与角膜表面平行；角膜基质细胞也沿同一方向变扁平。后弹力层将基质与角膜内皮（空心箭头）分隔开。原始放大倍数 ×630。 \n\nD在角膜缘处，角膜快速移行为巩膜。角膜上皮转变为薄得多的结膜上皮（E）。上皮与巩膜之间存在一层菲薄的疏松结缔组织。对比 C 图可见，巩膜胶原排列杂乱，不同于角膜基质。角膜内无血管通道（箭头），但角膜缘处巩膜血管丰富。原始放大倍数 ×400。",
            "width": 1507,
            "height": 529
          }
        ]
      },
      {
        "id": "anatomy-conjunctiva",
        "title": "02 · 结膜",
        "paragraphs": [
          "结膜起自黏膜皮肤交界处，睑结膜沿眼睑内表面延伸至上方、下方穹窿结膜，在此处反折（穹窿部）覆盖巩膜，一直延续至角巩膜缘，形成球结膜。",
          "结膜上皮为非角化复层鳞状上皮，主要由角质形成细胞和杯状细胞组成。结膜杯状细胞产生的黏蛋白、泪腺分泌的水样泪液以及及睑板腺分泌的脂质共同构成泪膜，保护角膜与结膜表面，避免干燥、异物造成的微小损伤以及细菌侵袭。采用阿尔辛蓝、黏卡红或过碘酸 - 希夫（PAS）染色可清晰显示杯状细胞。",
          "结膜角质形成细胞下方为薄层疏松、富含血管的胶原结缔组织，疏松附着于深部巩膜。该区域常可见淋巴细胞、嗜酸性粒细胞与肥大细胞。"
        ],
        "sources": [
          "Sundberg, J. P., Vogel, P., & Ward, J. M. (Eds.). (2021). Pathology of genetically engineered and other mutant mice. Wiley-Blackwell."
        ],
        "figures": [
          {
            "id": "anatomy-figure-12",
            "src": "/figures/anatomy/image12.png",
            "paperFig": "02 · 结膜",
            "caption": "睑结膜 → 穹窿结膜 → 球结膜：图中彩色标记对应不同区域。",
            "width": 664,
            "height": 758
          }
        ]
      },
      {
        "id": "anatomy-goblet",
        "title": "杯状细胞在睑结膜中的分布",
        "paragraphs": [],
        "sources": [
          "Henriksson 等，2013Morphologic alterations of the palpebral conjunctival epithelium in a dry eye model.Cornea, 32(4):483–490."
        ],
        "figures": [
          {
            "id": "anatomy-figure-13",
            "src": "/figures/anatomy/image13.png",
            "paperFig": "杯状细胞在睑结膜中的分布",
            "caption": "正常C57BL/6小鼠睑结膜，显示其三个分区。M = 睑缘区，C = 中央区，F = 穹窿区。靠近睑缘处（箭头）为复层多层上皮，该区域上皮最厚，无杯状细胞。杯状细胞分布区域位于两个白色箭头尖（三角标记）之间。（放大倍数 100 倍）",
            "width": 749,
            "height": 295
          }
        ]
      },
      {
        "id": "anatomy-tearfilm",
        "title": "03 · 泪膜",
        "paragraphs": [
          "泪膜由结膜杯状细胞产生的黏蛋白、泪腺分泌的水样泪液以及及睑板腺分泌的脂质共同构成。睁眼状态下的泪液分为三个空间：",
          "穹窿区泪液：位于结膜穹窿和睑板后方的间隙。",
          "泪河／泪液弯月面（tear menisci）：位于眼球与上、下睑缘相接的夹角。",
          "眼表泪膜：覆盖暴露的角膜和球结膜；分别沿角膜及球结膜表面轮廓铺展。"
        ],
        "sources": [],
        "figures": []
      },
      {
        "id": "anatomy-tfbut",
        "title": "泪膜破裂时间 · TFBUT",
        "paragraphs": [
          "TFBUT 用于评价泪膜稳定性。采用 2 μL、0.5% 荧光素钠，记录眨眼后至荧光素染色泪膜首次出现暗斑的时间，每眼测量三次取平均。"
        ],
        "sources": [
          "“Smart Eye Camera”: An innovative technique to evaluate tear film breakup time in a murine dry eye disease model.PLOS ONE 14(5):e0215130."
        ],
        "figures": [
          {
            "id": "anatomy-figure-14",
            "src": "/figures/anatomy/image14.png",
            "paperFig": "泪膜破裂时间 · TFBUT",
            "caption": "采用智能眼相机记录的泪膜破裂形态 本图为智能眼相机连续拍摄的一组图像。上排为移植物抗宿主病（GVHD）相关干眼模型小鼠图像：眨眼后 3 s 泪膜即发生破裂（泪膜破裂时间，TFBUT = 3 s）。下排为正常小鼠：眨眼后 3 s 泪膜仍保持稳定，至 6 s 时泪膜破裂（TFBUT = 6 s）。拍摄对象为 12 周龄小鼠右眼。",
            "width": 1960,
            "height": 1228
          }
        ]
      }
    ]
  }
]
