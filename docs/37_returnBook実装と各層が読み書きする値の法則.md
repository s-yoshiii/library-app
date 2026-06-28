# 37. returnBook実装と各層が読み書きする値の法則

## 今回やったこと

書籍の返却（`returnBook`）の実装を、domain → application → adapter（コントローラー）まで進めた。

- `ReturnBookRequestDto` / `ReturnBookResponseDto`（application/dtos）
- `ReturnBookUseCase` / `ReturnBookUseCaseInterface`（application/usecases）
- `LoanRepositoryInterface.update`（domain）と `PrismaLoanRepository.update`（adapter）
- `LoanController.returnBook`（adapter）

`app.ts` への配線（DIで実際に組み立てる部分）はまだ。次回の課題。

今回は「書いて終わり」ではなく、`loanBook`（貸出）の実装と見比べながら作ったことで、**各層が「何を受け取り、何を返すか」に共通のパターンがある**ことが見えてきた、というのが一番の収穫。このパターンを言葉にして残しておく。

---

## 各層が扱う「値の型」の対応表

`returnBook` の一連の流れを上から下まで並べると、こうなる。

```
HTTPリクエスト（req.body）
     ↓ ① コントローラーが req.body から DTO を組み立てる
RequestDto（ReturnBookRequestDto）
     ↓ ② UseCase.execute(requestDto) に渡す
UseCase内部 ── ここだけ「Entity」（Loan, Book）を扱う
     ↓ ③ UseCase が ResponseDto を組み立てて return
ResponseDto（ReturnBookResponseDto）
     ↓ ④ コントローラーが res.json(dto) でそのまま返す
HTTPレスポンス
```

層ごとに扱う「値の種類」が変わるのがポイント。

| 層 | 受け取る値 | 返す値 |
|---|---|---|
| Controller | `Request`（`req.body` は何でも入る `any`） | `Response`（`res.json()`） |
| UseCase（入口） | `RequestDto`（決まった形のプレーンオブジェクト） | `ResponseDto`（決まった形のプレーンオブジェクト） |
| UseCase（内部） | `Entity`（`Loan` / `Book`。メソッドを持つ） | - |
| Repository | `Entity` | `Entity`（DBの行を `new Loan(...)` で包み直す） |

### 法則1: Controller は DTO の「組み立て」と「そのまま転送」しかしない

```typescript
// returnBook（コントローラー）
const requestDto: ReturnBookRequestDto = {
  id: req.body.id,            // ← req.bodyから値を取り出すだけ
};
const loan = await this.returnBookUseCase.execute(requestDto);
res.status(200).json(loan);   // ← UseCaseの戻り値をそのままJSON化するだけ
```

コントローラーは「`req.body` のどのキーがDTOのどのフィールドに対応するか」を決めるだけで、ビジネスルール（貸出中かどうか、上限を超えていないか等）には一切関与しない。`loanBook` も `returnBook` もこの形は完全に同じ。

### 法則2: UseCase の「入口と出口」は必ずDTO、「中身」は必ずEntity

```typescript
async execute(requestDto: ReturnBookRequestDto): Promise<ReturnBookResponseDto> {
  return await this.transactionManager.run(async (ctx) => {
    const loan = await this.loanRepository.findById(requestDto.id, ctx); // Entityを取得
    ...
    loan.return();                                  // Entityのメソッドでルールを実行
    const updatedLoan = await this.loanRepository.update(loan, ctx);     // Entityを保存
    return {                                        // ここで初めてDTOに変換する
      id: updatedLoan.id,
      returnDate: updatedLoan.returnDate,
      createdAt: updatedLoan.createdAt,
      updatedAt: updatedLoan.updatedAt,
    };
  });
}
```

- 引数の型は `RequestDto`（外から来た「お願い」の形）
- 戻り値の型は `ResponseDto`（外に返す「結果」の形）
- でも中で実際に操作しているのは `Loan` / `Book` という **Entity**。`loan.return()` のような「ルールを知っているメソッド」を呼べるのはEntityだけ

DTOは「ただのデータの入れ物」、Entityは「ルールも持っているオブジェクト」という違いがある。UseCaseは入口でDTOを受け取ったら一度Entityに変換（または `findById` でEntityとして取得）し、最後にもう一度DTOに変換して返す、という「DTO→Entity→DTO」のサンドイッチになっている。

### 法則3: Repositoryは常に「Entityを受け取り、Entityを返す」

```typescript
// PrismaLoanRepository.update
async update(loan: Loan, ctx?: TransactionContextInterface): Promise<Loan> {
  const updatedLoan = await prisma.loan.update({ ... }); // ← ここだけPrismaの行データ
  return new Loan(                                        // ← 必ずEntityに包み直して返す
    updatedLoan.id,
    updatedLoan.bookId,
    ...
  );
}
```

PrismaのDB操作結果（`updatedLoan`という生のオブジェクト）は、リポジトリの外には絶対に出さない。必ず `new Loan(...)` で包み直してから返す。これにより、UseCase以降の層は「Prismaがどんな形でデータを返すか」を一切知らなくて済む（Prismaを別のORMに変えても、UseCaseのコードは変えなくていい）。

---

## なぜ `updatedLoan`（リポジトリの戻り値）を使うのか

今回、`returnBookUseCase.ts` で次のようなコードを書いた（最初は `loan` を返していたが `updatedLoan` に直した）。

```typescript
loan.return();                                  // ① メモリ上のEntityを更新
const updatedLoan = await this.loanRepository.update(loan, ctx); // ② DBに保存、DBの最新状態が返る
return {
  id: updatedLoan.id,       // ← ②を使う（①ではない）
  returnDate: updatedLoan.returnDate,
  ...
};
```

`loan`（①）も `updatedLoan`（②）も、見た目上は同じ値が入っていることが多い。でも本来 **DBに保存した後の「確定した値」を返すのが正しい**。例えば `updatedAt` はDB側（Prismaの自動更新）で書き換わることがあるため、メモリ上の `loan.updatedAt` ではなく、保存結果の `updatedLoan.updatedAt` を使う方が「実際にDBに何が保存されたか」と一致する。`loanBookUseCase`（貸出）でも同じパターンで `createLoan`（`create` の戻り値）を使っている。

---

## 次回の課題

- `app.ts` に `ReturnBookUseCase` と `ReturnBookRepository` 周りの依存性注入（DI）を書いて、`/loans` のルーティングに実際に繋ぎ込む
- Insomniaで `PATCH /loans` のような返却用エンドポイントを叩いて、貸出 → 返却 → もう一度貸出可能になることを確認する
