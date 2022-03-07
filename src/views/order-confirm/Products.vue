<template>
  <div class="products sub__block">
    <div class="shop__name sub__title">
      {{shopCnName}}
      <div class="deliver__partner">达达快递</div>
    </div>
    <div class="product__list">
      <div class="product__item" v-for="item in products" :key="item.id">
        <div class="porduct__icon">
          <img :src="item.imgURL" class="product__icon__img">
        </div>
        <div class="product__info">
          <div class="product__name">{{item.name}}</div>
          <div class="price">
            <span class="unit__price">&yen;{{item.price}} × {{item.count}}</span>
            <span class="total__peice">&yen;{{(item.price * item.count).toFixed(2)}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="total__amount">共{{totalAmount}}件</div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const useStoreInfo = () => {
  const store = useStore()
  const { products = [], shopCnName } = store.state.newOrder

  const totalAmount = products.reduce((acc, cur) => {
    return acc + cur.count
  }, 0)
  return { products, shopCnName, totalAmount }
}

export default {
  name: 'Products',
  setup() {
    const router = useRouter()
    const { products, shopCnName, totalAmount } = useStoreInfo()
    // 对products判空,若空则跳转到订单页面
    if (
      !Array.isArray(products) ||
    !products.length
    ) {
      router.push({ name: 'Order' })
      return
    }
    return { products, shopCnName, totalAmount }
  }
}
</script>

<style scoped lang="scss">
@import '@/style/mixin.scss';
@import '@/style/icon-font.scss';
@import '@/style/viriables.scss';

.products {
  margin-bottom: .66rem;
  .shop__name {
    @include bilateral-flex;
    padding-bottom: .15rem;
    .deliver__partner {
      border: 1px solid rgb(127, 187, 246);
      color: $delivery-blue;
      font-size: .1rem;
      font-weight: 400;
      text-align: center;
      height: 0.16rem;
      line-height: 0.16rem;
      box-sizing: content-box;
      padding: 0 .03rem;
    }
  }
  .product__list {
    @include column-sub-block;
    .product__item {
      display: flex;
      flex-flow: row nowrap;
      border-top: 1px solid $border-gray;
      padding: .15rem 0;
      .porduct__icon {
        width: .56rem;
        height: .56rem;
        flex: 0 0 auto;
        margin-right: .1rem;
        .product__icon__img {
          width: 100%;
          height: 100%;
        }
      }
      .product__info {
        @include up-down-flex;
        flex: 1 1 auto;
        font-size: .14rem;
        color: $font-black;
        .product__name {
          @include ellipsis;

        }
        .price {
          @include bilateral-flex;
          .total__peice {
            font-weight: bold;
          }
        }
      }
    }
  }
  .total__amount {
    height: .26rem;
    line-height: .26rem;
    background-color: rgb(248, 248, 248);
    color: rgb(132, 132, 132);
    font-size: .14rem;
    border-radius: .13rem;
    width: 100%;
    text-align: center;
  }
}
</style>
