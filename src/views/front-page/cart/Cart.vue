<template>
  <div class="cart__list" v-show="+isLogin">
    <div class="shop sub__block" v-for="(shop, shopIndex) in cartList"
     :key="shopIndex" v-show="Object.keys(shop).length">
     <!-- shopIndex与对应的shopId相等. -->
      <div class="head__field">
        <div class="check__all">
          <button class="check__btn" :id="`shop${shopIndex}__check__all__btn`"
           :class="{
             'checked': isShopAllChecked(shopIndex).value,
             'unchecked': !isShopAllChecked(shopIndex).value
           }"
           @click="toggleCartShopProductCheck(shopIndex)" type="button">
            &check;
          </button>
        </div>
        <div class="shop__info">
          <div class="shop__info__line1">
            <div class="shop__name with__rightward__arrow"
            @click="$router.push({ name: 'Shop', params: { id: shopIndex } })">
            {{shopNameList[shopIndex]}}
            </div>
            <button class="clear__all"  @click="clearCartProducts(shopIndex)" type="button">
              清空购物车
            </button>
          </div>
          <div class="shop__info__line2">
            <div class="deliver">
              <span class="spend">{{'100'}}分钟</span>
              <span class="distance">{{'1.2'}}km</span>
              <span class="vertical__separater"></span>
              <span class="freight">运费&yen;{{'5'}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="products">
        <div class="cart__item" v-for="(product, productIndex) in shop" :key="productIndex">
          <button class="check__btn" :id="`cart__item__${product.id}`"
           :class="{ 'checked': product.check, 'unchecked': !product.check }"
           @click="toggleCartShopProductCheck(shopIndex, productIndex)" type="button">
            &check;
          </button>
          <div class="cart__item__icon">
            <img :src="product.imgURL" class="cart__item__icon__img">
          </div>
          <div class="cart__item__info">
            <div class="cart__item__name">{{product.name}}</div>
            <div class="cart__item__price">
              &yen;{{product.price}}
              <div class="cart__item__counting">
                <button class="cart__item__counting__minus" type="button"
                @click="changeCartItem(product, -1, shopIndex)">-</button>
                <div class="cart__item__counting__num">{{product.count}}</div>
                <button class="cart__item__counting__plus" type="button"
                @click="changeCartItem(product, +1, shopIndex)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="payment">
        <div class="payment__title">总价</div>
        &yen;{{actualPaymentList[shopIndex - 1]}}
      </div>
      <div class="btns">
        <button class="btn confirm__btn confirm__btn--disabled"
         v-show="isShopAllUnchecked(shopIndex).value"
         disabled type="button">
         用券结算
        </button>
        <button class="btn confirm__btn confirm__btn--abled"
         v-show="!isShopAllUnchecked(shopIndex).value"
         @click="handleConfirmBtn(shopIndex)" type="button">
         用券结算
        </button>
        <button class="btn goshop__btn"
         @click="handleGoshopBtn(shopIndex)" type="button">进店选购</button>
      </div>
    </div>
    <EmptyMessage class="empty__cart__message sub__block" v-show="isCartListEmpty().value">
     购物车暂无商品
    </EmptyMessage>
  </div>
  <NoLoginPage  v-show="!+isLogin"/>
</template>

<script>
import { useCommonCartEffect } from '@/views/shop/commonCartEffect.js'
import { useStore } from 'vuex'
import { computed, ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import NoLoginPage from '@/components/NoLoginPage.vue'
import EmptyMessage from '@/components/EmptyMessage.vue'
import { watchEffect } from '@vue/runtime-core'

const useCartEffect = () => {
  const store = useStore()
  const router = useRouter()
  const cartList = store.state.cartList
  const shopNameList = store.state.shopNameList
  const { isShopAllChecked, isShopAllUnchecked, isCartListEmpty, changeCartItem, confirmOrder } = useCommonCartEffect()
  const shopIdList = computed(() => Object.keys(cartList))
  const actualPaymentList = computed(() => {
    const actualPaymentList = []
    shopIdList.value.forEach(shopId => {
      const { calculateAmountAndPayment } = useCommonCartEffect(shopId)
      actualPaymentList.push(calculateAmountAndPayment.value.actualPayment)
    })
    return actualPaymentList
  })

  const toggleCartShopProductCheck = (shopId, productNo) => {
    store.commit('toggleCartProductCheck', {
      shopId, productNo
    })
  }

  const clearCartProducts = (shopId) => {
    store.commit('clearCartProducts', { shopId })
  }

  const handleConfirmBtn = shopId => confirmOrder(shopId)
  const handleGoshopBtn = shopId => router.push({ name: 'Shop', params: { id: shopId } })
  return {
    cartList,
    shopNameList,
    actualPaymentList,
    isShopAllChecked,
    isShopAllUnchecked,
    isCartListEmpty,
    toggleCartShopProductCheck,
    changeCartItem,
    clearCartProducts,
    handleConfirmBtn,
    handleGoshopBtn
  }
}

const useLoginEffect = () => {
  const isLogin = ref(0)
  watchEffect(() => {
    isLogin.value = sessionStorage.getItem('isLogin')
  })

  return { isLogin }
}
export default {
  name: 'Cart',
  components: { NoLoginPage, EmptyMessage },
  setup() {
    const {
      cartList,
      shopNameList,
      actualPaymentList,
      isShopAllChecked,
      isShopAllUnchecked,
      isCartListEmpty,
      toggleCartShopProductCheck,
      changeCartItem,
      clearCartProducts,
      handleConfirmBtn,
      handleGoshopBtn
    } = useCartEffect()
    const { isLogin } = useLoginEffect()
    return {
      isLogin,
      cartList,
      shopNameList,
      actualPaymentList,
      isShopAllChecked,
      isShopAllUnchecked,
      isCartListEmpty,
      toggleCartShopProductCheck,
      changeCartItem,
      clearCartProducts,
      handleConfirmBtn,
      handleGoshopBtn
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/icon-font.scss';
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';

.sub__block {
  @include column-sub-block;
  background-color: white;
  border-radius: .12rem;
}
.check__btn {
  @include check-btn;
  &.checked {
    @include checked-btn;
  }
  &.unchecked {
    @include unchecked-btn;
  }
}
.with__rightward__arrow::after {
  @include with-rightward-arrow;
}

.cart__list {
  @include column-sub-block;
  margin: .08rem .12rem .6rem;
  overflow-x: hidden;
  background-color: transparent;
  .shop {
    padding: .12rem .12rem;
    margin-top: .08rem;
    .head__field {
      @include row-centered-list;
      gap: .09rem;
      padding-bottom: .12rem;
      .check__all {
      }
      .shop__info {
        flex: 1 1 auto;
        font-size: .12rem;
        cursor: pointer;
        &__line1 {
          @include bilateral-flex;
          .shop__name {
            position: relative;
            font-size: .16rem;
            font-weight: bold;
            color: $font-black;
          }
          .clear__all {
            color: $font-light-gray;
          }
        }
        &__line2 {
          .deliver {
            @include row-centered-list;
            gap: .04rem;
            color: $font-gray;
            margin-top: .04rem;
            .vertical__separater {
              display: inline-block;
              margin: 0 .02rem;
              height: .1rem;
              background-color: rgb(204, 204, 204);
              width: .02rem;
            }
          }
        }
      }
    }
    .products {
      @include column-sub-block;
      --border-238: solid rgb(238, 238, 238) 1px;
      .cart__item {
        @include row-centered-list;
        padding: .12rem 0;
        gap: .08rem;
        &__icon {
          width: .5rem;
          height: .5rem;
          &__img {
            width: 100%;
            height: 100%;
          }
        }
        &__info {
          flex: 1 1 auto;
          font-size: .14rem;
          color: $font-black;
          .cart__item__name {
            margin-bottom: .08rem;
          }
          .cart__item__price {
            @include bilateral-flex;
            font-weight: bold;
            .cart__item__counting {
              @include row-stretched-list;
              font-weight: normal;
              border: var(--border-238);
              border-radius: .11rem;
              & > div,
              & > button {
                height: .22rem;
                width: .22rem;
              }
              .cart__item__counting__minus{}
              .cart__item__counting__num {
                min-width: .25rem;
                line-height: .22rem;
                text-align: center;
                border-right: var(--border-238);
                border-left:  var(--border-238);
              }
              .cart__item__counting__plus {
              }
            }
          }
        }
      }
    }
    .payment {
      @include bilateral-flex;
      height: .36rem;
      line-height: .36rem;
      color: $font-black;
      font-size: .16rem;
      font-weight: bold;
      border-bottom: solid 1px $border-gray;
      .payment__title {
        font-size: .14rem;
        font-weight: normal;
      }
    }
    .btns {
      @include reverse-start-flex;
      gap: .08rem;
      padding-top: .12rem;
      .btn {
        border-radius: .2rem;
        min-width: .86rem;
        width: .88rem;
        height: .38rem;
        font-size: .14rem;
        font-weight: bold;
        &.confirm__btn {
          color: white;
        }
        &.confirm__btn--abled {
          background-image: $theme-green-btn-gradiant-bg-img;
        }
        &.confirm__btn--disabled {
          background-image: $bg-inactive-gradiant-gray;
        }
        &.goshop__btn {
          color: rgb(0, 207, 55);
          background-image: linear-gradient(
            35deg,
            rgb(229, 250, 235) 0%,
            rgb(229, 250, 235) 100%
          );
        }
      }
    }
  }
}
</style>
