const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const express = require("express");
app.use(express.static("client"));

var data = {};

// config
var msg_length = 150;
var usr_length = 30;
var log = false; // log
var xp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // xp amounts

io.on("connection", (socket) => {

    if (log == true) {
        console.log(`User ${socket.id} connected`);
    }

    data[socket.id] = {
        id: socket.id,
        name: 0,
        xp: 0,
    };

    socket.on("disconnect", (reason) => {
        if (log == true) {
            console.log(`User ${socket.id} disconnected`);
        }
        delete data[socket.id];
    });

    socket.on("n", (data) => {
        data[socket.id] = data;
    });

    socket.on('name', (name) => {
        if (name.indexOf("<") !== -1) {
            var r1 = "You cannot use '<'";
            socket.emit("e", r1);
        } else if (name.length > usr_length) {
            var r1 = "Your name is too long.";
            socket.emit("e", r1);
        } else {
            data[socket.id].name = name;
            if (log == true) {
                console.log(data[socket.id].id, 'set name to', name);
            }
        }
    });

    socket.on("message", function (name, msg) {
        if (msg.length < 2) {
            var r1 = "Your message is too short.";
            socket.emit("e", r1);
        } else if (msg.length > msg_length) {
            var r1 = "Your message is too long.";
            socket.emit("e", r1);
        } else if (name.length < 3) {
            var r1 = "Your name is too short.";
            socket.emit("e", r1);
        } else if (name.length > usr_length) {
            var r1 = "Your name is too long.";
            socket.emit("e", r1);
        } else if (msg.indexOf("<") !== -1) {
            var r1 = "You cannot use '<'";
            socket.emit("e", r1);
        } else {
            if (log == true) {
                console.log(`Name ${name} Message ${msg}`);
            }
            io.emit("message", name, msg);
            var GetXp = xp[Math.floor(Math.random() * xp.length)];
            data[socket.id].xp += GetXp;
        }
    });
});

setInterval(() => {
    io.emit("d", data);
}, 500);

http.listen(8080, () => {
    console.log("listening on *:8080");
});
