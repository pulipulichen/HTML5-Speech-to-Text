var app = new Vue({
  el: '#speechToText',
  data: {
    filename: 'SpeechToTextDemo',
    //loadFromURLValue: 'chi.ogg',
    //loadFromURLValue: 'https://www.youtube.com/watch?v=GE7sc_XvJ8w',
    loadFromURLValue: '',
    //extAudio: ['3gp','aa','aac','aax','act','aiff','amr','ape','au','awb','dct','dss','dvf','flac','gsm','iklax','ivs','m4a','m4b','m4p','mmf','mp3','mpc','msv','nsf','ogg, oga, mogg','opus','ra, rm','raw','sln','tta','vox','wav','wma','wv','webm','8svx'],
    
    // https://developer.mozilla.org/zh-TW/docs/Web/HTML/Supported_media_formats
    extAudio: ['wav', 'ogg', 'mp3'],
    extVedio: ['mp4'],
    playerTemplate: {
      video: `<video controls class="audio-player" style="display: block;max-width: 320px;max-height: 180px;">
          <source src="{{URL}}" type="video/mp4">
          Your browser does not support the audio element.
        </video>`,
      audio: `<div class="ui icon message">
          <i class="file audio outline icon"></i>
          {{FILENAME}}
        </div>
        <audio controls class="audio-player">
          <source src="{{URL}}" type="{{MIME_TYPE}}">
          Your browser does not support the audio element.
        </audio>`
    }
    //loadFromURLValue: ''
  },
  methods: {
    loadFromURL: function (event) {
      //console.log(this.loadFromURLValue)
      var type = this.detectURLtype(this.loadFromURLValue)
      console.log(type)
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
    setFilename: function (filename) {
      // https://stackoverflow.com/a/3780731
      filename = filename.replace(/[|&;$%@"<>()+,]/g, "");
      
      if (filename.length > 15) {
        filename = filename.slice(0, 15)
      }
      
      this.filename = filename
    },
    loadFromURLYouTube: function (url, playerContainer) {
      var videoId = YouTubeUtils.validateYouTubeUrl(url)
      //console.log(videoId)
      $('#audio_player').html('<div id="audio_player_youtube"></div>')
      var _this = this
      YouTubeUtils.setPlayer('audio_player_youtube', videoId, function () {
        _this.setFilename(YouTubeUtils.getTitle())
      })
    },
    loadFromURLVideo: function (url, playerContainer) {
      var template = this.playerTemplate.video
      template = template.split('{{URL}}').join(url)
      playerContainer.html(template)
      this.setFilename(getFilenameFromURL(url))
    },
    loadFromURLAudio: function (url, playerContainer) {
      var template = this.playerTemplate.audio
      template = template.split('{{URL}}').join(url)
      
      var ext = getExtFromURL(url)
      var mime = ext
      if (mime === 'mp3') {
        mime = 'mpeg'
      }
      mime = 'audio/' + mime
      template = template.split('{{MIME_TYPE}}').join(mime)
      
      var filename = getFullFilenameFromURL(url)
      template = template.split('{{FILENAME}}').join(filename)
      
      playerContainer.html(template)
      this.setFilename(getFilenameFromURL(url))
    },
    detectURLtype: function (url) {
      if (YouTubeUtils.validateYouTubeUrl(url) !== false) {
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