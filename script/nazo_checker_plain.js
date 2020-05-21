function AnswerCheck(form){
  // 入力欄に入っている文字列を拾う
  send_text = form.firstElementChild.value;
  // 入力欄が空のとき、送信せず、エラーメッセージを出す
  if(send_text.length == 0){
    result.innerHTML = "入力欄が空です";
    return false;
  }

  // XMLHttpRequestオブジェクトを生成する
  var req = new XMLHttpRequest();
  // タイムアウトを3000ミリ秒に設定する
  req.timeout = 3000;
  // レスポンスはJSONで受け取る
  req.responseType = "json";

  // レスポンスを受け取った後の処理を定義する
  req.addEventListener("loadend", function(){
    if(req.status == 200){
      // answers/{send_text}が存在する
      if(req.response["type"] == "move"){  // 遷移
        window.location.href = req.response["value"];
      }else if(req.response["type"] == "alert"){  // アラート
        alert(req.response["value"]);
      }
    }else{
      // answers/{send_text}が存在しない
      let result = document.getElementById("result");
      result.innerHTML = "「"+send_text+"」は不正解です";
    }
  })

  req.open("GET", "answers/"+send_text, true);
  // 送信
  req.send();

}
