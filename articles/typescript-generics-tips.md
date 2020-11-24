---
title: "Typescriptのジェネリクスとはなにか"
emoji: ""
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript","typesctipt"]
published: false
---
# Typescriptのジェネリクスとはなにか
typescriptのジェネリクス(generics)は型引数のことで、関数の引数に加えて型の情報を渡すことができるようになります。  
```typescript
function generics<T> (arg:T) :T {
  return arg;
}
// 呼び出し側
console.log(generics<string>("hello"));
```