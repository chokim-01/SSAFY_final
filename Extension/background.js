/* Click -> open inject.js */
chrome.browserAction.onClicked.addListener(
    function (tab) {
        console.log("Start section");
        chrome.tabs.executeScript(tab.id, {
        file: 'inject.js'
    });
});

/* New tab, url changed */
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    var url = tab.url;
    var findstr = "https://"
    var check_url = url.indexOf("http")
    if(url !== undefined && check_url != -1 && changeInfo.status == "complete") {
      console.log("tab changed");

      // Check https
      if(url.indexOf(findstr) == -1) {
          console.log("No https");
          chrome.browserAction.setIcon({
              path: { "19": "/Icons/icon_warn.png"},
              tabId: tabId
          });
      } else {
      // Check SSL
        await $.ajax({
            type: "POST",
            url: "http://localhost:5000/api/get/ssl",
            data: url,
            dataType: "html",
            success: function(data){
              alert("Find ssl");
              console.log(data);

              chrome.browserAction.setIcon({
                  path: { "19": "/Icons/icon_secure.png"},
                  tabId: tabId
              });

            },
            error: function(error) {
              console.log(error);
            }
        });
      }
    }
});

/* Maybe, Communication with js */
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
      // check pw is plaintext
      if(details.method == "POST") {
        let requestBody = details.requestBody
        if(requestBody && requestBody.formData && requestBody.formData.pw) {
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
