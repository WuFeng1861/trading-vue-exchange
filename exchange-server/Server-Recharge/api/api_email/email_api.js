import instance_email from './email_instance.js';
//获取token
export const sendEmailGet = (user, pass, to, from, title, content) => {
    return instance_email.get("/sendEmail", {params:{user, pass, to, from, title, content}});
};

export const sendEmailPost = (user, pass, to, from, title, content) => {
    return instance_email.post("/sendEmailPost", {user, pass, to, from, title, content});
};
