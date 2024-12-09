<template>
  <section>
    <div class="wave">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="container">
      <div class="mainView">
        <div class="imgView">
          <img src="../assets/logo.jpg" class="loginBg"/>
        </div>
        <div class="dataView">
          <h1>Login</h1>
          <p class="toRegister">现在还没有账户? <router-link to="/register">前往注册！</router-link></p>
          <el-form>
            <el-form-item>
              <el-input v-model="loginData.account" placeholder="请输入用户名或邮箱"/>
            </el-form-item>
            <el-form-item style="margin-top: 10px">
              <el-input type="password" v-model="loginData.passwordStr" show-password placeholder="请输入密码"/>
            </el-form-item>
            <el-form-item>
              <div class="keep">
                <el-checkbox v-model="accountKeep">记住账号</el-checkbox>
                <router-link to="/find" class="forget"><span>忘记密码?</span></router-link>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 100%" type="primary" @click="login">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

    </div>
  </section>

</template>

<script setup>
import{useLogin} from "../composition/useUser.js";
import {useRouter} from "vue-router";

const accountKeep = ref(false)

const loginData = ref({
  account: "",
  passwordStr: ""
});

let router = useRouter();
onMounted(() => {
  let account = localStorage['accountKeep'];
  if(account) {
    accountKeep.value = true;
    loginData.value.account = account;
  }
});

const login = () => {
  useLogin(loginData.value.account, loginData.value.passwordStr);
  if(accountKeep.value) {
    localStorage["accountKeep"] = loginData.value.account;
    return;
  }
  localStorage.removeItem("accountKeep");
};


</script>

<style scoped lang="scss">
@import '@/styles/wave.scss';
$border_radius:20px;
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to right bottom, $blue-1, $blue-3,$blue-1);
  .mainView {
    display: flex;
    width: 700px;
    height: 420px;
    background-color: #E0EDFC;
    border-radius: $border_radius;
    overflow: hidden;
    //transform: scale(0.8);
    .imgView {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 80%;
      height: 100%;
      .loginBg {
        height: 420px;
        width: auto;
      }
      .welcome {
        position: absolute;
        font-family: sans-serif;
        left: 38px;
        transform: skewY(17deg);
        color: #73A8C7;
      }
    }
    .dataView {
      width: calc(40% + $border_radius);
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: $border_radius;
      margin-left: -$border_radius;
      z-index: 1;
      padding: $border_radius;
      a {
        color: $blue-1;
      }
      h1 {
        color: $blue-2;
      }
      .toRegister {
        font-size: 14px;
        color: #656779;
        padding-bottom: 15px;
      }
      :deep(.el-form-item) {
        padding: 5px 0;
        .el-input {
          font-size: 12px;
        }
      }
      .keep {
        display: flex;
        width: 100%;
        margin-top: -5px;
        flex-direction: row;
        justify-content: space-between;
        //font-size: 12px;
        //:deep(.el-checkbox__inner) {
        //  width: 12px;
        //  height: 12px;
        //}
        //:deep(.el-checkbox__input) {
        //  font-size: 12px;
        //}
        //:deep(.el-checkbox__label) {
        //  font-size: 12px;
        //}
      }
    }

  }
}
@media screen and (max-width: 768px) {
  .container .mainView {
    display: flex;
    flex-direction: column;
    max-width: 80vw;
    width: 100%;
    height: auto;
    align-items: center;
    .imgView {
      width: 100%;
      max-width: 100%;
      .loginBg {
        object-fit: scale-down;
        width: 100%;
        height: auto;
      }
    }
    .dataView {
      width: 100%;
      height: 100%;
      margin-left: 0;
      //margin-top: calc(-1 * $border-radius);
    }
  }
}
</style>


