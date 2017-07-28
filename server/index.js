const express = require('express');
const app = express();
const path = require('path');
const socketio = require('socket.io');
require('events').EventEmitter.prototype._maxListeners = 100;

app.use('/vendor', express.static(path.join(__dirname, '..', 'node_modules')));
app.use('/img', express.static(path.join(__dirname, '..', 'public', 'img')));
app.use('/sound', express.static(path.join(__dirname, '..', 'public', 'sound')));
app.use('/js', express.static(path.join(__dirname, '..', 'public', 'js')));

const server = app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));

const io = socketio.listen(server);

app.use('/', require('./routes')(io));

io.on('connection', socket => {
  io.emit('nsps', Object.keys(io.nsps).filter(nsp => {
    return Object
      .keys(io.nsps[nsp].sockets)
      .length === 1;
  }));
});

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'home.html'));
});
