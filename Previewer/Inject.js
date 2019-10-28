(function() {
  document.querySelector("#secureTable").innerHTML = `<table class="table">
  <thead>
    <tr>
      <th scope="col">알림</th>
      <th scope="col">내용</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th id="plaintextIcon" scope="row"><img src='./Icons/64_secure.png' /></th>
      <td id="plaintextContent">평문체크</td>
    </tr>
    <tr>
      <th id="httpIcon" scope="row"><img src='./Icons/64_secure.png' /></th>
      <td id="httpContent">HTTP(S) 체크</td>
    </tr>
    <tr>
      <th id="hstsIcon" scope="row"><img src='./Icons/64_secure.png' /></th>
      <td id="hstsContent">HSTS 체크</td>
    </tr>
    <tr>
      <th id="xssIcon" scope="row">4</th>
      <td id="xssContent">XSS 체크</td>
    </tr>
    <tr>
      <th id="phishingIcon" scope="row">5</th>
      <td id="phishringContent">피싱 사이트 체크</td>
    </tr>
  </tbody>
</table>`

  var port = chrome.extension.connect({
      name: "Data Communication"
  });
  port.postMessage("GET Site Data");

  var iconSecure = "<img src='./Icons/64_secure.png' />"
  var iconWarning = "<img src='./Icons/64_warning.png' />"
  var iconDanger = "<img src='./Icons/64_danger.png' />"

  port.onMessage.addListener( ([data1, data2, data3]) => {
    let dataTransferCheck = data1;
    let httpStatus = data2;
    let sslData = data3;

    if(dataTransferCheck) {
      document.querySelector("#plaintextIcon").innerHTML = iconWarning;
      document.querySelector("#plaintextContent").innerHTML = "WARN! 데이터가 평문으로 전송되었습니다."
    } else {
      document.querySelector("#plaintextContent").innerHTML = "안전한 사이트입니다."
    }
    if(httpStatus == "http"){
      document.querySelector('#httpIcon').innerHTML = iconWarning;
      document.querySelector("#httpContent").innerHTML = "WARN! HTTPS를 사용하지 않는 사이트입니다."
    } else {
      document.querySelector("#httpContent").innerHTML = "HTTPS를 사용하는 사이트입니다."
    }
    if(sslData['hsts']) {
      document.querySelector('#hstsIcon').innerHTML = iconWarning;
      document.querySelector("#hstsContent").innerHTML = "WARN! HSTS를 사용하지 않는 사이트입니다."
    } else {
      document.querySelector("#hstsContent").innerHTML = "HSTS를 사용하는 사이트입니다."
    }

  });
})();
