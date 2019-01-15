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
$('.button.download-btn').click(downloadCaption)
