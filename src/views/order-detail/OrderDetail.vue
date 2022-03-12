<template>
  <!-- 注:接下来继续写订单详情页.还要检查一遍订单state参数的机制. -->
  <div class="order__detail">
    <div class="head__bg" />
    <div class="main__content sub__block">
      <div class="state__and__operate">
        <div class="state with__rightward__arrow">订单已完成</div>
        <div class="thanks">感谢您使用京东到家</div>
        <div class="buttons">
          <button class="rebuy"
           @click="handleRebuyBtn(targetOrder.shopId, targetOrder.shopCnName, targetOrder.products)">
           再次购买
          </button>
          <button class="after__sales">申请售后</button>
          <button class="more" @click="handleMoreBtn">···</button>
        </div>
      </div>
      <div class="sub__list" id="order__content">
        <div class="shop" @click="$router.push({ name: 'Shop', params: { id: targetOrder.shopId } })">
          <h3 class="shop__name with__rightward__arrow">{{targetOrder.shopCnName}}</h3>
        </div>
        <div class="product__list">
          <div class="product__item" v-for="(item, index) in targetOrder.products" :key="index">
            <div class="product__item__icon">
              <img :src="item.imgUrl" class="product__item__icon__img">
            </div>
            <div class="product__item__info">
              <div class="product__name">{{item.name}}</div>
              <div class="product__amounts">
                <div class="unit__price__n__count">&yen;{{item.price}} × {{item.count}}</div>
                <div class="total__price">&yen;{{item.totalPrice}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="payment">
          实付金额
          <div class="payment__num">&yen;{{targetOrder.payment}}</div>
        </div>
      </div>
      <div id="deliver__info" class="sub__list">
        <h3 class="list__heading" id="deliver__heading">配送信息</h3>
        <div class="list__content">
          <div class="list__item arrive__time">
            <div class="list__item__lbl">送达时间：</div>
            <!-- 收货时间可以设成下单时间的24h之后. -->
            <div class="list__item__msg">{{'1月31日 15:45-17:30'}}</div>
          </div>
          <div class="list__item deliver__address">
            <div class="list__item__lbl">收货地址：</div>
            <div class="list__item__msg">
              {{targetOrder.addressInfo.recipient}} {{targetOrder.addressInfo.telNum}}
              <br>
              {{targetOrder.addressInfo.address}}
            </div>
          </div>
          <div class="list__item deliver__means">
            <div class="list__item__lbl">配送方式：</div>
            <div class="list__item__msg">达达快送</div>
          </div>
        </div>
      </div>
      <div id="order__info" class="sub__list">
        <h3 class="list__heading" id="order__heading">订单信息</h3>
        <div class="list__content">
          <div class="list__item order__id">
            <div class="list__item__lbl">订单号码：</div>
            <div class="list__item__msg">{{orderId}}</div>
            <button class="copy__btn" @click="handleCopyBtn(orderId)">复制</button>
          </div>
          <div class="list__item order__time">
            <div class="list__item__lbl">下单时间：</div>
            <div class="list__item__msg test">{{standarlizeDate(targetOrder.date)}}</div>
          </div>
          <div class="list__item payment__means">
            <div class="list__item__lbl">支付方式：</div>
            <div class="list__item__msg">在线支付</div>
          </div>
          <div class="list__item order__memo">
            <div class="list__item__lbl">订单备注：</div>
            <div class="list__item__msg">缺货时电话与我沟通</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <MoreOptionsActionSheet :activity-toggle="sheetToggleKey" :order-id="+orderId" />
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import { get, post } from '@/utils/request'
import { nextTick, onBeforeMount } from '@vue/runtime-core'
import { useCommonCartEffect } from '@/views/shop/commonCartEffect.js'
import MoreOptionsActionSheet from './MoreOptionsActionSheet.vue'

const useFetchProductsEffect = () => {
  const targetOrder = reactive({
    shopId: NaN,
    shopCnName: '',
    shopEnName: '',
    date: NaN,
    isCanceled: undefined,
    paytypeId: NaN,
    products: [],
    addressInfo: {},
    payment: NaN
  })

  const fetchProductsInfo = async(orderId) => {
    const accountId = sessionStorage.getItem('accountId')
    try {
      const result = await post('/order-list', { accountId, orderId })
      console.log('result:', result);
      // 为targetOrder赋值:
      ([
        'shopId',
        'shopCnName',
        'shopEnName',
        'isCanceled',
        'date',
        'paytypeId',
        'products',
        'addressInfo',
        'payment'
      ]).forEach(item => {
        targetOrder[item] = result.data.targetOrder[item]
      })
      targetOrder.products.forEach(item => {
        item.imgUrl = require(`@/assets/img/shop/${targetOrder.shopEnName}/${item.id}.jpg`)
      })
      console.log('targetOrder:', targetOrder)
    } catch (e) {
      alert(e)
      console.log('error:', e)
    }
  }

  const useCartEffect = () => {
    const router = useRouter()
    const { changeCartItem } = useCommonCartEffect(targetOrder.shopId)

    const gettingResult = reactive({})

    const handleRebuyBtn = async(shopId, shopCnName) => {
      targetOrder.products.forEach(async(item, index) => {
        const productId = item.id
        const result = await get(`/shop/${shopId}/${productId}`)
        gettingResult[index] = result
        const product = result
        product.imgURL = item.imgUrl

        changeCartItem(product, item.count, shopId, shopCnName)
      })

      router.push({ name: 'Shop', params: { id: shopId } })
    }
    return { gettingResult, handleRebuyBtn }
  }
  return { targetOrder, fetchProductsInfo, useCartEffect }
}

const ctrlOptionsSheetCall = () => {
  const sheetToggleKey = ref(false)

  const handleMoreBtn = async() => {
    sheetToggleKey.value = true
    await nextTick()
    sheetToggleKey.value = false
  }

  return { sheetToggleKey, handleMoreBtn }
}

const standarlizeDate = timestamp => {
  // 将日期对象加工成所需的的日期字符串.
  const dateObj = new Date(timestamp)

  const year = dateObj.getFullYear()
  const month = dateObj.getMonth()
  const date = dateObj.getDate()
  const hour = dateObj.getHours()
  const minute = dateObj.getMinutes()
  const second = dateObj.getSeconds()

  const finalDateString =
  year + '-' +
  (month < 10 ? '0' + month : month) +
  '-' + date + ' ' + hour + ':' + minute + ':' + second

  return finalDateString
}

const handleCopyBtn = text => {
  navigator.clipboard.writeText(text)
  alert('复制成功!')
}

export default {
  name: 'OrderDetail',
  components: { MoreOptionsActionSheet },
  setup() {
    const route = useRoute()
    const orderId = route.params.orderId
    const { fetchProductsInfo, useCartEffect, targetOrder } = useFetchProductsEffect()
    const { gettingResult, handleRebuyBtn } = useCartEffect()
    const { sheetToggleKey, handleMoreBtn } = ctrlOptionsSheetCall()

    onBeforeMount(async() => {
      fetchProductsInfo(orderId)
    })
    return {
      gettingResult,
      orderId,
      targetOrder,
      sheetToggleKey,
      standarlizeDate,
      handleCopyBtn,
      handleRebuyBtn,
      handleMoreBtn
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';

.sub__block {
  @include column-sub-block;
  & > div {
    border-radius: .12rem;
    min-height: .3rem;
    background-color: white;
    margin-bottom: .1rem;
  }
}

.head__bg {
  @include head-green-bg;
  height: 1.2rem;
}

.with__rightward__arrow {
  position: relative;
  &::after {
    @include with-rightward-arrow;
    right: -.11rem;
  }
}

.main__content {
  margin: .45rem .1rem 0;
  color: $font-black;
  .state__and__operate {
    @include column-centered-list;
    gap: .1rem;
    padding: .15rem .15rem .1rem;
    .state {
      font-weight: bold;
      font-size: .18rem;
    }
    .thanks {
      font-size: .13rem;
      color: $font-light-gray;
    }
    .buttons {
      @include bilateral-flex;
      gap: .1rem;
      font-size: .14rem;
      & > button {
        height: .32rem;
        border-radius: .16rem;
        min-width: .96rem;
        border: 1px solid rgb(218, 218, 218);
      }
      .rebuy {
        color: white;
        background-color: rgb(0, 203, 30);
        background-image: linear-gradient(
          135deg,
          rgb(0, 203, 30) 0%,
          rgb(0, 190, 52)
          100%
        );
        border: none;
      }
      .more {
        width: fit-content;
        min-width: .46rem;
        font-weight: bold;
        letter-spacing: .02rem;
        text-indent: .0rem;
      }
    }
  }
  #order__content {
    .shop {
      padding: .15rem;
      margin: 0 -.15rem;
      border-bottom: 1px solid $border-gray;
      cursor: pointer;
      &__name {
        width: max-content;
        font-size: .16rem;
      }
    }
    .product__list {
      @include column-stretched-list;
      border-bottom: 1px solid $border-gray;
      .product__item {
        @include row-centered-list;
        gap: .1rem;
        padding: .15rem 0;
        border-bottom: 1px solid $border-gray;
        &__icon {
          width: .56rem;
          height: .56rem;
          &__img {
            width: 100%;
            height: 100%;
          }
        }
        &__info {
          @include up-down-flex;
          flex: 1 1 auto;
          font-size: .14rem;
          gap: .1rem;
          .product__amounts {
            @include bilateral-flex;
            .total__price {
              font-weight: bold;
            }
          }
        }
      }
    }
    .payment {
      @include row-centered-list;
      justify-content: flex-end;
      gap: .08rem;
      font-size: .14rem;
      padding: .2rem 0;
      &__num {
        font-size: .22rem;
        font-weight: bold;
      }
    }
  }
  .sub__list {
    @include column-stretched-list;
    padding: 0 .15rem;
    .list__heading {
      padding: .15rem;
      border-bottom: 1px solid $border-gray;
      margin: 0 -.15rem;
      font-size: .16rem;
    }
    .list__content {
      @include column-stretched-list;
      .list__item {
        @include row-centered-list;
        border-bottom: 1px solid $border-gray;
        padding: .16rem 0;
        gap: .1rem;
        font-size: .14rem;
        &__lbl {
          font-weight: bold;
        }
        &__msg {
          font-family: SimSun;
          flex: 1 1 auto;
        }
        &.deliver__means .list__item__msg {
          @include single-item-centered;
          font-family: Microsoft YaHei;
          flex: 0 0 auto;
          color: rgb(76, 156, 255);
          font-size: .1rem;
          height: .16rem;
          padding: 0 .03rem;
          border: 1px solid rgb(76, 156, 255);
          border-radius: .02rem;
        }
        .copy__btn {
          font-size: .12rem;
          border: 1px solid rgb(218, 218, 218);
          border-radius: .13rem;
          height: .26rem;
          padding: 0 .15rem;
        }
      }
    }
  }
}
</style>
