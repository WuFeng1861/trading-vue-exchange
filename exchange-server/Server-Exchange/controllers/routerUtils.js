// 检查发起人是该用户
export function queryCheckTransferId(req, id) {
  if(!id) {
    throw new Error('用户id不能为空');
  }
  let user_id = req.headers['authorization'].split(" ")[2];
  if (user_id.toString() !== id.toString()) {
    throw new Error('用户不匹配');
  }
}
