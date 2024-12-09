import {config} from '../../config/index.js';
import axios from "axios";
const instance = axios.create({
  baseURL:`http://127.0.0.1:${config.HTTP_PORT}`,
  timeout:5*1000,
});
export default instance;
