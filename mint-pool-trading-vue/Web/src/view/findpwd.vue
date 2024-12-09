<template>
  <div class="container">
    <aq-header/>
    <div class="mainView">
      <div class="main-title">
        <div class="title_split"/>
        找回密码
      </div>
      <div class="inner">
        <div class="title">
          请输入用户名或邮箱
        </div>
        <div style="display: flex">
          <el-input placeholder="用户名/邮箱" v-model="account"/>
          <el-button style="margin-left: 10px;font-size: 12px" @click="getCaptcha" :disabled="nextTime !== '获取验证码'">{{ nextTime }}</el-button>
        </div>
        <el-input placeholder="验证码" v-model="code"/>
        <el-button type="primary" class="nextbtn" @click="checkNext">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import AqHeader from "../components/aqHeader.vue";
import {useSendCaptcha, useVerifyCode} from "../composition/useCaptcha.js";
import {elTip} from "../utils/index.js";
import {useRouter} from "vue-router";

const account = ref("");
const code = ref("");
const nextTime = ref("");
const router = useRouter();

onMounted(() => {
  getNextTime();
});
const getNextTime = () => {
  let sendTime = localStorage['captcha_step_1'];
  if(!sendTime) {
    nextTime.value = '获取验证码';
    return;
  }
  let time = 60 - Math.floor((Date.now() - sendTime) / 1000);
  if(time > 0) {
    nextTime.value = `(${time})`;
    requestAnimationFrame(getNextTime);
    return;
  }
  nextTime.value = '获取验证码';
  localStorage.removeItem('captcha_step_1');
};

const getCaptcha = async () => {
  if(!account.value) {
    return;
  }
  try {
    localStorage['captcha_step_1'] = new Date().getTime();
    getNextTime();
    await useSendCaptcha(account.value);
  } catch (e) {
    localStorage.removeItem('captcha_step_1');
    getNextTime();
  }
};

const checkNext = async () => {
  if (!code || !account) {
    elTip('请输入账号和验证码', 'warning');
    return;
  }
  let uniCode = await useVerifyCode(account.value, code.value);
  localStorage['captcha_step_2'] = JSON.stringify({code:uniCode, account:account.value});
  await router.push({path: '/update'});
};

</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $main-bg;
  font-size: 14px;
  .mainView {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 460px;
    height: 270px;
    margin: 50px auto;
    border-radius: 8px;
    box-shadow: 0 6px 32px -7px rgba(29, 102, 189, 0.16);
    padding: 20px 0;
    .main-title {
      display: flex;
      flex-direction: row;
      width: 316px;
      height: auto;
      align-items: center;
      font-size: 14px;
      .title_split {
        background: $blue-1;
        height: 13px;
        margin-right: 6px;
        width: 3px;
      }
    }
    .inner {
      margin-top: 25px;
      width: 298px;
      display: flex;
      flex-direction: column;
      font-size: 13px;
      .title {
        margin-bottom:  8px;
      }
      :deep(.el-input) {
        font-size: 12px;
        margin-top: 10px;
        &:first-child {
          margin-top: 0;
        }
      }

      .nextbtn {
        margin-top: 20px;
      }
    }
  }
}

@media screen and (max-width: 768px ){
  .container .mainView {
    width: 90vw;
    .main-title {
      width: 85%;
    }
    .inner {
      width: 80%;
    }
  }
}
</style>
