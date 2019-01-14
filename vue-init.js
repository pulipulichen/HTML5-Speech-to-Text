var app = new Vue({
  el: '#speechToText',
  data: {
    filename: 'SpeechToTextDemo',
    loadFromURLValue: 'chi.aac',
    //extAudio: ['3gp','aa','aac','aax','act','aiff','amr','ape','au','awb','dct','dss','dvf','flac','gsm','iklax','ivs','m4a','m4b','m4p','mmf','mp3','mpc','msv','nsf','ogg, oga, mogg','opus','ra, rm','raw','sln','tta','vox','wav','wma','wv','webm','8svx'],
    
    // https://developer.mozilla.org/zh-TW/docs/Web/HTML/Supported_media_formats
    extAudio: ['wav', 'ogg', 'mp3', 'aac', 'm4a'],
    extVedio: ['mp4'],
    //loadFromURLValue: ''
  },
  methods: {
    loadFromURL: function (event) {
      //console.log(this.loadFromURLValue)
      var type = this.detectURLtype(this.loadFromURLValue)
      var playerContainer = $('#audio_player')
      if (type === 'youtube') {
        this.loadFromURLYouTube(this.loadFromURLValue, playerContainer)
      }
      else if (type === 'video') {
        this.loadFromURLVideo(this.loadFromURLValue, playerContainer)
      }
      else if (type === 'audio') {
        this.loadFromURLAudio(this.loadFromURLValue, playerContainer)
      }
    },
    loadFromURLYouTube: function (url, playerContainer) {
      
    },
    loadFromURLVideo: function (url, playerContainer) {
      var ext = getExtFromURL(url)
      playerContainer.html('<video controls class="audio-player" style="display: block;max-width: 320px;max-height: 180px;"><source src="' + url + '" type="video/mp4">Your browser does not support the audio element.</video>')
      this.filename = getFilenameFromURL(url)
    },
    loadFromURLAudio: function (url, playerContainer) {
      playerContainer.html('<video controls class="audio-player" style="display: block;max-width: 320px;max-height: 180px;"><source src="' + url + '" type="video/mp4">Your browser does not support the audio element.</video>')
      this.filename = getFilenameFromURL(url)
    },
    getMIMEfromExt: function (ext) {
      
    },
    detectURLtype: function (url) {
      if (validateYouTubeUrl(url) !== false) {
        return 'youtube'
      }
      else {
        var ext = getExtFromURL(url)
        //console.log(ext)
        //console.log(ext.indexOf(this.extAudio))
        //console.log(this.extAudio.indexOf(ext))
        if (this.extAudio.indexOf(ext) > -1) {
          return 'audio'
        }
        else {
          return 'video'
        }
      }
    }
  }
})