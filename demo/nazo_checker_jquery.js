function AnswerCheck(form){
  // 入力欄に入っている文字列を拾う
  send_text = $(form).children("input[type=text]")[0].value;
  // 入力欄が空のとき、送信せず、エラーメッセージを出す
  if(send_text.length == 0){
    $("#result").text("入力欄が空です");
    return false;
  }
  // DEBUG
  console.log("送信 : "+send_text);

  $.ajax({
    url: "answers/"+send_text,
    type: "GET",
    dataType: "json",
    timeout: 3000,
  })
  .done(function(resp){
    // answers/{send_text}が存在する
    if(resp["type"] == "move"){  // 遷移
      window.location.href = resp["value"];
    }else if(resp["type"] == "alert"){  // アラート
      alert(resp["value"])
    }
  })
  .fail(function(){
    // answers/{send_text}が存在しない
    $("#result").text("「"+send_text+"」は不正解です");
  })

}
