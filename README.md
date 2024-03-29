## これはなに？
謎の解答のチェックを行うためのスクリプト  
jqueryを使う版(nazo_checker_jquery.js)と、jqueryに依存しない版(nazo_checker_plain.js)があります。好みで選んでください。  
スクリプトから答えワードがバレる心配がありません

## デモ
https://amigurumicats.github.io/nazochecker_demo/

## 使い方
1. script/nazo_checker_jquery.jsかscript/nazo_checker_plain.jsのどちらかをコピーして適当な場所に置く  
2. html内で上のスクリプトを適切に読み込む  
\<head>タグの間(\<head>〜\</head>の間)に以下を書く

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
各答えワードファイルは以下のような形式にしてください(ちなみに、以下のようなデータ形式をJSONといいます)。
```
{
  "type": "alert" または "move",
  "value": "(後述)"
  "comment": "ここはコメントです。処理には使わないので、メモ的な使い方をしてください。"
}
```
valueはtypeによってどのように使われるかが変わります。  
typeが"alert"ならvalueの値がアラートに出力されます。  
typeが"move"なら、valueの値のページに遷移するので、URLを記入してください。  
答えワードファイルはいくつあってもいいですし、それぞれの中身が同じでも、異なっててもいいです。  
例えば、「ねこ」「ネコ」「猫」という3つの中身が同じでファイル名だけが異なる答えワードファイルを置いておくと、表記揺れ対応ができます。  
また、中身の違う「ねこ」と「いぬ」の答えワードファイルを置いておくと、「ねこ」が入力された時と「いぬ」が入力された時で別の処理を行うことができます。  

## どういう仕組み？
まず、submitボタンが押されたら、テキストフォームに入っているテキストを取得します(入力ワード)。  
ajaxによって、answersディレクトリの下に入力ワードと同じ名前のファイルがあるかどうかを確認します。(例えば、入力ワードが"ねこ"なら、"answers/ねこ"というファイルがあるかどうかを確認する)  
そのファイルがあれば、ファイルの中身を取得し、色々処理をします。  
ファイルがなければ、不正解(想定していないワード、無反応ワード)とします。  
どんな名前のファイルがどこにあるかどうかは、事前には分からないため(このファイルがあるかどうか？を知るためには、実際にそのファイルをリクエストしなければならない)、スクリプトから答えがバレません。  
また、答えワードファイルの中にアラート内容や遷移先URLが記載されているため、答えが分からないうちはアラート内容や遷移先URLもバレません。  
(とはいえGitHub Pagesで公開すると、{アカウント名}.github.io/じゃなくて、github.io/{アカウント名}.github.io/の方にアクセスすればファイルやらフォルダやら全部見えるので留意しておいてください)

## カスタマイズしたい
答えワードファイルのtypeやvalue(あるいはさらに他のフィールド)を適当に追加し、その追加したtypeに対する処理をスクリプトに追加することで、自由にカスタマイズができます。  
さらには、typeやvalueは文字列ではなく、数字や配列でもいいですし、typeやvalueという名前をやめて、kindやmessageなどにしても構いません。その場合、きちんとそれに対する処理をスクリプトに書きましょう。

## Note
### jquery版+jquery.slimでうまく動作しない(`$.ajax is not function`的なエラーが出る)
jqueryのスリムビルド版はajaxが使えないためです。  
スリム版ではない("slim"が入っていない)jqueryを使うか、nazo_checker_plain.jsを使うか、をしてください。

### demo/index.htmlをローカルでそのまま開いた状態(URLがfile://とかになっている状態)だと、CORSにひっかかってうまく動作しない
本番環境に思い切って投げちゃうか、それでも不安ならローカルで一時的に開発サーバを動かして確認しましょう。
ローカルで一時的に開発サーバを動かすのは、例えば、お使いのPCにpythonが入ってるなら、ターミナル(コマンドプロンプト)を立ち上げて、適切なディレクトリまで移動して、`python -m http.server`をすると、簡易開発サーバが立ちます。  
その状態で、ブラウザのURL欄に`localhost:8000/index.html`を入力すれば、さっき立てた簡易開発サーバ経由で色々動かせます。
(立てた開発サーバはCtrl+CやCtrl+Dで止める(終了する)ことができます。)

### 一つのページにフォームを複数用意して、それぞれ別の解答を用意したい、または、別のページで同じスクリプトを参照するが、解答は別にしたい(フォームAの答えワードがフォームBの解答に反応しないようにしたい)
例えば、formに適当なnameをつけて(`<form onsubmit="AnswerCheck(this);return false;" name="formname">`)、探しにいく場所を`"answers/"+send_text`から`"answers/"+form.name+"/"+send_text`とすると、"answers/formname/{入力ワード}"を探すようになります。  
このとき、答えワードはそれぞれ対応した場所(`answers/hogehoge/`や`answers/fugafuga/`)に置くようにしましょう。  
答えワードに対してフォルダが増えすぎて大変！というときは、`"answers/"+form.name+"_"+send_text`とすると、同じフォルダでも接頭辞によってファイルの棲み分けができます。  
ただし、このときは答えワードファイルも対応する接頭辞をつけなければいけません。  
(上の例なら"formname_"をつけることになります。例えば、元の答えワードが"ねこ"なら、"formname_ねこ"というファイルを`answers/`に置きましょう。)  
探しに行くパス(ファイルの位置を表すもの)は文字列を適当に切ったり貼ったりしているだけなので、フォルダ名をanswersじゃなくすることもできます。

### 日本語を含むファイルが作れない（fc2とか)
適当なエンコードを挟んで日本語を数字列や英数字列にしましょう。  
以下の手順が必要です。  
- 予め、手元で想定ワードをエンコードした文字列を出しておき、答えワードファイルの名前を全てその形式にする  
  - ブラウザで新規タブを開いて、JavaScriptコンソールを出す  
  - `Array.prototype.map.call("ねこ", c => c.charCodeAt()).join(",")`と打って実行すると、`12397,12371`のような文字列が得られるので、答えワードファイルの名前を"12397,12371"にする
- send_text取得後、チェックする前にsend_textをエンコードする処理を挟む  
  - `req.open("GET", ...`の前の行に`send_text = Array.prototype.map.call(send_text, c => c.charCodeAt()).join(",");`を追加する  
  - また、どのファイルがどのワードかがかなり分かりにくくなるので、答えワードファイルのcomment欄(スクリプト側の処理では使っていないため、メモみたいな使い方ができます)に元のワードが何だったかを書いておくと多少ましになります。  

### 答えワードファイルをアップロードしようとすると、"拡張子がない"と怒られる
以下の手順が必要です  
- 答えワードファイルに適当な拡張子をつける(例えば、答えワードが"ねこ"のとき、ファイル名は"ねこ.json"とする、など)
- 送信時のパスに拡張子を補う
スクリプト中の`"answers/"+send_text`を`"answers/"+send_text+".json"`にする

### formのonsubmit="AnswerCheck(this);return false;"って何？
スクリプトで定義しているAnswerCheck()にthis(ここではform自身)を渡したあと、元々のsubmitの動作(今のURLにformの内容を送る)をキャンセルしています。(AnswerCheckで送信処理をしているので、改めてsubmit側で送られてしまうと困るため)

### formにonsubmitじゃなくて、buttonにonclick="AnswerCheck(this)"をつけてもいいのでは？
もちろんそれでもいいです。submitに紐づけると、Enterで反応させられて便利だなと思っただけです。

## 改善点・バグ報告
なんか変なところ等あれば、何経由でもよいのでどしどしください
