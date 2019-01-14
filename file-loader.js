
let loadFromUrl = function () {
  $('.ui.modal.load-from-url').modal('show')
}
$('.load-url-btn').click(loadFromUrl)

// ---------------------

/**
 * 程式開始時就先開始播放
 */
$(function () {
  setTimeout(function () {
    //$('.start-btn').click()
    //SpeechToText.addExampleRow(30)
    $('.load-url-btn').click()
  }, 3000)
})