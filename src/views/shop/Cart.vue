<template>
  <div class="mask"
   :class="{ 'mask--deactive': isHidden }"
   @click="toggleMerchandiseShow()"
  />
  <!-- 过渡动画小缺陷:动画duration不会根据货物列表长度而变化 -->
  <!-- 注: 可拆分组件. -->
  <div class="merchandise"
   :class="{ 'merchandise--deactive': isHidden }">
    <div class="control__all sub__block">
      <div class="check__all">
        <button class="check__btn"
         :class="{ 'checked': isAllChecked, 'unchecked': !isAllChecked }"
         id="check__all__btn" @click="toggleCartProductCheck()">
         &check;
        </button>
        <label class="check__all__lbl" for="check__all__btn">全选</label>
        <span class="checked__amount">(已选{{limitAmount(totalAmount)}}件)</span>
      </div>
      <button class="clear__all" @click="clearCartProducts()" type="button">
        清空购物车
      </button>
    </div>
    <div class="cart__list">
      <div class="cart__item sub__block"
       v-for="(item, index) in productList" :key="index" >
        <button class="check__btn" :id="`cart__item__${item.id}`"
         :class="{ 'checked': item.check, 'unchecked': !item.check }"
         @click="toggleCartProductCheck(index)" type="button">
        &check;
        </button>
        <div class="cart__item__icon">
          <img class="cart__item__icon__img" :src="item.imgURL"
           :alt="`cart-item-${index}`">
        </div>
        <div class="cart__item__info">
          <div class="cart__item__name">
            {{item.name}}
          </div>
          <div class="cart__item__price">
            <span class="cart__item__original__price">&yen;{{item.price}}</span>
            <!-- 到手价均为原价的八成 -->
            <span class="cart__item__inhand__price">
              到手价&yen;{{(item.price * 0.8).toFixed(2)}}
            </span>
            <div class="cart__item__counting">
              <span class="iconfont icon-minus-circle"
               @click="changeCartItem(item, -1, shopId)" />
              <span class="cart__item__num">{{item.count}}</span>
              <span class="iconfont icon-plus-circle-fill"
               @click="changeCartItem(item, +1, shopId)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- class: check对应两种check通用的样式,class: check(--not)--empty对应两者不同的样式 -->
  <div class="check check--not--empty" v-show="totalAmount">
    <div class="cart__icon">
      <div class="iconfont icon-shopping-cart-fill"
       @click="toggleMerchandiseShow()" />
      <div id="total__amount">{{limitAmount(totalAmount)}}</div>
    </div>
    <div id="total__price">&yen;{{calculateAmountAndPayment.actualPayment}}</div>
    <!-- 原价设定为总价的1.25倍 -->
    <del id="original__price">
      &yen;{{(calculateAmountAndPayment.actualPayment * 1.25).toFixed(2)}}
    </del>
    <button class="confirm__btn confirm__btn--not--empty" v-show="!isAllUnchecked"
     @click="handleConfirmBtn()" type="button">
      去结算
    </button>
    <button class="confirm__btn confirm__btn--empty" v-show="isAllUnchecked"
     disabled type="button">
      去结算
    </button>
  </div>
  <div class="check check--empty" v-show="!totalAmount">
    <!-- .check--empty标签内的所有一级子元素都需要用含empty的类名 -->
    <div class="cart__icon cart__icon--empty">
      <div class="iconfont icon-shopping-cart-fill"/>
    </div>
    <div id="empty__hint">购物车是空的</div>
    <button class="confirm__btn confirm__btn--empty" disabled type="button">
      去结算
    </button>
  </div>
</template>

<script>
import { ref, toRefs, computed, watchEffect, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useCommonCartEffect } from '@/views/shop/commonCartEffect.js'

// 处理merchandise展示与否的逻辑
const useHiddenEffect = totalAmount => {
  const isHidden = ref(true)
  const toggleMerchandiseShow = () => {
    isHidden.value = !isHidden.value
  }
  watch(totalAmount, totalAmount => {
    if (!totalAmount) isHidden.value = true
  }, { immediate: true })
  return { isHidden, toggleMerchandiseShow }
}
// 与购物车有关的操作
const useCartEffect = shopId => {
  const store = useStore()
  const route = useRoute()

  const cartList = store.state.cartList
  const {
    calculateAmountAndPayment,
    isShopAllChecked,
    isShopAllUnchecked,
    confirmOrder
  } = useCommonCartEffect(shopId.value)

  const clearCartProducts = () => {
    store.commit('clearCartProducts', { shopId: shopId.value })
  }
  // 若productNo未传参,则切换此shopId下所有商品的check
  const toggleCartProductCheck = productNo => {
    store.commit('toggleCartProductCheck', {
      shopId: shopId.value, productNo
    })
  }

  const isAllChecked = isShopAllChecked(shopId.value)
  const isAllUnchecked = isShopAllUnchecked(shopId.value)

  const totalAmount = computed(() => {
    let count = 0
    const { cartList } = toRefs(store.state)
    if (cartList.value) {
      for (const productNo in cartList.value[shopId.value]) {
        const product = cartList.value[shopId.value][productNo]
        count += product?.count
      }
    }
    return count
  })

  const { changeCartItem } = useCommonCartEffect(shopId.value)
  // productList用于模板遍历.
  const productList = computed(() => cartList[shopId.value])

  const handleConfirmBtn = () => confirmOrder(route.params.id)

  return {
    totalAmount,
    calculateAmountAndPayment,
    isAllChecked,
    isAllUnchecked,
    productList,
    clearCartProducts,
    changeCartItem,
    toggleCartProductCheck,
    handleConfirmBtn
  }
}

// 数量超过99,则输出'99+'
// 可以拆分为公用方法
const limitAmount = amount => {
  if (+amount > 99) return '99+'
  else return amount
}

export default {
  name: 'Cart',
  setup() {
    const route = useRoute()
    const shopId = ref(0)
    watchEffect(() => {
    // 路由参数改变时,更新shopId
      shopId.value = route.params.id
    })
    const {
      totalAmount,
      calculateAmountAndPayment,
      isAllChecked,
      isAllUnchecked,
      productList,
      clearCartProducts,
      changeCartItem,
      toggleCartProductCheck,
      handleConfirmBtn
    } = useCartEffect(shopId)
    const { isHidden, toggleMerchandiseShow } = useHiddenEffect(totalAmount)
    // useCartEffect和useCommonCartEffect有一些相似的功能,
    // 这里主要使用useCommonCartEffect中修改cart商品数量的方法.

    return {
      isHidden,
      shopId,
      calculateAmountAndPayment,
      totalAmount,
      isAllChecked,
      isAllUnchecked,
      productList,
      changeCartItem,
      toggleMerchandiseShow,
      limitAmount,
      clearCartProducts,
      toggleCartProductCheck,
      handleConfirmBtn
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/icon-font.scss';
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';
// 拆分购物车组件.

.mask {
  @include mask-with-transition;
  &--deactive {
    @include mask-with-transition-deactived;
  }
}
.merchandise {
  position: fixed;
  bottom: .6rem;
  width: 100%;
  max-height: 4.68rem;
  transform: translateY(0rem);
  transition: transform .5s ease-in-out 0s;
  border-radius: .1rem .1rem 0 0;
  background-color: white;
  padding: .1rem 0;
  overflow: hidden;
  z-index: 100;
  &--deactive {
    transform: translateY(4.68rem);
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
  .sub__block {
    width: 100%;
    padding-right: .1rem;
    padding-left: .1rem;
  }
  .control__all {
    @include row-centered-list;
    justify-content: space-between;
    width: 100%;
    height: .46rem;
    border-bottom: solid 1px $border-gray;
    background-color: rgb(252, 252, 252);
    .check__all {
      &__lbl {
        margin-left: .05rem;
        color: $font-black;
      }
      .checked__amount {
        margin-left: .05rem;
        color: $font-gray;
      }
    }
    .clear__all {
      color: $font-light-gray;
    }
  }
  .cart__list {
    @include column-list;
    max-height: 3.2rem;
    .cart__item {
      display: flex;
      flex-flow: row nowrap;
      position: relative;
      gap: .08rem;
      padding-top: .12rem;
      padding-bottom: .12rem;
      height: .8rem;
      background-color: white;
      .cart__item__icon {
        width: .5rem;
        height: .5rem;
        &__img {
          width: .5rem;
          height: .5rem;
        }
      }
      .cart__item__info {
        @include up-down-flex;
        position: relative;
        flex: 1 1 auto;
        .cart__item__name {
          font-size: .14rem;
          color: $font-black;
          @include ellipsis;
        }
        .cart__item__price {
          .cart__item__original__price {
            font-weight: bold;
            font-size: .14rem;
            color: $font-black;
          }
          .cart__item__inhand__price {
            background-image: linear-gradient(
              135deg,
              rgb(254, 232, 231) 0%,
              rgb(254, 232, 231) 100%
            );
            color: $price-red;
            margin-left: .08rem;
            font-size: .1rem;
            font-weight: bold;
          }
          .cart__item__counting {
                @include counting;
              .cart__item__num {
                @include counting-num;
              }
              .icon-minus-circle,
              .icon-plus-circle-fill {
                @include minus-plus-btn;
                cursor: pointer;
              }
          }
        }
      }
    }
  }
}
.check {
    @include fixed-to-bottom-stretched;
    @include row-centered-list;
    z-index: 101;
    height: .6rem;
    padding: 0 .12rem;
    background-color: white;
    place-content: center start;
}
.icon-shopping-cart-fill {
  width: .44rem;
  height: .44rem;
  line-height: .44rem;
  font-size: .25rem;
  cursor: pointer;
}
.confirm__btn {
  border-radius: .2rem;
  width: .88rem;
  height: .4rem;
  line-height: .4rem;
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: .14rem;
}
.confirm__btn--not--empty {
  background-image: $theme-green-btn-gradiant-bg-img;
}
.confirm__btn--empty {
  background-image: $bg-inactive-gradiant-gray;
}
.cart__icon {
  position: relative;
  width: .44rem;
  height: .44rem;
  border-radius: .22rem;
  text-align: center;
  color:white;
}
.check--not--empty {
  .cart__icon {
    background-color: $theme-green;
    #total__amount {
        position: absolute;
        top: -.05rem;
        right: -.01rem;
        min-width: .18rem;
        height: .18rem;
        padding: 0 .03rem;
        font-size: .11rem;
        font-weight: 400;
        background-color: $striking-red;
        border-radius: .18rem;
        text-align: center;
        line-height: .18rem;
    }
  }
  #total__price {
      color: $price-red;
      font-size: .2rem;
      font-weight: bold;
      margin-left: .08rem;
  }
  #original__price {
      color: $font-light-gray;
      font-size: .12rem;
      margin-left: .04rem;
      flex: 1 1 auto;
  }
}
.check--empty {
  .cart__icon--empty {
    background-image: $bg-inactive-gradiant-gray;
  }
  #empty__hint {
    flex: 1 1 auto;
    margin-left: .08rem;
    color: $font-light-gray;
    font-size: .14rem;
    @include ellipsis;
  }
}
</style>
