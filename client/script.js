$(document).ready(function () {
    document.getElementsByClassName('join')[0].onclick = function () {
		var socket = io();
		var x = document.getElementsByClassName('username')[0].value;
		socket.emit('name',x);
        document.getElementsByClassName("main")[0].style.visibility = "visible";
        document.getElementsByClassName("index")[0].style.visibility = "hidden";
        let myData = {
            roomID: 0,
        };
        var userlist = {};
        socket.on("d", (data) => {
            userlist = data;
        });
        var btn = document.createElement("button");
        var r1 = "room1";
        btn.id = "pulic_room";
        btn.className = "room1";
        btn.setAttribute("width", "50px");
        btn.setAttribute("height", "30px");
        document.getElementsByClassName("rooms_row")[0].appendChild(btn);
        document.getElementById("pulic_room").innerHTML = "Room 1 [Public]";
        document.getElementById("pulic_room").onclick = function () {
            myData.roomID = 1;
            document.getElementsByClassName("chat_default")[0].style.visibility = "visible";
        };
        document.getElementById("close").onclick = function () {
            myData.roomID = 0;
            document.getElementsByClassName("chat_default")[0].style.visibility = "hidden";
        };
        document.getElementById("send_room1").onclick = function () {
            var data = document.getElementsByClassName("input_r1")[0].value;
            socket.emit("message", userlist[socket.id].name, data);
            document.getElementsByClassName("input_r1")[0].value = " ";
            scroll();
        };
        socket.on("message", function (uid, msg) {
            var NEW_MSG = document.createElement("li");
            NEW_MSG.innerHTML = uid + ": " + msg;
            document.getElementsByClassName("room1_public")[0].appendChild(NEW_MSG);
        });
        socket.on("e", function (r) {
            var log = document.createElement("li");
            log.innerHTML = r;
            document.getElementsByClassName("room1_public")[0].appendChild(log);
        });
        socket.on("error", function () {
            socket.disconnect();
            var y = "connection closed";
            alert(y);
            console.clear();
            console.log(y);
        });
        setInterval(()=> {
            document.getElementsByClassName("friends_row")[0].innerHTML = " ";
            for (const user in userlist) {
                var xid = userlist[user].name + ' | ⭐' + userlist[user].xp;
                var item = document.createElement("li");
                item.textContent = xid;
                document.getElementsByClassName("friends_row")[0].appendChild(item);
            }
            x = Object.keys(userlist).length;
            document.getElementsByClassName("friends_header_txt")[0].innerHTML = "Online [" + x + "]";
        }, 50);

        function scroll() {
            if (document.getElementsByTagName("li").length > 21) {
                document.getElementsByClassName("chat_default")[0].style = "overflow-y:scroll;";
            }
            let x = document.getElementsByClassName("chat_default")[0];
            x.scrollTo(0, x.scrollHeight);
        }
    }
});