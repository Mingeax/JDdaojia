<template>
  <div class="page">
    <span class="back_btn" @click="handleBackClick">く</span>
    <h2 class="title">京东登录注册</h2>
    <div class="form captcha__plan"
         v-if="loginPlan === 'captcha-plan'">
      <div class="tel">
        <span class="area__code">+86 <i class="downward__arrow"></i>
        </span>
        <input class="tel__num" type="tel" disabled
         placeholder="请输入手机号" maxlength="11"
         minlength="11" title="暂未开放验证码登录,请使用账号密码登录">
        <div class="clear__icon">×</div>
      </div>
      <div class="captcha">
        <input class="captcha__num" type="text" disabled
         maxlength="6" minlength="6" title="暂未开放验证码登录,请使用账号密码登录"
         placeholder="请输入收到的验证码">
        <div class="clear__icon">×</div>
        <button class="captcha__btn" type="button"
         @click="showToast('暂未开放验证码登录,请使用账号密码登录')">
          获取验证码
        </button>
        <!-- 注: 要对数字字段设置聚焦后的清空按钮 -->
      </div>
    </div>
    <div class="form password__plan"
         v-if="loginPlan === 'password-plan'">
      <div class="user__name">
        <input class="user__name__text" type="text"
         v-model="userName" maxlength="20" minlength="4"
         placeholder="用户名" required>
        <div class="clear__icon">×</div>
      </div>
      <div class="password">
        <input class="password__text" type="password"
         maxlength="12" minlength="4" autocomplete="new-password"
         v-model="password" required
         placeholder="请输入密码" >
        <div class="clear__icon">×</div>
        <button class="forget__password__btn" type="button"
         @click="showToast('暂未开放忘记密码功能')">
         忘记密码
        </button>
        <!-- 注: 要对数字字段设置聚焦后的清空按钮 -->
      </div>
    </div>
    <button class="login__btn" type="button"
     @click="handleLoginRegister(showToast)"
     :disabled="isLoginBtnDisabled.value">
     登 录
    </button>
    <div class="quick__btns">
      <button class="password__plan"
       @click="loginPlanChange" type="button"
       v-if="loginPlan === 'captcha-plan'">
       账号密码登录
      </button>
      <button class="password__plan"
       @click="loginPlanChange" type="button"
       v-if="loginPlan === 'password-plan'">
       手机验证码登录
      </button>
      <button class="quick__reg" type="button"
       @click="showToast('暂未开放验证码登录,请使用账号密码登录')">
       手机快速注册
      </button>
    </div>
    <div class="policy">
      <input class="policy__checkbox" type="checkbox"
       v-model="policyCheckboxState">
      <span class="policy__tips">
        若您输入的手机号未注册，将为您直接注册，
        注册即视为同意
        <a class="policy__link" href="https://plogin.m.jd.com/joinlogin/static/agreement.html?agreement=register_info">
        京东用户注册协议
        </a>
        、
        <a class="policy__link" href="https://plogin.m.jd.com/joinlogin/static/agreement.html?agreement=private_policy">
        用户隐私政策
        </a>
      </span>
      <p id="login__register__tips">
        ps:前端管理员账号(在前端校验):用户名:auth,密码:auth;<br>
        后端管理员账号(在后端校验):用户名:admin,密码:admin.
      </p>
    </div>
  </div>
  <Toast v-if='show' :message='toastMessage' />
</template>

<script>
import { computed, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import Toast, { useToastEffect } from '@/components/Toast.vue'
import { post } from '@/utils/request.js'
import { setArraySessionStorage } from '@/utils/webStorage.js'

const useLoginRegisterEffect = showToast => {
  const router = useRouter()
  const accountData = reactive({ password: '', userName: '' })

  const toggleLoginPlanEffect = () => {
    const loginPlan = ref('captcha-plan')
    const loginPlanChange = () => {
      loginPlan.value = (loginPlan.value === 'captcha-plan') ? 'password-plan' : 'captcha-plan'
    }
    return { loginPlan, loginPlanChange }
  }
  const usePolicyCheckboxEffect = () => {
    const policyCheckboxState = ref(false)
    return { policyCheckboxState }
  }

  const { loginPlan, loginPlanChange } = toggleLoginPlanEffect()
  const { policyCheckboxState } = usePolicyCheckboxEffect()

  const determineLoginAvailability = () => {
    // 如果同时满足: 登录方式为账号密码登录、同意政策、用户名和密码均非空,
    // 登录按钮才可用.
    const isLoginBtnDisabled = ref(false)
    const isAccountCompleted = computed(() => {
      if (accountData.userName && accountData.password) {
        return true
      } else {
        return false
      }
    })
    const isPasswordPlan = computed(() => {
      switch (loginPlan.value) {
        case 'captcha-plan':
          return false
        case 'password-plan':
          return true
        default:
          console.log('ERR: loginPlan.value:', loginPlan.value)
          return false
      }
    })
    isLoginBtnDisabled.value = computed(() => !(isAccountCompleted.value && isPasswordPlan.value && policyCheckboxState.value))
    return { isLoginBtnDisabled }
  }

  const handleLoginRegister = async() => {
    // 是否为前端管理员登录:
    if (
      accountData.userName === 'auth' &&
      accountData.password === 'auth'
    ) {
      showToast('前端管理员登录成功.正在跳转至首页')
      setArraySessionStorage(
        ['isLogin', 'accountId', 'userName'],
        [1, -1, accountData.userName]
      )
      setTimeout(() => {
        router.push('/front-page')
      }, 2001
      )
      return
    }
    try {
      const result = await post('user/login-register', {
        userName: accountData.userName,
        password: accountData.password
      })

      // 密码错误:
      if (
        result?.errno === 1 &&
        result?.message === 'Password Unmatched'
      ) {
        showToast('密码错误')
        // 登录成功:
      } else if (
        result?.errno === 0 &&
        result?.message === 'Login Successfully'
      ) {
      // 是否为后端管理员登录:
        if (result.id === 0) showToast('后端管理员登录成功.正在跳转至首页')
        else showToast('登录成功.正在跳转至首页')
        setArraySessionStorage(
          ['isLogin', 'accountId', 'userName'],
          [1, result.id, accountData.userName]
        )
        setTimeout(() => {
          router.push('/front-page')
        }, 2001
        )
        // 注册成功:
      } else if (
        result?.errno === 0 &&
        result?.message === 'Register Successfully'
      ) {
        showToast('账号未注册,已自动注册并登录.正在跳转至首页')
        setArraySessionStorage(
          ['isLogin', 'accountId', 'userName'],
          [1, result.id, accountData.userName]
        )
        setTimeout(() => {
          router.push('/front-page')
        },
        2001
        )
      // 出现错误
      } else {
        console.log('post请求出现错误')
        showToast('出现未知错误,请联系管理员')
      }
    } catch (e) {
      showToast('请求失败')
      console.log('error:', e)
    }
  }
  const { userName, password } = toRefs(accountData)
  const { isLoginBtnDisabled } = determineLoginAvailability()
  return {
    loginPlan,
    policyCheckboxState,
    userName,
    password,
    isLoginBtnDisabled,
    loginPlanChange,
    handleLoginRegister,
    determineLoginAvailability
  }
}

export default {
  name: 'LoginRegister',
  components: { Toast },
  setup() {
    const router = useRouter()
    const handleBackClick = () => router.back()

    const { show, toastMessage, showToast } = useToastEffect()
    const {
      loginPlan,
      policyCheckboxState,
      userName,
      password,
      isLoginBtnDisabled,
      loginPlanChange,
      handleLoginRegister
    } = useLoginRegisterEffect(showToast)

    return {
      userName,
      password,
      loginPlan,
      policyCheckboxState,
      router,
      show,
      showToast,
      toastMessage,
      isLoginBtnDisabled,
      handleBackClick,
      loginPlanChange,
      handleLoginRegister
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';

.page {
  position: relative;
  margin: 0 .25rem .25rem .25rem;
  overflow: hidden;
  .back_btn {
    position: absolute;
    left: -0.03rem;
    top: 0.14rem;
    height: .17rem;
    line-height: .17rem;
    font-weight: bolder;
    font-size: 0.17rem;
    cursor: pointer;
  }
  .title {
    text-align: center;
    font-weight: normal;
    height: .44rem;
    line-height: .44rem;
    font-size: .17rem;
  }
  .form {
    .tel,
    .captcha,
    .password,
    .user__name {
      @include row-centered-list;
      height: .5rem;
      width: 100%;
      padding: .1rem 0;
      margin-top: .2rem;
      box-sizing: border-box;
      border-bottom: solid 1px rgb(239, 239, 239);
    }
  }
    .area__code {
      display: block;
      width: 0.72rem;
      height: 100%;
      text-align: center;
      font-size: 0.16rem;
      line-height: 0.3rem;
      .downward__arrow {
        position: relative;
        top: -.04rem;
        right: -.04rem;
        height: .06rem;
        width: .14rem;
        display: inline-block;
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url('~@/assets/img/arrow_icon/downward_arrow1.png');
      }
    }
    .user__name__text,
    .tel__num,
    .captcha__num,
    .password__text {
      display: block;
      height: 100%;
      flex:1 1;
      box-sizing: border-box;
      font-size: .16rem;
      outline: none;
      &::placeholder {
        color: rgba(0,0,0,.4);
      }
    }
    .tel__num,
    .captcha__num {
      cursor: not-allowed;
    }

    .clear__icon {
      font-size: .27rem;
      color: rgba(0, 0, 0, 0.4);
      height: 100%;
      width: 0.35rem;
      line-height: .27rem;
      text-align: center;
    }
    .captcha__btn,
    .forget__password__btn {
      height: 100%;
      line-height: .29rem;
      color: rgba(226, 35, 26);
      background-color: transparent;
      font-size: .14rem;
      width: 1.1rem;
      flex: 0 0 1.1rem;
      margin: 0;
      border-left: solid 1px rgb(204, 204, 204);
    }
    .forget__password__btn {
        color: black
    }
  .login__btn {
    width: 100%;
    height: .5rem;
    border-radius: .25rem;
    color: white;
    background-image: linear-gradient(
      90deg,
      rgb(241, 0, 0),
      rgb(255, 32, 0) 73%,
      rgb(255, 79, 24)
    );
    margin-top: .3rem;
    font-size: .16rem;
    &:disabled {
      background-image: linear-gradient(
        90deg,
        rgb(250, 179, 179),
        rgb(255, 188, 179) 73%,
        rgb(255, 202, 186)
      );
    }
  }
  .quick__btns {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-top: .2rem;
    .password__plan,
    .quick__reg {
      background-color: transparent;
      color: rgba(0,0,0,.4);
      height: .19rem;
      font-size: .14rem;
    }
  }
  .policy {
    margin-top: 2rem;
    width: 100%;
    text-align: center;
    #login__register__tips,
    &__tips {
      color: rgba(0,0,0,.3);
      font-size: .13rem;
      .policy__link,
      .policy__link:focus-visible,
      .policy__link:focus {
        color: rgb(74, 144, 226);
        text-decoration: none;
      }
    }
  }
}
</style>
