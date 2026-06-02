# 11. クリーンアーキテクチャと DTO（データ転送オブジェクト）

## 今日やったこと

概念のレクチャー回＋エンティティ層の実装。クリーンアーキテクチャの 4 層構造と、層をまたぐデータをどう扱うか（DTO）を学んだ。

---

## クリーンアーキテクチャとは

「変わりやすいもの（フレームワーク・DB）と、変わりにくいもの（ビジネスルール）を分離する」設計思想。
**依存の方向を常に内側へ向ける**ことで、外側（Express や Prisma）を別のものに替えても内側が壊れないようにする。

### 同心円のイメージ

```
┌─────────────────────────────────────────┐
│  フレームワーク & ドライバー層           │ ← いちばん外側（Express, Prisma, DB）
│  ┌─────────────────────────────────┐    │
│  │  インターフェースアダプター層    │    │ ← Controller, Repository 実装
│  │  ┌─────────────────────────┐   │    │
│  │  │  ユースケース層          │   │    │ ← アプリケーションの「手順書」
│  │  │  ┌─────────────────┐   │   │    │
│  │  │  │  エンティティ層  │   │   │    │ ← いちばん内側（ビジネスの核心）
│  │  │  └─────────────────┘   │   │    │
│  │  └─────────────────────────┘   │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

依存の矢印：外側 → 内側（内側は外側を知らない）
```

---

## 4 つの層：役割と実際のファイル

### 1. エンティティ層（Entity layer）― いちばん内側

**役割**：アプリケーションの**ビジネスルール**そのものを表す。フレームワークや DB とは無関係。

**何を置くか**：エンティティクラス（ドメインオブジェクト）

**このプロジェクトの実装**：`src/domain/entities/book.ts`

```typescript
export class Book {
  constructor(
    private _id: string,
    private _title: string,
    private _isAvailable: boolean = true,
    // ...
  ) {}

  // ビジネスルールをメソッドとして持つ
  loan() {
    if (!this._isAvailable) {
      throw new Error('書籍はすでに貸出中です。');
    }
    this._isAvailable = false;
  }

  return() {
    if (this._isAvailable) {
      throw new Error('この本はすでに返却されています。');
    }
    this._isAvailable = true;
  }
}
```

**ポイント**：`loan()` や `return()` というメソッドが「貸出・返却のルール」を表している。
Express も Prisma も import していない。完全に独立している。

---

### 2. ユースケース層（Use case layer）

**役割**：「ユーザーが何をしたいか」という**アプリケーション固有の手順**を定義する。
エンティティを使って「本を登録する」「本を検索する」といった操作の流れを記述する。

**何を置くか**：Service クラス・Service インターフェース

**このプロジェクトの実装**：`src/businessLogic/BookService.ts`

```typescript
export class BookService implements BookServiceInterface {
  // リポジトリをインターフェース越しに受け取る（Prisma を直接知らない）
  constructor(private readonly bookRepository: BookRepositoryInterface) {}

  async add(title: string): Promise<Book> {
    return await this.bookRepository.create(title);  // 「本を登録する」という手順
  }

  async findById(id: string): Promise<Book | null> {
    return await this.bookRepository.findById(id);   // 「本を検索する」という手順
  }
}
```

**ポイント**：`BookRepositoryInterface`（インターフェース）だけを知っていて、Prisma の実装は知らない。
「DB が Prisma でも SQLite でも、このクラスは変わらない」という状態が理想。

---

### 3. インターフェースアダプター層（Interface adapter layer）

**役割**：内側の世界（エンティティ・ユースケース）と外側の世界（HTTP・DB）を**変換・橋渡し**する層。

**何を置くか**：Controller（HTTP ↔ ユースケース の変換）、Repository 実装（DB ↔ エンティティ の変換）

**このプロジェクトの実装**：
- `src/presentation/bookController.ts` ← HTTP の世界からユースケースを呼び出す
- `src/dataAccess/PrismaBookRepository.ts` ← Prisma でリポジトリインターフェースを実装する

```typescript
// bookController.ts：HTTP リクエストをユースケースへ変換する
export class BookController {
  constructor(private readonly bookService: BookServiceInterface) {}

  async add(req: Request, res: Response): Promise<void> {
    const title = req.body.title as string;   // HTTP の世界（req.body）から値を取り出し
    const book = await this.bookService.add(title); // ユースケースを呼び出す
    res.status(201).json(book);              // 結果を HTTP の世界（JSON）へ変換して返す
  }
}
```

```typescript
// PrismaBookRepository.ts：Prisma（外側）でリポジトリインターフェース（内側）を実装する
export class PrismaBookRepository implements BookRepositoryInterface {
  async create(title: string): Promise<Book> {
    return await this.prisma.book.create({ data: { title, isAvailable: true } });
  }
}
```

**ポイント**：`PrismaBookRepository` は `BookRepositoryInterface` を満たすように作られている。
内側（ユースケース層）は「このインターフェースを実装したものが来る」としか知らない。

---

### 4. フレームワーク & ドライバー層（Framework & Driver layer）― いちばん外側

**役割**：Express・Prisma・DB など、**具体的なツールそのもの**。基本的に自分でコードを書かず、ライブラリに任せる。

**何を置くか**：フレームワークの設定（`app.ts`）、生成されたコード（`src/generated/prisma/`）

---

## このプロジェクトの現在地

```
src/
├── domain/               ← エンティティ層（いちばん内側）
│   ├── entities/
│   │   └── book.ts          ← Book クラス（loan/return などビジネスルール）
│   └── repositories/
│       └── BookRepositoryInterface.ts  ← リポジトリの「約束」を定義
│
├── businessLogic/        ← ユースケース層
│   ├── BookService.ts       ← 「本を登録する」「本を検索する」手順
│   └── BookServiceInterface.ts
│
├── presentation/         ← インターフェースアダプター層（HTTP 側）
│   └── bookController.ts    ← HTTP ↔ ユースケース の変換
│
├── dataAccess/           ← インターフェースアダプター層（DB 側）
│   └── PrismaBookRepository.ts  ← Prisma でリポジトリを実装
│
└── generated/prisma/     ← フレームワーク & ドライバー層（自動生成）
```

---

## DTO（データ転送オブジェクト）

### なぜ必要か

層をまたいでデータを受け渡すとき、内側が外側の型に直接依存してしまうと困る。

```typescript
// NG の例：ユースケース層が Prisma の型を直接使っている
import type { Book } from "@prisma/client"; // ← 外側（Prisma）への依存！
// Prisma をやめたら、ここも全部書き換えが必要になる
```

### DTO を使った解決策

「層の境界でデータを詰め替える専用の型」を用意して、依存を断ち切る。

```
HTTP リクエスト
    ↓
[Presentation 層] → req.body を RequestDTO に詰め替え
    ↓
[Application 層]  → RequestDTO を受け取って処理 → ResponseDTO に詰め替え
    ↓
[Presentation 層] → ResponseDTO を JSON にして返す
```

### リクエスト DTO（Request DTO）

```typescript
// CreateBookRequestDTO.ts（Application 層に置く）
export type CreateBookRequestDTO = {
  title: string;
};
```

### レスポンス DTO（Response DTO）

```typescript
// CreateBookResponseDTO.ts（Application 層に置く）
export type CreateBookResponseDTO = {
  id: string;
  title: string;
  isAvailable: boolean;
  createdAt: string; // Date 型ではなく string に変換済み（API で扱いやすい形に）
};
```

### 「誰が型を定義するか」が重要

**内側の層が型を定義し、外側の層がそれに合わせる。**

| 境界 | 型を定義する側 | 型を使う側 |
|------|---------------|-----------|
| HTTP ↔ ユースケース | Application 層（DTO） | Presentation 層 |
| ユースケース ↔ DB | Domain 層（Interface） | Infrastructure 層 |

---

## 「依存の方向を統一する」の意味まとめ

依存とは「そのコードを変えたとき、影響を受けるか」のこと。

```
エンティティ層          ← 誰にも依存しない（いちばん安定）
    ↑ 依存
ユースケース層          ← エンティティにだけ依存
    ↑ 依存
インターフェースアダプター層  ← ユースケース・エンティティに依存
    ↑ 依存
フレームワーク & ドライバー層  ← すべてに依存できる（いちばん不安定でよい）
```

この向きが逆になると（例：エンティティが Prisma を import する）、「Prisma を変えたらビジネスルールも壊れる」という脆い構造になってしまう。

---

## 実装時に起きた型エラーと修正

エンティティ層を追加したあと、型チェックで以下のエラーが発生した。

**原因**：`BookRepositoryInterface` がドメインエンティティの `Book` クラスを返すよう定義されているのに、`PrismaBookRepository` は Prisma のプレーンオブジェクト（`{ id, title, ... }`）を返していた。クラスとプレーンオブジェクトは TypeScript の型として互換しない（クラスにはプライベートフィールドや `loan()` メソッドがある）。

**修正**：`PrismaBookRepository` の各メソッドで Prisma の結果を `new Book(...)` に変換するようにした。

```typescript
// 修正後の PrismaBookRepository
async create(title: string): Promise<Book> {
  const row = await this.prisma.book.create({ data: { title, isAvailable: true } });
  return new Book(row.id, row.title, row.isAvailable, row.createdAt, row.upDatedAt);
  //             ↑ Prisma の行データをドメインエンティティに変換
}
```

あわせて `BookService`・`BookServiceInterface`・テストの `Book` 型インポートを Prisma 型からドメインエンティティに変更した。

**追加のハマりポイント**：テストで `import { Book } from '@/domain/entities/book.js'` と書いたら Jest がモジュールを見つけられなかった。Jest の `moduleNameMapper` は `@/` パスの `.js` 拡張子を剥がさないため。`../domain/entities/book.js` の相対パスに変えて解決（相対パスは別のマッパールールで `.js` が剥がされる）。

---

## わかっていないこと・復習ポイント

- [ ] DTO はどの層に置くべきか（Application 層？境界ごとに持つ？）
- [ ] バリデーション（不正な入力値チェック）は RequestDTO に含めるのか、別レイヤーで行うのか
- [ ] `res.json(book)` でドメインエンティティを返すと `_id`・`_title` など内部フィールド名がそのまま出てしまう → ResponseDTO で整形が必要
