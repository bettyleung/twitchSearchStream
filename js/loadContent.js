(function () {
   'use strict';

}());
var offsetNum;
var totalResults;
var curPageNum;



function initialize(){

document.getElementById("myQuery").focus();
}

function checkEnter(e){
  if(e.keyCode === 13)
    getFirstPage(e);
}

function getFirstPage(ev){
  getTwitchData(ev);
}

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

function updateOffset(num){
  offsetNum += num;
  document.getElementById('curPage').innerHTML = curPageNum;
}


function getTwitchData(ev){ //use JSONP here
  var inputQuery = encodeURIComponent(document.getElementById("myQuery").value);
  var myScript = document.createElement("script");
  var myCallback = "&callback=handleData"
  if(ev.currentTarget.id ==="bgBtn" || ev.currentTarget.id ==="smBtn" ||ev.currentTarget.id === "myQuery"){
    myCallback = "&callback=handleMetaData";
  }

  var url = "https://api.twitch.tv/kraken/search/streams?limit=10&offset=" + offsetNum + "&q=" + inputQuery + myCallback;

  myScript.type= "application/javascript";
  myScript.src = url;
  myScript.id = "jsonpScript";
  //console.log(myScript);
  document.getElementsByTagName('head')[0].appendChild(myScript);
}

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
  handleData(data);
}

function handleData(data) {
  var resultsDiv = document.getElementById('results');
  var removeScript = document.getElementById('jsonpScript');
  removeScript.parentNode.removeChild(removeScript);
  //if results already has data then remove it before adding
  if(resultsDiv.hasChildNodes()){
    resultsDiv.innerHTML = '';
  }


  for(var i = 0; i < data.streams.length; i++){
    //create a row
    var oneResult = document.createElement('div');
    oneResult.setAttribute("class", "row one-result");
    //create image
    var imgContainer = document.createElement('div');
    imgContainer.setAttribute("class", "six columns");
    var picDefault = document.createElement("img");
    picDefault.setAttribute("class","default-img");
    var picTablet = document.createElement("img");
    picTablet.setAttribute("class","tablet-img");
    var picDesktop = document.createElement("img");
    picDesktop.setAttribute("class","desktop-img");
    picDefault.setAttribute("src", data.streams[i].preview.medium);
    picTablet.setAttribute("src", data.streams[i].preview.template.substring(0,data.streams[i].preview.template.length-20) +"350x275.jpg");
    picDesktop.setAttribute("src",data.streams[i].preview.large);


    var imgLink= document.createElement("a");
    imgLink.setAttribute("href", data.streams[i].channel.url);
    imgLink.appendChild(picDefault);
    imgLink.appendChild(picTablet);
    imgLink.appendChild(picDesktop);
    imgContainer.appendChild(imgLink)
    //create text
    var textContainer = document.createElement('div');
    textContainer.setAttribute("class", "six columns");
    var displayName = document.createElement('h4');
    displayName.innerHTML += data.streams[i].channel.display_name;
    var stats = document.createElement('p');
    stats.innerHTML += "Game name: \"" + data.streams[i].game;
    stats.innerHTML += "\" | Viewers: " + data.streams[i].viewers;
    //create description
    var streamDescription = document.createElement('p');
    streamDescription.innerHTML += "This stream was created at: " + data.streams[i].created_at;
    streamDescription.innerHTML += ". The channel status is \"" + data.streams[i].channel.status;
    streamDescription.innerHTML += "\", and the maturity rating is " + data.streams[i].channel.mature+".";
    textContainer.appendChild(displayName);
    textContainer.appendChild(stats);
    textContainer.appendChild(streamDescription);

    //add everything together
    oneResult.appendChild(imgContainer);
    oneResult.appendChild(textContainer);
    resultsDiv.appendChild(oneResult);
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
