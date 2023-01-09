---
title: "Nuxt3でOGPを定義する"
emoji: "🦁"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["nuxt", "vue"]
published: false
---

Nuxt3でOGPを設定する場合に色々とはまったので対処法などをまとめておきます。
Vueは2.x時代に軽く触ったことがあるぐらいで、最近はあまり触っていなかったので勉強も兼ねて使い始めました。
NuxtというよりかはそもそもVue自体の使い方の話も入ってきますが、一通りの手順をまとめておきます。

## 最終的なコードから解説

### サイト共通かつ静的な値は`nuxt.config.ts`に記載

サイト全体で共通の項目を`nuxt.config.ts`に設定します。
ここで指定した値は`App.vue`や`pages/**/*.vue`・`layout/**/*.vue`で上書きされるようで、フォールバック的に他の項目を設定しておいても問題ありません。
一方で`nuxt.config.ts`には動的な値が設定できないためあくまでこちらに記載するのはサイト全体で共通の静的な項目のみとなります。

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

SSRの場合`new URL(import.meta.url)`を利用して`protocol`と`host`を取得できますが、この指定をする場合URLはクライアント側のJSで解決されるためOGPのクローラーが正しく読み取れない場合があります。
そのため各種環境ごとにURLを変更したい場合は`.env`経由で指定するなどビルド時に解決される方法を選択する必要がありそうです。

### ページ固有のものは`pages/**/*.vue`で指定

最後にページ固有かつ静的な項目はぞれぞれページごとに`useHead`を使用して指定を行います。

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
