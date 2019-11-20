(function() {
  document.querySelector("#secureTable").innerHTML = `
    <div style="text-align: center; margin-top: 15px;">
      <div class="siren" id="plaintextContent" data-tooltip-text="로그인 후 확인가능합니다.">
        <span class="sirenTitle mb-2">로그인 평문</span>
        <div id="plaintextIcon">
          <img src="./Icons/64_nomal.png" />
        </div>
      </div>
      <div class="siren" id="httpContent" data-tooltip-text="분석중 입니다.">
        <span class="sirenTitle mb-2">HTTPS 여부</span>
        <div id="httpIcon">
          <img src="./Icons/64_nomal.png" />
        </div>
      </div>
      <div class="siren" id="hstsContent" data-tooltip-text="분석중 입니다.">
        <span class="sirenTitle mb-2">HSTS 여부</span>
        <div id="hstsIcon">
          <img src="./Icons/64_nomal.png" />
        </div>
      </div>
      <div class="siren" id="xssContent" data-tooltip-text="분석중 입니다.">
        <span class="sirenTitle mb-2">XSS 탐지</span>
        <div id="xssIcon">
          <img src="./Icons/64_nomal.png" />
        </div>
      </div>
      <div class="siren" id="phishingContent" data-tooltip-text="분석중 입니다.">
        <span class="sirenTitle mb-2">피싱사이트</span>
        <div id="phishingIcon">
          <img src="./Icons/64_nomal.png" />
        </div>
      </div>
    </div>`

  // Create Session port
  var portSession = chrome.extension.connect({
    name: "Check Session"
  });

  // Create Login port
  var portLogin = chrome.extension.connect({
      name: "Login Communication"
  });

  // Create GetData port
  var portGetData = chrome.extension.connect({
      name: "Data Communication"
  });

  // Create sendPhishingSite port
  var portSendSite = chrome.extension.connect({
      name: "SendPhishing Communication"
  })

  // Get session data & site Data
  portSession.postMessage(["Get Session Data",])
  portGetData.postMessage(["GET Site Data",]);

  // Get Session
  portSession.onMessage.addListener(([data1, data2]) => {
    let email = data1;
    let grade = data2;

    document.querySelector("#loginTable").style.display = "none";
    document.querySelector("#loginSuccess").style.display = "inline";
    document.querySelector("#loginMessage").innerHTML = email+"님";
    document.querySelector("#UserGrade").innerHTML = grade;
    if(grade === 'PREMIUM') {
      document.querySelector("#totalInfo").style.display = "inline";
    }
  });

  var iconSecure = "<img src='./Icons/64_secure.png' />"
  var iconWarning = "<img src='./Icons/64_warning.png' />"
  var iconDanger = "<img src='./Icons/64_danger.png' />"

  // Get Data
  portGetData.onMessage.addListener(([data1, data2, data3, data4, data5, score, warnFlag]) => {
    let dataTransferCheck = data1;
    let httpStatus = data2;
    let hstsData = data3['hsts'];
    let xss = data4;
    let phishing = data5;

    if(dataTransferCheck) {
      document.querySelector("#plaintextIcon").innerHTML = iconWarning;
      document.getElementById("plaintextContent").setAttribute("data-tooltip-text", "데이터가 평문으로 전송되었습니다.");
    } else {
      document.querySelector("#plaintextIcon").innerHTML = iconSecure;
      document.getElementById("plaintextContent").setAttribute("data-tooltip-text", "데이터가 안전하게 전송되었습니다.");
    }

    if(httpStatus !== "https"){
      document.querySelector('#httpIcon').innerHTML = iconWarning;
      document.getElementById("httpContent").setAttribute("data-tooltip-text", "HTTPS를 사용하지 않습니다.");
    } else {
      document.querySelector("#httpIcon").innerHTML = iconSecure;
      document.getElementById("httpContent").setAttribute("data-tooltip-text", "HTTPS를 사용하고 있습니다.");
    }

    if(hstsData) {
      document.querySelector("#hstsIcon").innerHTML = iconSecure;
      document.getElementById("hstsContent").setAttribute("data-tooltip-text", "HSTS를 사용하고 있습니다.");
    } else {
      document.querySelector('#hstsIcon').innerHTML = iconWarning;
      document.getElementById("hstsContent").setAttribute("data-tooltip-text", "HSTS를 사용하지 않습니다.");
    }

    if(xss) {
      document.querySelector("#xssIcon").innerHTML = iconDanger;
      document.getElementById("xssContent").setAttribute("data-tooltip-text", "XSS가 탐지되었습니다. 사이트 이용에 주의하세요.");
    } else {
      document.querySelector("#xssIcon").innerHTML = iconSecure;
      document.getElementById("xssContent").setAttribute("data-tooltip-text", "XSS가 탐지되지 않았습니다.");
    }

    if(phishing) {
      document.querySelector("#phishingIcon").innerHTML = iconDanger;
      document.getElementById("phishingContent").setAttribute("data-tooltip-text", "피싱 사이트 입니다. 사이트 이용에 주의하세요.");
    } else {
      document.querySelector("#phishingIcon").innerHTML = iconSecure;
      document.getElementById("phishingContent").setAttribute("data-tooltip-text", "피싱 사이트 아닙니다.");
    }

    if(warnFlag) {
      document.querySelector("#securePercent").innerHTML="0%";
      document.querySelector("#secureResult").innerHTML = "위험한 사이트입니다!"
      document.getElementById("secureCircle").setAttribute("class","c100 center red p100");
    } else {
      document.querySelector("#securePercent").innerHTML=score+"%";
      if(score >= 90) {
        document.querySelector("#secureResult").innerHTML = "안전한 사이트입니다."
        document.getElementById("secureCircle").setAttribute("class","c100 center green p"+score);}
      else if(score >= 70 && score < 90) {
        document.querySelector("#secureResult").innerHTML = "사이트 이용에 주의하세요!"
        document.getElementById("secureCircle").setAttribute("class","c100 center orange p"+score);
      }
      else {
        document.querySelector("#secureResult").innerHTML = "위험한 사이트입니다!"
        document.getElementById("secureCircle").setAttribute("class","c100 center red p"+score);
      }
    }
  });

  // Go to Our page
  var gotoPage = document.querySelector("#gotopage");
  gotoPage.addEventListener('click', event => {
    chrome.tabs.create({ url: 'http://52.79.152.29' });
  })

  // Login click
  var login = document.querySelector("#login");
  login.addEventListener('click', event => {
    let loginForm = document.loginform;
    let email = loginForm.email.value;
    let userPassword = loginForm.password.value;

    if(email === "") {
      alert("이메일을 입력해주세요");
      return;
    }
    if(userPassword === "") {
      alert("비밀번호를 입력해주세요");
      return;
    }

    loginForm.email.value = "";
    loginForm.password.value = "";

    portLogin.postMessage(["Login", email, userPassword]);

  });

  // Login Listener
  portLogin.onMessage.addListener((data) => {
    //data['status'] : status, data['email'] : email, data['grade'] : grade?
    if(data['status'] === 'success') {
      console.log(data['grade'])
      if(data['grade'] === 'PREMIUM') {
        document.querySelector("#totalInfo").style.display = "inline";
      }
      document.querySelector("#loginTable").style.display = "none";
      document.querySelector("#loginSuccess").style.display = "inline";
      document.querySelector("#loginMessage").innerHTML = data['email']+"님";
      document.querySelector("#UserGrade").innerHTML = data['grade'];
    } else if(data['status'] == 'failed') {
      alert(data['message'])
    }
  });

  // Logout click
  var logout = document.querySelector("#logout");
  logout.addEventListener('click', event => {
    document.querySelector("#loginTable").style.display = "block";
    document.querySelector("#loginSuccess").style.display = "none";
    portLogin.postMessage(["Logout",])
  });

  // Send phishing Site click
  var sendPhishingSite = document.querySelector("#sendphishing");
  sendPhishingSite.addEventListener('click', event => {
    urlDocument = document.querySelector("#url")
    let url = urlDocument.value
    urlDocument.value = ""

    portSendSite.postMessage(["PhishingSite", url]);
  });

  portSendSite.onMessage.addListener((data) => {
    alert(data);
  });

  chrome.storage.local.get(["tabHistory"], res => {
    let historyArray = res.tabHistory;
    if(historyArray) {
      historyArray = historyArray.reverse()
      let historyCount = 0;

      if(historyArray.length != 0) {
        document.getElementById("historyBox").style.display = 'block';
      }

      for(let history of historyArray){
        inputHistory(history);
        historyCount += 1;

        if(historyCount != historyArray.length) {
          document.querySelector("#history").innerHTML +=
          `<hr style="width: 90%; border: 1px dashed white;"/>`;
        }
      }
    }
  });

  var inputHistory = (history) => {
    let plaintext = "./Icons/38_secure.png";
    let httpsStatus = "./Icons/38_secure.png";
    let hstsStatus = "./Icons/38_secure.png";
    let xssStatus = "./Icons/38_secure.png";
    let phishingStatus = "./Icons/38_secure.png";

    if(history.data1) {
      plaintext = "./Icons/38_warning.png";
    }
    if(history.data2 === "http") {
      httpsStatus = "./Icons/38_warning.png";
    }
    if(!history.data3) {
      hstsStatus = "./Icons/38_warning.png";
    }
    if(history.data4) {
      xssStatus = "./Icons/38_danger.png";
    }
    if(history.data5) {
      phishingStatus = "./Icons/38_danger.png";
    }
    if(history.url.length > 60) {
      history.url = history.url.slice(0,60)+"..."
    }
    document.querySelector("#history").innerHTML +=
    `<div class="his" id="history_2">
        <p class="text-center" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; padding: 0 20px;"> `+history.url+` </p>
        <div class="mb-2" style="text-align: center; margin-top: 15px;">
            <div class="siren">
                <span class="sirenTitle">로그인평문</span>
                <div id="plaintextIcon">
                    <img src=`+plaintext+` />
                </div>
            </div>
            <div class="siren">
                <span class="sirenTitle">HTTPS</span>
                <div id="httpIcon">
                    <img src=`+httpsStatus+` />
                </div>
            </div>
            <div class="siren">
                <span class="sirenTitle">HSTS</span>
                <div id="hstsIcon">
                    <img src=`+hstsStatus+` />
                </div>
            </div>
            <div class="siren">
                <span class="sirenTitle">XSS 탐지</span>
                <div id="xssIcon">
                    <img src=`+xssStatus+` />
                </div>
            </div>
            <div class="siren">
                <span class="sirenTitle">피싱사이트</span>
                <div id="phishingIcon">
                    <img src=`+phishingStatus+` />
                </div>
            </div>
        </div>
    </div>`
  }

})();
