function showMessage(title, message) {
    var opt = {
        type: 'basic',
        iconUrl: 'yd-128.png',
        title: title,
        message: message
    };
    chrome.notifications.create("",opt, function(id) {
        timer = setTimeout(function(){chrome.notifications.clear(id);}, 3000);
    });
}

function getStatus(href, token, link) {
    var request = new XMLHttpRequest();

    request.open("GET", href);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', 'OAuth ' + token);
    request.onload = function() {
        var obj = JSON.parse(request.responseText);
        if (obj.status == "in-progress") {
            timer = setTimeout(function(){}, 1000);
            getStatus(href, token, link);
        } else {
            var text = obj.status == "success"
                    ?  "Download successful" : "Download failure";
            showMessage(text, link);
        }
    }
    request.send();
};

function getClickHandler() {
    return function(info, tab) {
        chrome.storage.sync.get("token", function(items) {
            if (!chrome.runtime.error) {
                var token = items.token;
                var link = info.linkUrl != null ? info.linkUrl : info.srcUrl;
                var filename = link.lastIndexOf("/") > -1
                        ? link.substr(link.lastIndexOf("/") + 1) : "";
                if (filename == "") {
                    filename = link.replace("http://","")
                    .replace("https://","").replace("/","") + ".html";
                }
                var url = encodeURIComponent(link);

                var path = encodeURIComponent('disk:/Downloads/' + filename);

                var request = new XMLHttpRequest();

                request.open("POST", 'https://cloud-api.yandex.net:443/v1/disk/resources/upload?disable_redirects=false'+"&url=" + url + "&path=" + path);
                request.setRequestHeader('Accept', 'application/json');
                request.setRequestHeader('Content-Type', 'application/json');
                request.setRequestHeader('Authorization', 'OAuth ' + token);

                request.onload = function() {
                    var obj = JSON.parse(request.responseText);
                    getStatus(obj.href, token, link);
                }
                request.send();
            }
        });
    };
};

chrome.contextMenus.create
        ({
             "title" : "Download to Yandex disk",
             "type" : "normal",
             "contexts" : ["image","link"],
             "onclick" : getClickHandler()
         });
