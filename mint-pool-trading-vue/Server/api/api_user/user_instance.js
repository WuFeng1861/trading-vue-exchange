import {config} from '../../config/index.js';
import axios from "axios";
let baseUrl = config.USER_API;
const instance = axios.create({
  baseURL:baseUrl,
  timeout:5*1000,
});
export default instance;
