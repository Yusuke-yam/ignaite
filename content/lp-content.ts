export const SECTION_IDS = [
  "hero",
  "campaign",
  "problems",
  "about",
  "reviews",
  "feature",
  "flow",
  "final-cta",
  "faq",
  "footer",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const NAV_ITEMS = [
  { label: "デジハクとは", href: "#about" },
  { label: "特徴", href: "#feature" },
  { label: "流れ", href: "#flow" },
  { label: "FAQ", href: "#faq" },
] as const;

export const FAQ_ITEMS = [
  {
    question: "未経験でも本当に大丈夫ですか？",
    answer:
      "ご安心ください。専任講師が基礎から実践までマンツーマンで伴走します。初めてでも着実にスキルを習得し、副業やキャリアに活かせる力を養えます。",
  },
  {
    question: "仕事や育児と両立できますか？",
    answer:
      "オンライン教材と個別サポートを活用し、生活リズムに合わせて自分のペースで進められます。",
  },
  {
    question: "本当に仕事やキャリアに活かせますか？",
    answer:
      "実案件を想定した課題と専任講師のフィードバックで、実務につながるスキルを習得できます。",
  },
  {
    question: "学習中に不安や疑問が出た場合は？",
    answer:
      "いつでもチャットで相談でき、定期的なオンライン面談で学習計画も調整できます。",
  },
  {
    question: "法人やチームでの受講は可能ですか？",
    answer:
      "可能です。組織の目的やスキルレベルに応じた学習方法をご案内します。",
  },
] as const;

export const REVIEW_MESSAGES = [
  "AI初心者でしたが、講師の方が丁寧に伴走してくれたので安心して学べました。",
  "プロンプトの考え方が身につき、日々の業務時間が大幅に短縮できました！",
  "副業案件への提案から納品まで、実践的なサポートが本当に役立ちます。",
  "仕事と両立しながら自分のペースで進められるのが嬉しいです。",
  "AIを使うだけでなく、仕事につなげる方法まで学べるのがデジハクの魅力。",
  "ポートフォリオが完成し、初めての案件を受注できました。一歩踏み出して良かった！",
  "一人では止まっていたところも、1on1のアドバイスですぐに解決できました。",
  "学んだことをその日から実務で試せるので、成長のスピードを実感しています。",
] as const;

export const CURRICULUM_TABS = [
  "生成AI共通基礎",
  "AIコンテンツ生成",
  "AIビジュアル制作",
  "業務効率化・自動化",
  "AIアプリ開発",
  "AIビジネス実践編",
] as const;
