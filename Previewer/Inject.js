(function() {
  // http or https
  var httpStatus;
  var siteData;

  var port = chrome.extension.connect({
      name: "Data Communication"
  });

  // SSL Data check
  port.postMessage("GET Site Data");
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
