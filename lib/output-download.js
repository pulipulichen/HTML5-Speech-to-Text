let downloadCaption = function () {
  let filetype = $('.output-data-type').val()
  if (filetype === 'srt') {
    downloadCaptionSrt()
  }
  else if (filetype === 'txt') {
    downloadCaptionTxt()
  }
  else if (filetype === 'ods') {
    downloadCaptionOds()
  }
  else if (filetype === 'caption') {
    downloadCaptionCaption()
  }
}

let downloadCaptionSrt = function () {
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
      ','+
      contentItem.start.millisecond +
      ' --> '+
      contentItem.end.hour +
      ':'+
      contentItem.end.minute +
      ':'+
      contentItem.end.second +
      ','+
      contentItem.end.millisecond)
    item.push(contentItem.caption)
    content[i] = item.join('\n')
  }
  content = content.join('\n\n')

  downloadAsFile(title, content)
}

let downloadCaptionTxt = function () {
  let filetype = $('.output-data-type').val()
  let title = $('.filename').val().trim() + '.' + filetype

  let content = SpeechToText.getContent()
  for (let i = 0; i < content.length; i++) {
    let contentItem = content[i]
    let item = []
    // 45
    // 00:02:52,184 --> 00:02:53,617
    // 慢慢来

    item.push(contentItem.start.hour +
      ':'+
      contentItem.start.minute +
      ':'+
      contentItem.start.second +
      ':'+
      contentItem.start.millisecond +
      ','+
      contentItem.end.hour +
      ':'+
      contentItem.end.minute +
      ':'+
      contentItem.end.second +
      ':'+
      contentItem.end.millisecond)
    item.push(contentItem.caption)
    content[i] = item.join(',')
  }
  content = content.join('\n')

  downloadAsFile(title, content)
}


let downloadCaptionCaption = function () {
  let title = $('.filename').val().trim() + '-caption.txt'

  let content = SpeechToText.getContent()
  for (let i = 0; i < content.length; i++) {
    let contentItem = content[i]
    content[i] = contentItem.caption
  }
  content = content.join('\n')

  downloadAsFile(title, content)
}

let downloadCaptionOds = function () {
  //let filetype = $('.output-data-type').val()
  //let title = $('.filename').val().trim() + '.' + filetype

  let content = SpeechToText.getContent()
  
  for (let i = 0; i < content.length; i++) {
    let contentItem = content[i]
    content[i].start = contentItem.start.hour +
      ':'+
      contentItem.start.minute +
      ':'+
      contentItem.start.second +
      ':'+
      contentItem.start.millisecond
    content[i].end = contentItem.end.hour +
      ':'+
      contentItem.end.minute +
      ':'+
      contentItem.end.second +
      ':'+
      contentItem.end.millisecond
  }
  
  xlsx_helper_ods_download($('.filename').val().trim(), content)
}

$('.button.download-btn').click(downloadCaption)
