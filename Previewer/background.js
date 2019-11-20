var dataTransferCheck = {};
var phishingSite = [];
var tabHistory = new Queue();
var plaintextInfo = [];

chrome.tabs.onUpdated.addListener((currentTabId, changeInfo, tab) => {
	// Get User access url ex) https://naver.com
	url = tab.url;
	exception_url = url.indexOf("chrome://")

	if(exception_url !== 0 && changeInfo.status ==="complete")
	{
		// Get user input password
		chrome.tabs.executeScript({
      code:"document.addEventListener('keyup', function(){var elements = document.querySelectorAll('input[type=password]')[0];if(elements) { var passwordName = elements.name;var passwordValue = elements.value;let passwordInfo = [passwordName, passwordValue]; chrome.runtime.sendMessage({ 'plaintextInfo': passwordInfo }); }; });"
		// check & extension icon change
		});
		checkSite(tab);
	}

});

chrome.webRequest.onBeforeRequest.addListener((requestData) => {
	// Request method check
	let grade = sessionStorage.getItem("grade");
	if(grade === "PREMIUM" || grade === "PRO") {
		let urlBeforeConnect = requestData.url.replace("http://", "").replace("https://", "")
		for(data of phishingSite) {
			if(urlBeforeConnect == data.url || urlBeforeConnect == data.url+"/") {
				let flagPhishing = confirm("피싱사이트로 탐지되었습니다. 정말로 연결하시겠습니까?")
				if(!flagPhishing) {
					return {cancel: true}
				}
			}
		}
	}

	if(requestData.method == "POST")
	{
		let checkPasswordFlag = checkPassword(requestData, grade, requestData.tabId);
		if((grade === "PRO" || grade === "PREMIUM") && checkPasswordFlag) {
			let confirmflag = confirm("로그인 데이터가 평문으로 전송되고 있습니다. 로그인하시겠습니까?");
			if(!confirmflag) {
				return {cancel: true}
			}
		}
		plaintextInfo = [];
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
					getSite();
					signIn(message[1], message[2], port);
				} else if(message[0] === "Logout") {
					sessionStorage.clear();
				} else if(message[0] === "PhishingSite") {
					sendSite(message[1], port);
				}
    });
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		plaintextInfo = request.plaintextInfo;
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

	// hsts & https
 	await getsiteData(tab, null);
 	// Phishing
 	await phishingCheck(tab, null);
 	// XSS
 	await xssCheck(tab, null);

 	await chrome.storage.local.get(['iconChange'], (res) => {
	 	if(res['iconChange'] !== true){
		 	setIcon("secure",tab.id);
	 	}
	chrome.storage.local.get("tabHistory", (res) => {

		chrome.storage.local.get(['data1','data2','data3','data4','data5'], (res) => {
				let datas = {'url': tab.url, 'data1': res.data1,'data2': res.data2,'data3': res.data3,'data4': res.data4,'data5': res.data5}

				if(tabHistory.size() >= 4) {
					tabHistory.dequeue();
					tabHistory.enqueue(datas);
				} else {
					tabHistory.enqueue(datas);
				}
				chrome.storage.local.set({"tabHistory": tabHistory.getStore()})

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
    url: "http://52.79.152.29/post/chrome/signIn",
    data: {email:email, password:password},
    success: (data) => {
			// sessionStorage setItem
			if(data['status'] === "success") {
				sessionStorage.setItem('email', data['email'])
				sessionStorage.setItem('grade', data['grade'])
			}
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
    url: "http://52.79.152.29/post/hsts",
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
					let score = 100;
					let warnFlag = false;
					if(dataTransferCheck[tab.id]) {
						score -= 10;
					}
					if(urlStatus == "http") {
						score -= 10;
					}
					if(!data['hsts']) {
						score -= 10;
					}
					if(xssFlag) {
						score -=30;
						warnFlag = true;
					}
					if(phishingFlag) {
						score -=30;
						warnFlag = true;
					}

					port.postMessage([dataTransferCheck[tab.id], urlStatus, data, xssFlag, phishingFlag, score, warnFlag]);
					chrome.storage.local.remove(['xssFlag','phishingFlag']);
					dataTransferCheck[tab.id] = false;
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
		if(result) {
     		$.ajax({
      		type: "GET",
      		url: "http://52.79.152.29/get/chrome/xssGet",
      		success: (xssData) => {
						let flag = false;
						for(let data of xssData) {
							let match = result[0].indexOf(data['gadget'])
							if(match != -1 && data['gadget']) {
								flag = true;
								break;
							}
						}
						chrome.storage.local.set({"data4":flag});
						if(port == null && flag){
							chrome.storage.local.set({"iconChange":true})
							setIcon("danger",tab.id)
						}
						else if (port != null){
							chrome.storage.local.set({"xssFlag":flag})
						}
      	},
      	error: (error) => {
      	}
    	});
		}
	});
}

var phishingCheck = async (tab, port) => {
  // Check HSTS, Get sslData
	url = tab.url;
	let lastUrl = url.charAt(url.length-1);
	if(lastUrl === "/"){
		url = url.slice(0, -1);
	}

  await $.ajax({
    type: "POST",
    url: "http://52.79.152.29/post/chrome/phishingCheck",
    data: url,
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
		url: "http://52.79.152.29/post/chrome/siteRequest",
		data: {url:url, email:email},
		success: (data) => {
			port.postMessage(data["message"])
		},
		error: (error) => {

		}
	})
}

setInterval( () => {
	// get Site
	getSite();
}, 10000);

var getSite = () => {
	// get Site
	$.ajax({
		type: "GET",
		url: "http://52.79.152.29/get/chrome/siteRequest",
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

var checkPassword = (requestData, grade, tabId) => {
	// Get user password parameter name and value in chrome local storage
		if(plaintextInfo !== null)
		{
			// If user send password to server
			let requestBody = requestData.requestBody;
			let passwordParameterName = plaintextInfo[0];
			let passwordValue = plaintextInfo[1];

			// Compare send server value and local storage value
			if(requestBody && requestBody.formData && requestBody.formData[passwordParameterName])
			{
				if(requestBody.formData[passwordParameterName] == passwordValue)
				{
					dataTransferCheck[tabId] = true;
					console.log("Un Secure");
					return true;
				}
			}
		}
		return false;
};

function Queue() {
	this.dataStore = [];
	this.enqueue = enqueue;
	this.dequeue = dequeue;
	this.getStore = getStore;
	this.size = size;
}

function enqueue(element) {
	this.dataStore.push(element);
}

function dequeue() {
	this.dataStore.shift();
}

function getStore() {
	return this.dataStore.slice(0, -1);
}

function size() {
	return this.dataStore.length;
}
