"use strict"
var offsetNum;
var totalResults;
//src: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
function encodeRFC5987ValueChars (str) {
    return encodeURIComponent(str).
        // Note that although RFC3986 reserves "!", RFC5987 does not,
        // so we do not need to escape it
        replace(/['()]/g, escape). // i.e., %27 %28 %29
        replace(/\*/g, '%2A').
            // The following are not required for percent-encoding per RFC5987,
            // so we can allow for a little better readability over the wire: |`^
            replace(/%(?:7C|60|5E)/g, unescape);
}

function initialize(){
   document.getElementById("myQuery").focus();
   offsetNum = 0;
   totalResults = 0;
}

function checkEnter(e){
  if(e.keyCode === 13)
    submit();
}

function submit(){ //use JSONP here
  var inputQuery = encodeRFC5987ValueChars(document.getElementById("myQuery").value);
  //var xhrRequest = new XMLHttpRequest();
  var myScript = document.createElement("script");
  var url = "https://api.twitch.tv/kraken/search/streams?limit=10&offset="
            + offsetNum + "&q=" + inputQuery + "&callback=handleData";
  myScript.type= "application/javascript";
  myScript.src = url;
  myScript.id = "jsonpScript"
  console.log(myScript);
  document.getElementsByTagName('head')[0].appendChild(myScript);


}

function handleData(data) {

  var resultsDiv = document.getElementById('results');
  var removeScript = document.getElementById('jsonpScript');
  removeScript.parentNode.removeChild(removeScript);
  //if results already has data then remove it before adding
  if(resultsDiv.hasChildNodes()){
    resultsDiv.innerHTML = '';
  }
  var resultNumber = document.getElementById('listResult');
  resultNumber.innerHTML = data["_total"];
  totalResults = data["_total"];


  for(let i = 0; i < data.streams.length; i++){
    //create a row
    var oneRow = document.createElement('div');
    oneRow.setAttribute("class", "row one-result");
    //create image
    var imgContainer = document.createElement('div');
    imgContainer.setAttribute("class", "five columns");
    var pic = document.createElement("img");
    pic.setAttribute("src", data["streams"][i]["preview"].medium);
    imgContainer.appendChild(pic);
    //create text
    var textContainer = document.createElement('div');
    textContainer.setAttribute("class", "seven columns");
    var displayName = document.createElement('h4');
    displayName.innerHTML +=  data["streams"][i]["channel"]["display_name"];
    var stats = document.createElement('p');
    stats.innerHTML += "Game name: \"" + data["streams"][i]["game"];
    stats.innerHTML += "\" | Viewers: " + data["streams"][i]['viewers'];
    //create description
    var streamDescription = document.createElement('p');
    streamDescription.innerHTML += "This stream was created at: " + data["streams"][i]["created_at"];
    streamDescription.innerHTML += ". The channel status is \"" + data["streams"][i]["channel"]["status"];
    streamDescription.innerHTML += "\", and the maturity rating is " + data["streams"][i]["channel"]["mature"]+".";
    textContainer.appendChild(displayName);
    textContainer.appendChild(stats);
    textContainer.appendChild(streamDescription);

    //add everything together
    oneRow.appendChild(imgContainer);
    oneRow.appendChild(textContainer);
    resultsDiv.appendChild(oneRow);
  }

}

function nextButton(){
  if(offsetNum < totalResults){
    offsetNum+=10;
    submit();
  }
}

function prevButton(){
  if(offsetNum > 10){
    offsetNum-=10;
    submit();
  }
}


// function updateData(){
//   var inputQuery = encodeRFC5987ValueChars(document.getElementById("myQuery").value);
//   var xhrRequest = new XMLHttpRequest();
//   var url = "https://api.twitch.tv/kraken/search/streams?limit=10&offset="
//             + offsetNum + "&q=" + inputQuery;
//     console.log(url);
//     xhrRequest.onreadystatechange = function() {
//       if (xhrRequest.readyState == 4 && xhrRequest.status == 200) {
//           var myData = JSON.parse(xhrRequest.responseText);
//           handleData(myData);
//           totalResults = myData["_total"];
//       }
//   };
//   xhrRequest.open("GET", url, true);
//   xhrRequest.send();
// }
