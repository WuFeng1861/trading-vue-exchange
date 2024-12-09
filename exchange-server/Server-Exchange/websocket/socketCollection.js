const socketCache = {};

export const addSocket = (name, socket) => {
  if (socketCache[name]) {
    socketCache[name].push(socket);
  } else {
    socketCache[name] = [socket];
  }
};

export const removeSocket = (name, socket) => {
  if (!socketCache[name]) {
    return;
  }
  const index = socketCache[name].indexOf(socket);
  if (index !== -1) {
    socketCache[name].splice(index, 1);
  }
};

export const removeSocketInAll = (Socket) => {
  let keys = Object.keys(socketCache);
  for (let i = 0; i < keys.length; i++) {
    const sockets = socketCache[keys[i]];
    const index = sockets.indexOf(Socket);
    if (index !== -1) {
      sockets.splice(index, 1);
    }
  }
};

export const getSockets = (name) => {
  return socketCache[name] || [];
};

