# video-chatbot

## 必要条件

プロジェクトを使用するために必要な環境

- Node.js 18.4.0
- OPENAI_API_KEY の環境変数に OpenAI API key を設定しておく([設定方法](https://ovaldesign.jp/2023/04/05/openai/))

## アプリケーションの起動方法

プロジェクトを起動する方法をここに書きます。

### frontend
frontend で使用しているライブラリは[yarn](https://yarnpkg.com/)を用いて管理しています。`yarn`のセットアップは各自済ませておくようにお願いします。

1. パッケージをインストールする
   ```zsh
   yarn install
   ```
2. supabaseの設定を完了する
   
   以下のコマンドを実行し、各環境変数に値を入れる。api keyが必要なときは言ってくれればOK。
   ```zsh
   cp .env.local.template .env.local
   ```
3. Nextjsで実装したfrontendを立ち上げる
   ```zsh
   yarn dev
   ```
   その後http://localhost:3000/ にアクセスする。

