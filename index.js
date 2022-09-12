// const app = require('express')();
// const {Server} = require('socket.io');
// const { v4: uuidv4 } = require("uuid");


const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {transports: ['websocket']});
const PORT = process.env.PORT || 3000;


// async function server(){
//     const http = require('http').createServer(app);
//     const io = new Server(http, {transports: ['websocket']});
//     const roomName = 'prem'  //uuidv4();
//     io.on('connection', (socket) => {

//         console.log('this is main socket ' + socket)

//         socket.on('join', (data) =>{
//             console.log('join ' + data)
//             var x = JSON.parse(data)
//             console.log('join ' + x.msg)
//             // console.log('join ' + uuidv4())
//             socket.join(x.msg);
//             socket.to(x.msg).emit('joined'); 

//             socket.on('disconnect', () => {
//                 console.log('disconnect')
//                 console.log('disconnect ' + x.msg)
//                 // var x = JSON.parse(data)
//                 // socket.to(x.msg).broadcast.emit('user-disconnected', x.msg)
//             })
    
//        });
//        socket.on('offer', (offer) => {
//             console.log('offer ' + roomName)
//             var x = JSON.parse(offer)
//             console.log('offer ' + offer)
//            socket.to(x.msg).emit('offer', offer);
//         });
//         socket.on('answer', (answer) => {
//             console.log('answer ' + roomName)
//             var x = JSON.parse(answer)
//             console.log('answer ' + answer)
//             socket.to(x.msg).emit('answer', answer);
//         });
//         socket.on('ice', (ice) => {
//             console.log('ice ' + roomName)
//             var x = JSON.parse(ice)
//             console.log('ice ' + ice)
//             socket.to(x.msg).emit('ice', ice);
//         });

//     });
//     http.listen(3000, () => console.log('server open !!'));
// }

// server();



app.get('/', (req, res) => {
    res.write(`<h1>Socket IO Start on Port : ${PORT}</h1>`);
});

io.on('connection', (socket) => {

    console.log('this is main socket ' + socket)

    socket.on('join', (data) =>{
        console.log('join ' + data)
        var x = JSON.parse(data)
        console.log('join ' + x.room)
        // console.log('join ' + uuidv4())
        socket.join(x.room);
        socket.to(x.room).emit('joined'); 

        socket.on('disconnect', () => {
            console.log('disconnect')
            console.log('disconnect ' + x.room)
            // var x = JSON.parse(data)
            // socket.to(x.msg).broadcast.emit('user-disconnected', x.msg)
        })

    });
    socket.on('offer', (offer) => {
        // console.log('offer ' + roomName)
        var x = JSON.parse(offer)
        console.log('offer ' + offer)
        socket.to(x.room).emit('offer', offer);
    });
    socket.on('answer', (answer) => {
        // console.log('answer ' + roomName)
        var x = JSON.parse(answer)
        console.log('answer ' + answer)
        socket.to(x.room).emit('answer', answer);
    });
    socket.on('ice', (ice) => {
        // console.log('ice ' + roomName)
        var x = JSON.parse(ice)
        console.log('ice ' + ice)
        socket.to(x.room).emit('ice', ice);
    });

});


server.listen(PORT, () => {
    console.log('listening on *:3000');
})