# 社内向け問題作成・回答Webアプリ（フェーズ1）

Next.js + TypeScript + Prisma + SQLite + Tailwind CSS で作成した最小構成です。

## 1. 要件整理（提案）
- 回答者は開始時に「所属部署 / 社員番号 / 名前」を入力し、公開問題へ回答する。
- 作成者は問題の作成・編集・削除・公開管理、回答結果確認、CSV / Excel 出力を行う。
- 権限制御として作成者画面はログイン必須にする（フェーズ1では環境変数ベース）。
- 将来の回答者ログイン移行に備えて、回答者識別は `examinee_profile` を抽象化した実装にする。

## 2. 画面一覧
### 回答者向け
1. `/` 回答開始画面
2. `/questions` 問題一覧
3. `/questions/[id]` 問題回答
4. `/complete` 回答完了
5. `/results` 自分の回答結果

### 作成者向け
1. `/admin/login` 作成者ログイン
2. `/admin/questions` 問題一覧管理
3. `/admin/questions/new` 問題作成
4. `/admin/questions/[id]/edit` 問題編集
5. `/admin/answers` 回答結果一覧
6. `/admin/export` CSV / Excel 出力

## 3. 画面遷移図
### 回答者
`/` → `/questions` → `/questions/[id]` → `/complete` → (`/questions` or `/results`)

### 作成者
`/admin/login` → `/admin/questions` → (`new` or `edit`) → `/admin/answers` / `/admin/export`

## 4. テーブル設計
- `Creator`: 作成者アカウント
- `Question`: 問題
- `Choice`: 選択肢（単一選択）
- `Examinee`: 回答者マスタ
- `Answer`: 回答履歴（問題ごと）

## 5. ディレクトリ構成
- `src/app`: 画面とAPIルート
- `src/components`: UI共通部品
- `src/lib`: 認証、Prisma、CSV/Excel補助
- `src/types`: 型定義
- `prisma`: Prisma schema

## 6. APIルート
- `POST /api/examinee/session`: 回答者情報をセッション保存
- `POST /api/answers`: 回答保存
- `POST /api/admin/login`: 作成者ログイン
- `POST /api/admin/questions`: 問題作成
- `POST /api/admin/questions/[id]`: 問題更新/削除
- `GET /api/admin/export/csv`: CSV出力
- `GET /api/admin/export/excel`: Excel出力

## 7. セットアップ
```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

## 8. 環境変数
- `DATABASE_URL`（SQLite）
- `CREATOR_LOGIN_ID`
- `CREATOR_LOGIN_PASSWORD`

## 9. フェーズ1の制約
- 作成者認証は簡易実装（環境変数照合 + Cookie）。
- バリデーションは最小限（Zod + required中心）。
- 本番向けにはCSRF対策、パスワードハッシュ管理、監査ログ等を追加してください。
