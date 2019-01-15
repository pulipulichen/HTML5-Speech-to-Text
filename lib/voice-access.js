VoiceAccess = {
  check: function () {
    // 如果本機有，那就確認
    // initialization
    if( localStorage.getItem("voice_access") === null ){
        
    }
  }
}

$(function () {
  VoiceAccess.check()
})