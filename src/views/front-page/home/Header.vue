<template>
<div class="header header--top">
 <router-link class="header__address" :to="{ name: 'AddressList' }">
   <!-- 此处如果可以的话应显示定位地址,但是geoAPI涉及大量复杂的安全环境问题,所以此处用固定文字代替. -->
   管理地址
   <span class="iconfont icon-dingwei "></span>
   <span class="iconfont icon-xiajiantou-copy"></span>
 </router-link>
 <span class="header__search">
   <span class="iconfont icon-sousuo1"></span>
   <input class="form" type="search" placeholder="超市狂欢节">
 </span>
 <span class="iconfont icon-sixin"></span>
</div>
</template>

<script>
export default {
  name: 'Docker',
  setup() {
  }
}
</script>

<style lang='scss' scoped>
@import '@/style/icon-font.scss';
//注： @import '@/style/viriables.scss';
@import '@/style/mixin.scss';

  .header{
    @include fixed-to-top-stretched;
    @include row-centered-list;
    font-size: .16rem;
    gap: .08rem;
    height: .44rem;
    background-color: white;
    text-align: center;
    &--top {
      background-color: rgb(255, 255, 255, 0);
    }
    .iconfont {
      font-size: .22rem;
    }
    &__address {
      color: white;
      height: .32rem;
      width: 1.44rem;
      line-height: .32rem;
      font-weight: bold;
      @include ellipsis;
      .icon-dingwei{
      margin-left: .12rem;
      font-weight: normal;
      }
      .icon-xiajiantou-copy {
        display: inline-block;
        font-size: .14rem;
        font-weight: bolder;
        transform: scaleY(50%);
      }
    }
    &__search {
      @include row-centered-list;
      line-height: .32rem;
      height: .32rem;
      min-width: 0;
      background-color: white;
      border-radius: .16rem ;
      flex: 1 1 0rem;
      gap: .06rem;
      padding: 0 .15rem;
      color: $font-translucence;
      text-align: start;
      .icon-sousuo1 {
        font-size: .16rem;
        height: .16rem;
        line-height: .2rem;
      }
      input[type=search] {
        flex: 1 1 0rem;
        outline-offset: 0;
        font-size: .16rem;
        min-width: 0;
        &:focus,
        &:focus-visible {
          outline: none;
        }
      }
    }
    .icon-sixin {
      line-height: 0.22rem;
      margin-right: 0.12rem;
      height: 0.22rem;
      width: 0.22rem;
      color: white;
    }
  }
</style>
