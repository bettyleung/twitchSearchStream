/*
* Twitch Search Stream
* www.bettyleung.github.io/twitchSearchStream
* 5/25/2016
*/

//Get JSONP -------------------------------------------------------------------------------------
function getTwitchData(url){ //use JSONP here
  var inputQuery = encodeURIComponent(document.getElementById("myQuery").value),
      myScript = document.createElement("script"),
      myCallback = "&callback=handleContinedSearch";

  if(typeof url === 'undefined'){ //new query
    myCallback = "&callback=handleNewSearch";
    url = "https://api.twitch.tv/kraken/search/streams?q=" + inputQuery + myCallback;
  }

  myScript.type= "application/javascript";
  myScript.src = url;
  myScript.id = "jsonpScript";
  console.log(url);
  document.getElementsByTagName('head')[0].appendChild(myScript);
}

//callback for a new query being submitted
function handleNewSearch(data){
  setNewNavigation(data);
  clearOldResults(data);
  renderResults(data);
}

//callback if the navigation buttons are pressed
function handleContinedSearch(data){
  setContinuedNavigation(data);
  clearOldResults(data);
  renderResults(data);
}

//Rendering Navigation and Results Metadata Section------------------------------------------------
//update navagation of page button and numbers
function setNewNavigation(data){
  //set the total number of results
  document.getElementById('totalResultsNumber').innerHTML = data._total;

  if(data._total > 10){  //if there are more than 10 results, allow navigation
    var setNextBtn = data._links.next || "";
    document.getElementById('currentPageNumber').innerHTML = 0;
    document.getElementById('totalPageNumber').innerHTML = Math.floor(data._total/10);
    document.getElementById('nextPageButton').onclick = setTwitchDataCallback(setNextBtn);
    document.getElementById('prevPageButton').onclick = "";
  } else{
    document.getElementById('currentPageNumber').innerHTML = 0;
    document.getElementById('totalPageNumber').innerHTML = 0;
    document.getElementById('nextPageButton').onclick = "";
    document.getElementById('prevPageButton').onclick = "";
  }
}



//when prev or next button is pressed to call on getTwitchData()
function setContinuedNavigation(data){
  var setPrevBtn = data._links.prev || "";
  var setNextBtn = data._links.next || "";
  //set current page number
  var pg = data._links.self.substring(data._links.self.indexOf("offset=")+7, data._links.self.indexOf("&q"));
  document.getElementById('currentPageNumber').innerHTML = Math.floor(pg/10);

  //set navagation buttons
  if(setPrevBtn === ""){
    //no more prev (on page 0)
    document.getElementById('prevPageButton').onclick = "";
    document.getElementById('nextPageButton').onclick = setTwitchDataCallback(setNextBtn);
  } else if(Math.floor(data._total/10)*10 <= parseInt(data._links.self.substring(data._links.self.indexOf("offset=")+7, data._links.self.indexOf("&q")))){
    //no more foward (on last page)
    document.getElementById('prevPageButton').onclick = setTwitchDataCallback(setPrevBtn);
    document.getElementById('nextPageButton').onclick = "";
  } else{
    document.getElementById('prevPageButton').onclick = setTwitchDataCallback(setPrevBtn);
    document.getElementById('nextPageButton').onclick = setTwitchDataCallback(setNextBtn);
  }
}

function setTwitchDataCallback(url){
  return function(){
    getTwitchData(url+"&callback=handleContinedSearch");
  };
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
}




//Rendering the Results-----------------------------------------------------------------------------------
//build the rows of results from twitch json
function renderResults(data){
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

//build responsive images that when clicked will take to the stream
function buildimage(data, i){
  var imgContainer = document.createElement('div'),
      picDefault = document.createElement("img"),
      picTablet = document.createElement("img"),
      picDesktop = document.createElement("img"),
      imgLink= document.createElement("a");

  imgContainer.setAttribute("class", "six columns");

  picDefault.setAttribute("class","default-img");
  picDefault.setAttribute("alt","The twitch stream image preview.");
  picTablet.setAttribute("class","tablet-img");
  picTablet.setAttribute("alt","the twitch stream image preview.");
  picDesktop.setAttribute("class","desktop-img");
  picDesktop.setAttribute("alt","The twitch stream image preview.");
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
      streamDescription = document.createElement('p'),
      maturity = data.streams[i].channel.mature;;

  textContainer.setAttribute("class", "six columns");
  displayName.innerHTML += data.streams[i].channel.display_name;
  stats.setAttribute("class", "results-subtitle");
  stats.innerHTML += "Game name: \"" + data.streams[i].game;
  stats.innerHTML += "\" | Viewers: " + data.streams[i].viewers;

  //build stream description
  if(maturity === null){
    maturity = "unknown";
  }
  //format date and time
  var d = new Date(data.streams[i].created_at);
  var creationDate = d.getMonth() + "\/" + d.getDate() + "\/" +   d.getFullYear() + " at " +  d.getHours() +":"+ d.getMinutes();

  streamDescription.innerHTML += "This stream was created on " + creationDate;
  streamDescription.innerHTML += ". The channel's status is: \"" + data.streams[i].channel.status;
  streamDescription.innerHTML += "\". The channel's maturity rating is " +maturity +".";

  textContainer.appendChild(displayName);
  textContainer.appendChild(stats);
  textContainer.appendChild(streamDescription);

  return textContainer;
}



//Interactions -------------------------------------------------------------------------------------------
//enter is pressed on input then submit query to getTwitchData();
function checkEnter(e){
  if(e.keyCode === 13)
    getTwitchData();
}
