# 35. リポジトリインターフェースへの ctx 引き渡し

## 今回やったこと

- `BookRepositoryInterface` / `LoanRepositoryInterface` の各メソッドに、オプショナルな `ctx?: TransactionContextInterface` 引数を追加
- `PrismaBookRepository.create` を、`ctx` が渡された場合はそれを使い、無ければ通常の `this.prisma` を使うように修正

---

## なぜ ctx をメソッド引数に追加するのか

[34. トランザクション管理の実装と型エラー修正](34_トランザクション管理の実装と型エラー修正.md) の「今後の課題」で書いた、

> リポジトリがトランザクション用クライアント（`ctx`）を受け取れるよう拡張が必要

への対応。

`LoanBookUseCase` のように複数のリポジトリ操作（`bookRepository.update` と `loanRepository.create`）を1つのトランザクションでまとめたい場合、各リポジトリのメソッドが「今だけはこのトランザクション用クライアントを使ってね」と外部から指定できる必要がある。

```typescript
// 今回の修正
async create(book: Book, ctx?: TransactionContextInterface): Promise<Book> {
  const prisma = ctx ? (ctx as PrismaClient) : this.prisma;
  const createdBook = await prisma.book.create({ ... });
  ...
}
```

- `ctx` が渡されたとき → トランザクション内のクライアントでDB操作する（ロールバック対象になる）
- `ctx` が渡されないとき → 通常通り `this.prisma`（コンストラクタで受け取ったクライアント）を使う

---

## オプショナル引数にした理由

`ctx?: TransactionContextInterface` と `?` をつけることで、既存の呼び出し側（`ctx` を渡さないコード）を壊さずに済む。

インターフェース側でオプショナルにしておけば、実装側（`findById` や `update` など）がまだ `ctx` を受け取っていなくても TypeScript の構造的型付け上は問題なくコンパイルが通る。今回は `create` だけ実装を更新し、`findById` / `update` は次回以降に対応する。

---

## `ctx as PrismaClient` というキャスト

`TransactionContextInterface` は domain 層にあるため Prisma を知らない空インターフェース（[34番](34_トランザクション管理の実装と型エラー修正.md)参照）。実際に Prisma の操作で使うには、アダプター層（infrastructure に近い側）で `PrismaClient` 型へキャストし直す必要がある。

```typescript
import type { TransactionContextInterface } from '@/domain/utils/transactionContextInterface.js';

const prisma = ctx ? (ctx as PrismaClient) : this.prisma;
```

domain 層の「何かトランザクションのコンテキスト」という抽象的な約束と、adapter 層の「具体的に Prisma の型として使う」という実装を、このキャストで橋渡ししている。

---

## 今後の課題

- `findById` / `update`（`PrismaBookRepository`）と `PrismaLoanRepository` の各メソッドにも同様に `ctx` を受け取って分岐する実装を追加する
- `LoanBookUseCase` から実際に `TransactionManagerInterface.run()` を呼び、その中で `bookRepository.update(book, ctx)` と `loanRepository.create(loan, ctx)` を実行する形に組み上げる
