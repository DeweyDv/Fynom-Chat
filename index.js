const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const express = require("express");
app.use(express.static("client"));

var data = {};
var time = 0;
var requests = 0;

// rate limit settings
var CIT = 10; // max connections requests in total time
var TS = 30; // total time

// chat config 
var ML = 150; // max message length 
var MN = 50; // max name length

io.on("connection", (socket) => {
    requests++;

    console.log(`User ${socket.id} connected`);
    data[socket.id] = {
        id: socket.id,
    };

    socket.on("disconnect", (reason) => {
        console.log(`User ${socket.id} disconnected`);
        delete data[socket.id];
    });

    socket.on("n", (data) => {
        data[socket.id] = data;
    });

    socket.on("message", function (name, msg) {
        if (msg.length < 2) {
            var r1 = "Your message is too short.";
            socket.emit("e", r1);
        } else if(msg.length>ML) {
		    var r1 = "Your message is too long.";
            socket.emit("e", r1);
		} else if(name.length<3) {
		    var r1 = "Your name is too short.";
            socket.emit("e", r1);
		} else if(name.length>MN) {
		    var r1 = "Your name is too long.";
            socket.emit("e", r1);
		} else if (msg.indexOf("<") !== -1) {
		    var r1 = "You cannot use '<'.";
            socket.emit("e", r1);
	    } else {
            io.emit("message", name, msg);
        }
    });

    if (requests > CIT) {
        socket.emit("error");
        socket.disconnect();
    }
});

// main loop
setInterval(() => {
    io.emit("d", data);
}, 500);

// rate limit timer
setInterval(function () {
    time++;
    if (time > TS) {
        time = 0;
        requests = 0;
    }
}, 1000);

http.listen(8080, () => {
    console.log("listening on 127.0.0.0:8080");
});

