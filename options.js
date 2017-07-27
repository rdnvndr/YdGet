document.getElementById('tokenLabel').innerHTML = chrome.i18n.getMessage('tokenLabel');
document.getElementById('pathLabel').innerHTML = chrome.i18n.getMessage('pathLabel');
document.getElementById('saveButton').innerHTML = chrome.i18n.getMessage('saveButton');
document.getElementById('pageTitle').innerHTML = chrome.i18n.getMessage('pageTitle');
document.getElementById('pageHead').innerHTML = chrome.i18n.getMessage('pageTitle');

document.body.onload = function() {
  chrome.storage.sync.get({"token":"", "path":"disk:/Downloads"}, function(items) {
    if (!chrome.runtime.error) {
        document.getElementById("token").value = items.token;
        document.getElementById("path").value = items.path;
    }
  });
}

document.getElementById("saveButton").onclick = function() {
  var token = document.getElementById("token").value;
  var path = document.getElementById("path").value;
  chrome.storage.sync.set({ "token" : token, "path" : path}, function() {

  });
  window.close();
}