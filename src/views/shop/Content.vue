<template>
  <div class="content">
    <div class="head__tabs">
      <div :class="{'head__tabs__item': true, 'head__tabs__item--active': index === 2}"
       v-for="(item, index) in headTabList" :key="index">
       {{item}}
      </div>
    </div>
    <div class="product__wrapper">
      <div class="sidebar__tabs">
        <div v-for="(item, index) in sidebarTabList"
         :key="index"
         :class="{'sidebar__tabs__item': true,
         'sidebar__tabs__item--active': index === currentTab}"
         @click="handleTabClick(index)">
       {{item}}
        </div>
      </div>
      <div class="product__list">
        <div v-for="(item, index) in products" :key="item.id"
        class="product">
          <div class="product__icon">
            <img :src="item.imgURL"
             :alt="'商品' + index" class="product__icon__img">
          </div>
          <div class="product__info">
            <!-- 商品名应设置最多两行省略,但没能按网上技巧实现 -->
            <h3 class="product__name">{{item.name}}</h3>
            <div class="product__sales">月售{{item.sales}}</div>
            <div class="product__price">&yen;{{item.price}}</div>
            <div class="product__counting">
              <span class="product__minus iconfont icon-minus-circle"
               @click="changeCartItem(item, -1, shopId)" />
              <span class="product__num">
                {{findCartItemCount(item.id)}}
              </span>
              <span class="product__plus iconfont icon-plus-circle-fill"
               @click="changeCartItem(item, +1,shopId , shopCnName)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref } from '@vue/reactivity'
import { get } from '@/utils/request.js'
import { watchEffect } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { useCommonCartEffect } from './commonCartEffect.js'

const headTabList = ['首页', '全部商品', '会员精选', '省运费']
// 长列表用于演示溢出滚动效果:
const sidebarTabList = ['秒杀', '直降', '正大专区', '时令蔬菜', '新鲜水果',
  '时令蔬菜', '时令蔬菜', '时令蔬菜', '时令蔬菜', '时令蔬菜', '时令蔬菜',
  '时令蔬菜', '时令蔬菜', '时令蔬菜', '时令蔬菜', '时令蔬菜', '时令蔬菜',
  '时令蔬菜', '时令蔬菜', '时令蔬菜', '时令蔬菜', '末尾']

// 侧边栏相关逻辑,注意currentTab从0开始
const useSidebarEffect = () => {
  const currentTab = ref(1)
  const handleTabClick = index => {
    currentTab.value = index
  }
  return { currentTab, handleTabClick }
}
// 根据店铺获取产品信息.
const useProductEffect = (currentTab, shopId) => {
  const advancedProductList = reactive({ products: [] })

  const computeImgURL = shopEnName => {
  // 用shopName计算商品icon图片的路径
    advancedProductList.products.forEach(item => {
      item.imgURL = require(`@/assets/img/shop/${shopEnName}/${item.id}.jpg`)
    })
  }

  const getShopProductInfo = async(currentTab, shopId) => {
  // 在setup中用watch监听getShopProductInfo函数,
  // 以便随着props改变而实时更新.
  // get的url包含一个currentTab查询参数,
  // 仅为演示与侧边栏有关的Ajax请求,不改变产品列表内容
    const results = await get(`/shop/${shopId.value}?tab=${currentTab.value}`)
    const shopEnName = results.enName
    advancedProductList.products = results.products
    computeImgURL(shopEnName)
  }
  const { products } = toRefs(advancedProductList)
  return { products, getShopProductInfo }
}

const limitAmount = amount => {
  if (+amount > 99) return '99+'
  else return amount
}

export default {
  name: 'Content',
  props: ['shopCnName'],
  setup() {
    const route = useRoute()
    const shopId = ref(route.params.id)
    const { currentTab, handleTabClick } = useSidebarEffect()
    const { products, getShopProductInfo } = useProductEffect(currentTab, shopId)
    const {
      cartList,
      findCartItemCount,
      changeCartItem
    } = useCommonCartEffect(shopId.value)

    // 监听侧边栏选项和路由参数的变化,每次都调用getShopProductInfo.
    // 注:应改为watch,避免页面加载时重复发送请求.

    watchEffect(() => {
      if (route.name === 'Shop') {
        shopId.value = route.params.id
        getShopProductInfo(currentTab, shopId)
      }
    })

    return {
      headTabList,
      sidebarTabList,
      currentTab,
      products,
      cartList,
      shopId,
      handleTabClick,
      findCartItemCount,
      changeCartItem,
      limitAmount
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';
.content {
  width: 100%;
  background-color: white;
  overflow: hidden;
  .head__tabs {
    display: flex;
    flex-flow: row nowrap;
    place-content: start start;
    gap: .28rem;
    padding: 0 .12rem;
    width: 100%;
    height: .28rem;
    &__item {
      flex: 0 0 max-content;
      max-width: 5em;
      font-size: .16rem;
      color: $font-gray;
      &--active {
        position: relative;
        font-weight: bold;
        color: $font-black;
        &::before {
          content: '';
          width: .2rem;
          height: .03rem;
          position: absolute;
          bottom: .03rem;
          left: calc(50% - .75em);
          background-image: linear-gradient(
            135deg,
            rgb(39, 220, 10) 0%,
            $theme-green 100%
          );
        }
      }
    }
  }
  .product__wrapper {
    @include row-stretched-list;
    height: 4.59rem;
    padding-bottom: .6rem;
    .sidebar__tabs {
      @include column-list;
      flex: 0 0 .93rem;
      width: .93rem;
      height: 100%;
      padding: 0;
      scrollbar-width: none;
      .sidebar__tabs__item {
        height: 0.48rem;
        padding: 0 4px 0 .12rem;
        line-height: 0.48rem;
        background-color: rgb(244, 244, 244);
        font-size: 0.14rem;
        color: $font-gray;
        width: .8rem;
        cursor: pointer;
        &--active {
          background-color: white;
          color: $font-black;
        }
      }
    }
    .product__list {
    @include column-list;
    flex: 1 1;
    padding-right: .1rem;
    height: 100%;
      .product {
        display: flex;
        flex-flow: row nowrap;
        border-bottom: 1px solid $border-gray;
        padding: .16rem .1rem;
        &__icon {
          width: .8rem;
          height: .8rem;
          &__img {
            width: .8rem;
            height: .8rem;
          }
        }
        &__info {
          margin-left: .08rem;
          width: calc(100% - .8rem);
          position: relative;
          .product__name {
            @include ellipsis;
            font-size: .16rem;
            line-height: .2rem;
          }
          .product__sales {
            margin-top: .04rem;
            color: $font-gray;
            font-size: .11rem;
            width: max-content;
          }
          .product__price {
            color: $price-red;
            font-size: .18rem;
            font-weight: bold;
            position: absolute;
            bottom: 0;
            left: 0;
          }
          .product__counting {
            @include counting;
            .product__num {
              @include counting-num;
            }
            .product__plus,
            .product__minus {
              @include minus-plus-btn;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
