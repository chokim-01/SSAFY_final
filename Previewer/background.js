var dataTransferCheck = {};
var phishingSite = [];
var tabHistory = new Queue();

chrome.tabs.onCreated.addListener((tab) => {
	getSite();
});

chrome.tabs.onUpdated.addListener((currentTabId, changeInfo, tab) => {
	// Get User access url ex) https://naver.com
	url = tab.url;
	exception_url = url.indexOf("chrome://")

	if(exception_url !== 0 && changeInfo.status ==="complete")
	{
		// Get user input password
		chrome.tabs.executeScript({
      code:"document.addEventListener('keyup', function(){var elements = document.querySelectorAll('input[type=password]')[0]; if(elements) { var passwordName = elements.name; var passwordValue = elements.value; chrome.storage.local.set({ passwordInfo: [passwordName, passwordValue] }); } });"
    });
		// check & extension icon change
		checkSite(tab);
		console.log(tabHistory)
	}
});

chrome.webRequest.onBeforeRequest.addListener((requestData) => {
	// Request method check
	let urlBeforeConnect = requestData.url.replace("http://", "").replace("https://", "")
	for(data of phishingSite) {
		if(urlBeforeConnect == data.url || urlBeforeConnect == data.url+"/") {
			let flagPhishing = confirm("피싱사이트로 탐지되었습니다. 정말로 연결하시겠습니까?")
			if(!flagPhishing) {
				return {cancel: true}
			}
		}
	}
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
							xssCheck(currTab, port);
							phishingCheck(currTab, port);
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
				} else if(message[0] === "PhishingSite") {
					sendSite(message[1], port);
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

var checkSite = async (tab) => {
	chrome.storage.local.set({"iconChange":false});
	let stringTab = String(tab.id)

	// data plaintext check
 	if(dataTransferCheck[tab.id]) {
		chrome.storage.local.set({"iconChange":true});
 		setIcon("warn", tab.id);
 	} else {
		dataTransferCheck[tab.id] = false;
	}
	chrome.storage.local.set({"data1":dataTransferCheck[tab.id]});

 	// Phishing
 	await phishingCheck(tab, null);
 	// XSS
 	await xssCheck(tab, null);
	// hsts & https
 	await getsiteData(tab, null);

 	await chrome.storage.local.get(['iconChange'], (res) => {
	 	if(res['iconChange'] !== true){
		 	setIcon("secure",tab.id);
	 	}
	chrome.storage.local.get("tabHistory", (res) => {

		chrome.storage.local.get(['data1','data2','data3','data4','data5'], (res) => {
				let datas = {'url': tab.url, 'data1': res.data1,'data2': res.data2,'data3': res.data3,'data4': res.data4,'data5': res.data5}

				if(tabHistory.size() >= 3) {
					tabHistory.dequeue();
					tabHistory.enqueue(datas);
				} else {
					tabHistory.enqueue(datas);
				}
				chrome.storage.local.set({"tabHistory": tabHistory})

			chrome.storage.local.remove(['data1','data2','data3','data4','data5']);
		});
	});
 });

 chrome.storage.local.remove(['iconChange']);
}

var signIn = async (email, password, port) => {
	// Check HSTS, Get sslData
  await $.ajax({
    type: "POST",
    url: "http://52.79.152.29:5000/post/chrome/signIn",
    data: {email:email, password:password},
    success: (data) => {
			// sessionStorage setItem
			if(data['status'] === "success")
			sessionStorage.setItem('email', data['email'])
			sessionStorage.setItem('email', data['grade'])
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
			let urlStatus = checkURL(tab.url);
			chrome.storage.local.set({"data2":urlStatus});
			chrome.storage.local.set({"data3":data['hsts']});

			if(port == null){
				if(!data['hsts'] || urlStatus !=='https'){
					chrome.storage.local.set({"iconChange":true})
					setIcon("warn", tab.id);
				}
			}
			else {
				chrome.storage.local.get(['xssFlag', 'phishingFlag'], (res) => {
					let xssFlag = res.xssFlag;
					let phishingFlag = res.phishingFlag;
					port.postMessage([dataTransferCheck[tab.id], urlStatus, data, xssFlag, phishingFlag]);
					chrome.storage.local.remove(['xssFlag','phishingFlag']);
				});
			}
		},
    error: (error) => {
    }
  });
}

var xssCheck = (tab, port) => {
	// get current tab html
  chrome.tabs.executeScript({
    code:"document.documentElement.innerHTML"
  }, (result) => {
		if(result[0]) {
     		$.ajax({
      		type: "POST",
      		url: "http://52.79.152.29:5000/post/chrome/xssCheck",
      		data: result[0],
					async: false,
      		success: (data) => {
						chrome.storage.local.set({"data4":data['xssFlag']});
						if(port == null && data['xssFlag']){
							chrome.storage.local.set({"iconChange":true})
							setIcon("danger",tab.id)
						}
						else if (port != null){
							chrome.storage.local.set({"xssFlag":data['xssFlag']})
						}
      	},
      	error: (error) => {
      	}
    	});
		}
	});
}

function Queue() {
	this.dataStore = [];
	this.enqueue = enqueue;
	this.dequeue = dequeue;
	this.size = size;
}

function enqueue(element) {
	this.dataStore.push(element);
}

function dequeue() {
	this.dataStore.shift();
}

function size() {
	return this.dataStore.length;
}

var phishingCheck = async (tab, port) => {
  // Check HSTS, Get sslData
  await $.ajax({
    type: "POST",
    url: "http://52.79.152.29:5000/post/chrome/phishingCheck",
    data: tab.url,
    success: (data) => {
			chrome.storage.local.set({"data5":data['phishingFlag']});
			if(port == null && data['phishingFlag']){
				chrome.storage.local.set({"iconChange":true})
				setIcon("danger", tab.id)
			}
			else if(port != null) {
				chrome.storage.local.set({"phishingFlag":data['phishingFlag']})
			}
    },
    error: (error) => {
    }
  });
}

var sendSite = (url, port) => {
	//send Site
	let email = sessionStorage.getItem("email")
	if(email == null)
		email = "guest";

	$.ajax({
		type: "POST",
		url: "http://52.79.152.29:5000/post/chrome/siteRequest",
		data: {url:url, email:email},
		success: (data) => {
			port.postMessage(data["message"])
		},
		error: (error) => {

		}
	})
}

var getSite = () => {
	// get Site
	$.ajax({
		type: "GET",
		url: "http://52.79.152.29:5000/get/chrome/siteRequest",
		async: false,
		success: (data) => {
			phishingSite = data;
		},
		error: (error) => {

		}
	})
}

var setIcon = (status, tabId) => {
	// change extension Icon
	if(status === "secure") {
		chrome.browserAction.setIcon({
				path: {"38": "/Icons/38_secure.png"},
				tabId: tabId
			});
	} else if(status === "warn") {
		chrome.browserAction.setIcon({
				path: {"38": "/Icons/38_warning.png"},
				tabId: tabId
			});
	} else if(status === "danger") {
		chrome.browserAction.setIcon({
				path: {"38": "/Icons/38_danger.png"},
				tabId: tabId
			});
	}
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
