# Jiufight - Super Yawara Cup 2025

## ウェブサイト公開手順

### 1. GitHub Pages を使った公開（無料・推奨）

#### ステップ 1: GitHubアカウントの作成
1. [GitHub](https://github.com) にアクセス
2. Sign up をクリックしてアカウントを作成

#### ステップ 2: リポジトリの作成
1. GitHubにログイン後、右上の「+」ボタンから「New repository」を選択
2. Repository name: `jiufight` と入力
3. Public を選択
4. 「Create repository」をクリック

#### ステップ 3: ファイルのアップロード
1. 作成したリポジトリページで「uploading an existing file」をクリック
2. jiufightフォルダ内の全ファイルをドラッグ&ドロップ
3. Commit message に「Initial commit」と入力
4. 「Commit changes」をクリック

#### ステップ 4: GitHub Pages の設定
1. リポジトリの「Settings」タブをクリック
2. 左メニューの「Pages」をクリック
3. Source で「Deploy from a branch」を選択
4. Branch で「main」を選択、フォルダは「/ (root)」を選択
5. 「Save」をクリック

#### ステップ 5: 公開確認
- 数分後、`https://[あなたのユーザー名].github.io/jiufight/` でアクセス可能になります

---

### 2. Netlify を使った公開（無料・簡単）

#### ステップ 1: Netlifyアカウントの作成
1. [Netlify](https://www.netlify.com) にアクセス
2. 「Sign up」をクリック（GitHubアカウントでログイン可能）

#### ステップ 2: サイトのデプロイ
1. ログイン後、「Sites」タブを選択
2. jiufightフォルダをドラッグ&ドロップエリアにドロップ
3. 自動的にデプロイが開始されます

#### ステップ 3: カスタムドメイン設定（オプション）
1. Site settings → Domain management
2. カスタムドメインを追加可能

---

### 3. 独自ドメインでの公開

#### 必要なもの
- レンタルサーバー（さくらインターネット、エックスサーバーなど）
- 独自ドメイン（お名前.com、ムームードメインなど）

#### アップロード手順
1. FTPクライアント（FileZilla等）をダウンロード
2. レンタルサーバーのFTP情報を設定
3. public_html フォルダにすべてのファイルをアップロード

---

## ファイル構成

```
jiufight/
├── index.html          # ホームページ
├── tournament.html     # 大会情報
├── fighters.html       # 選手一覧
├── rankings.html       # ランキング
├── announcements.html  # アナウンス
├── admin.html         # 管理画面
├── styles.css         # メインスタイルシート
├── script.js          # 共通JavaScript
├── fighters.js        # 選手データ管理
├── rankings.js        # ランキングデータ
├── announcements.js   # アナウンス機能
└── tournament-fighters.js # 大会選手プロフィール

```

## 注意事項

- すべてのファイルが同じフォルダ内にあることを確認してください
- ブラウザのLocalStorageを使用しているため、データはユーザーのブラウザに保存されます
- 管理画面（admin.html）は本番環境では適切なアクセス制限を設けることを推奨します

## サポート

問題が発生した場合は、以下を確認してください：
- すべてのファイルが正しくアップロードされているか
- ファイル名が正確か（大文字小文字の区別）
- JavaScriptが有効になっているか