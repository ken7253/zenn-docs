---
title: "Nuxt3でOGPを定義する"
emoji: "📌"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["nuxt", "vue"]
published: true
---

# Nuxt3でOGPを設定する方法

以前自分のサイトをVuePressからNuxt3に変更しましたが、Vue3自体の理解の低さなどもあり
OGPの設定を行うのに非常に手間取ってしまったのとNuxt3向けの解説がそこまでなかったので備忘録的にまとめておきます。

## 最終的なコードから解説

細かい説明などは省いて、設定するためのコードの書き方を中心にまとめます。
用語の説明などがない部分もありますが、基本的にNuxt3の初期設定ぐらいは分かってVueもなんとなく触ったことがあるぐらいの人を想定して記載しています。
分かりづらい箇所などありましたらコメントなどでお知らせください。

### サイト共通かつ静的な値は`nuxt.config.ts`に記載

まずは、サイト全体で共通の項目を`nuxt.config.ts`に設定します。
ここで指定した値は`App.vue`や`pages/**/*.vue`・`layout/**/*.vue`で上書きされるようで、フォールバック的に他の項目を設定しておいても問題ありません。
一方で`nuxt.config.ts`には動的な値が設定できないため、あくまでこちらに記載するのはサイト全体で共通の静的な項目のみとなります。

1. `html`タグに`prefix`を追加
2. `og:type`を`website`に指定
3. `og:site_name`にサイト名を指定
4. `og:image`に画像を絶対パスで指定

```ts:nuxt.config.ts
export default defineNuxtConfig({
// ...
app: {
  head: {
    htmlAttrs: {
      lang: 'ja', prefix: 'og: https://ogp.me/ns#'
    },
    meta: [
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: '<サイト名>' },
      { property: 'og:image', content: '<ogpに使われる画像の絶対パス>', },
    ]
  }
}
// ...
});
```

### 動的な値の設定は`App.vue`で指定

`og:url`などのページごとに異なるが動的に指定可能なものに関しては`App.vue`に指定を行います。
layoutが1つしかない場合は`layout/default.vue`に設定しても同じように動作します。

```vue:App.vue
<script lang="ts" setup>
import { computed } from '#imports';
import { useHead, useRouter } from '#app';

const router = useRouter();
const currentPath = computed(
  () => `https://example.com${router.currentRoute.value.path}`
);

useHead({
  meta: [
    { property: 'og:url', content: currentPath }
  ],
});
</script>
```

#### `useHead`

`useHead`は各種コンポーネントから直接`<head>`を設定できる関数で、この場合は`<meta>`の追加・上書きに使用しています。

#### `computed`

絶対パスを取得する`currentPath`の指定方法ですが、`computed`を利用しています。
この値は`useRouter`を利用して現在のパスを取得していますが`computed`を使用しないと再計算が行われないため指定しています。

::: details `import.meta`を使用する場合の注意点

SSRの場合`new URL(import.meta.url)`を利用して`protocol`と`host`を取得できますが、この指定をする場合URLはクライアント側のJSで解決されるためOGPのクローラーが正しく読み取れない場合があります。
そのため各種環境ごとにURLを変更したい場合は`.env`経由で指定するなどビルド時に解決される方法を選択する必要がありそうです。

:::

余談ですが個人的にVue3を使用していて一番混乱したのがこの`computed`の指定方法でした、`react`の`state`や`props`のように再計算を行わないため明示的に更新の指示を行う必要があるようです。

### ページ固有のものは`pages/**/*.vue`で指定

最後にページ固有かつ静的な項目はぞれぞれページごとに`useHead`を使用して指定を行います。
`og:description`については指定必須ではありませんが設定する場合は`pages`で指定するのが適切だと思います。

```vue:pages/**/*.vue
<script lang="ts" setup>
import { useHead } from "#app";

useHead({
  title: '<ページタイトル>',
  meta: [
    { property: 'og:title', content: '<ページタイトルを記載>' },
    { property: 'og:description', content: '<descriptionを記載>' }
  ]
});
</script>
```

#### 動的ルーティングを使用している場合

`nuxt/content`などを使用している場合は動的ルーティングを行っている場合があると思いますが`pages`においても`App.vue`のように動的な指定が可能です。

下記は`nuxt/content`を使用している場合です。

```vue:[...slug].vue
<script lang="ts" setup>
import { useHead, useRoute } from '#app';
import { queryContent } from '#imports';

const route = useRoute();
const content = await queryContent(route.fullPath).findOne();

useHead({
  meta: [
    { property: 'og:title', content: content.title },
    { property: 'og:type', content: 'article' },
  ],
});
</script>
```

1. `useRoute`で現在のパスを取得
2. 現在のパスから`queryContent`でmarkdownのコンテンツを取得
3. `content.title`でタイトルを取得

また、記事コンテンツの場合は`og:type`も`article`に指定します。

## まとめ

自分の環境では上記の設定でTwitterでのOGP表示が行えるようになりました。

https://dairoku-studio.com

https://github.com/ken7253/d6
