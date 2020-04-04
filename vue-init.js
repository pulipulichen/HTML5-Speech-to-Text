var app = new Vue({
  el: '#speechToText',
  data: {
    finishTime: '',
    i18n: i18n,
    filename: 'SpeechToText',
    //loadFromURLValue: 'chi.ogg',
    //loadFromURLValue: 'https://www.youtube.com/watch?v=GE7sc_XvJ8w',
    loadFromURLValue: '',
    customLang: '',
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
    checkLoadFromURL: function () {
      var _this = this
      $(function () {
        setTimeout(function () {
          if ($('.setting-load-from-url').val() !== '') {
            _this.loadFromURLValue = $('.setting-load-from-url').val()
          }

          if (_this.loadFromURLValue !== '') {
            _this.loadFromURL()
          }
          else {
            _this.loadDemoVideo()
          }
        }, 500)
      })

      
    },
    loadFromURL: function (event) {
      $('.recognition-status').attr('data-recognition-status', 'loading')
      
      //console.log(this.loadFromURLValue)
      var type = this.detectURLtype(this.loadFromURLValue)
      //console.log(type)
      var playerContainer = $('#audio_player')
      if (type === 'youtube') {
        var _this = this
        this.loadFromURLYouTube(this.loadFromURLValue, playerContainer, function () {
          $('.recognition-status').attr('data-recognition-status', 'ready')
          _this.reset()
          //console.log('aaaa')
        })
      }
      else if (type === 'video') {
        this.loadFromURLVideo(this.loadFromURLValue, playerContainer)
        $('.recognition-status').attr('data-recognition-status', 'ready')
        this.reset()
      }
      else if (type === 'audio') {
        this.loadFromURLAudio(this.loadFromURLValue, playerContainer)
        $('.recognition-status').attr('data-recognition-status', 'ready')
        this.reset()
      }
    },
    changeLang: function (lang) {
      $('.lang').val(lang);
      $('#customLang').val('');
    },
    setFilename: function (filename) {
      // https://stackoverflow.com/a/3780731
      if (!filename) {
        filename = 'unknown'
      }
      filename = filename.replace(/[|&;$%@"<>()+,]/g, "");
      
      if (filename.length > 15) {
        filename = filename.slice(0, 15)
      }
      
      this.filename = filename
    },
    loadFromURLYouTube: function (url, playerContainer, callback) {
      var videoId = YouTubeUtils.validateYouTubeUrl(url)
      //console.log(videoId)
      playerContainer.html('<div id="audio_player_youtube"></div>')
      var _this = this
      YouTubeUtils.setPlayer('audio_player_youtube', videoId, function () {
        _this.setFilename(YouTubeUtils.getTitle())
        if (typeof(callback) === "function") {
          setTimeout(function () {
            callback()
          }, 100)
        }
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
    },
    reset: function () {
      SpeechToText.reset()
      setTimeout(function () {
        $('[data-persist="garlic"] input').change()
      }, 100)
    },
    confirmReset: function () {
      if (SpeechToText.hasContent()) {
        return window.confirm(i18n.t('Text will be reset. Are you sure?'))
      }
    },
    grantMicrophonePermission: function () {
      VoiceAccess.grantMicrophonePermission()
    },
    openVirtualAudioCableHelpModel: function () {
      $('.ui.modal.virtual-audio-cable-help-modal').modal('show')
    },
    loadDemoVideo: function () {
      var playerContainer = $('#audio_player')
      this.loadFromURLVideo('chi.mp4', playerContainer)
      this.setFilename('SpeechToText')
      this.clearLoadFromURLValue()
      this.reset()
    },
    clearLoadFromURLValue: function () {
      this.loadFromURLValue = ''
    }
  }
})

app.checkLoadFromURL()