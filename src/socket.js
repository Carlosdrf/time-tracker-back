import jwt from 'jsonwebtoken'
import config from './config';

module.exports = (io) => {
  io.on("connection", (socket) => {
    var userID;
    try {
      const decoded = jwt.verify(socket.handshake.query.jwt, config.SECRET)

      socket.join(decoded.id)
      console.log("just joined, id: ", decoded.id);
      userID = decoded.id

    } catch (error) {
      console.log('unable to join user')
    }

    // console.log(io.sockets.adapter.rooms.get(userID))
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
    socket.on("client:joinRoom", (token) => {
      const decoded = jwt.verify(token, config.SECRET)

      socket.join(decoded.id);
      console.log("just joined, welcome ", decoded.id);
    });
    socket.on("client:start_timer", (data) => {
      socket.broadcast.to(userID).emit("server:start_timer", data);
    });
    socket.on("client:loadEntries", (data) => {
      socket.broadcast.to(userID).emit("server:getEntries", data);
    });
    socket.on("client:end_entry", (data) => {
      socket.broadcast.to(userID).emit("server:end_entry")
    });
  });
}