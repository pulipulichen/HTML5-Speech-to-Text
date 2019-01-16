
let openLoadFromUrlModel = function () {
  $('.ui.modal.load-from-url').modal('show')
}
$('.open-load-url-model-btn').click(openLoadFromUrlModel)

let getFullFilenameFromURL = function (url) {
  if (typeof(url) !== 'string') {
    return
  }

  // Remove everything to the last slash in URL
  url = url.substr(1 + url.lastIndexOf("/"));

  // Break URL at ? and take first part (file name, extension)
  url = url.split('?')[0];

  // Sometimes URL doesn't have ? but #, so we should aslo do the same for #
  url = url.split('#')[0];

  // Now we have only extension
  return url;
}

let getExtFromURL = function (url) {
  if (typeof(url) !== 'string') {
    return
  }

  // Remove everything to the last slash in URL
  url = getFullFilenameFromURL(url)

  if (url.lastIndexOf('.') > -1) {
    url = url.slice(url.lastIndexOf('.')+1, url.length)
  }

  // Now we have only extension
  return url.toLowerCase();
}

let getFilenameFromURL = function (url) {
  if (typeof(url) !== 'string') {
    return
  }

  // Remove everything to the last slash in URL
  url = getFullFilenameFromURL(url)

  if (url.lastIndexOf('.') > -1) {
    url = url.slice(0, url.lastIndexOf('.'))
  }

  // Now we have only extension
  return url;
}

var URL = window.URL || window.webkitURL
/*
 * 
var displayMessage = function (message, isError) {
  var element = document.querySelector('#message')
  element.innerHTML = message
  element.className = isError ? 'error' : 'info'
}
*/

var playSelectedFile = function (event) {
  var file = this.files[0]
  if (file === undefined) {
    return
  }
  
  var type = file.type
  var fullFilename = file.name
  var filename = getFilenameFromURL(fullFilename)
  app.setFilename(filename)
 
  //console.log(file)
  //console.log(type)
  var videoNode, template
  if (type === 'video/mp4') {
    if ($('#audio_player video').length === 0) {
      template = app.$data.playerTemplate.video
      template = template.split('{{URL}}').join('')
      $('#audio_player').html(template)
    }
    videoNode = document.querySelector('video')
  }
  else {
    if ($('#audio_player audio').length === 0) {
      template = app.$data.playerTemplate.audio
      template = template.split('{{URL}}').join('')
      
      var mime = type
      template = template.split('{{MIME_TYPE}}').join(mime)
      
      template = template.split('{{FILENAME}}').join(filename)
      
      $('#audio_player').html(template)
    }
    videoNode = document.querySelector('audio')
  }
  //var videoNode = document.querySelector('video')

  var canPlay = videoNode.canPlayType(type)
  if (canPlay === '') canPlay = 'no'
  var message = 'Can play type "' + type + '": ' + canPlay
  var isError = canPlay === 'no'
  //displayMessage(message, isError)

  if (isError) {
    return
  }

  var fileURL = URL.createObjectURL(file)
  videoNode.src = fileURL
  app.clearLoadFromURLValue()
  app.reset()
}

var inputNode = document.getElementById('local_file')
$('.open-load-local-file-model-btn').click(function () {
  //inputNode.click()
  //console.log('aaa')
  $('#local_file').click();

})
inputNode.addEventListener('change', playSelectedFile, false)

// ---------------------

/**
 * 程式開始時就先開始播放
 */
$(function () {
  setTimeout(function () {
    //$('.start-btn').click()
    //SpeechToText.addExampleRow(30)
    //$('.open-load-url-model-btn').click()
  }, 1000)
})