/* global app, YouTubeUtils */

let SpeechToText = {
  tbody: $('tbody.text-content'),
  player: null,
  setPlayer: function () {
    this.player = $('.audio-player')[0]
  },
  audioPlay: function () {
    if (this.player === null) {
      this.setPlayer()
    }
    
    if (this.getPlayerMode() === 'html') {
      this.player.play()
    }
    else if (this.getPlayerMode() === 'youtube') {
      YouTubeUtils.play()
    }
  },
  play () {
    return this.audioPlay()
  },
  stop () {
    if (this.player === null) {
      this.setPlayer()
    }
    
    if (this.getPlayerMode() === 'html') {
      this.player.stop()
    }
    else if (this.getPlayerMode() === 'youtube') {
      YouTubeUtils.stop()
    }
  },
  pause () {
    if (this.player === null) {
      this.setPlayer()
    }
    
    if (this.getPlayerMode() === 'html') {
      this.player.pause()
    }
    else if (this.getPlayerMode() === 'youtube') {
      YouTubeUtils.pause()
    }
  },
  getPlayerMode: function () {
    if ($('#audio_player_youtube').length === 0) {
      return 'html'
    }
    else {
      return 'youtube'
    }
  },
  playerDuration: null,
  getDuration: function () {
    if (this.playerDuration !== null) {
      return this.playerDuration
    }
    
    if (this.getPlayerMode() === 'html') {
      this.playerDuration = this.player.duration
    }
    else if (this.getPlayerMode() === 'youtube') {
      this.playerDuration = YouTubeUtils.getDuration()
    }
    
    // 設定完成時間
    var currentTime = (new Date()).getTime()
    
    let duration = this.playerDuration
    // 每30秒，增加3秒
    duration = duration + Math.ceil((duration / 30) * 3)
    //console.log(duration, this.playerDuration, YouTubeUtils.getDuration())
    var finishTime = new Date(currentTime + (duration * 1000) + 100)
    var finishTimeStr = this.prefixPaddingZero(finishTime.getHours(), 2) 
            + ':' 
            + this.prefixPaddingZero(finishTime.getMinutes(), 2) 
            + ":" 
            + this.prefixPaddingZero(finishTime.getSeconds(), 2)
    
    app.finishTime = finishTimeStr
    
    //console.log(finishTimeStr)
    
    return this.playerDuration
  },
  getCurrentTime () {
    if (this.getPlayerMode() === 'html') {
      return this.player.currentTime
    }
    else if (this.getPlayerMode() === 'youtube') {
      return YouTubeUtils.getCurrentTime()
    }
  },
  addRow: function () {
    if (this.isLastRowEmpty()) {
      return null
    }
    
    let tr = $(`
      <tr>
        <th class="start">
          <input type="number" class="ui mini input hour" min="0" max="999"">
          :
          <input type="number" class="ui mini input minute" min="0" max="999"">
          :
          <input type="number" class="ui mini input second" min="0" max="59"">
          ,
          <input type="number" class="ui mini input millisecond" min="0" max="999"">
        </th>
        <th class="hyper">-</th>
        <th class="end">
          <input type="number" class="ui mini input hour" min="0" max="999">
          :
          <input type="number" class="ui mini input minute" min="0" max="59">
          :
          <input type="number" class="ui mini input second" min="0" max="59">
          ,
          <input type="number" class="ui mini input millisecond" min="0" max="999">
        </th>
        <td class="caption"><textarea class="ui mini input"></textarea></td>
      </tr>`)
    //tr.find('textarea').autogrow({vertical: true, horizontal: false})
    tr.find('textarea').css('height', '2.1rem')
    this.tbody.append(tr)

    // scroll to bottom
    let container = $('table.tbody')[0]
    container.scrollTop = container.scrollHeight;
  },
  addExampleRow: function (_loop) {
    this.addRow()
    this.tbody.find('input').val('999')
    this.tbody.find('textarea').val('Test test test')
    
    if (typeof(_loop) === 'number') {
      _loop--
      if (_loop > 0) {
        this.addExampleRow(_loop)
      }
    }
  },
  isLastRowEmpty: function () {
    let lastCaption = this.tbody.find('tr:last .caption textarea')
    if (lastCaption.length === 0) {
      return false
    }
    else {
      return (lastCaption.val().trim() === '')
    }
  },
  hasContent: function () {
    return (this.tbody.children().length > 0)
  },
  removeEmptyRow: function () {
    this.tbody.find('tr .caption textarea').each((i, caption) => {
      caption = $(caption)
      if (caption.val().trim() === '') {
        caption.parents('tr:first').remove()
      }
    })
  },
  getCaption: function () {
    return this.tbody.find('tr:last .caption textarea').val()
  },
  reset: function () {
    // 清理資料
    this.tbody.empty()
    
    // 把狀態改掉
    $('.recognition-status').attr('data-recognition-status', 'ready')
  },
  setCaption: function (caption) {
    let textarea = this.tbody.find('tr:last .caption textarea')
    textarea.val(caption.trim()).autogrow({vertical: true, horizontal: false, flickering: false})

  },
  setStart: function (time) {
    var [hour, minute, second, millisecond, currentTime] = time
    let timeField = this.tbody.find('tr:last .start')
    timeField.find('.hour').val(hour)
    timeField.find('.minute').val(minute)
    timeField.find('.second').val(second)
    timeField.find('.millisecond').val(millisecond)
    timeField.attr('currentTime', currentTime)

    // 回去調整最後一個欄位
    if (this.tbody.find('tr').length > 1) {
      let lastEnd = this.tbody.find('tr:last').prev().find('.end')
      let lastEndCurrentTime = lastEnd.attr('currentTime')
      lastEndCurrentTime = parseFloat(lastEndCurrentTime)
      if (currentTime < lastEndCurrentTime) {
        lastEnd.find('.hour').val(hour)
        lastEnd.find('.minute').val(minute)
        lastEnd.find('.second').val(second)
        lastEnd.find('.millisecond').val(millisecond)
        lastEnd.attr('currentTime', currentTime)
      }
    }
  },
  setEnd: function (time) {
    var [hour, minute, second, millisecond, currentTime] = time
    let timeField = this.tbody.find('tr:last .end')
    timeField.find('.hour').val(hour)
    timeField.find('.minute').val(minute)
    timeField.find('.second').val(second)
    timeField.find('.millisecond').val(millisecond)
    timeField.attr('currentTime', currentTime)
  },
  getPlayerCurrentTime: function (adjust) {
    let currentTime
    
    if (this.getPlayerMode() === 'html') {
      currentTime = this.player.currentTime
    }
    else if (this.getPlayerMode() === 'youtube') {
      currentTime = YouTubeUtils.getCurrentTime()
    }
    
    if (currentTime > this.getDuration()) {
      currentTime = this.getDuration()
    }
    
    if (typeof(adjust) === 'number') {
      currentTime = currentTime + adjust
    }
    let sec = currentTime

    let minSec = Math.floor(sec * 1000 % 1000)

    /*
    if (minSec < 10) {
      minSec = '00' + minSec
    } else if (minSec < 100) {
      minSec = '0' + minSec
    }
    */

    let min = Math.floor(sec / 60 % 60)
    let hour = Math.floor(sec / (60 * 60))

    sec = Math.floor(sec % 60)

    /*
    sec = Math.floor(sec & 60)
    if (sec < 10) {
      sec = '0' + sec
    }
    */

    return [hour, min, sec, minSec, currentTime]
  },
  prefixPaddingZero: function (number, length) {
    if (typeof(number) === 'number') {
      number = number + ''
    }
    
    while (number.length < length) {
      number = '0' + number
    }
    return number
  },
  getContent: function () {
    let content = []
    this.tbody.find('tr').each((i, tr) => {
      tr = $(tr)
      let item = {}
      item.start = {
        hour: this.prefixPaddingZero(tr.find('.start .hour').val(), 2),
        minute: this.prefixPaddingZero(tr.find('.start .minute').val(), 2),
        second: this.prefixPaddingZero(tr.find('.start .second').val(), 2),
        millisecond: this.prefixPaddingZero(tr.find('.start .millisecond').val(), 3),
      }
      item.end = {
        hour: this.prefixPaddingZero(tr.find('.end .hour').val(), 2),
        minute: this.prefixPaddingZero(tr.find('.end .minute').val(), 2),
        second: this.prefixPaddingZero(tr.find('.end .second').val(), 2),
        millisecond: this.prefixPaddingZero(tr.find('.end .millisecond').val(), 3),
      }
      item.caption = tr.find('.caption textarea').val().trim(),

      content.push(item)
    })
    return content
  },
  complete: function () {
    SpeechToText.removeEmptyRow()
    app.finishTime = ''
  },
  confirmBeforeUnload() {
    if (SpeechToText.hasContent()) {
      return i18n.t('Text will be reset. Are you sure?')
    }
  }
}

$(window).resize(function () {
  $('.caption textarea').css('height', '3rem').autogrow({vertical: true, horizontal: false, flickering: false})
})

window.onbeforeunload = SpeechToText.confirmBeforeUnload;