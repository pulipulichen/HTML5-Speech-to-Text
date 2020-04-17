
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

let pauseInterval = 30 * 60
let pauseSeconds = 3

// start immediately
// recognition.start();

settingExceptionCases = {
  'cmn-Hant-TW': ['台', '桃', '巧虎', '彩虹', 'trial', 'iO', 'trials'],
  'cmn-Hans-CN': ['台', '桃', '巧虎', '彩虹', 'trial', 'iO', 'trials'],
  'en-US': ['巧虎', '彩虹', 'trial', 'iO', 'trials'],
}
let disableExceptionCount = false

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

let tempStart
let tempTransscript
recognition.onresult = function (event) {
  let result = event.results[ event.results.length - 1 ]
  // let section = $('<div></div>').text(result[result.length - 1 ].transcript)
  // $(text).append(section);
  let transcript = result[ result.length - 1 ].transcript.trim()
  let caption = SpeechToText.getCaption()
  if (caption === '' && transcript !== '' && !tempStart) {
    tempStart = SpeechToText.getPlayerCurrentTime(adjustStartSecond)
    //SpeechToText.setStart(SpeechToText.getPlayerCurrentTime(adjustStartSecond))
  }
  tempTransscript = transcript
  
  // 偵錯
  if (disableExceptionCount === false 
          && Array.isArray(settingExceptionCases[recognition.lang]) 
          && settingExceptionCases[recognition.lang].indexOf(transcript) > -1) {
    settingExceptionCount++
    if (settingExceptionCount === 3) {
      //settingExceptionCount = 0
      app.openVirtualAudioCableHelpModel()
    }
  }
  else {
    disableExceptionCount = true
  }
  
}

// speech error handling
recognition.onerror = function (event) {
  console.log('error', event)
}

let lastPauseTime = 0
recognition.onend = function () {
  let hasAdd = true
  if (tempTransscript) {
    if (Array.isArray(settingExceptionCases[recognition.lang]) 
          && settingExceptionCases[recognition.lang].indexOf(tempTransscript) > -1) {
      tempStart = null
      tempTransscript = null
      hasAdd = false
    }
    else {
      SpeechToText.setStart(tempStart)
      SpeechToText.setCaption(tempTransscript)
      tempStart = null
      tempTransscript = null
    }
  }
  
  let caption = SpeechToText.getCaption()
  if (caption !== '' && hasAdd === true) {
    SpeechToText.setEnd(SpeechToText.getPlayerCurrentTime(adjustEndSecond))
  }
  //console.log('end')
  // auto restart
  if (playingFlag === true) {
    if (caption !== '' && hasAdd === true) {
      SpeechToText.addRow()
    }
    
    //console.log('被暫停了2', SpeechToText.getCurrentTime(), SpeechToText.getDuration())
    if (SpeechToText.getCurrentTime() < pauseInterval
        || (SpeechToText.getCurrentTime() - lastPauseTime) < pauseInterval) {
      recognition.setFinishEvent()
      recognition.start()
    }
    else {
      console.log('現在暫停休息中', window.performance.memory)
      lastPauseTime = SpeechToText.getCurrentTime()
      SpeechToText.pause()
      recognition.clearFinishEvent()
      //settingExceptionCount = 0
      //console.log(window.performance)
      setTimeout(() => {
        recognition.start()
        SpeechToText.play()
        recognition.setFinishEvent()
      }, pauseSeconds * 1000)
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
  
  //console.log('重新設定結束時間', time)
  clearTimeout(finishTimer)
  finishTimer = setTimeout(() => {
    clearTimeout(finishTimer)
    console.log('結束了')
    recognitionFinish()
  }, time)
  //console.log(audioPlay.duration * 1000 + 100)
}