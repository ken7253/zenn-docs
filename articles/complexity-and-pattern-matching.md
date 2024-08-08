---
title: "パターンマッチングを利用して条件式を読みやすくする"
emoji: "🐡"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ['typescript']
published: false
---

## 複雑な条件式をまとめる例

```tsx
const isEnterprise = true;
const isAdmin = true;

if (isAdmin) {
  return <AdminForm />
} else if (isEnterprise) {
  return <EnterpriseForm />
} else {
  return <NormalForm />
};
```

```tsx
import { match, P } from "ts-pattern";

const isEnterprise = true;
const isAdmin = true;

match({ isEnterprise, isAdmin })
  .with({ isEnterprise: P.any, isAdmin: true }, () => <AdminForm />)
  .with({ isEnterprise: true, isAdmin: P.any }, () => <EnterpriseForm />)
  .with({ isEnterprise: false, isAdmin: false }, () => <NormalForm />)
  .exhaustive();
```

## 参考リンク

https://github.com/tc39/proposal-pattern-matching

https://github.com/gvergnaud/ts-pattern
