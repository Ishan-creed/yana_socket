const {Server, Socket} = require("socket.io");

const io = new Server({cors:"https://my-yanafrontend1.onrender.com"});

let onlineUsers = [];

io.on("connection",(socket)=>{

    console.log("new connection", socket.id);

    //listening to a connection.................

    socket.on("addNewUser",(userId)=>{

        !onlineUsers.some(user=>user.userId === userId) &&
        onlineUsers.push({
            userId,
            socketId:socket.id
        });

        console.log("onlineUsers",onlineUsers);

        io.emit("getOnlineUsers",onlineUsers);

    });


    socket.on("sendMessage",(message)=>{
        const user = onlineUsers.find(user => user.userId === message.recipientId)

        if(user){
            io.to(user.socketId).emit("getMessage",message);
            io.to(user.socketId).emit("getNotification",{
                senderId:message.senderId,
                isRead:false,
                data:new Date()
            });

        }

    })

     socket.on("disconnect",()=>{
         onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);

         io.emit("getOnlineUsers",onlineUsers);
     })

});

io.listen(3005);
