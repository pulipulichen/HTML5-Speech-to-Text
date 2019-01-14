let SpeechToText = {
  tbody: $('tbody.text-content'),
  player: null,
  setPlayer: function () {
    this.player = $('.audio-player')
  },
  audioPlay: function () {
    if (this.player === null) {
      this.setPlayer()
    }
    if (this.player.hasClass('youtube') === false) {
      this.player.play()
    }
    else {
      this.player[0].src += "&autoplay=1";
    }
  },
  addRow: function () {
    if (this.isLastRowEmpty()) {
      return
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
  setCaption: function (caption) {
    let textarea = this.tbody.find('tr:last .caption textarea')
    textarea.val(caption.trim()).autogrow({vertical: true, horizontal: false, flickering: false})

  },
  setStart: function (time) {
    [hour, minute, second, millisecond, currentTime] = time
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
    [hour, minute, second, millisecond, currentTime] = time
    let timeField = this.tbody.find('tr:last .end')
    timeField.find('.hour').val(hour)
    timeField.find('.minute').val(minute)
    timeField.find('.second').val(second)
    timeField.find('.millisecond').val(millisecond)
    timeField.attr('currentTime', currentTime)
  },
  getPlayerCurrentTime: function (adjust) {
    let currentTime = this.player.prop('currentTime')
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
  getContent: function () {
    let content = []
    this.tbody.find('tr').each((i, tr) => {
      tr = $(tr)
      let item = {}
      item.start = {
        hour: tr.find('.start .hour').val(),
        minute: tr.find('.start .minute').val(),
        second: tr.find('.start .second').val(),
        millisecond: tr.find('.start .millisecond').val(),
      }
      item.end = {
        hour: tr.find('.end .hour').val(),
        minute: tr.find('.end .minute').val(),
        second: tr.find('.end .second').val(),
        millisecond: tr.find('.end .millisecond').val(),
      }
      item.caption = tr.find('.caption textarea').val().trim(),

      content.push(item)
    })
    return content
  }
}
