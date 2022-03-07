<template>
  <div class="submit">
    <div class="actual__payment">&yen;{{(+actualPayment).toFixed(2)}}</div>
    <button id="submit__btn" type="button" :disabled="appliedAddress.isEmpty"
     @click="handleSubmitBtn(appliedAddress)">提交订单</button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { post } from '@/utils/request.js'
import { wrongLoginGuard } from '@/utils/wrongLoginGuard.js'

const useStoreInfo = () => {
  const store = useStore()
  const router = useRouter()
  const handleSubmitBtn = async(appliedAddress) => {
    if (!+sessionStorage.getItem('isLogin')) {
      router.push({ name: 'LoginRegister' })
      return
    }
    console.log('Submit')
    const accountId = sessionStorage.getItem('accountId')
    const shopId = +store.state.newOrder.shopId
    const addressInfo = {
      recipient: appliedAddress.recipient,
      telNum: appliedAddress.telNum,
      address: appliedAddress.address
    }
    const products = store.state.newOrder.products.map(item => {
      const tempProduct = { ...item }
      // 这些商品信息不需要上传到后端.
      delete tempProduct.imgURL
      delete tempProduct.name
      delete tempProduct.price
      delete tempProduct.totalPrice
      return tempProduct
    })

    const orderForConfirm = {
      accountId,
      shopId,
      addressInfo,
      products
    }

    try {
      const result = await post('user/order', { ...orderForConfirm, processCode: 2 })
      if (wrongLoginGuard(result)) return
      const { shopCnName, newOrderId: orderId, payment } = result.data
      store.commit('submitOrderForPay', { shopId, shopCnName, payment, orderId })
      router.push({ name: 'PayPage' })
    } catch (e) {
      alert(e)
      console.log('error:', e)
    }
  }
  const actualPayment = store.state.newOrder.payment
  return { handleSubmitBtn, actualPayment }
}

export default {
  name: 'Submit',
  props: { appliedAddress: Object },
  setup() {
    const { handleSubmitBtn, actualPayment } = useStoreInfo()
    return { handleSubmitBtn, actualPayment }
  }
}
</script>

<style scoped lang="scss">
@import '@/style/icon-font.scss';
@import '@/style/viriables.scss';
@import '@/style/mixin.scss';
.submit {
  @include fixed-to-bottom-stretched;
  @include row-centered-list;
  justify-content: end;
  padding: .08rem 0;
  background-color: white;
  border-top: 1px solid $border-gray;
  .actual__payment {
    font-size: .18rem;
    font-weight: bold;
    color: $font-black;
  }
  #submit__btn {
    @include theme-green-long-btn;
    margin: 0 .1rem 0 .12rem;
    line-height: .4rem;
    text-align: center;
    width: 1.22rem;
  }
}

</style>
