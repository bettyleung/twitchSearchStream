/*
* Twitch Search Stream
* www.bettyleung.github.io/twitchSearchStream
* 5/25/2016
*/

//TODO: fix up stream description
//TODO: test in safari, firefox, and ie???
//TODO: code cleanup
(function () {
   'use strict';
}());


//JSON ------------------------------------------------------------------------
function getTwitchData(url){ //use JSONP here
  var inputQuery = encodeURIComponent(document.getElementById("myQuery").value),
      myScript = document.createElement("script"),
      myCallback = "&callback=handleMetaDataCont";

  if(typeof url === 'undefined'){ //new query
    myCallback = "&callback=handleMetaDataNew";
  }

  url = url || "https://api.twitch.tv/kraken/search/streams?q=" + inputQuery + myCallback;

  myScript.type= "application/javascript";
  myScript.src = url;
  myScript.id = "jsonpScript";
  console.log(url);
  document.getElementsByTagName('head')[0].appendChild(myScript);
}





//Rendering --------------------------------------------------------------------
function handleMetaDataNew(data){
  var setNextBtn = data._links.next || ""; //set next button, but not previous
  document.getElementById('nextPage').onclick = callGetTwitchData(setNextBtn);

  document.getElementById('resultInfoNumber').innerHTML = data._total;
  document.getElementById('curPage').innerHTML = 0;
  document.getElementById('totalPage').innerHTML = Math.floor(data._total/10);
  clearOldResults(data);
}

function handleMetaDataCont(data){
  var pg = data._links.self.substring(data._links.self.indexOf("offset=")+7, data._links.self.indexOf("&q"));
  document.getElementById('curPage').innerHTML = Math.floor(pg/10);
  var setPrevBtn = data._links.prev || "";
  var setNextBtn = data._links.next || "";
  if(setPrevBtn === ""){//no more prev
    document.getElementById('prevPage').onclick = "";
    document.getElementById('nextPage').onclick = callGetTwitchData(setNextBtn);
  } else if(parseInt(document.getElementById('curPage').innerHTML,10) >= parseInt(document.getElementById('totalPage').innerHTML,10)){ //no more foward
    document.getElementById('prevPage').onclick = callGetTwitchData(setPrevBtn);
    document.getElementById('nextPage').onclick = "";
  } else{
    document.getElementById('prevPage').onclick = callGetTwitchData(setPrevBtn);
    document.getElementById('nextPage').onclick = callGetTwitchData(setNextBtn);
  }
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
  var resultsDiv = document.getElementById('results');
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

function callGetTwitchData(url){
  return function(){
    getTwitchData(url+"&callback=handleMetaDataCont");
  };
}

//build responsive images that when clicked will take to the stream
function buildimage(data, i){
  var imgContainer = document.createElement('div'),
      picDefault = document.createElement("img"),
      picTablet = document.createElement("img"),
      picDesktop = document.createElement("img"),
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
function buildText(data, i){
  var textContainer = document.createElement('div'),
      displayName = document.createElement('h4'),
      stats = document.createElement('p'),
      streamDescription = document.createElement('p');

  textContainer.setAttribute("class", "six columns");
  displayName.innerHTML += data.streams[i].channel.display_name;
  stats.innerHTML += "Game name: \"" + data.streams[i].game;
  stats.innerHTML += "\" | Viewers: " + data.streams[i].viewers;
  //build stream description

  //formate date and time
  var str = new Date(data.streams[i].created_at).toString();
  var maturity = data.streams[i].channel.mature;

  streamDescription.innerHTML += "This stream was created at: " + str.substring(0,str.substring(0,str.lastIndexOf(" ")).lastIndexOf(" "));
  streamDescription.innerHTML += ". The channel status is \"" + data.streams[i].channel.status;
  streamDescription.innerHTML += "\", and the maturity rating is " + data.streams[i].channel.mature+".";

  textContainer.appendChild(displayName);
  textContainer.appendChild(stats);
  textContainer.appendChild(streamDescription);

  return textContainer;
}



//Interactions & Utility Functions -----------------------------------------------------------------
//enter is pressed on input
function checkEnter(e){
  if(e.keyCode === 13)
    getTwitchData();
}
