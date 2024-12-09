<template>
  <section>
    <div class="wave">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="container">
      <div class="mainView">
        <div class="dataView">
          <h1>Register</h1>
          <p class="toRegister">已有帐户?
            <router-link to="/">前往登录！</router-link>
          </p>
          <el-form :model="registerData" :rules="rules" :inline-message="true" ref="form" @submit="register">
            <el-form-item prop="email">
              <el-input v-model="registerData.email" placeholder="请输入邮箱"/>
            </el-form-item>
            <el-form-item prop="username">
              <el-input v-model="registerData.username" placeholder="请输入用户名"/>
            </el-form-item>
            <el-form-item prop="passwordStr">
              <el-input v-model="registerData.passwordStr" show-password type="password" placeholder="请输入密码"/>
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input v-model="registerData.confirmPassword" show-password type="password" placeholder="请确认密码"/>
            </el-form-item>
            <!--<el-form-item prop="verifyCode">-->
            <!--  <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center">-->
            <!--    <el-input style="margin-right: 10px" v-model="registerData.verifyCode" placeholder="请输入邮箱验证码"/>-->
            <!--    <el-button :disabled="nextTime !== '获取验证码'" @click="getRegisterCaptcha">{{nextTime}}</el-button>-->
            <!--  </div>-->
            <!--</el-form-item>-->
            <el-form-item prop="code">
              <el-input v-model="registerData.code" placeholder="请输入邀请码"/>
            </el-form-item>
            <el-form-item>
              <el-button native-type="submit" type="primary" style="width: 100%">
                注册
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="imgView">
          <img src="../assets/logo.jpg" class="loginBg"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {checkUserData} from "../api/user/api.js";
import {validatePassword} from "../utils/index.js";
import {useCheckCode, useRegister} from "../composition/useUser.js";
import {useRouter} from "vue-router";
import {useSendRegisterEmailCaptcha} from "@/composition/useCaptcha.js";

const registerData = ref({
  email: "",
  username: "",
  passwordStr: "",
  confirmPassword: "",
  // verifyCode: "",
  code: ""
});
const nextTime = ref("获取验证码");
onMounted(() => {
  getNextTime();
  const router = useRouter()
  const inviter = router.currentRoute.value.query['inviter'];
  if (!inviter) {
    return;
  }
  registerData.value.code = inviter;
})

const form = ref(null);

let passOther = true;
const rules = reactive({
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']},
    {
      validator: async (rule, value, callback) => {
        let result = await checkUserData(value);
        if (result.result) {
          return callback();
        }
        return callback(new Error('邮箱已注册'));
      }, trigger: 'blur'
    }
  ],
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {
      validator: async (rule, value, callback) => {
        if (value.length < 3 || value.length > 10) {
          return callback(new Error('用户名长度在3~10个字符之间'));
        }
        let result = await checkUserData(undefined, value);
        if (result.result) {
          return callback();
        }
        return callback(new Error('用户名已存在'));
      }, trigger: 'blur'
    }
  ],
  passwordStr: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {
      validator: (rule, value, callback) => {
        if (!validatePassword(value)) {
          return callback("密码需要6位以上，且包含大小写字母");
        }
        if (passOther) {
          passOther = false;
          form.value.validateField('confirmPassword');
          setTimeout(() => {
            passOther = true;
          }, 1000);
        }
        return callback();
      }, trigger: 'blur'
    }
  ],
  confirmPassword: [
    {required: true, message: '请确认密码', trigger: 'blur'},
    {
      validator: (rule, value, callback) => {
        if (value !== registerData.value.passwordStr) {
          return callback(new Error('两次输入的密码不一致'));
        }
        if (!validatePassword(value)) {
          return callback("密码需要6位以上，且包含大小写字母");
        }
        if (passOther) {
          passOther = false;
          form.value.validateField('passwordStr');
          setTimeout(() => {
            passOther = true;
          }, 1000);
        }
        return callback();
      }, trigger: 'blur'
    }
  ],
  // verifyCode: [
  //   {required: true, message: '请输入邮箱验证码', trigger: 'blur'},
  // ],
  code: [
    {required: true, message: '请输入邀请码', trigger: 'blur'},
    {
      validator: async (rule, value, callback) => {
        let result = await useCheckCode(value);
        if (result) {
          callback();
        }
        callback(new Error('邀请码无效'));
      }, trigger: 'blur'
    }
  ]
});

let do_register = false;
const register = async (e) => {
  if (do_register) {
    return;
  }
  e.preventDefault();
  form.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    do_register = true;
    await useRegister(registerData.value.email, registerData.value.username, registerData.value.passwordStr, registerData.value.code, registerData.value.verifyCode);
    ElMessage.success("注册成功！");
    do_register = false;
  });
};

let router = useRouter();

const getNextTime = () => {
  let sendTime = localStorage['register_verify_time'];
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
  localStorage.removeItem('register_verify_time');
};

const getRegisterCaptcha = async () => {
  if(!registerData.value.email) {
    return;
  }
  try {
    localStorage['register_verify_time'] = new Date().getTime();
    getNextTime();
    await useSendRegisterEmailCaptcha(registerData.value.email);
  } catch (e) {
    localStorage.removeItem('register_verify_time');
    getNextTime();
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/wave.scss';

$border_radius: 20px;
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to right bottom, $blue-1, $blue-3, $blue-1);

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
      width: calc(60% + $border_radius);
      height: 100%;
      margin-left: -$border_radius;

      .loginBg {
        height: 420px;
        width: auto;
      }
    }

    .dataView {
      width: calc(40% + $border_radius);
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: $border_radius;
      //margin-left: -$border_radius;
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
    flex-direction: column;
    width: 80vw;
    height: auto;

    .imgView {
      width: 100%;
      display: none;
    }

    .dataView {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

