
let openLoadFromUrlModel = function () {
  $('.ui.modal.load-from-url').modal('show')
}
$('.open-load-url-model-btn').click(openLoadFromUrlModel)

let getFullFilenameFromURL = function (url) {
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
    // Remove everything to the last slash in URL
    url = getFullFilenameFromURL(url)
    
    if (url.lastIndexOf('.') > -1) {
      url = url.slice(url.lastIndexOf('.')+1, url.length)
    }

    // Now we have only extension
    return url.toLowerCase();
}

let getFilenameFromURL = function (url) {
    // Remove everything to the last slash in URL
    url = getFullFilenameFromURL(url)
    
    if (url.lastIndexOf('.') > -1) {
      url = url.slice(0, url.lastIndexOf('.'))
    }

    // Now we have only extension
    return url;
}

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