const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/javascript', (req,res) => {
    res.sendFile(__dirname + '/public/javascript.html');
});
app.get('/angular', (req,res) => {
    res.sendFile(__dirname + '/public/angular.html');
});
app.get('/css', (req,res) => {
    res.sendFile(__dirname + '/public/css.html');
});
//tech namespace
const tech = io.of('/tech');

//Note we are using the syntax socket "client events" and io "server events"
tech.on('connection', (socket) => {
    console.log('user connected');
    // socket.emit('message', {Avinash: 'hey how are you?'});
    // socket.on('another event', (data) => {
    //     console.log(data);
    // });
    socket.on('join', (data) => {
        socket.join(data.room);
        tech.in(data.room).emit('message', `New user joined ${data.room} room!`); //when someone joins the room, message others in the room
    });

    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        tech.in(data.room).emit('message', data.msg);//message should ve visible to others in the room
    });

    socket.on('disconnect', () => {
        console.log('disconnected');
        tech.emit('message', 'user disconnected');
    });
});