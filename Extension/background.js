chrome.browserAction.onClicked.addListener(
    function (tab) {
        console.log("Start section");
        chrome.tabs.executeScript(tab.id, {
        file: 'inject.js'
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log("tab url");
    console.log(tab.url);
});