// const app = require('express')();
// const {Server} = require('socket.io');
// const { v4: uuidv4 } = require("uuid");

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


const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {transports: ['websocket']});
const PORT = process.env.PORT || 3000;

const { v4: uuidv4 } = require("uuid");

app.get('/', (req, res) => {
    res.write(`<h1>Socket IO Start on Port : ${PORT}</h1>`);
});


const _login_user = [];

io.on('connection', (socket) => {

    socket.on('login', (data) =>{
        var join_data = JSON.parse(data)
        console.log('login ' + data)
        join_data['socketId'] = socket.id
        _login_user.push(join_data)

        socket.join('loginRoom')
        socket.to('loginRoom').emit('loggedin', join_data); 

        socket.on('disconnect', () => {    
            console.log('login disconnect ' + data)
            const indexOfObject = _login_user.findIndex(object => {
                return object.userId === join_data['userId'];
            });
            _login_user.splice(indexOfObject, 1);
            socket.to('loginRoom').emit('loggedout', join_data);
            socket.to('loginRoom').emit('disconnected', join_data);
        })
    });


    socket.on('inituser', (data) => {
        var join_data = JSON.parse(data)
        console.log('inituser ' + data)
        var call_obj = _login_user.filter(x => x['userId'] != join_data['userId'])
        socket.to('loginRoom').emit('inituserstate', call_obj); 
    })


    socket.on('call', (data) =>{
        var join_data = JSON.parse(data)
        console.log('call ' + data)
        const _room = uuidv4()
        join_data['room'] = _room
        socket.to(join_data['socketId']).emit('calling', join_data); 
    });

    socket.on('denide', (data) =>{
        var join_data = JSON.parse(data)
        console.log('denide ' + data)
        socket.to(join_data['socketId']).emit('denided', join_data); 
    });

    socket.on('accept', (data) =>{
        var join_data = JSON.parse(data)
        console.log('accept ' + data)
        var caller_obj = _login_user.filter(x => x['userId'] == join_data['caller'])
        console.log('send accept to ' + caller_obj[0]['socketId'])
        socket.to(caller_obj[0]['socketId']).emit('accepted', join_data); 
    });

    socket.on('denideaccept', (data) =>{
        var join_data = JSON.parse(data)
        console.log('accept ' + data)
        var caller_obj = _login_user.filter(x => x['userId'] == join_data['caller'])
        console.log('send accept to ' + caller_obj[0]['socketId'])
        socket.to(caller_obj[0]['socketId']).emit('denideaccepted', join_data); 
    });


    socket.on('leaveroom', (data) =>{
        var join_data = JSON.parse(data)
        console.log('leaveroom ' + data)
        console.log(socket.rooms)
        socket.leave(socket.rooms[0])
        socket.to(socket.rooms[0]).emit('disconnected', join_data)
    });


    socket.on('join', (data) =>{
        var join_data = JSON.parse(data)
        console.log('join ' + data)
        socket.join(join_data.room);
        socket.to(join_data.room).emit('joined', join_data.userName); 

        socket.on('disconnect', () => {
            console.log('join disconnect ' + data)
            socket.to(join_data.room).emit('disconnected', join_data.userName);
        })
    });

    socket.on('offer', (offer) => {
        var offer_data = JSON.parse(offer)
        console.log('offer ' + offer_data.userName)  
        socket.to(offer_data.room).emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        var answer_data = JSON.parse(answer)
        console.log('answer ' + answer_data.userName)
        socket.to(answer_data.room).emit('answer', answer);
    });

    socket.on('ice', (ice) => {
        var ice_data = JSON.parse(ice)
        console.log('ice ' + ice_data.userName)
        socket.to(ice_data.room).emit('ice', ice);
    });

});

server.listen(PORT, () => {
    console.log('listening on *:3000');
})