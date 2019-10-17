(function() {
  // http or https
  var httpStatus;
  var sslData;

  var port = chrome.extension.connect({
      name: "Data Communication"
  });
  port.postMessage("Request Modified Value");
  port.onMessage.addListener(function ([data1, data2]) {
    httpStatus = data1;
    sslData = data2;
    document.querySelector('#httpStatus').innerHTML = httpStatus;

    if(sslData) {
      for(let data of sslData){
        document.querySelector('#sslData').innerHTML += "<span>"+data+"</span><br />";
      }
    }
  });
})();
