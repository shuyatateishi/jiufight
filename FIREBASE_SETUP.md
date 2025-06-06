# Firebase Setup Guide for Jiufight

## 🔥 Firebase Realtime Database セットアップガイド

このガイドでは、Jiufightの別端末間同期を実現するためのFirebase設定方法を説明します。

## 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを作成」をクリック
3. プロジェクト名を入力（例：`jiufight`）
4. Googleアナリティクスは不要なので無効にしてOK
5. 「プロジェクトを作成」をクリック

## 2. Realtime Databaseの有効化

1. 左側メニューから「Realtime Database」を選択
2. 「データベースを作成」をクリック
3. 場所を選択（アジアの場合は「シンガポール」推奨）
4. セキュリティルールで「テストモードで開始」を選択
   - 30日間は誰でも読み書き可能（開発用）
   - 本番環境では適切なルールに変更必要

## 3. Webアプリの設定

1. プロジェクト設定（歯車アイコン）→「プロジェクトの設定」
2. 「マイアプリ」セクションで「</> (Web)」アイコンをクリック
3. アプリのニックネームを入力（例：`jiufight-web`）
4. 「アプリを登録」をクリック
5. 表示される設定情報をコピー

## 4. firebase-config.jsの更新

以下の設定情報を`firebase-config.js`に貼り付けてください：

```javascript
const firebaseConfig = {
    apiKey: "あなたのAPIキー",
    authDomain: "あなたのプロジェクト.firebaseapp.com",
    databaseURL: "https://あなたのプロジェクト.firebasedatabase.app",
    projectId: "あなたのプロジェクトID",
    storageBucket: "あなたのプロジェクト.appspot.com",
    messagingSenderId: "あなたのSenderID",
    appId: "あなたのAppID"
};
```

## 5. セキュリティルールの設定（本番用）

Realtime Database → ルール で以下を設定：

```json
{
  "rules": {
    "fighters": {
      ".read": true,
      ".write": true
    },
    "announcements": {
      ".read": true,
      ".write": true
    },
    "matches": {
      ".read": true,
      ".write": true
    },
    "metadata": {
      ".read": true,
      ".write": true
    }
  }
}
```

## 6. 使用方法

1. `firebase-config.js`を更新
2. ブラウザでサイトを開く
3. 別の端末・ブラウザでも同じサイトを開く
4. データの変更が即座に全端末に反映される！

## トラブルシューティング

### データベースに接続できない場合
- Firebase ConsoleでRealtime Databaseが有効になっているか確認
- `databaseURL`が正しいか確認（地域によって異なる）
- ブラウザのコンソールでエラーを確認

### 同期が遅い場合
- インターネット接続を確認
- Firebase Consoleで使用量制限に達していないか確認

### ローカルでのテスト
- Firebaseはローカルファイル（file://）では動作しません
- 簡易サーバーを起動してテスト：
  ```bash
  # Python 3
  python -m http.server 8000
  
  # Node.js
  npx http-server
  ```

## 無料枠の制限

Firebase無料プラン（Spark）の制限：
- 同時接続数：100
- データベースサイズ：1GB
- ダウンロード：10GB/月

Jiufightの使用では十分な容量です。