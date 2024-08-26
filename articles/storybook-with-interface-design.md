---
title: "私たちはStorybookを通じて設計を見つめなおす"
emoji: "💬"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["storybook"]
published: false
---

みなさん、普段のフロントエンド開発業務にStorybookは使っているでしょうか。

## Storybookを使って何を得たいのか

私がstorybookの導入を進める場合のモチベーションは大きく分けて２つあります。

1. 高速な開発サイクルを回すため
2. コンポーネントの設計を完全にAPIから切り離すため

### 高速な開発サイクルを回すため

### コンポーネントの設計を完全にAPIから切り離すため

前提としてContainer/Presentationalパターン（以下C/Pパターン）を想定をしています。
こちらの記事でよく解説されていますので、ご存じない方は参考になるかと思います。

https://zenn.dev/buyselltech/articles/9460c75b7cd8d1

自分たちの場合さらにPresentation層から1つ階層を増やしUIコンポーネントを分割して、Presentation層でまとめるという方式をとっています。

```txt
FooComponent
┣ index.tsx           // Container層
┗ components
  ┣ Presentation.tsx  // 個別のUI結合して１つのUIにするコンポーネント
  ┣ GridLayout.tsx    // 個別のUIコンポーネント
  ┣ SearchBox.tsx     // 個別のUIコンポーネント
  ┗ SearchResult.tsx  // 個別のUIコンポーネント
```

この場合、必ず個別のUIコンポーネントから実装するのを優先するようにしています。
