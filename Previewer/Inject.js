(function() {
  document.querySelector("#secureTable").innerHTML = `<div class="content">
      <div class="step">
        <div class="div1" id="plaintextIcon"><img src='./Icons/64_nomal.png' /></div>
        <div class="div3" id="plaintextContent">
          <div class="div2">
            웹 사이트 로그인 시도 후 확인가능 합니다.
          </div>
        </div>
      </div>

      <div class="step">
        <div class="div1" id="httpIcon"><img src='./Icons/64_nomal.png' /></div>
        <div class="div3" id="httpContent">
          <div class="div2">
            분석중 입니다.
          </div>
        </div>
      </div>
      <div class="step">
        <div class="div1" id="hstsIcon"><img src='./Icons/64_nomal.png' /></div>
        <div class="div3" id="hstsContent">
          <div class="div2">
            분석중 입니다.
          </div>
        </div>
      </div>

      <div class="step">
        <div class="div1" id="xssIcon"><img src='./Icons/64_nomal.png' /></div>
        <div class="div3" id="xssContent">
          <div class="div2">
            분석중 입니다.
          </div>
        </div>
      </div>
      <div class="step">
        <div class="div1" id="phishingIcon"><img src='./Icons/64_nomal.png' /></div>
        <div class="div3" id="phishingContent">
          <div class="div2">
            분석중 입니다.
          </div>
        </div>
      </div>
    </diV>`
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
    document.querySelector("#loginMessage").innerHTML = email+"님 환영합니다.";
  });

  var iconSecure = "<img src='./Icons/64_secure.png' />"
  var iconWarning = "<img src='./Icons/64_warning.png' />"
  var iconDanger = "<img src='./Icons/64_danger.png' />"

  // Get Data
  portGetData.onMessage.addListener(([data1, data2, data3, data4, data5]) => {
    let dataTransferCheck = data1;
    let httpStatus = data2;
    let hstsData = data3['hsts'];
    let xss = data4;
    let phishing = data5;

    if(dataTransferCheck) {
      document.querySelector("#plaintextIcon").innerHTML = iconWarning;
      document.querySelector("#plaintextContent").innerHTML = `<div class="div2 yellow">데이터가 평문으로 전송되었습니다.</div>`
    } else {
      document.querySelector("#plaintextIcon").innerHTML = iconSecure;
      document.querySelector("#plaintextContent").innerHTML = `<div class="div2 green">데이터가 안전하게 전송되었습니다.</div>`
    }

    if(httpStatus !== "https"){
      document.querySelector('#httpIcon').innerHTML = iconWarning;
      document.querySelector("#httpContent").innerHTML = `<div class="div2 yellow">HTTPS를 사용하지 않습니다.</div>`
    } else {
      document.querySelector("#httpIcon").innerHTML = iconSecure;
      document.querySelector("#httpContent").innerHTML = `<div class="div2 green">HTTPS를 사용하고 있습니다.</div>`
    }

    if(hstsData) {
      document.querySelector("#hstsIcon").innerHTML = iconSecure;
      document.querySelector("#hstsContent").innerHTML = `<div class="div2 green">HSTS를 사용하고 있습니다.</div>`
    } else {
      document.querySelector('#hstsIcon').innerHTML = iconWarning;
      document.querySelector("#hstsContent").innerHTML = `<div class="div2 yellow">HSTS를 사용하지 않습니다.</div>`
    }

    if(xss) {
      document.querySelector("#xssIcon").innerHTML = iconDanger;
      document.querySelector("#xssContent").innerHTML = `<div class="div2 red">XSS가 탐지되었습니다. 사이트 이용에 주의하세요.</div>`
    } else {
      document.querySelector("#xssIcon").innerHTML = iconSecure;
      document.querySelector("#xssContent").innerHTML = `<div class="div2 green">XSS가 탐지되지않았습니다.</div>`
    }

    if(phishing) {
      document.querySelector("#phishingIcon").innerHTML = iconDanger;
      document.querySelector("#phishingContent").innerHTML = `<div class="div2 red">피싱 사이트 입니다. 사이트 이용에 주의하세요.</div>`
    } else {
      document.querySelector("#phishingIcon").innerHTML = iconSecure;
      document.querySelector("#phishingContent").innerHTML = `<div class="div2 red">피싱 사이트가 아닙니다.</div>`
    }

  });

  // Login click
  var login = document.querySelector("#login");
  login.addEventListener('click', event => {
    let loginForm = document.loginForm;
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
      console.log(data['status'])
    //data['status'] : status, data['email'] : email, data['grade'] : grade?
    if(data['status'] === 'success') {
      document.querySelector("#loginTable").style.display = "none";
      document.querySelector("#loginSuccess").style.display = "inline";
      document.querySelector("#loginMessage").innerHTML = data['email']+"님 환영합니다.";
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

})();
