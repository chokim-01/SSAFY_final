/* Click -> open inject.js */
var sslData;
var httpStatus;
/* New tab, url changed */
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    let url = tab.url;
    let findstr = "https://";
    let check_url = url.indexOf("http");

    if(url !== undefined && check_url != -1 && changeInfo.status == "complete") {
      console.log("tab changed");

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
        // Check SSL
        await $.ajax({
            type: "POST",
            url: "http://localhost:5000/api/get/ssl",
            data: url,
            success: function(data){
              sslData = data;
              // Set icon secure state
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

/* call by inject.js, call ssl data send to inject.js */
chrome.extension.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (message) {
        if (message == "Request Modified Value") {
            port.postMessage([httpStatus, sslData]);
        }
    });
});
