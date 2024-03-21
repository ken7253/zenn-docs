---
title: "「stateはスナップショットである」をバグから理解する"
emoji: "📌"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react"]
published: false
---

::: message
タイトルのキャッチーさのために「バグ」という言葉を利用してしまいましたが
ここで述べられているReactの挙動は正しいものでありタイトルで利用した「バグ」という表現は **「実装者が意図していなかった挙動」** のことを指します。
:::

まずはこのコードをご覧ください。

```tsx:Counter.tsx
import { useState, useEffect, type FC } from "react";

const Counter:FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        setCount(count + 1);
      };
      console.log(count);
    };

    window.addEventListener('keydown', handler);

    return (() => window.removeEventListener('keydown', handler));
  }, []);

  return (
    <div>Counter</div>
  )
};
```

このコードでやってることを簡単にまとめると下記のようになります。

- `count`という`state`を定義
- Enterキーが押下される度に`state`を+1するイベントハンドラーを定義
- `useEffect`によってコンポーネントの初回レンダリング時にイベントハンドラーを設定

また、イベントハンドラー内にある`console.log()`では呼び出される度にログに`count`を出力します。

## state はスナップショットである
