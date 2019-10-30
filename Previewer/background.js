var dataTransferCheck = {};

chrome.tabs.onUpdated.addListener((currentTabId, changeInfo, tab) => {
	// Get User access url ex) https://naver.com
	url = tab.url;

	if(url !== undefined && changeInfo.status ==="complete")
	{
		// Get user input password
		chrome.tabs.executeScript({
      code:"document.addEventListener('keyup', function(){var elements = document.querySelectorAll('input[type=password]')[0]; if(elements) { var passwordName = elements.name; var passwordValue = elements.value; chrome.storage.local.set({ passwordInfo: [passwordName, passwordValue] }); } });"
    });
	}
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
        if(message[0] === "GET Site Data") {
          // get current tab info
          await chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            var currTab = tabs[0];
            if(currTab && checkURL(currTab.url) !== "unknown") { // Sanity check
              getsiteData(currTab, port);
            }
          });
        } else if(message[0] === "Get Session Data") {
					// If session already exists
					if(sessionStorage.length > 0) {
						let email = sessionStorage.getItem('email');
						let grade = sessionStorage.getItem('grade');
						port.postMessage([email, grade]);
					}
				} else if(message[0] === "Login") {
					signIn(message[1], message[2], port);
				} else if(message[0] === "Logout") {
					sessionStorage.clear();
				}
    });
});

var checkURL = (url) => {
	// Find "http" word in userAccessURL
	let http_check = url.indexOf("http://");
	// Find "https" word in userAcessURL
	let https_check = url.indexOf("https://");
	let result = "";

	if(http_check == 0) {
		result = "http";
	}
	else if(https_check == 0) {
		result = "https";
	}
	else {
		result = "unknown";
	}
	return result;
}

var signIn = async (email, password, port) => {
  // Check HSTS, Get sslData
  await $.ajax({
    type: "POST",
    url: "http://52.79.152.29:5000/post/chrome/signIn",
    data: {email:email, password:password},
    success: (data) => {
			// sessionStorage setItem
			sessionStorage.setItem('email',data['email'])
			port.postMessage(data)
    },
    error: (error) => {
    }
  });
}

var getsiteData = async (tab, port) => {
  // Check HSTS, Get sslData
  await $.ajax({
    type: "POST",
    url: "http://52.79.152.29:5000/post/hsts",
    data: tab.url,
    success: (data) => {
			// send to inject.js
			let urlStatus = checkURL(tab.url)
			port.postMessage([dataTransferCheck[tab.id], urlStatus, data]);
			console.log(data);
    },
    error: (error) => {
    }
  });
}

var checkPassword = (requestData) => {
	// Get user password parameter name and value in chrome local storage
	chrome.storage.local.get("passwordInfo", async (data) => {
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
					await chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
						var currTab = tabs[0];
						dataTransferCheck[currTab.id] = true;
					});
					console.log("Un Secure");
				}
			}

			chrome.storage.local.remove("passwordInfo");
		}
	});
};
