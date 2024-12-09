import {getbalance, getWeekEarnings} from "../controllers/mint.js";
import {syncRegister} from "../controllers/user.js";
let req = {
  body: {}
};
let res = {
  json: (data) => console.log(data),
  send: (data) => console.log(data),
};

function testBalance() {
  req.body.id = 1;
  console.log("Testing getbalance function...");
  getbalance(req, res);
}
function testSyncRegister(){
  console.log("Testing syncRegister function...");
  req.body = {
    id:1,
    email: '1379459026@qq.com',
    invitation_code: 'HJSIXW',
    inviter_id: "0"
  };
  syncRegister(req, res);
}


function testWeekEarnings() {
  console.log("Testing getWeekEarnings function...");
  req.body = {
    id:1,
    email: '1379459026@qq.com',
    invitation_code: 'HJSIXW',
    inviter_id: "0"
  };
  getWeekEarnings(req, res);
}

// testBalance();
// testSyncRegister();
testWeekEarnings();

