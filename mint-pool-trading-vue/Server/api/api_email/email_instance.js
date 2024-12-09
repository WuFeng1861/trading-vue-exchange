import {config} from '../../config/index.js';
import axios from "axios";
let baseUrl_email = config.EMAIL_API;
const instance_email = axios.create({
    baseURL:baseUrl_email,
    timeout:5*1000,
});
export default instance_email;
