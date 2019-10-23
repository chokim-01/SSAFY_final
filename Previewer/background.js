chrome.tabs.onUpdated.addListener((currentTabId, changeInfo, tab) => {
	// Get User access url ex) https://naver.com
	// Check http, https
	urlStatus = checkURL(tab.url);
	// If https
	if(urlStatus === "https")
	{
		chrome.browserAction.setIcon({
			path: {"38": "/Icons/38_secure.png"},
			tabId: currentTabId
		});
	}
	// If http
	else if(urlStatus === "http")
	{
		chrome.browserAction.setIcon({
			path: {"38": "/Icons/38_warning.png"},
			tabId: currentTabId
		});
	}
	// Unkown
	else
	{
		console.log("Unknown");
	}

	// Get user input password
	chrome.tabs.executeScript({
        code:"document.addEventListener('keyup', function(){var elements = document.querySelectorAll('input[type=password]')[0]; if(elements) { var passwordName = elements.name; var passwordValue = elements.value; chrome.storage.local.set({ passwordInfo: [passwordName, passwordValue] }); } });"
    });
});

chrome.webRequest.onBeforeRequest.addListener((requestData) => {
	// Request method check
	if(requestData.method == "POST")
	{
		checkPassword(requestData);
	}
},
{urls: ["<all_urls>"]},
["blocking", "requestBody"]
);

chrome.extension.onConnect.addListener((port) => {
    port.onMessage.addListener(async (message) => {
        if(message == "GET Site Data") {
          // get current tab info
          await chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            var currTab = tabs[0];
            if(currTab) { // Sanity check
              getsslData(currTab.url, port);
            }
          });
          secureCheck();
        }
    });
});

var checkURL = (url) => {
	// Find "http" word in userAccessURL
	let http_check = url.indexOf("http://");
	if(http_check == 0)
	{
		return "http"
	}
	// Find "https" word in userAcessURL
	let https_check = url.indexOf("https://");
	if(https_check == 0)
	{
		return "https"
	}
	return "unknown"
}

var getsslData = async (url, port) => {
  // Check HSTS, Get sslData
  await $.ajax({
    type: "POST",
    url: "http://localhost:5000/api/get/ssl",
    data: url,
    success: (data) => {
			// send to inject.js
			let httpStatus = checkURL(url)
			port.postMessage([httpStatus, data]);
			console.log(data);
    },
    error: (error) => {
      console.log(error)
    }
  });
}

var secureCheck = () => {
	// get current tab html
  chrome.tabs.executeScript({
    code:"document.querySelector('html').innerHTML"
  }, (result) => {
    console.log(result);
    $.ajax({
      type: "POST",
      url: "http://localhost:5000/api/get/check_secure",
      data: result[0],
      success: (data) => {
        console.log("check_secure")
        console.log(data);
      },
      error: (error) => {
        console.log(error)
      }
    });
  });
}

var checkPassword = (requestData) => {
	// Get user password parameter name and value in chrome local storage
	chrome.storage.local.get("passwordInfo", (data) => {
		if(data["passwordInfo"])
		{
			// If user send password to server
			let requestBody = requestData.requestBody;
			let passwordParameterName = data["passwordInfo"][0];
			let passwordValue = data["passwordInfo"][1];

			// Compare send server value and local storage value
			if(requestBody && requestBody.formData && requestBody.formData[passwordParameterName])
			{
				if(requestBody.formData[passwordParameterName] == passwordValue)
				{
					console.log("Un Secure");
				}
			}

			chrome.storage.local.remove("passwordInfo");
		}
	});
};
