/* Click -> open inject.js */
chrome.browserAction.onClicked.addListener(
    function (tab) {
        console.log("Start section");
        chrome.tabs.executeScript(tab.id, {
        file: 'inject.js'
    });
});

/* New tab, url changed */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    var url = tab.url;
    var findstr = "https://"
    if (url !== undefined && changeInfo.status == "complete") {
      console.log("tab changed");

      // Check https
      if(url.indexOf(findstr) == -1) {
          console.log("No https");
      }
});

/* Communication with js */
chrome.runtime.onConnect.addListener(function(port) {
    console.log("Call onConnect");
    port.onMessage.addListener(function(Message) {
        console.log(Message);
        console.log(port);
    });
});

/* The Web Request API */
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      if(details.method == "POST") {
        console.log(details)
        let pw = details.requestBody.formData
        if(pw && pw.pw) {
            if(pw.pw[0] == "test") {
              alert("Un secured");
              window.location.reload();
              return { cancel: true };
          }
        }
      }
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestBody"]
);
