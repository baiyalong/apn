var http = require('http');
var apn = require('apn');

var options = {production:true,connectionTimeout:0,batchFeedback:true,interval:300};
var apnConnection = new apn.Connection(options);

var push = function (j) {
    var myDevice = new apn.Device(j.token);
    var note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 1;
    note.sound = "ping.aiff";
    note.alert = j.msg;//"\uD83D\uDCE7 \u2709 You have a new message";
    note.payload = {'message':j.msg};

    apnConnection.pushNotification(note, myDevice);
}

/*
var options = {
    "batchFeedback": true,
    "interval": 300
};*/

var feedback = new apn.Feedback(options);
feedback.on("feedback", function (devices) {
    devices.forEach(function (item) {
        console.log(item)
    });
});


http.createServer(function (req, resp) {
    req.on('data', function (chunk) {
        push(JSON.parse(chunk))
    });
    req.on('end', function () {
        resp.writeHead(200, "OK", {'Content-Type': 'text/plain'});
        resp.end();
    });
}).listen(8089);

console.log('Server running ---');

