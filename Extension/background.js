var httpStatus;
var sslData;

/* New tab, url changed */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    url = tab.url;
    let check_url = url.indexOf("http");

    if(url !== undefined && check_url != -1 && changeInfo.status == "complete") {
      console.log("tab changed");

      let findstr = "https://";
      // click, type password exist : pw data transfer
      chrome.tabs.executeScript({
        code:"document.addEventListener('click', function(){var elements = document.querySelectorAll('input[type=password]')[0]; if(elements) { var passwordName = elements.name; var passwordValue = elements.value; chrome.storage.local.set({ passwordInfo: [passwordName, passwordValue] }); } });"
      });

      // Check https
      if(url.indexOf(findstr) == -1) {
        console.log("No https");
        httpStatus = "http";
        // Set icon warn state
        chrome.browserAction.setIcon({
          path: { "19": "/Icons/icon_warn.png"},
          tabId: tabId
        });
      } else {
        httpStatus = "https";
        sslFlag = getsslData(url, tabId, 0);
        if(sslFlag) {
          // Set icon secure state
          chrome.browserAction.setIcon({
            path: { "19": "/Icons/icon_secure.png"},
            tabId: tabId
          });
        }
    }
  }
});

/* The Web Request API */
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      // check pw is plaintext
      if(details.method == "POST") {
        return checkPassword(details);
      }
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestBody"]
);

/* call by inject.js, call ssl data send to inject.js */
chrome.extension.onConnect.addListener(function (port) {
    port.onMessage.addListener(async function (message) {
        if(message == "Request Modified Value") {
          // get current tab id
          await chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currTab = tabs[0];
            if(currTab) { // Sanity check
              getsslData(currTab.url, currTab, port);
            }
          });
        }
    });
});

var getsslData = async function(url, tabId, port) {
  // Check SSL
  await $.ajax({
    type: "POST",
    url: "http://localhost:5000/api/get/ssl",
    data: url,
    success: function(data){
      sslData = data;
    },
    error: function(error) {
      console.log(error)
    }
  });
  if(port !== 0){
    port.postMessage([httpStatus, sslData]);
  }
}

var checkPassword = function(details) {

  return chrome.storage.local.get('passwordInfo', function (items) {
    if(items['passwordInfo']){
      let requestBody = details.requestBody
      let passwordName = items['passwordInfo'][0];
      let passwordValue = items['passwordInfo'][1];

      if(requestBody && requestBody.formData && requestBody.formData[passwordName]) {
        if(requestBody.formData[passwordName] == passwordValue) {
          alert("Un secured");
          return {cancel: true}
        }
      }
      chrome.storage.local.remove('passwordInfo');
    }
  });
}
