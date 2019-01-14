let SpeechToText = {
  tbody: $('tbody.text-content'),
  player: $('.audio-player'),
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

let startBtn = document.querySelector('.start-btn')
let audioPlay = document.querySelector('.audio-player')
// audioPlay.playbackRate = 0.8

let recognition = new webkitSpeechRecognition()
// set params
recognition.continuous = false
recognition.interimResults = true
adjustStartSecond = -0.5
adjustEndSecond = 0.5

// start immediately
// recognition.start();


let playingFlag = false
let currentCaption
startBtn.addEventListener('click', function () {
  recognition.lang = $('.lang').val()
  
  $('.recognition-status').attr('data-recognition-status', 'wait')
  
  playingFlag = true
  SpeechToText.addRow()
  
  var errorCount = 0

  var startRecognition = function () {
    try {
      audioPlay.play()
    }
    catch (e) {
      errorCount++
      console.log('Audio player load failed (' + errorCount + ')')
      
      if (errorCount > 3) {
        if (window.confirm('Audio player is broken. Do you want to refresh this page?')) {
          location.reload()
        }
        return 
      }
      
      setTimeout(function () {
        startRecognition()
      }, 0)
      return
    }

    setTimeout(() => {
      recognitionFinish()
    }, (audioPlay.duration * 1000 + 100))

    // $('<div>0:00</div>').insertBefore(text)
    recognition.start()

    //document.querySelector('.text-content').style.display = 'block'
    $('.text-content').removeClass('hide')
  }
  startRecognition()
})

let recognitionFinish = function () {
  recognition.stop()
  playingFlag = false
  SpeechToText.removeEmptyRow()
  $('.content-controller .button.disabled').removeClass('disabled')
  $('.recognition-status').attr('data-recognition-status', 'finish')
}

recognition.onresult = function (event) {
  let result = event.results[ event.results.length - 1 ]
  // let section = $('<div></div>').text(result[result.length - 1 ].transcript)
  // $(text).append(section);
  let transcript = result[ result.length - 1 ].transcript.trim()
  let caption = SpeechToText.getCaption()
  if (caption === '' && transcript !== '') {
    SpeechToText.setStart(SpeechToText.getPlayerCurrentTime(adjustStartSecond))
  }
  SpeechToText.setCaption(transcript)
}

// speech error handling
recognition.onerror = function (event) {
  console.log('error', event)
}

recognition.onend = function () {
  let caption = SpeechToText.getCaption()
  if (caption !== '') {
    SpeechToText.setEnd(SpeechToText.getPlayerCurrentTime(adjustEndSecond))
  }
  console.log('end')
  // auto restart
  if (playingFlag === true) {
    if (caption !== '') {
      SpeechToText.addRow()
    }
    recognition.start()
  }
}

$(window).resize(function () {
  $('.caption textarea').css('height', '3rem').autogrow({vertical: true, horizontal: false, flickering: false})
})

let downloadCaption = function () {
  let filetype = $('.output-data-type').val()
  let title = $('.filename').val().trim() + '.' + filetype

  let content = SpeechToText.getContent()
  for (let i = 0; i < content.length; i++) {
    let contentItem = content[i]
    let item = []
    // 45
    // 00:02:52,184 --> 00:02:53,617
    // 慢慢来

    item.push((i + 1))
    item.push(contentItem.start.hour +
      ':'+
      contentItem.start.minute +
      ':'+
      contentItem.start.second +
      ':'+
      contentItem.start.millisecond +
      ' --> '+
      contentItem.end.hour +
      ':'+
      contentItem.end.minute +
      ':'+
      contentItem.end.second +
      ':'+
      contentItem.end.millisecond)
    item.push(contentItem.caption)
    content[i] = item.join('\n')
  }
  content = content.join('\n\n')

  downloadAsFile(title, content)
}
$('.button.download-btn').click(downloadCaption)

/**
 * 程式開始時就先開始播放
 */
$(function () {
  setTimeout(function () {
    //$('.start-btn').click()
    //SpeechToText.addExampleRow(30)
  }, 3000)
})