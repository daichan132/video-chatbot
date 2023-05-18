# video-chatbot

## 必要条件

プロジェクトを使用するために必要な環境

- Python 3.10.x
- Node.js 18.4.0
- OPENAI_API_KEY の環境変数に OpenAI API key を設定しておく([設定方法](https://ovaldesign.jp/2023/04/05/openai/))

## アプリケーションの起動方法

プロジェクトを起動する方法をここに書きます。

### frontend
frontend で使用しているライブラリは[yarn](https://yarnpkg.com/)を用いて管理しています。`yarn`のセットアップは各自済ませておくようにお願いします。

1. frontend directory に移動する
   ```
   cd ./frontend
   ```
2. パッケージをインストールする
   ```zsh
   yarn install
   ```
3. Nextjsで実装したfrontendを立ち上げる
   ```zsh
   yarn dev
   ```
   その後http://localhost:3000/ にアクセスする。

### backend
backend の python のパッケージは[poetry](https://github.com/python-poetry/poetry)を用いて管理しています。`poetry`のセットアップは各自済ませておくようにお願いします。

1. backend directory に移動する
   ```
   cd ./backend
   ```
2. パッケージをインストールする
   ```zsh
   poetry install
   ```
3. fastapiで実装したapiを起動する
   ```zsh
   uvicorn src.main:app --reload
   ```

