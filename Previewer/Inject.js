(function() {
  // http or https
  var httpStatus;
  var siteData;

  var port = chrome.extension.connect({
      name: "Data Communication"
  });

  // SSL Data check
  port.postMessage("GET Site Data");
  document.querySelector("#test").innerHTML = `
<table class="table">
  <thead>
    <tr>
      <th scope="col">알림</th>
      <th scope="col">내용</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row"><img src='./Icons/64_secure.png' /></th>
      <td>평문체크</td>
    </tr>
    <tr>
      <th scope="row"><img src='./Icons/64_warning.png' /></th>
      <td>HTTP(S) 체크</td>
    </tr>
    <tr>
      <th scope="row"><img src='./Icons/64_danger.png' /></th>
      <td>HSTS 체크</td>
    </tr>
    <tr>
      <th scope="row">4</th>
      <td>XSS 체크</td>
    </tr>
    <tr>
      <th scope="row">5</th>
      <td>피싱 사이트 체크</td>
    </tr>
  </tbody>
</table>
<p class="text-center">피싱 사이트 요청</p>
<div class="input-group mb-3 ml-1 row">
  <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
  <button type="button" class="btn btn-primary">요청</button>
</div>
`


  port.onMessage.addListener( ([data1, data2]) => {
    httpStatus = data1;
    siteData = data2;
    document.querySelector('#httpStatus').innerHTML = httpStatus;

    if(siteData) {
      for(let data in siteData){
        document.querySelector('#sslData').innerHTML += "<span>"+data+ " : "+ siteData[data]+"</span><br />";
      }
    }
  });
})();
