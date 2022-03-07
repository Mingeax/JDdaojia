<template>
  <div class="docker">
    <router-link
      v-for="(item) in dockerList"
      :class="{
      'docker__item': true,
      }"
      :to="item.to"
      :key="item.text"
      exact-active-class="docker__item--active"
    >
      <div class="docker__iconfont iconfont" :class="item.iconfont"></div>
      <div class="docker__title">{{item.text}}</div>
    </router-link>
  </div>
</template>

<script>
export default {
  text: 'Docker',
  setup() {
    const dockerList = [
      { text: '首页', iconfont: 'icon-shouye', to: { name: 'Home' } },
      { text: '发现', iconfont: 'icon-faxian', to: { name: 'Discovery' } },
      { text: '购物车', iconfont: 'icon-gouwuche', to: { name: 'Cart' } },
      { text: '订单', iconfont: 'icon-dingdan', to: { name: 'Order' } },
      { text: '我的', iconfont: 'icon-wode-', to: { name: 'Mine' } }
    ]
    return { dockerList }
  }
}

</script>

<style lang='scss' scoped>
@import '../style/icon-font.scss';
@import '@/style/viriables.scss';

  .docker {
    position: fixed;
    display: flex;
    width: 100%;
    height: .5rem;
    bottom: 0;
    box-shadow: 0 -2px 8px 0 rgba(0,0,0,.03);
    background-image: -webkit-gradient(
      linear,left top,left bottom,
      from($border-white),
      color-stop(50%,$border-white),
      color-stop(0,transparent)
    );
    &__item {
      display: flex;
      flex-direction: column;
      height: 100%;
      flex: 1;
      background-color: white;
      text-align: center;
      font-size: .12rem;
      justify-content: center;
      &--active {
        color: rgb(0, 207, 55);
      }
    };
    &__iconfont {
      margin: 0 auto;
      width: .25rem;
      height: .25rem;
      font-size: .22rem;
      font-weight: bold;
      line-height: .27rem;
      letter-spacing: 0.014rem;
    };
    &__title{
      margin: 0 auto;
      height: .20rem;
      line-height: .17rem;
    }
  };

</style>
