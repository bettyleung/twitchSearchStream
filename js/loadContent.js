(function(){ //get the data using a GET request
  var xhrRequest = new XMLHttpRequest();
  var url = "https://api.twitch.tv/kraken/search/streams?limit=1&q=league%20of%20legends";
    xhrRequest.onreadystatechange = function() {
      if (xhrRequest.readyState == 4 && xhrRequest.status == 200) {
          var myArr = JSON.parse(xhrRequest.responseText);
          handleData(myArr);
      }
  };
  xhrRequest.open("GET", url, true);
  xhrRequest.send();
})();

function handleData(data) {
  var resDiv = document.getElementById('results');
  resDiv.innerHTML += JSON.stringify(data);
}
