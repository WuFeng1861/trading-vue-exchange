export const socketEmit = (socket, event, data) => {
  socket.emit(event, data);
};
