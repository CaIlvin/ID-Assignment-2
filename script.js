$(document).ready(function () {
    const APIKEY = "63d202d4a95709597409cfa8";

    let playerName = $("#player-name").val();
    let playerScore = $("#player-score").val();
    let playerTime = $("player-time").val();

    let jsondata = {
        "name": playerName,
        "score": playerScore,
        "time": playerTime
    };

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://scoreboard-0ca7.restdb.io/rest/player",
        "method": "POST", //[cher] we will use post to send info
        "headers": {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata),
        "beforeSend": function(){
          //@TODO use loading bar instead
          //disable our button or show loading bar
        }
    }
})