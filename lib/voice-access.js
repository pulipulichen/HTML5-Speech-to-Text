VoiceAccess = {
  check: function () {
    // 如果本機有，那就確認
    // initialization
    if( localStorage.getItem("voice_access") === null
            || localStorage.getItem("voice_access") !== 'granted'){
        localStorage.setItem("voice_access", "prompt")
        $('.ui.modal.voice-access-modal').modal('show')
    }
  },
  grantMicrophonePermission: function () {
    // Then somewhere
    navigator.getUserMedia({
      audio: true
    }, function (e) {

        // http://stackoverflow.com/q/15993581/1008999
        //
        // In chrome, If your app is running from SSL (https://),
        // this permission will be persistent.
        // That is, users won't have to grant/deny access every time.
        localStorage.setItem("voice_access", "granted");
        
    }, function(err){
      
        if(err.name === "PermissionDismissedError"){
            localStorage.setItem("voice_access", "prompt");
        }
        if(err.name === "PermissionDeniedError"){
            localStorage.setItem("voice_access", "denied");
        }
        
    });
  }
}

$(function () {
  VoiceAccess.check()
})