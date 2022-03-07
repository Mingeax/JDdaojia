<template>
  <div class="shop__header">
    <div class="shop__logo">
      <img :src="imgURL" class="logo__img">
    </div>
    <div class="shop__info">
      <h2 class="shop__title">
      {{cnName}}
      </h2>
      <div class="deliver">
      达达快送 · 31分钟
      </div>
      <div class="freight">
      运费¥5
      </div>
    </div>
    <p class="shop__concession">
      <span id="concession__tag">运费</span>
      商家会员享满129元减4元运费（每月2次）
    </p>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { watchEffect } from '@vue/runtime-core'

const useImgEffect = enName => {
  const imgURL = ref('')
  const computeImgURL = enName => {
    if (enName) {
      imgURL.value = require(`@/assets/img/shop/shop_${enName}.jpg`)
    }
  }
  return { imgURL, computeImgURL }
}
export default {
  name: 'ShopHeader',
  props: ['cnName', 'enName'],
  setup(props) {
    const { imgURL, computeImgURL } = useImgEffect(props.enName)
    watchEffect(() => computeImgURL(props.enName))
    return { imgURL }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/viriables.scss';

.shop__header {
  width: 100%;
  background-color: white;
  color: $font-black;
  display: grid;
  grid-template-areas: "a b"
                       "c c";
  grid-template-columns: .68rem 1fr;
  padding: .08rem .1rem .2rem .1rem;
  .shop__logo {
    grid-area: a;
    height: .68rem;
    width: .68rem;
    border-radius: .2rem 0 .2rem 0;
    overflow: hidden;
    .logo__img {
      height: .68rem;
      width: .68rem;
    }
  }
  .shop__info {
    margin-left: .1rem;
    grid-area: b;
    .shop__title {
      margin: 0 0 .09rem 0;
    }
    .deliver {
      margin-bottom: .09rem;
      font-size: .1rem;
      line-height: .15rem;
    }
    .freight {
      font-size: .1rem;
      line-height: .15rem;
    }
  }
  .shop__concession {
    grid-area: c;
    font-size: .11rem;
    color: $font-gray;
    margin-top: .15rem;
    #concession__tag {
    color: white;
    background-image:linear-gradient(
      135deg,
      rgb(64, 160, 255) 0%,
      $delivery-blue 100%
    );
    border-radius: .02rem;
    padding: 0 .03rem 0 .03rem;
    margin-right: .03rem;
    height: .16rem;
    font-size: .1rem;
    display: inline-block;
    text-align: center;
    line-height: .16rem;
    }
  }
}
</style>
