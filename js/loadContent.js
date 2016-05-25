/*
* Twitch Search Stream
* www.bettyleung.github.io/twitchSearchStream
* 5/25/2016
*/

(function () {
   'use strict';
}());

//Global Vars ------------------------------------------------------------------
var offsetNum;
var totalResults;
var curPageNum;


//Initial Load -----------------------------------------------------------------
function initialize(){
  document.getElementById("myQuery").focus();
}

 //JSON ------------------------------------------------------------------------
function getTwitchData(ev){ //use JSONP here
  var inputQuery = encodeURIComponent(document.getElementById("myQuery").value),
      myScript = document.createElement("script"),
      myCallback = "&callback=clearOldResults",
      url;

  if(ev.currentTarget.id ==="bgBtn" || ev.currentTarget.id ==="smBtn" ||ev.currentTarget.id === "myQuery"){
    myCallback = "&callback=handleMetaData";
  }

  url = "https://api.twitch.tv/kraken/search/streams?limit=10&offset=" + offsetNum + "&q=" + inputQuery + myCallback;

  myScript.type= "application/javascript";
  myScript.src = url;
  myScript.id = "jsonpScript";
  //console.log(myScript);
  document.getElementsByTagName('head')[0].appendChild(myScript);
}



//Rendering --------------------------------------------------------------------
function handleMetaData(data){
  offsetNum = 10;
  totalResults = 0;
  curPageNum = 1;
  document.getElementById('resultInfoNumber').innerHTML = data._total;
  totalResults = data._total;
  document.getElementById('curPage').innerHTML = 1;
  var totalPage = document.getElementById('totalPage');
  totalPage.innerHTML = (totalResults/10 > 0 ? (parseInt(totalResults/10, 10)+1) : 1);
  curPage.innerHTML = 1;
  clearOldResults(data);
}

//remove jsonp script and clear old results
function clearOldResults(data){
  var resultsDiv = document.getElementById('results'),
    removeScript = document.getElementById('jsonpScript');

  removeScript.parentNode.removeChild(removeScript);  //remove the jsonp

  //if results already has data then remove it before adding
  if(resultsDiv.hasChildNodes()){
    resultsDiv.innerHTML = '';
  }

  renderResults(data);
}

//build the rows of result row
function renderResults(data) {
  for(var i = 0; i < data.streams.length; i++){
    //build a result row
    var oneResult = document.createElement('div'),
        imgContainer = buildimage(data, i),
        textContainer = buildText(data, i);

    oneResult.setAttribute("class", "row one-result");
    oneResult.appendChild(imgContainer);
    oneResult.appendChild(textContainer);
    resultsDiv.appendChild(oneResult);
  }
}

//build responsive images that when clicked will take to the stream
function buildimage(data, i){
  var imgContainer = document.createElement('div'),
      picDefault = document.createElement("img"),
      picTablet = document.createElement("img"),
      picDesktop = document.createElement("img");
      imgLink= document.createElement("a");

  imgContainer.setAttribute("class", "six columns");
  picDefault.setAttribute("class","default-img");
  picTablet.setAttribute("class","tablet-img");
  picDesktop.setAttribute("class","desktop-img");
  picDefault.setAttribute("src", data.streams[i].preview.medium);
  picTablet.setAttribute("src", data.streams[i].preview.template.substring(0,data.streams[i].preview.template.length-20) +"350x275.jpg");
  picDesktop.setAttribute("src",data.streams[i].preview.large);
  imgLink.setAttribute("href", data.streams[i].channel.url);

  imgLink.appendChild(picDefault);
  imgLink.appendChild(picTablet);
  imgLink.appendChild(picDesktop);
  imgContainer.appendChild(imgLink);

  return imgContainer;
}

//build display name, game name, viewers, and description
function buildText(){
  var textContainer = document.createElement('div'),
      displayName = document.createElement('h4'),
      stats = document.createElement('p'),
      streamDescription = document.createElement('p');

  textContainer.setAttribute("class", "six columns");
  displayName.innerHTML += data.streams[i].channel.display_name;
  stats.innerHTML += "Game name: \"" + data.streams[i].game;
  stats.innerHTML += "\" | Viewers: " + data.streams[i].viewers;
  //build stream description
  streamDescription.innerHTML += "This stream was created at: " + data.streams[i].created_at;
  streamDescription.innerHTML += ". The channel status is \"" + data.streams[i].channel.status;
  streamDescription.innerHTML += "\", and the maturity rating is " + data.streams[i].channel.mature+".";

  textContainer.appendChild(displayName);
  textContainer.appendChild(stats);
  textContainer.appendChild(streamDescription);

  return textContainer;
}


//Interactions -----------------------------------------------------------------
//enter is pressed on input
function checkEnter(e){
  if(e.keyCode === 13)
    getFirstPage(e);
}
//page is first loaded
function getFirstPage(ev){
  getTwitchData(ev);
}
//next button is pressed
function getNextPage(ev){
  if(offsetNum < Math.floor(totalResults/10)*10){
    curPageNum++;
    updateOffset(10);
    getTwitchData(ev);
  } else if (offsetNum <= totalResults){
    curPageNum++;
    updateOffset(totalResults % 10);
    getTwitchData(ev);
  }
}
//previous button is pressed
function getPrevPage(ev){
  if(offsetNum > 10) {
    curPageNum--;
    updateOffset(-10);
    getTwitchData(ev);

  } else {
    curPageNum = 1;
    updateOffset(-updateOffset);
  }
}



//Utility Functions ------------------------------------------------------------
function updateOffset(num){
  offsetNum += num;
  document.getElementById('curPage').innerHTML = curPageNum;
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
//           renderResults(myData);
//           totalResults = myData["_total"];
//       }
//   };
//   xhrRequest.open("GET", url, true);
//   xhrRequest.send();
// }
