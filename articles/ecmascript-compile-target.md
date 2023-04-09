---
title: "IE対応が終わった今ES5へのコンパイルは必要なのか"
emoji: "🔖"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript", "ecmascript"]
published: false
---

::: message
この記事で使用されている [caniuse.com](https://caniuse.com/) のデータは記事公開時点でのデータとなります。
:::

## ブラウザとECMAScriptのバージョン比較

ブラウザの対応状況とECMAScriptのバージョン比較として一番手軽なものはCaniuseでの調査だと思います。
下記のようにバージョン名を検索にかけるとES5やES6ではバージョン全体の対応表が表示されます。
ES2017(ES8)以降についてはバージョン全体の対応表は表示されませんが、下記画像のように「Specification」や「Feature support list」などが含まれた検索結果が表示されます。

[![caniuse.comでES2020と検索している画面のスクリーンショット](/images/articles/ecmascript-compile-target/caniuse.com-search-example.png)](https://caniuse.com/?search=ES2020)

その中で、「Feature support list」に移動すると少し画面が異なりますが下記のように対応状況をまとめた表が閲覧できます。

ES2016(ES7)については「Feature support list」が表示されませんが同バージョンで追加された項目が２つのみのためこの記事では個別に確認をしています。
この検索結果を参考にブラウザのバージョンとECMAScriptのバージョンを比較していきます。

## ES5

まずはES5です。

[![caniuse.comのES5対応ブラウザ一覧画面のスクリーンショット](/images/articles/ecmascript-compile-target/caniuse.com-es5.png)](https://caniuse.com/es5)

流石にES5までダウンレベリングを行えば動かないブラウザは存在しないと考えて良さそうです。
究極の安牌ではありますがそもそもIE11がサポート終了した今、わざわざES5までダウンレベリングを行う必要性はあるのでしょうか？次の章から世代を上げながら確認していきたいと思います。

## ES6

では次にES6です。
`tsc --init`で作成される`tsconfig.json`のデフォルト値が`ES6`になったり、各種ライブラリでの`ES5`対応終了の波を感じる機会がありますが、その影響はどのぐらいになるのでしょうか。

[![caniuse.comのES6対応ブラウザ一覧画面のスクリーンショット](/images/articles/ecmascript-compile-target/caniuse.com-es6.png)](https://caniuse.com/es6)

> Notable partial support in IE11 includes (at least some) support for const, let, block-level function declaration, typed arrays, Map, Set and WeakMap.

上記の注釈にもある通りIE11でも`let`/`const`/`Map`/`Set`/`WeakMap`以外はサポートされていたんですね。
殆どのブラウザでES6はサポートされておりブラウザの使用率を見てもフルサポートで **96.09%** と多くのユーザーが問題なく使用できるようです。

データ上から見ても分かるようにIE11サポート終了によってES5へのコンパイルが不要であるということは明らかです。

## ES2016(ES7)

次にES2016ですが、こちらは一覧が無いため個別で確認します。

[![caniuse.comのES2016(Array.includes)対応ブラウザ一覧画面のスクリーンショット](/images/articles/ecmascript-compile-target/caniuse.com-es2016-array-includes.png)](https://caniuse.com/array-includes)

[![caniuse.comのES2016(べき乗演算子)対応ブラウザ一覧画面のスクリーンショット](/images/articles/ecmascript-compile-target/caniuse.com-es2016-javascript_operators_exponentiation.png)](https://caniuse.com/mdn-javascript_operators_exponentiation)

内容としては`Array.prototype.includes`とべき乗演算子(`**`)の２点ですがこちらもES6同様にほぼ全てのブラウザが対応しています。
ユーザー割合ベースで見てもES6同等かそれ以上の人が利用できる状態にあります。
上記のデータからES6とES2016では有意な差は存在しないと考えて良さそうです。

## ES2017

更にES2017も見ていきます。

[![caniuse.comでES2017の機能に対応したブラウザ一覧画面のスクリーンショット](/images/articles/ecmascript-compile-target/caniuse.com-es2017-summary.png)](https://caniuse.com/async-functions,object-values,object-entries,mdn-javascript_builtins_object_getownpropertydescriptors,pad-start-end,mdn-javascript_grammar_trailing_commas_trailing_commas_in_functions)

こちらについてもES2016同様殆どのブラウザで対応がされています。
差分としては`Async Functions`がSafari 11からの対応となっているためSafari 10に対応しなければいけないプロダクトの場合は`ES2016`までダウンレベリングする必要がありそうです。

## ES2018

次にES2018ですが一覧が正しく読み込まれなかったためスキップ

## ES2019

次にES2019を確認します。

[![caniuse.comでES2019の機能に対応したブラウザ一覧画面のスクリーンショット](/images/articles/ecmascript-compile-target/caniuse.com-es2019-summary.png)](https://caniuse.com/?feats=array-flat,mdn-javascript_builtins_object_fromentries,mdn-javascript_builtins_string_trimstart,mdn-javascript_builtins_symbol_description,mdn-javascript_statements_try_catch_optional_catch_binding,mdn-javascript_builtins_json_stringify_well_formed_stringify,mdn-javascript_builtins_array_sort_stable,mdn-javascript_builtins_function_tostring_tostring_revision)

まず、Safariの最新版(16.5)でも未対応のメソッドがありますが、こちらは[`Function.prototype.toString`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function/toString)です。

## さいごに
