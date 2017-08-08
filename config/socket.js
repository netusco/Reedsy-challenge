import SocketIO from 'socket.io';

let globalSocket;

export default (server, agenda) => {

  let io = SocketIO(server);
  console.log('[Websocket] loading socket.io, waiting for clients...');

  io.on('connection', (socket) => {
    globalSocket = socket;

    console.log('[Websocket] user connected');
    
    socket.on('disconnect', () => {
      console.log('[Websocket] user disconnected');
    });
  });
}


export const updateConversionList = () => {
  if(!globalSocket) return console.log('[Websocket] no clients connected to socket.io, impossible to emit updateConversionList signal');
  console.log('[Websocket] emitting signal updateConversionList');
  globalSocket.emit('updateConversionList');
}
