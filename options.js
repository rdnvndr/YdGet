document.body.onload = function() {
  chrome.storage.sync.get("token", function(items) {
    if (!chrome.runtime.error) {
      document.getElementById("token").value = items.token;
    }
  });
}

document.getElementById("save").onclick = function() {
  var token = document.getElementById("token").value;
  chrome.storage.sync.set({ "token" : '' }, function() {

  });
  window.close();
}
