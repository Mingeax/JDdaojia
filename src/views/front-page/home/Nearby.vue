<template>
 <div class="nearby">
  <div class="nearby__title">附近商家</div>
  <div class="shops">
    <!-- 只有1号卜蜂莲花和2号华润万家可以购买商品. -->
    <div class="shop__item" v-for="item in advancedShopList"
     :id="item.id" :key="item.id" :class="{ 'shop__item--valid': +item.id < 3 }"
     @click="handleShopItemLink(item.id)">
      <div class="shop__bg">
        <img :src="item.bgURL"
         :alt="item.cnName" class="shop__bg__img">
      </div>
      <div class="shop__info">
        <img :src="item.logoURL"
         :alt="item.cnName + '_logo'" class="shop__logo">
         <h3 class="shop__title">{{item.cnName}}</h3>
         <p class="shop__coupons">{{item.coupons}}</p>
      </div>
    </div>
  </div>
 </div>
 <VisitorAlert @cancelAlert="cancelAlert()" v-show="isAlertShow" class="visitor__alert" />
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import VisitorAlert from '@/components/VisitorAlert.vue'
import { ref } from '@vue/reactivity'

const shopList = [
  { cnName: '卜蜂莲花', enName: 'lotus', coupons: '领2元券', id: 1 },
  { cnName: '华润万家', enName: 'vanguard', coupons: '领2元叠加券', id: 2 },
  { cnName: '永辉超市', enName: 'yonghui', coupons: '领10元券', id: 3 },
  { cnName: '人人乐', enName: 'renrenle', coupons: '领10元券', id: 4 },
  { cnName: '怡康大药房', enName: 'yikang', coupons: '领10元券', id: 5 }
]

const addShopListImgURL = computed(() => {
  const advancedShopList = shopList.map(shop => {
    shop.logoURL = require('@/assets/img/shop/shop_' + shop.enName + '.jpg')
    shop.bgURL = require('@/assets/img/home/shop_bg_' + shop.enName + '.jpg')
    return shop
  })
  return advancedShopList
})

const useAlertEffect = () => {
  const isAlertShow = ref(false)
  const router = useRouter()

  const generateAlert = () => {
    isAlertShow.value = true
  }
  const cancelAlert = () => {
    isAlertShow.value = false
  }
  const handleShopItemLink = shopId => {
    const isLogin = sessionStorage.getItem('isLogin')
    // 仅1号和2号商店有效.
    if (+isLogin && +shopId <= 2) router.push({ name: 'Shop', params: { id: shopId } })
    else if (!isLogin) generateAlert()
    else return false
  }

  return { isAlertShow, generateAlert, cancelAlert, handleShopItemLink }
}
export default {
  name: 'Nearby',
  components: { VisitorAlert },
  setup() {
    const advancedShopList = addShopListImgURL.value
    const { isAlertShow, generateAlert, cancelAlert, handleShopItemLink } = useAlertEffect()
    return { advancedShopList, isAlertShow, generateAlert, cancelAlert, handleShopItemLink }
  }
}
</script>

<style lang='scss' scoped>
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';

.visitor__alert {
  z-index: 1000;
}
.nearby{
  margin: 0 .12rem;
  border-radius: .12rem;
  overflow: hidden;
  background-color: white;
  &__title {
    margin: .12rem 0 .08rem .12rem;
    font-size: .16rem;
    font-weight: bold;
    color: $font-black;
  }
  .shops {
    @include row-stretched-list;
    height: 1.8rem;
    gap:.08rem;
    margin-left: .12rem;
    overflow-x: scroll;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .shop__item {
      display: flex;
      flex-direction: column;
      background-color: $bg-light-gray;
      flex: 0 0 1.09rem;
      height: 1.56rem;
      width: 1.09rem;
      border-radius: .06rem;
      overflow: hidden;
      &--valid {
        cursor: pointer;
      }
      .shop__bg {
        flex:0 0 .81rem;
        height: .81rem;
        width: 100%;
        overflow: hidden;
        .shop__bg__img {
          height: 100%;
          width: 100%;
        }
      }
      .shop__info{
        flex:1 1 .73rem;
        width: 100%;
        position: relative;
        .shop__logo {
          height: .49rem;
          width: .49rem;
          border-radius: 50% 50%;
          border: white 2px solid;
          margin: 0 auto;
          transform: translateX(-50%);
          transform-origin: center;
          position: absolute;
          top: -0.3rem;
          z-index: 2;
          left: 50%;
        }
        .shop__title {
          margin: .295rem auto 0 auto;
          text-align: center;
          @include ellipsis;
          max-width: 7em
        }
        .shop__coupons {
          color: $price-red;
          width: max-content;
          max-width: 100%;
          font-size: .10rem;
          border: 1px $price-red solid;
          text-align: center;
          padding: 0 .03rem;
          margin: .04rem auto;
          max-width: 7em;
          @include ellipsis;
//接下来做媒体查询设定滚动页高度,以及调整商铺列表宽度
        }
      }
    }
  }
}
</style>
