chrome.tabs.onUpdated.addListener((currentTabId, changeInfo, tab) => {
	// Get User access url ex) https://naver.com
	let userAccessURL = tab.url;

	// Find "http" word in userAccessURL
	let http_check = userAccessURL.indexOf("http");

	// Find "https" word in userAcessURL
	let https_check = userAccessURL.indexOf("https");

	// If https
	if(https_check == 0)
	{
		chrome.browserAction.setIcon({
			path: {"128": "/Icons/secure.png"},
			tabId: currentTabId
		});
	}
	// If http
	else if(http_check == 0)
	{
		chrome.browserAction.setIcon({
			path: {"128": "/Icons/warn.png"},
			tabId: currentTabId
		});
	}
	// Unkown
	else
	{
		console.log("Unkown");
	}

	// Get user input password
	chrome.tabs.executeScript({
        code:"document.addEventListener('click', function(){var elements = document.querySelectorAll('input[type=password]')[0]; if(elements) { var passwordName = elements.name; var passwordValue = elements.value; chrome.storage.local.set({ passwordInfo: [passwordName, passwordValue] }); } });"
    });
});

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

