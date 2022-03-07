export const wrongLoginGuard = result => {
  // 用与处理http中errno为1的情况.
  // 可在axios请求之后使用.若未通过检验则返回false.
  if (+result.errno === 1) {
    sessionStorage.removeItem('accountId')
    sessionStorage.setItem('isLogin', 0)
    return false
  }
}
