

// ---------------------

/**
 * 程式開始時就先開始播放
 */
$(function () {
  setTimeout(function () {
    //$('.start-btn').click()
    //SpeechToText.addExampleRow(30)
    
xlsx_helper_ods_download('t', {
  "Sheet1": [
    {
      "key1": "value1-1",
      "key2": "value1-2"
    },
    {
      "key1": "value2-1",
      "key2": "value2-2"
    }
  ]
})
    
  }, 1000)
})