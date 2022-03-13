<template>
  <div class="user__field">
    <div class="iconfont icon-sixin"></div>
    <div class="user__info">
      <div class="avatar">
        <img src="../../../assets/img/mine/avatar_img.jpg"
         alt="用户头像" class="avatar__img">
      </div>
      <div class="user__identity">
        <p class="user__name" v-if="!!+isLogin">
          {{userName}}
        </p>
        <router-link class="login__register" v-if="!+isLogin"
         to="/login-register">
          登录/注册
        </router-link>
        <span class="user__tel" v-if="!!+isLogin"
         @click="showToast('固定的手机号')">
          1069643013
          <span class="iconfont icon-xiugai" />
        </span>
      </div>
    </div>
  </div>

  <div class="user__property sub__block">
    <div class="wallet">
      <div class="wallet__icon">
        <img src="../../../assets/img/mine/wallet_icon.png"
         alt="钱包图标" class="wallet__icon__img">
      </div>
      <div class="property__name">我的钱包</div>
    </div>
    <div id="seperator" />
    <div v-for="(item, index) in propertyList" :key="index"
     :class="item.enName" class="property__item">
      <div class="property__amount"  v-if="!!+isLogin">{{item.amount}}</div>
      <div class="property__amount"  v-if="!+isLogin">-</div>
      <div class="property__name">{{item.cnName}}</div>
    </div>
  </div>

  <div class="function__serve sub__block">
    <h3 class="title">功能服务</h3>
    <div class="function__serve__matrix">
      <div class="function__serve__item"
       v-for="(item, index) in advancedFunctionServeList" :key="index"
       @click="handleAddressBlock(item)">
        <div class="function__serve__icon">
          <img :src="item.imgURL"
           :alt="item.cnName" class="function__serve__img">
        </div>
        <div class="function__serve__name">
          {{item.cnName}}
        </div>
      </div>
    </div>
  </div>

  <div class="account__exit sub__block"
   v-if="!!+isLogin" @click="handleAccountExitBtn">
    <p id="tuichuzhanghao">退出账号</p>
  </div>
  <Toast v-if="show" :message="toastMessage" />
</template>

<script>
import { reactive, toRefs } from 'vue'
import { get } from '../../../utils/request.js'
import Toast, { useToastEffect } from '../../../components/Toast.vue'
import { setArraySessionStorage } from '../../../utils/webStorage.js'
import router from '../../../router/index.js'
// 以后要添加路由导航

const receiveMineList = () => {
  // 从后端接收页面的信息列表
  // 注: 页面信息列表应改成前端设置.
  const mineLists = reactive({ propertyList: [], functionServeList: [] })
  const processMineLists = () => {
    Promise.all([
      get('property-list', { headers: { 'Cache-Control': 'max-age=2592000' } }),
      get('function-serve-list', { headers: { 'Cache-Control': 'max-age=2592000' } })])
      .then(res => {
        mineLists.propertyList = res[0]
        const addFunctionServeImgURL = () => {
          res[1].forEach(funcSrv => {
            funcSrv.imgURL = require('@/assets/img/mine/' + funcSrv.enName + '.png')
            mineLists.functionServeList.push(funcSrv)
          })
        }
        addFunctionServeImgURL()
      })
  }
  processMineLists()
  const { functionServeList: advancedFunctionServeList, propertyList } = toRefs(mineLists)
  return { advancedFunctionServeList, propertyList }
}
const useLoginStateEffect = () => {
  // 注意isLogin储存的是字符串'1'/'0',
  // 使用时需转换为数字再转换为布尔值
  const loginState = reactive({
    isLogin: 0,
    accountId: null,
    userName: null
  })
  loginState.isLogin = sessionStorage.getItem('isLogin')
  loginState.accountId = sessionStorage.getItem('accountId')
  loginState.userName = sessionStorage.getItem('userName')
  const { isLogin, userName, accountId } = toRefs(loginState)

  const handleAccountExitBtn = () => {
    setArraySessionStorage(['isLogin'], [0])
    sessionStorage.clear()
    window.location.reload(true)
  }
  console.log('isLogin, userName, accountId:', isLogin, userName.value, accountId.value)
  return { isLogin, userName, accountId, handleAccountExitBtn }
}
const handleAddressBlock = item => {
  if (item.enName === 'address') router.push({ name: 'AddressList' })
}
export default {
  name: 'Mine',
  components: { Toast },
  setup() {
    const { advancedFunctionServeList, propertyList } = receiveMineList()
    const { show, toastMessage, showToast } = useToastEffect()
    const { isLogin, userName, accountId, handleAccountExitBtn } = useLoginStateEffect()
    return {
      advancedFunctionServeList,
      propertyList,
      show,
      toastMessage,
      showToast,
      isLogin,
      userName,
      accountId,
      handleAccountExitBtn,
      handleAddressBlock
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/icon-font.scss';
@import '@/style/mixin.scss';

.sub__block {
  margin: .12rem .12rem;
  padding: .12rem .12rem;
  border-radius: .12rem;
  background-color: white;
  #tuichuzhanghao {
    text-align: center;
    font-size: .14rem;
  }
  &.account__exit {
    cursor: pointer;
  }
}
.user__field {
  position: relative;
  width: 100%;
  height: 2rem;
  background: url('~@/assets/img/mine/user_field_bg.png') no-repeat;
  background-size: 100% 100%;
  .icon-sixin {
    position: absolute;
    top: .17rem;
    right: .15rem;
    width: .22rem;
    height: .22rem;
    color: white;
    font-size: .22rem;
  }
  .user__info {
    @include row-centered-list;
    position: relative;
    width: max-content;
    height: .55rem;
    color: white;
    top: .65rem;
    left: .16rem;
    gap: .14rem;
    .avatar {
      height: .49rem;
      width: .49rem;
      flex:0 0 .49rem;
      overflow: hidden;
      border-radius: 50%;
      &__img {
        height: 100%;
        width: 100%;
      }
    }
    .user__identity {
      display: flex;
      height: auto;
      width: auto;
      flex-flow: column nowrap;
      gap: .09rem;
      .user__name,
      .login__register {
        margin: 0;
        font-size: .16rem;
        font-weight: bold;
        @include ellipsis;
        max-width: 9em;
      }
      .user__tel {
        font-size: .14rem;
        .icon-xiugai {
          height: .12rem;
          width: .12rem;
          margin-left: .09rem;
          font-size: .12rem;
        }
      }
    }
  }
}
.user__property {
  @include row-centered-list;
  height: .8rem;
  .property__item,
  .wallet {
    height: .58rem;
    width: .75rem;
  }
  .wallet {
    &__icon {
      text-align: center;
      width: .32rem;
      margin: 0 auto;
      &__img {
        height: .32rem;
        width: .32rem;
      }
    }
    .property__name {
      text-align: center;
      @include ellipsis;
    }
  }
  #seperator {
    width: .1rem;
    height: .58rem;
    background: url('~@/assets/img/mine/separator.png') no-repeat center;
    background-size: cover;
  }
  .property__item {
    .property__amount {
      font-size: .2rem;
      font-weight: bold;
      height: .34rem;
      text-align: center;
      line-height: .34rem;
      @include ellipsis
    }
    .property__name {
      text-align: center;
      @include ellipsis
    }
  }
}

.function__serve {
  .title {
    margin: 0 0 .13rem 0;
    font-size: .16rem;
    font-weight: 700;
    @include ellipsis;
  }
  &__matrix{
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(4, 1fr);
    align-items: center;
    grid-gap: .16rem .18rem;
    padding: 0 .17rem;
    .function__serve__item {
      height: .66rem;
      text-align: center;
      .function__serve__icon {
        height: .32rem;
        width: .32rem;
        text-align: center;
        margin: auto;
        .function__serve__img {
          height: 100%;
          width: 100%;
        }
      }
      .function__serve__name {
        margin-top: .05rem;
        text-align: center;
        @include ellipsis
      }
    }
  }
}
</style>
