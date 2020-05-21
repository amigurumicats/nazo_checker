## これはなに
謎の解答のチェックを行うためのスクリプト  
jqueryを使う版(nazo_checker_jquery.js)と、jqueryに依存しない版(nazo_checker_plain.js)があります。好みで選んでください。  
スクリプトから答えワードがバレる心配がありません

## 使い方
1. script/nazo_checker_jquery.jsかscript/nazo_checker_plain.jsのどちらかをコピーして適当な場所に置く  
2. html内で上のスクリプトを適切に読み込む  
<head>タグの間(<head>〜</head>の間)に以下を書く

```
  <script src="nazo_checker_{jqueryかplainのどちらか}"></script>
```
ただし、jquery版の場合は、jqueryを読み込んだ後に、nazo_checker_jquery.jsを読み込んでください

3. htmlにformを作る

```
  <form onsubmit="AnswerCheck(this);return false;">
    <input type="text" name="input">
    <button type="submit">送信</button>
  </form>
```

4. 何かが起こってほしいワードごとに、ファイル名をそのワードとするファイル(答えワードファイル)を作る  
各答えワードは以下のような形式にしてください(ちなみに、以下のようなデータ形式をJSONといいます)。
```
{
  "type": "alert" または "message",
  "value": "(後述)"
  "comment": "ここはコメントです。処理には使わないので、メモ的な使い方をしてください。"
}
```
valueはtypeによってどのように使われるかが変わります。  
typeが"alert"ならvalueの値がアラートに出力されます。  
typeが"message"なら、valueの値のページに遷移するので、URLを記入してください。  

## どういう仕組み
まず、submitボタンが押されたら、テキストフォームに入っているテキストを取得します(入力ワード)。  
ajaxによって、answersディレクトリの下に入力ワードと同じ名前のファイルがあるかどうかを確認します。(例えば、入力ワードが"ねこ"なら、"answers/ねこ"というファイルがあるかどうかを確認する)  
そのファイルがあれば、ファイルの中身を取得し、色々処理をします。  
ファイルがなければ、不正解(想定していないワード、無反応ワード)とします。
どんな名前のファイルがどこにあるかどうかは、事前には分からないため(このファイルがあるかどうか？を知るためには、実際にそのファイルをリクエストしなければならない)、スクリプトから答えがバレません。
また、答えワードファイルの中にアラート内容や遷移先URLが記載されているため、答えが分からないうちはアラート内容や遷移先URLもバレません。

## カスタマイズしたい
答えワードファイルのtypeやvalueを適当に追加し、その追加したtypeに対する処理をスクリプトに追加することができます。  
さらには、typeやvalueは文字列ではなく、数字や配列でもいいですし、typeやvalueという名前をやめて、kindやmessageなどにしても構いません。その場合、きちんとそれに対する処理をスクリプトに書きましょう。

## Note
### jquery版+jquery.slimでうまく動作しない(`$.ajax is not function`的なエラーが出る)
jqueryのスリムビルド版はajaxが使えないためです。  
スリム版ではない("slim"が入っていない)jqueryを使うか、nazo_checker_plain.jsを使うか、をしてください。

### demo/index.htmlをローカルでそのまま開いた状態(URLがfile://とかになっている状態)だと、CORSにひっかかってうまく動作しない
本番環境に思い切って投げちゃうか、それでも不安ならローカルに開発サーバを立てましょう。  
例えば、お使いのPCにpythonが入ってるなら、ターミナルを立ち上げて、適切なディレクトリまで移動して、`python -m http.server`をすると、簡易開発サーバが立ちます。  
その状態で、ブラウザのURL蘭に`localhost:8000/index.html`を入力すれば、さっき立てた簡易開発サーバ経由で色々動かせます。

### 一つのページにフォームを複数用意したい、または、別のページで同じスクリプトを参照したい(フォームAの答えワードがフォームBの解答に反応しないようにしたい)
例えば、formにname属性を足して(`<form onsubmit="AnswerCheck(this);return false;" name="hogehoge">`)、探しにいく場所を`"answers/"+send_text`から`"answers/"+form.name+"/"+send_text`すると、"answer/hogehoge/{入力ワード}"を探すようになります。  
このとき、答えワードはそれぞれ対応した場所(`answers/hogehoge/`や`answers/fugafuga`)に置くようにしましょう。  
答えワードに対してフォルダが増えすぎて大変！というときは、`"answers/"+form.name+"_"+send_text`とすると、同じフォルダでも接頭辞によってファイルの棲み分けができます。  
ただし、このときは答えワードファイルも対応する接頭辞(上の例なら"hogehoge_"をつけましょう。例えば、元の答えワードが"ねこ"なら、"hogehoge_ねこ"というファイルを`answers/`に置きましょう。)をつけなければいけません。

### fc2だと日本語を含むファイルが作れない
適当なエンコードを挟んで日本語を数字列や英数字列にしましょう。  
以下の手順が必要です。  
- 予め、手元で想定ワードをエンコードした文字列を出しておき、答えワードファイルの名前を全てその形式にする
- send_text取得後、チェックする前にsend_textをエンコードする処理を挟む
このとき、どのファイルがどのワードかがかなり分かりにくくなるので、答えワードファイルのcomment欄(スクリプト側の処理では使っていないため、メモみたいな使い方ができます)に元のワードが何だったかを書いておくと多少ましになります。

### 答えワードファイルをアップロードしようとすると、"拡張子がない"と怒られる
以下の手順が必要です  
- 答えワードファイルに適当な拡張子をつける(答えワードが"ねこ"、ファイル名は"ねこ.json"とする)
- 送信時のパスに拡張子を補う
`"answers/"+send_text`を`"answers/"+send_text+".json"`にする

### formのonsubmit="AnswerCheck(this);return false;"って何
スクリプトで定義しているAnswerCheck()にthis(ここではform自身)を渡したあと、元々のsubmitの動作(今のURLにformの内容を送る)をキャンセルしています。(AnswerCheckで送信処理をしているので、改めてsubmit側で送られてしまうと困るため)

### formのonsubmitじゃなくて、buttonにonclick="AnswerCheck(this)"をつけてもいいのでは？
もちろんそれでもいいです。submitに紐づけると、Enterで反応させられて便利だなと思っただけです。