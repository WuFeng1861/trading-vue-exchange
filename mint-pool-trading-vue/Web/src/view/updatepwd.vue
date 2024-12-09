<template>
  <div class="container">
    <aq-header/>
    <div class="mainView">
      <div class="main-title">
        <div class="title_split"/>
        修改密码
      </div>
      <div class="inner">
        <div class="title">
          请输入修改密码
        </div>
        <el-form :model="updateData" :rules="rules" ref="form" @submit="update">
          <el-form-item prop="passwordStr">
            <el-input v-model="updateData.passwordStr" type="password" placeholder="请输入密码"/>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input v-model="updateData.confirmPassword" type="password" placeholder="请确认密码"/>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="nextbtn" @click="update">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import AqHeader from "../components/aqHeader.vue";
import {useRouter} from "vue-router";
import {validatePassword} from "../utils/index.js";
import {useChangePassword} from "../composition/useCaptcha.js";

const router = useRouter();
const code = ref('');
const account = ref('');

onMounted(() => {
  let data = localStorage['captcha_step_2'];
  if(!data) {
    // router.push('/find');
    return;
  }
  code.value = JSON.parse(data).code;
  account.value = JSON.parse(data).account;

});
const updateData = ref({
  passwordStr:"",
  confirmPassword:""
});

const form = ref(null);
let passOther = true;
const rules = reactive({
  passwordStr: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {validator: (rule, value, callback) => {
        if(!validatePassword(value)) {
          return callback("密码需要6位以上，且包含大小写字母");
        }
        if(passOther) {
          passOther = false;
          form.value.validateField('confirmPassword');
          setTimeout(() =>{passOther = true;}, 1000);
        }
        return callback();
      }, trigger: 'blur'}
  ],
  confirmPassword:[
    {required: true, message: '请确认密码', trigger: 'blur'},
    {validator: (rule, value, callback) => {
        if(value !== updateData.value.passwordStr) {
          return callback(new Error('两次输入的密码不一致'));
        }
        if(!validatePassword(value)) {
          return callback("密码需要6位以上，且包含大小写字母");
        }
        if(passOther) {
          passOther = false;
          form.value.validateField('passwordStr');
          setTimeout(() =>{passOther = true;}, 1000);
        }
        return callback();
      }, trigger: 'blur'}
  ]
});

let do_update = false;
const update = (e) => {
  if(do_update) {
    return;
  }
  e.preventDefault();
  form.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    do_update = true;
    let result = await useChangePassword(account.value, updateData.value.passwordStr, code.value);
    localStorage.removeItem('captcha_step_2');
    if(result) {
      router.push('/');
    }
    do_update = false;
  });
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
        margin-top: 5px;
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
