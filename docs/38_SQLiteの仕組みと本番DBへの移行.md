# 38. SQLiteの仕組みと本番DBへの移行

## 今回の質問

- `.db`ファイルは何のためにあるのか
- SQLiteでない場合（サーバー型のDB）はどう動くのか
- 開発（SQLite）から本番に移行するとき、何がどう変わるのか

---

## `.db`ファイルとは

このプロジェクトの[.env](../.env)にある

```
DATABASE_URL="file:./prisma/dev.db"
```

の `prisma/dev.db` が、**SQLiteのデータベース本体そのもの**。Prismaは「サーバーに接続する」のではなく、**このファイル自体を直接読み書きしてデータを保存している**。

実際に[doc36](36_トランザクションが効いていなかった不整合バグの調査と修正.md)の調査で

```bash
sqlite3 prisma/dev.db "select * from Book where id='...';"
```

のようにファイルへ直接クエリを投げて中身を確認できたのも、「ファイル自体がDB」だから。

---

## SQLite（ファイル型） vs サーバー型DB（PostgreSQLなど）

| | SQLite | PostgreSQL等 |
|---|---|---|
| DBの実体 | 1つのファイル（バイナリ形式でテーブル・行データが詰まっている） | 別プロセスとして動いているDBサーバー |
| アプリからのアクセス方法 | ファイルを直接開いて読み書き | ネットワーク経由でSQLをリクエストし、結果を受け取る |
| イメージ | アプリ自身がファイルの中身を操作する | アプリ → （ネットワーク）→ DBサーバー → ディスク |

サーバー型は「複数人が同時に書き込む」「ネットワーク越しにアクセスする」といった要件に対応しやすいが、ローカル開発では別途サーバーを立てる手間が増える。SQLiteは1ファイルだけで完結するので学習・開発段階では扱いやすい、という位置づけ。

`prisma/schema.prisma` が「テーブルの設計図」、`.db`ファイルは「その設計図に従って実際にデータが入っている箱」という関係。

---

## 開発 → 本番でPostgreSQLに切り替える場合の変更点

[schema.prisma](../prisma/schema.prisma)には実はすでにヒントのコメントがある。

```prisma
// Get a free hosted Postgres database in seconds: `npx create-db`

datasource db {
  provider = "sqlite"
}
```

変更が必要なのは主に以下の4箇所。

### 1. `provider`

```prisma
datasource db {
  provider = "postgresql"  // sqlite → postgresql
}
```

### 2. `DATABASE_URL`

```
# 開発（ファイルパス）
DATABASE_URL="file:./prisma/dev.db"

# 本番（サーバーのアドレス + 認証情報）
DATABASE_URL="postgresql://user:password@db.example.com:5432/library_app"
```

`file:...` から `postgresql://...` への変化が、「ファイルを直接開く」から「サーバーに接続する」への切り替えそのもの。

### 3. アダプター

[app.ts](../src/infrastructure/web/app.ts)で使っている

```typescript
import { PrismaLibSql } from '@prisma/adapter-libsql';
const adapter = new PrismaLibSql({ url: process.env['DATABASE_URL'] ?? 'file:./prisma/dev.db' });
```

`PrismaLibSql` はSQLite/libSQL専用のアダプターなので、PostgreSQLに変えるなら `@prisma/adapter-pg` のようなPostgreSQL用アダプターに差し替える必要がある。

### 4. マイグレーションの実行

`schema.prisma` の設計図を本番のPostgreSQLサーバーに反映するには `npx prisma migrate deploy` のようなコマンドを実行する（まだこのプロジェクトでは触れていない部分）。

---

## まとめの対応表

| | 開発（今） | 本番 |
|---|---|---|
| DBの実体 | ローカルの`.db`ファイル | クラウド上のPostgreSQLサーバー |
| `provider` | `sqlite` | `postgresql` |
| `DATABASE_URL` | `file:./prisma/dev.db` | `postgresql://...`（サーバーのURL） |
| アダプター | `@prisma/adapter-libsql` | `@prisma/adapter-pg`等 |

---

## ポイント: UseCase/Controller/Entityは変更不要

DBの種類を切り替えても、`LoanBookUseCase` や `LoanController`、`Loan`/`Book` エンティティのコードは一切変更しなくていい。これは[doc37](37_returnBook実装と各層が読み書きする値の法則.md)で書いた「リポジトリがPrismaの生データを外に漏らさない（必ずEntityに包み直して返す）」という設計のおかげ。DBの種類が変わってもビジネスロジック側はそれを知らずに済む、というのがレイヤードアーキテクチャ/クリーンアーキテクチャの利点の一つ。
