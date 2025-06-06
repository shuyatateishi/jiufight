# 🥋 Jiufight - Brazilian Jiu-Jitsu Tournament Platform

> 第2回 Super Yawara Cup 2025 - 技術と感動が融合する新時代の柔術大会

## ✨ 特徴

- 🏆 **リアルタイム大会進行** - 試合状況が即座に全端末に同期
- 👥 **選手プロフィール管理** - 詳細なプロフィール情報の編集・表示
- 📢 **ライブアナウンス** - 管理者からのリアルタイム情報配信
- 🏅 **動的ランキング** - 階級別・帯別の選手ランキング
- 📱 **別端末間同期** - スマホ・PC・タブレット間での即座なデータ同期
- 🎨 **モダンUI** - Glassmorphismを採用した美しいデザイン

## 🚀 技術スタック

### フロントエンド
- **HTML5** - セマンティックマークアップ
- **CSS3** - Glassmorphism、CSS Grid、Flexbox
- **Vanilla JavaScript** - フレームワークレス設計

### バックエンド・データベース
- **Firebase Realtime Database** - リアルタイム同期
- **LocalStorage** - オフライン対応

### デプロイメント
- **Vercel** - 静的サイトホスティング（推奨）
- **GitHub Pages** - 無料デプロイオプション

## 📦 インストール・セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/shuyatateishi/jiufight.git
cd jiufight
```

### 2. Firebase設定

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. Realtime Database を有効化
3. `firebase-config.js` の設定値を更新

詳細手順: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

### 3. ローカル開発環境

```bash
# Python の場合
python -m http.server 8000

# Node.js の場合
npx http-server

# ブラウザで http://localhost:8000 を開く
```

### 4. Vercelデプロイ（推奨）

```bash
npm i -g vercel
vercel
```

詳細手順: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## 🎯 主要機能

### 🎮 管理者機能
- ✅ 試合進行管理
- ✅ アナウンス投稿
- ✅ リアルタイム配信

### 👤 選手管理
- ✅ プロフィール編集
- ✅ 写真アップロード
- ✅ 戦績管理

### 👀 観戦者向け
- ✅ ライブ情報表示
- ✅ 選手情報閲覧
- ✅ ランキング確認

### 🔧 技術的特徴
- ✅ **真の別端末間同期** - Firebase Realtime Database
- ✅ **オフライン対応** - LocalStorage フォールバック
- ✅ **レスポンシブデザイン** - モバイルファースト
- ✅ **SEO最適化** - メタタグ・構造化データ

## 📁 プロジェクト構造

```
jiufight/
├── index.html              # メインページ
├── fighters.html           # 選手一覧
├── rankings.html          # ランキング
├── announcements.html     # アナウンス
├── admin.html            # 管理者ページ
├── tournament.html       # 大会情報
├── styles-v2.css         # メインスタイルシート
├── fighters-v2.css       # 選手ページ専用スタイル
├── script.js             # 共通JavaScript
├── fighters.js           # 選手管理機能
├── announcements.js      # アナウンス機能
├── firebase-config.js    # Firebase設定
├── database-sync.js      # データベース同期システム
├── vercel.json          # Vercel設定
└── images/              # 画像アセット
    └── fighters/        # 選手写真
```

## 🔧 設定ファイル

### Firebase設定 (`firebase-config.js`)

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### Vercel設定 (`vercel.json`)

Vercel最適化設定が自動適用されます。

## 🧪 テスト

### 別端末間同期テスト

1. `cross-device-test.html` を開く
2. 複数端末で同時アクセス
3. データ変更の即座反映を確認

### Firebase接続テスト

1. `firebase-setup.html` を開く
2. 接続状態をリアルタイム確認
3. トラブルシューティング実行

## 📊 データ構造

### Firebase Realtime Database

```javascript
{
  "fighters": [...],           // 選手データ配列
  "announcements": [...],      // アナウンス配列  
  "matches": {                 // 試合情報
    "current": 1
  },
  "metadata": {                // メタデータ
    "fighters": {
      "lastUpdate": timestamp,
      "deviceId": "device_id",
      "count": 49
    }
  }
}
```

## 🔐 セキュリティ

### Firebase セキュリティルール

```json
{
  "rules": {
    "fighters": {
      ".read": true,
      ".write": true,
      ".validate": "newData.hasChildren(['id', 'name'])"
    },
    "announcements": {
      ".read": true,
      ".write": true
    },
    "matches": {
      ".read": true,
      ".write": true
    }
  }
}
```

### Vercel セキュリティヘッダー

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

## 🐛 トラブルシューティング

### よくある問題

1. **Firebase接続エラー**
   - Authorized domains の確認
   - API キーの有効性確認
   - セキュリティルールの確認

2. **同期が遅い**
   - インターネット接続確認
   - Firebase地域設定確認（Asia推奨）

3. **Vercelデプロイエラー**
   ```bash
   vercel --prod --force
   ```

## 📈 パフォーマンス

### 最適化施策

- 🚀 CDNキャッシュ活用
- 🖼️ 画像最適化
- ⚡ JavaScript非同期読み込み
- 🔥 Firebase接続プール活用

### 制限事項

- **Firebase Spark**: 同時接続100台、1GB
- **Vercel Hobby**: 帯域幅100GB/月

## 🌍 本番環境

### アクセス方法

1. **Vercel URL**: `https://jiufight.vercel.app`
2. **カスタムドメイン**: 設定に応じて

### 機能確認

- ✅ 別端末間同期
- ✅ リアルタイム更新
- ✅ レスポンシブデザイン
- ✅ SEO最適化

## 🤝 コントリビューション

1. このリポジトリをFork
2. ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 📞 お問い合わせ

- **Email**: info@jiufight.com
- **Website**: [jiufight.com](https://jiufight.com)
- **GitHub**: [shuyatateishi/jiufight](https://github.com/shuyatateishi/jiufight)

---

**🥋 技術と感動が融合する新時代の柔術大会プラットフォーム**

Firebase Realtime Database により、全端末での即座なデータ同期を実現。Vercel最適化済み。