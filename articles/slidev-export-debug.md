---
title: "slidevでexport時にレイアウトが崩れる場合のデバック方法"
emoji: "🐛"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["slidev"]
published: false
---

::: message
この記事に記載されているデバック方法は非公式な情報であり、今後のアップデートで確認ができなくなる可能性があります。
:::

普段LTなどのスライドはslidevを利用して作成していますが、レイアウト用のCSSファイルを編集した場合に何度かexport時（`npx slidev export`）にレイアウトが崩れてしまう現象に何度か遭遇しました。

https://ja.sli.dev/

## exportされるデータをブラウザから確認する方法

先に結論を記載しておくと、ローカルホストを起動後（`npx slidev`）に下記のアドレスにアクセスすると実際にexportされるスライドが確認できます。

```txt
http://localhost:3030/print?print
```
