import db from "../models/index.js";

let mqEmailUser = db.mqEmailUser;
let mqEmailUserDao = {};

mqEmailUserDao.create = async (user, pass, app, email_company, limit_count, t) => {
  if(!limit_count) {
    limit_count = 900;
  }
  return mqEmailUser.create({user, pass, app, email_company, limit_count}, {transaction: t});
};

mqEmailUserDao.getAppEmailUsers = async (app, email_company) => {
  return mqEmailUser.findAll({
    where: {
      app: app,
      email_company: email_company
    },
    raw: true
  });
};

export default mqEmailUserDao;
