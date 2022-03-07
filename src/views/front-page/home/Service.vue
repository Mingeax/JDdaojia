<template>
 <div class="top__bg">
   <img src="../../../assets/img/home/top_bg.jpg"
    alt="" class="top__bg__img">
 </div>
 <div class="banner">
   <img src="../../../assets/img/home/home_banner.gif"
    alt="促销活动" class="banner__img">
 </div>

 <div class="service__matrix">
   <div v-for="(item) of advancedServeList"
   class="service__item" :class="'service__item__' + item.itemPinyin" :key="item.itemNum">
    <img :src="item.itemImgURL"
    :alt="item.itemName" class="service__img">
    <div class="service__name">{{ item.itemName }}</div>
   </div>
 </div>
</template>

<script>
import { ref } from 'vue'
import { get } from '../../../utils/request.js'

// 拼音pinyin 用于图片路径,若有雷同需更换名称,或在pinyin值后面添加数字编号以区分
const useServeListEffect = () => {
  const serveList = ref([])
  const advancedServeList = ref([])
  const processServeList = () => {
    get('service-list')
      .then(res => {
        serveList.value = res
        for (const serveItem of serveList.value) {
          advancedServeList.value.push({
            itemName: serveItem.name,
            itemPinyin: serveItem.pinyin,
            itemImgURL: require('@/assets/img/home/service_' + serveItem.pinyin + '.png'),
            itemNum: serveItem.num
          })
        }
      })
  }
  processServeList()

  // advancedServeList现在含有img对应的URL
  return { advancedServeList }
}

export default {
  name: 'Service',
  setup() {
    const { advancedServeList } = useServeListEffect()
    return { advancedServeList }
  }
}
</script>

<style lang='scss' scoped>
@import '@/style/mixin.scss';

  .top__bg {
    overflow: hidden;
    height: .64rem;
    &__img {
      width: 100%;
      height: 100%;
    }

  }
  .banner {
    overflow: hidden;
    padding-bottom: 37.1%;
    height: 0;
    &__img {
    width: 100%;
    }
  }
  .service__matrix {
    display: grid;
    width: 100%;
    height: 1.56rem;
    padding: 0 0.07rem;
    grid-template-columns: repeat(5,1fr);
    grid-template-rows: repeat(2,1fr);
    place-items: stretch;
    margin: .1rem 0;
    .service__item{
      position: relative;
      text-align: center;
      .service__img {
        display: inline;
        height: .48rem;
        width: .48rem;
      }
      .service__name {
        position: absolute;
        bottom: .11rem;
        left: 50%;
        transform: translate(-50%,0);
        @include ellipsis;
        max-width: 100%;
      }
    }
  }
</style>
