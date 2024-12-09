import {createSocketServer} from "./websocket/index.js";
import { createServer } from 'http';

// websocket 连接
const server = createServer();
createSocketServer(server);