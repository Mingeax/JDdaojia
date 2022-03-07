<template>
  <!-- 注: 需要请求订单号、商店、中英店名、支付状态、时间、支付额、总数、productIds,
    products包含商品、商品英文名 -->
  <!-- 注: 应进一步完善,如isCanceled、查询单个订单的功能. -->
  <div class="order__list" v-show="+isLogin">
    <div class="order sub__block" v-for="(order, orderIndex) in orders" :key="orderIndex">
      <div class="shop" @click="$router.push({ name: 'Shop', params: { id: order.shopId } })">
        <div class="shop__logo">
          <img class="shop__logo__img" :src="order.imgURL">
        </div>
        <div class="shop__info">
          <div class="shop__name with__rightward__arrow">{{order.shopCnName}}</div>
          <div class="order__state to__pay" v-if="true">{{'待支付'}}</div>
          <div class="order__state canceled" v-if="false">{{'已取消'}}</div>
          <div class="order__state proceeding" v-if="false">{{'进行中'}}</div>
        </div>
      </div>
      <div class="products" @click="$router.push({ name: 'OrderDetail', params: { orderId: order.id } })">
        <div class="product__list">
          <div class="product__icon" v-for="(product, productIndex) in order.products" :key="productIndex">
            <img class="product__icon__img" :src="product.imgURL">
          </div>
        </div>
        <div class="total__amount">共{{order.totalAmount}}件</div>
      </div>
      <div class="other__info">
        <div class="delivery">
          <div class="delivery__partner">{{'达达快送'}}</div>
          <div class="date">
            <!-- 此处的日期时间可以用day.js等库来进一步格式化. -->
            {{order.date.getMonth() + 1}}-{{order.date.getDate()}} {{order.date.getHours()}}:{{order.date.getMinutes()}}
          </div>
        </div>
        <div class="payment">&yen;{{order.payment}}</div>
      </div>
      <div class="btns">
        <button class="btn__rebuy btn" v-if="false" type="button">{{'再次购买'}}</button>
        <button v-if="false" type="button"></button>
        <!-- 注: 要把'去支付'换成再买. -->
        <button class="btn__topay btn" v-if="true" type="button">{{'去支付'}}</button>
      </div>
    </div>
    <EmptyMessage class="sub__block" v-show="Object.keys(orders).length === 0">
     暂无订单
    </EmptyMessage>
  </div>
  <NoLoginPage  v-show="!+isLogin"/>
</template>

<script>
import { post } from '@/utils/request.js'
import { reactive, ref } from '@vue/reactivity'
import NoLoginPage from '@/components/NoLoginPage.vue'
import EmptyMessage from '@/components/EmptyMessage.vue'
import { watchEffect } from '@vue/runtime-core'
import { wrongLoginGuard } from '@/utils/wrongLoginGuard.js'

const useOrderEffect = () => {
  const orders = reactive({})
  const getOrderList = async() => {
    if (!+sessionStorage.getItem('isLogin')) return
    try {
      const result = await post('/order-list', { accountId: sessionStorage.getItem('accountId') })
      if (wrongLoginGuard(result)) return
      for (const orderId in result.data.orders) {
        orders[orderId] = result.data.orders[orderId]
        // 对orders进行加工:
        const order = orders[orderId]
        const { shopEnName } = order
        order.imgURL = require(`@/assets/img/shop/shop_${shopEnName}.jpg`)
        order.date = new Date(order.date)
        order.products.forEach((product, index) => {
          if (index >= 6) return
          product.imgURL = require(`@/assets/img/shop/${shopEnName}/${product.id}.jpg`)
        })
      }
    } catch (e) {
      alert(e)
      console.log('error:', e)
    }
  }
  getOrderList()

  return { orders }
}

const useLoginEffect = () => {
  const isLogin = ref(0)
  watchEffect(() => {
    isLogin.value = sessionStorage.getItem('isLogin')
  })

  return { isLogin }
}

export default {
  name: 'Order',
  components: { NoLoginPage, EmptyMessage },
  setup() {
    const { orders } = useOrderEffect()
    const { isLogin } = useLoginEffect()
    return { orders, isLogin }
  }
}

</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';

img {
  display: inline;
}
.sub__block {
  @include column-sub-block;
  background-color: white;
  padding: .13rem .12rem .16rem .12rem;
  margin-bottom: .08rem;
  border-radius: .12rem;
}
.with__rightward__arrow::after {
  @include with-rightward-arrow;
}

.order__list {
  @include column-sub-block;
  margin: .1rem .1rem .6rem .1rem;
  overflow-x: hidden;
  background-color: transparent;
  .order {
    & > div {
      @include bilateral-flex;
    }
    .shop {
      align-items: start;
      gap: .11rem;
      cursor: pointer;
      &__logo {
        height: .4rem;
        width: .4rem;
        border-radius: .04rem;
        border: solid 1px rgba(0, 0, 0, 0.08);
        &__img {
          width: 100%;
          height: 100%;
        }
      }
      &__info {
        @include bilateral-flex;
        flex: 1 1 20%;
        .shop__name {
          position: relative;
          font-weight: bold;
          font-size: .14rem;
          color: $font-black;
        }
        .order__state {
          font-size: .13rem;
        }
        &.proceeding {
          color: $theme-green-btn-bg-color;
        }
        &.canceled {
          color: $font-light-gray;
        }
        &.to__pay {
          color: $striking-red;
        }
      }
    }
    .products {
      @include bilateral-flex;
      align-items: center;
      margin: .12rem 0 .11rem;
      cursor: pointer;
      .product__list{
        @include row-stretched-list;
        gap: .1rem;
        flex: 1 1 0%;
        overflow: hidden;
        .product__icon {
          width: .5rem;
          height: .5rem;
          flex: 0 0 auto;
          &__img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .total__amount {
        color: $font-light-gray;
        font-size: .13rem;
        line-height: .15rem;
        flex: 0 0 auto;
      }
    }
    .other__info {

      .delivery {
        @include row-centered-list;
        justify-items: start;
        gap: .04rem;
        &__partner {
          border: solid 1px $delivery-blue;
          height: .16rem;
          color: $delivery-blue;
          font-size: .1rem;
          border-radius: .02rem;
          text-align: center;
          line-height: .14rem;
          padding: 0 .03rem;
        }
        .date {
          color: $font-light-gray;
          font-size: .12rem;
        }
      }
      .payment {
        font-size: .14rem;
        color: $font-black;
      }
    }
    .btns {
      margin-top: .15rem;
      flex-direction: row-reverse;
      .btn {
        border-radius: .16rem;
        height: .32rem;
        min-width: .86rem;
        border: solid 1px white;
        font-size: .14rem;
      }
      .btn__rebuy {
        background-color: white;
        border-color: rgb(218, 218, 218);
        color: $font-black;
      }
      .btn__topay {
        background-color: $striking-red;
        border-color: $bg-gray;
        color: white;
      }
    }
  }
}

</style>
