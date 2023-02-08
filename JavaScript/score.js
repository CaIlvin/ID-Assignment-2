const APIKEY = "63d202d4a95709597409cfa8";

$(document).ready(function () {
  getScore();
  $("#scoreSubmit").on("click", function(e){
      e.preventDefault();
      let playerName = $("#playerName").val();
      let playerScore = score;
      let playerTime = time;
  
      let jsondata = {
          "Name": playerName,
          "Score": playerScore,
          "Time": playerTime
      };
      let settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://scoreboard-0ca7.restdb.io/rest/player",
          "method": "POST",
          "headers": {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
          },
          "processData": false,
          "data": JSON.stringify(jsondata),
          'beforeSend':function() {
              $("scoreSubmit").prop("disabled", true);
              $("formID").trigger("reset");

          }
      }

      $.ajax(settings).done(function (response) {
          getScore();
      });
  })


})

function getScore(limit = 10, all = true) {
  let settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://scoreboard-0ca7.restdb.io/rest/player?q={}&sort=Score&dir=-1",
      "method": "GET",
      "headers": {
      "content-type": "application/json",
      "x-apikey": APIKEY,
      "cache-control": "no-cache"
      },
  }  

  $.ajax(settings).done(function (response) {
      let content = ""
      for (var i = 0; i < response.length && i < limit; i++)
      {
          content = `${content}
          <tr id='${response[i]._id}'><td>${response[i].Name}</td>
        <td>${response[i].Score}</td><td>${response[i].Time}</td>`
      }

      $("#scoreboard tbody").html(content);
  })
}