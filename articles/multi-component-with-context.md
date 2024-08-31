---
title: "組み合わせて使う前提のコンポーネントを設計する場合Contextを使うとよい"
emoji: "📝"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react"]
published: false
---

複数のコンポーネントを組み合わせる前提で設計を行うという需要は多くはないですが、必要な場面があります。
HTMLの要素の中でもテーブルやリストなどは複数の要素を組み合わせて利用する前提で設計されています。

これらの要素をラップするようにコンポーネントを作る場合や、複雑な機能の実現などで複数のコンポーネントを設計する場合にReactのContextを利用することでシンプルかつ高機能なコンポーネントの設計ができる場合があります。

## 注意点

ContextについてはReact 19より下記の変更がありました。

- `Context.Provider`は`Context`そのものをProviderとして利用できるようになった
- `useContext(Context)`が`use(Context)`で利用できるようになった

しかしこの記事ではReact 18時点での書き方でコードを記載させていただきます。

https://zenn.dev/uhyo/books/react-19-new/viewer/context

## Contextとはなにか

まず、本題に入る前にContextの捉え方について簡単に振り返ります。
利用方法やAPIについては公式ドキュメントが非常にわかりやすく解説してくれているのでこちらをご覧ください。

https://ja.react.dev/learn/passing-data-deeply-with-context

Reactでのデータの受け渡しはPropsによって直接コンポーネントからコンポーネントに受け渡しを行うのが基本となります。

一方でContextによるデータの受け渡しではPropsで子に渡すのではなく、離れたコンポーネントに直接データを渡すことが可能になります。

また、離れたコンポーネント同士で値を受け渡すというと[jotai](https://jotai.org/)や[Redux](https://redux.js.org/)のようなstoreを想像される方もいらっしゃるかと思いますがContextはその名の通りコンポーネントの階層構造という文脈に依存したデータの受け渡しを行います。

## 組み合わせて利用するコンポーネント

では本題に入り、実際にコンポーネントの設計や求められる仕様を例に説明を進めていきます。

### なぜContextを利用するのか

組み合わせて利用するコンポーネントではPropsによる値の受け渡しは行なえません。
例として、リストを表現するコンポーネントを考えてみます。

利用する側としては、HTMLのリストと同じように使えたほうがわかりやすいので下記のように利用する想定で組んでいきます。

```tsx:App.tsx
import { MyListItem, MyListGroup } from "./MyList";

export const App = () => {
  return (
    <MyListGroup>
      <MyListItem>item 1</MyListItem>
      <MyListItem>item 2</MyListItem>
      <MyListItem>item 3</MyListItem>
    </MyListGroup>
  );
};
```

`MyListGroup`を`ul`のように`MyListItem`を`li`のように扱いたい。

```tsx:MyList.tsx
import { type PropsWithChildren, type FC } from "react";

export const MyListItem: FC<PropsWithChildren<{}>> = ({ children }) => {
  return <li>{children}</li>;
};

export const MyListGroup: FC<PropsWithChildren<{}>> = ({ children }) => {
  return <ul>{children}</ul>;
};

```

組み合わせて利用するという前提があるため普通のコンポーネントのようにコンポーネントAの中でコンポーネントBを使うということができず、`MyListItem`と`MyListGroup`はお互いにコンポーネントとして依存していないためPropsでの値の受け渡しは行なえません。

ではこの`MyListGroup`をHTMLの`<ul>`と同じようにネスト可能にして、そのネストされた回数をコンポーネント内部で参照したい場合どのように設計するとよいでしょうか。

### コンポーネントがネストされた回数をカウントする

説明のため、先程のリストの例とは別のネストされた回数をカウントするだけのコンポーネントを作ってみます。

```ts:context.ts
import { createContext } from "react";

export const NestCountContext = createContext(0);
```

まずは初期値を`0`としてContextを作成して、コンポーネントで利用します。

```tsx:NestingSection.tsx
import { type FC, PropsWithChildren, useContext } from "react";
import { NestCountContext } from "./context";

export const NestingSection: FC<PropsWithChildren<{}>> = ({ children }) => {
  const nestCount = useContext(NestCountContext);
  console.log(nestCount); // ネストされた回数が表示される。

  return (
    <NestCountContext.Provider value={nestCount + 1}>
      {children}
    </NestCountContext.Provider>
  );
};

```

このようにコンポーネントを作成することで、そのコンポーネントが何回ネストされたのかを`useContext`の返り値（今回は`nestCount`という変数）によって取得することができます。
そして、次の`Provider`に`+ 1`した値を渡して配下のコンポーネントがまた`useContext`を使って値を取得した場合はインクリメントされた値が渡されるようにしています。

コンテキストの値は構造によって変わるため、別のツリーに位置するコンポーネントでは別の値を参照することが可能です。

```tsx
import { NestingSection } from "./NestingSection";

export const App = () => {
  return (
    <NestingSection>          {/* => 0 */}
      <NestingSection>        {/* => 1 */}
        <NestingSection>      {/* => 2 */}
          <NestingSection />  {/* => 3 */}
        </NestingSection>
      </NestingSection>
      <NestingSection>        {/* => 1 */}
        <NestingSection />    {/* => 2 */}
      </NestingSection> 
    </NestingSection>
  )
}
```

:::details リストコンポーネントへの適用例

基本的には先程の例と同じく、Contextを作成してコンポーネントで読み込みます。

```ts:context.ts
import { createContext } from "react";

export const NestCountContext = createContext(0);
```

```tsx:MyList.tsx
import { type PropsWithChildren, type FC, useContext } from "react";
import { NestCountContext } from "./context";

export const MyListItem: FC<PropsWithChildren<{}>> = ({ children }) => {
  return <li>{children}</li>;
};

export const MyListGroup: FC<PropsWithChildren<{}>> = ({ children }) => {
  const nestCount = useContext(NestCountContext);

  return (
    <NestCountContext.Provider value={nestCount + 1}>
      <ul>{children}</ul>
    </NestCountContext.Provider>
  );
};

```

:::

### 親コンポーネントの参照を別のコンポーネントに渡す

また、`ref`と組み合わせて下の階層のコンポーネントに参照を渡す方法もスクロールの制御などを行う場合などで有効です。

少しコードが長くなってしまいますが、スクロールエリアを作成するコンポーネントとスクロールエリアを元に戻すコンポーネントを作成してみます。

```ts:context.ts
import { createContext, RefObject } from "react";

export const ParentRefContext = createContext<RefObject<HTMLElement>>(null);
```

```tsx:Scroll.tsx
import { useRef, useContext, type PropsWithChildren, type FC } from "react";
import { ParentRefContext } from "./context";

const ScrollContainer: FC<PropsWithChildren<{}>> = ({ children }) => {
  const ref = useRef<HTMLElement>(null);

  return (
    <ParentRefContext.Provider value={ref}>
      <div
        ref={ref}
        style={{ height: 300, overflow: "scroll" }}
      >
        {children}
      </div>
    </ParentRefContext.Provider>
  );
};

const BackToTop: FC<PropsWithChildren<{}>> = ({ children }) => {
  // 直前にネストされた親コンポーネントの参照が受け取れる。
  const parentRef = useContext(ParentRefContext);

  const handleClick = () => {
    if (parentRef?.current != null) {
      parentRef.current.scrollTo({ top: 0, left: 0 });
    }
  };

  return (
    <button onClick={handleClick} type="button">
      最初に戻る
    </button>
  )
};
```

このように親となるコンポーネント側でProviderに自身の参照を渡すことによって、そのコンポーネントの配下に所属するコンポーネントが親のDOMへの参照を受け取ることができます。

## まとめ

Contextを適切に利用することで実現したい動作を簡潔なコードで実現できることを感じていただけたかと思います。

一方でContextを利用したコンポーネントは利用側からは暗黙的な挙動をするとも捉えられます。

そのためContextを利用して受け渡した値を使って複雑なロジックを実装することは避け、あくまでコンポーネントの利用者側が予測しやすい挙動の範囲内でContextを利用するべきだとも考えています。
