YouTubeUtils = {
  player: null,
  isAPIReady: true,
  isPlayerReady: false,
  validateYouTubeUrl: function (url) {
    if (url != undefined || url != '') {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length == 11) {
            // Do anything for being valid
            // if need to change the url to embed url then use below line
            return match[2]
            //$('#ytplayerSide').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=0');
        }
        else {
            // Do anything for not being valid
            return false
        }
    }
  },
  setPlayer: function (containerId, videoId) {
    this.isPlayerReady = false
    if (this.isAPIReady === false) {
      setTimeout(function () {
        YouTubeUtils.setPlayer(videoId)
      }, 1000)
      return
    }
    
    // GE7sc_XvJ8w
    
    $('#' + containerId).empty()
    
    YouTubeUtils.player = new YT.Player(containerId, {
      height: '180',
      width: '320',
      videoId: videoId,
      events: {
        'onReady': YouTubeUtils.onPlayerReady,
        'onStateChange': YouTubeUtils.onPlayerStateChange
      }
    });
  },
  onPlayerReady: function (event) {
    event.target.playVideo();
    //event.target.playVideo();
    /*
    this.isPlayerReady = true
    setTimeout(function () {
      console.log(YouTubeUtils.getDuration())
    }, 0)
    */
  },
  onPlayerStateChange: function (event) {
    if (event.data == YT.PlayerState.PLAYING && !YouTubeUtils.isPlayerReady) {
      //setTimeout(stopVideo, 6000);
      YouTubeUtils.player.pauseVideo()
      YouTubeUtils.isPlayerReady = true
      console.log(YouTubeUtils.getDuration())
    }
  },
  play: function () {
    if (this.isPlayerReady === false) {
      return
    }
    this.player.playVideo()
  },
  getDuration: function () {
    if (this.isPlayerReady === false) {
      return
    }
    return this.player.getDuration()
  },
  getCurrentTime: function () {
    if (this.isPlayerReady === false) {
      return
    }
    return this.player.getCurrentTime()
  }
}


if (!window['YT']) {var YT = {loading: 0,loaded: 0};}if (!window['YTConfig']) {var YTConfig = {'host': 'http://www.youtube.com'};}if (!YT.loading) {YT.loading = 1;(function(){var l = [];YT.ready = function(f) {if (YT.loaded) {f();} else {l.push(f);}};window.onYTReady = function() {YT.loaded = 1;for (var i = 0; i < l.length; i++) {try {l[i]();} catch (e) {}}};YT.setConfig = function(c) {for (var k in c) {if (c.hasOwnProperty(k)) {YTConfig[k] = c[k];}}};var a = document.createElement('script');a.type = 'text/javascript';a.id = 'www-widgetapi-script';a.src = 'https://s.ytimg.com/yts/jsbin/www-widgetapi-vflkA4wlR/www-widgetapi.js';a.async = true;var c = document.currentScript;if (c) {var n = c.nonce || c.getAttribute('nonce');if (n) {a.setAttribute('nonce', n);}}var b = document.getElementsByTagName('script')[0];b.parentNode.insertBefore(a, b);})();}