var express = require("express");
var app = express();
var axios = require("axios");

var port = process.env.PORT || 3000;
app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.post("/interactions", function(req, res) {});
app.post("/cover", function(req, res) {
    res.status(200).end();
    openDialog();
});

function openDialog() {
  const config = {
    headers: { Authorization: "Bearer " + process.env.SLACK_ACCESS_TOKEN }
  };
  request_view.trigger_id = payload.trigger_id;
  const body = request_view;

  axios.post("https://slack.com/api/views.open", body, config);
}

app.listen(port, function() {
  console.log("Listening on port 3000!");
});
