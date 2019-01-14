
let startBtn = document.querySelector('.start-btn')
let audioPlay
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
  audioPlay = document.querySelector('.audio-player')
  recognition.lang = $('.lang').val()
  
  $('.recognition-status').attr('data-recognition-status', 'wait')
  
  playingFlag = true
  //SpeechToText.setPlayer()
  SpeechToText.addRow()
  
  var errorCount = 0

  var startRecognition = function () {
    try {
      //audioPlay.play()
      SpeechToText.audioPlay()
    }
    catch (e) {
      console.log(e)
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
    }
    
    setTimeout(() => {
      recognitionFinish()
    }, (SpeechToText.getDuration() * 1000 + 100))
    //console.log(audioPlay.duration * 1000 + 100)

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
  console.log('finish')
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

// ---------------------

/**
 * 程式開始時就先開始播放
 */
$(function () {
  setTimeout(function () {
    //$('.start-btn').click()
    //SpeechToText.addExampleRow(30)
  }, 1000)
})