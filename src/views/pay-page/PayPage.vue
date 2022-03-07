<template>
<!-- 下单后跳转至订单列表页面 -->
<!-- 注:需要优化button:active效果 -->
  <div class="white__bg" />
  <div class="head"
   :class="{
   'head__wechat': chosenPaytypeId === 1,
   'head__jdpay':  chosenPaytypeId === 2
   }">
    <div class="shop__name">{{shopCnName}}</div>
    <div class="total__payment">&yen;{{payment}}</div>
    <div class="remaining__time">剩余支付时间：{{'18:46'}}</div>
  </div>
  <div class="paytype__list">
    <div class="paytype__option"
     v-for="item in advancedPaytypeList" :key="item.id"
      @click="choosePaytype(item.id)">
      <div class="paytype__icon">
        <img :src="item.iconImgURL" alt="icon" class="paytype__icon__img">
      </div>
      <div class="paytype__name">
        {{item.cnName}}
      </div>
      <button class="check__btn" :id="`paytype__option${item.id}`" type="button"
       :class="{ 'checked': item.id === chosenPaytypeId, 'unchecked': item.id !== chosenPaytypeId }">
      &check;
      </button>
    </div>
  </div>
  <button class="pay__btn" :class="{
   'pay__btn__wechat': chosenPaytypeId === 1,
   'pay__btn__jdpay': chosenPaytypeId === 2
   }" type="button" @click="handlePayBtnClick()">
    立即支付 {{payment}}元
  </button>

</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { post } from '@/utils/request.js'
import { wrongLoginGuard } from '@/utils/wrongLoginGuard.js'

const paytypeList = [
  {
    id: 1,
    enName: 'wechat',
    cnName: '微信支付'
  }, {
    id: 2,
    enName: 'jdpay',
    cnName: '京东支付'
  }
]
const chosenPaytypeId = ref(1)
const usePaytypeEffect = () => {
  const store = useStore()
  const router = useRouter()
  const advancedPaytypeList = computed(() => {
    const list = paytypeList
    list.forEach((paytype) => {
      paytype.iconImgURL = require('@/assets/img/pay_page/' + paytype.enName + '-icon.png')
      paytype.bgImgURL = require('@/assets/img/pay_page/' + paytype.enName + '-back.png')
    })
    return list
  })
  const choosePaytype = paytypeId => {
    chosenPaytypeId.value = paytypeId
  }
  const handlePayBtnClick = async() => {
    // 数据传递结束后,删除购物车中相应的商品,并跳转至order页.
    if (!+sessionStorage.getItem('isLogin')) {
      router.push({ name: 'LoginRegister' })
      return
    }
    const accountId = sessionStorage.getItem('accountId')
    const { orderId } = store.state.orderForPay
    const payingOrder = { orderId, isCanceled: false, accountId, paytypeId: chosenPaytypeId.value }

    try {
      const result = await post('user/order', { ...payingOrder, processCode: 3 })
      console.log('result:', result)
      if (+result.errno !== 0) {
        console.log(result.message)
        return
      }
      if (wrongLoginGuard(result)) return

      if (+orderId !== result.data.orderId) {
        // 核对前后端orderId是否一致.
        alert('支付错误,请重新下单并支付.')
        return
      }
      const { productIds, shopId } = result.data
      store.commit('removeCartProducts', { productIds, shopId })
      store.commit('clearNewOrder')
      console.log('支付成功,已确认订单.')
      router.push({ name: 'Order', replace: true })
    } catch (e) {
      alert(e)
      console.log('error:', e)
    }
  }
  return { advancedPaytypeList, chosenPaytypeId, choosePaytype, handlePayBtnClick }
}
const useOrderStore = () => {
  const store = useStore()
  const { shopCnName } = store.state.orderForPay
  const payment = (+store.state.orderForPay.payment).toFixed(2)
  if (!shopCnName || !payment) alert('Need necessary orderForPay store data.')
  return { shopCnName, payment }
}

//  注: setTimeout(() => {
//    router.push("{ path: '/front-page/order', name: 'Order' }")
//  }, 1500)

export default {
  name: 'PayPage',
  setup() {
    const { advancedPaytypeList, chosenPaytypeId, choosePaytype, handlePayBtnClick } = usePaytypeEffect()
    const { shopCnName, payment } = useOrderStore()
    return { advancedPaytypeList, chosenPaytypeId, shopCnName, payment, choosePaytype, handlePayBtnClick }
  }
}
</script>

<style scoped lang="scss">
@import '@/style/icon-font.scss';
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';

.white__bg {
  @include bg;
  background-color: white;
}
.head {
  @include column-centered-list;
  width: 100%;
  background:
    no-repeat scroll
    right bottom / .75rem .75rem;
  padding-bottom: .15rem;
  color: white;
  font-size: .13rem;
  text-align: center;
  &__wechat {
    background-color: $theme-green-btn-bg-color;
    background-image: url("~@/assets/img/pay_page/wechat-back.png");
  }
  &__jdpay {
    background-color: $striking-red;
    background-image: url("~@/assets/img/pay_page/jdpay-back.png");
  }
  .shop__name {
    opacity: .5;
    padding-top: .10rem;
    width: 100%;
  }
  .total__payment {
    font-size: .36rem;
    width: 100%;
    margin-top: .1rem;
    margin-bottom: .08rem;
  }
  .remaining__time {
    border-radius: .15rem;
    background-color: rgba(255, 255, 255, 0.1);
    padding: .06px .13rem;
  }
}
.paytype__list {
  .check__btn {
    @include check-btn;
    &.checked {
      @include checked-btn;
    }
    &.unchecked {
      @include unchecked-btn;
    }
  }
  .paytype__option {
    @include bilateral-flex;
    align-items: center;
    margin-left: .15rem;
    padding: .15rem .15rem .15rem;
    font-size: .16rem;
    color: $font-black;
    border-bottom: 1px solid $border-gray;
    cursor: pointer;
    .paytype__icon {
      width: .28rem;
      height: .28rem;
      &__img {
        width: 100%;
        height: 100%;
      }
    }
    .paytype__name {
      flex: 1 1 auto;
      margin-left: .1rem;
    }
  }
}
.pay__btn {
  position: fixed;
  bottom: .34rem;
  width: calc(100% - .2rem);
  margin: 0 .1rem;
  padding: 0 .15rem;

  color: white;
  height: .4rem;
  line-height: .4rem;
  border-radius: .2rem;

  text-align: center;
  font-size: .16rem;
  font-weight: bold;
  @include ellipsis;
  &__wechat {
  box-shadow:
   rgba(71, 179, 79, 0.165) 0px .04rem .08rem 0px,
   $theme-green-btn-box-shadow;
  background-color: $theme-green-btn-bg-color;
  }
  &__jdpay {
    background-color: $striking-red;
    box-shadow:
    rgba(255, 87, 87, 0.2) 0px .04rem .08rem 0px,
    $theme-green-btn-box-shadow;

  }
}
</style>>
