---
title: "Nuxt3でOGPを定義する"
emoji: "🦁"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["nuxt", "vue"]
published: false
---

Nuxt3でOGPを設定する場合に色々とはまったので対処法などをまとめておきます。

## OGPで最低限定義しなければならない値を整理する

OGPの設定項目についてはいくらでも記事が公開されていると思いますので省略させていただきますが、基本的には下記のような分類になると思います。

| プロパティ名   | 概要             | ページごとに固有か |
| -------------- | ---------------- | ------------------ |
| `og:title`     | ページのタイトル | 固有               |
| `og:site_name` | サイト名         | 共通               |

公式ドキュメントでは下記のように記述することで、OGPなどのmetaタグを設定できると記載されています。

```ts:App.vue
import { useHead, useRoute } from '#imports'

const route = useRoute();

useHead({
  meta: [
    { property: "og:title", content: route.meta.title  }
  ]
});
```

### コンポーネントからheadへのアクセスは`useHead`を利用する

`useHead()`は各種コンポーネントから直接headの内容を変更できます。
設定項目としては`nuxt.config.ts`の`app.head`の項目と同じ値が設定可能です。

### 再計算して欲しい値は`computed`を利用する

metaタグ自体は設定できましたが、ページ遷移時に内容が更新されない場合があります。
再計算して欲しい値は`computed()`を利用して定義します。

### import.metaは使わない

localhost Netlifyのステージング production環境それぞれでURLが動的に変わってほしかったので`import.meta`を利用して下記のようにURLを定義していました。

```ts
import { useRouter } from '#imports';

const router = useRouter();
const { protocol, host } = new URL(import.meta.url);
const currentAbsolutePath = computed(() => `${protocol}//${host}/${router.currentRoute.value.path}`);
```

しかし、どうやら`useHead`の処理などはビルド時に解決されないようで、クライアント側で解決されるようです。
ogpのクローラーではJavaScriptが実行できないため、ここでも引っかかりました。

最終的に動的に`og:url`を設定する記述は下記のように。

```ts:App.vue
import { useHead, useRouter, computed } from '#imports';

const router = useRouter();
const currentAbsolutePath = computed(() => `https://example.com/${router.currentRoute.value.path}`);

useHead({
  meta: [
    { property: "og:url", content: currentAbsolutePath }
  ]
});
```

`og:title`については諦めて`pages`にて個別に指定しました。  
