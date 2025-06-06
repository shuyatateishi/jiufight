# 🚀 Vercel デプロイメントガイド

## Firebase + Vercel での Jiufight 運用ガイド

### 📋 前提条件

1. ✅ Firebase プロジェクトが作成済み
2. ✅ Realtime Database が有効化済み  
3. ✅ Vercel アカウントが作成済み

### 🔧 Vercel デプロイ手順

#### 1. Vercel プロジェクトの作成

```bash
# Vercel CLI のインストール（未インストールの場合）
npm i -g vercel

# プロジェクトディレクトリでデプロイ
vercel

# 初回デプロイ時の設定
# - Set up and deploy? → Y
# - Which scope? → あなたのアカウント
# - What's your project's name? → jiufight
# - In which directory is your code located? → ./
```

#### 2. 環境変数の設定（オプション）

Vercel ダッシュボードで環境変数を設定可能：

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`  
- `FIREBASE_DATABASE_URL`
- `FIREBASE_PROJECT_ID`

#### 3. カスタムドメインの設定

Vercel ダッシュボード → Settings → Domains で設定

### 🔥 Firebase 設定（Vercel 用）

#### セキュリティルール（本番用）

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
      ".write": true,
      ".validate": "newData.hasChildren(['id', 'message', 'timestamp'])"
    },
    "matches": {
      ".read": true,
      ".write": true,
      "current": {
        ".validate": "newData.isNumber() && newData.val() >= 1"
      }
    },
    "metadata": {
      ".read": true,
      ".write": true
    }
  }
}
```

#### Authorized domains の追加

Firebase Console → Authentication → Settings → Authorized domains

追加するドメイン：
- `localhost` (開発用)
- `your-project.vercel.app`
- カスタムドメイン（設定した場合）

### 🌐 HTTPS 対応

- Vercel は自動的に HTTPS を提供
- Firebase も HTTPS 接続をサポート
- Mixed Content エラーなし

### 📊 パフォーマンス最適化

#### 1. CDN キャッシュ設定

`vercel.json` で設定済み：
- HTML: 24時間キャッシュ
- JS: 24時間キャッシュ  
- `firebase-config.js`: キャッシュなし（設定変更時の即座反映）

#### 2. Firebase 接続最適化

- Realtime Database の地域を Asia (シンガポール) に設定
- 接続プールの活用
- 自動再接続機能

### 🔍 デバッグ方法

#### 1. Vercel Function Logs

```bash
vercel logs
```

#### 2. Firebase Debug Console

```javascript
// ブラウザコンソールで実行
console.log('Database status:', window.databaseSync.getSyncStatus());
window.databaseSync.forceSync();
```

#### 3. 接続テスト

`https://your-domain.com/firebase-setup.html` でリアルタイム接続状態確認

### ⚡ パフォーマンス監視

#### Firebase Analytics（オプション）

```javascript
// firebase-config.js に追加
import { getAnalytics } from "firebase/analytics";
const analytics = getAnalytics(app);
```

#### Vercel Analytics

Vercel ダッシュボードで自動的に利用可能

### 🛠️ トラブルシューティング

#### よくある問題と解決策

1. **Firebase 接続エラー**
   - Authorized domains の確認
   - API キーの有効性確認
   - セキュリティルールの確認

2. **データ同期の遅延**
   - インターネット接続の確認
   - Firebase プロジェクトの地域設定
   - ブラウザキャッシュのクリア

3. **デプロイエラー**
   ```bash
   # キャッシュクリア
   vercel --prod --force
   ```

### 📈 スケーリング

#### Firebase 制限（Spark プラン）
- 同時接続: 100
- データベースサイズ: 1GB
- ダウンロード: 10GB/月

#### Vercel 制限（Hobby プラン）
- 帯域幅: 100GB/月
- ビルド実行時間: 無制限
- ファンクション実行時間: 10秒

### 🚀 本番運用チェックリスト

- [ ] Firebase プロジェクトの本番設定完了
- [ ] Realtime Database セキュリティルール設定
- [ ] Vercel デプロイ成功
- [ ] カスタムドメイン設定（必要に応じて）
- [ ] 複数端末での同期テスト完了
- [ ] パフォーマンステスト完了
- [ ] バックアップ戦略の確立

---

**これで Vercel + Firebase による高性能な別端末間同期システムが完成です！** 🎉