
/* global SpeechToText, app */

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

settingExceptionCases = {
  'cmn-Hant-TW': ['巧虎', '彩虹', 'trial', 'iO', 'trials'],
  'cmn-Hans-CN': ['巧虎', '彩虹', 'trial', 'iO', 'trials'],
  'en-US': ['巧虎', '彩虹', 'trial', 'iO', 'trials'],
}

let playingFlag = false
let currentCaption
let settingExceptionCount
startBtn.addEventListener('click', function () {
  audioPlay = document.querySelector('.audio-player')
  let customLang = $('#customLang').val()
  if (customLang.trim() === '') {
    recognition.lang = $('.lang').val()
  }
  else {
    recognition.lang = customLang.trim()
  }
  console.log(recognition.lang)
  
  $('.recognition-status').attr('data-recognition-status', 'wait')
  
  playingFlag = true
  //SpeechToText.setPlayer()
  SpeechToText.addRow()
  
  var errorCount = 0
  settingExceptionCount = 0

  var startRecognition = function () {
    try {
      //audioPlay.play()
      SpeechToText.play()
    }
    catch (e) {
      console.log(e)
      errorCount++
      console.log('Audio player load failed (' + errorCount + ')')
      
      if (errorCount > 3) {
        if (window.confirm('Audio player is broken. Do you want to refresh this page?')) {
          location.reload()
        }
        return null
      }
      setTimeout(function () {
        //console.log('被暫停了1', SpeechToText.getPlayerCurrentTime(), SpeechToText.getDuration())
        startRecognition()
      }, 0)
    }
    
    /**
     * 改在另外的地方關閉
     */
    //setTimeout(() => {
    //  recognitionFinish()
    //}, (SpeechToText.getDuration() * 1000 + 100))
    //console.log(audioPlay.duration * 1000 + 100)

    // $('<div>0:00</div>').insertBefore(text)
    recognition.setFinishEvent()
    recognition.start()

    //document.querySelector('.text-content').style.display = 'block'
    $('.text-content').removeClass('hide')
  }
  startRecognition()
})

let recognitionFinish = function () {
  recognition.stop()
  playingFlag = false
  $('.content-controller .button.disabled').removeClass('disabled')
  $('.recognition-status').attr('data-recognition-status', 'finish')
  SpeechToText.complete()
  //console.log('finish')
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
  
  // 偵錯
  if (Array.isArray(settingExceptionCases[recognition.lang]) && settingExceptionCases[recognition.lang].indexOf(transcript) > -1) {
    settingExceptionCount++
    if (settingExceptionCount === 3) {
      settingExceptionCount = 0
      app.openVirtualAudioCableHelpModel()
    }
  }
  
}

// speech error handling
recognition.onerror = function (event) {
  console.log('error', event)
}

let lastPauseTime = 0
recognition.onend = function () {
  let caption = SpeechToText.getCaption()
  if (caption !== '') {
    SpeechToText.setEnd(SpeechToText.getPlayerCurrentTime(adjustEndSecond))
  }
  //console.log('end')
  // auto restart
  if (playingFlag === true) {
    if (caption !== '') {
      SpeechToText.addRow()
    }
    //console.log('被暫停了2', SpeechToText.getCurrentTime(), SpeechToText.getDuration())
    if (SpeechToText.getCurrentTime() < 30
        || (SpeechToText.getCurrentTime() - lastPauseTime) < 30) {
      recognition.setFinishEvent()
      recognition.start()
    }
    else {
      console.log('現在暫停休息中', SpeechToText.getCurrentTime(), SpeechToText.getDuration())
      lastPauseTime = SpeechToText.getCurrentTime()
      SpeechToText.pause()
      recognition.clearFinishEvent()
      settingExceptionCount = 0
      setTimeout(() => {
        recognition.start()
        SpeechToText.play()
        recognition.setFinishEvent()
      }, 3000)
    }
  }
}

let finishTimer
recognition.clearFinishEvent = function () {
  clearTimeout(finishTimer)
}
recognition.setFinishEvent = function () {
  let time = SpeechToText.getDuration() - SpeechToText.getCurrentTime()
  time = (time * 1000) + 100
  //console.log([SpeechToText.getDuration(), SpeechToText.getCurrentTime()])
  
  console.log('重新設定結束時間', time)
  clearTimeout(finishTimer)
  finishTimer = setTimeout(() => {
    clearTimeout(finishTimer)
    console.log('結束了')
    recognitionFinish()
  }, time)
  //console.log(audioPlay.duration * 1000 + 100)
}