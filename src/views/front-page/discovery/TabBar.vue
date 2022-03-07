<template>
  <div class="tab__bar">
    <div class="tab__bar__item" id="following">关注</div>
    <div class="tab__bar__item" id="recipe">食谱</div>
    <div class="tab__bar__item active" id="recommend">种草社</div>
  </div>
</template>

<script>
export default {
  name: 'TabBar'
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';
.tab__bar {
  @include fixed-to-top-stretched;
  height: .5rem;
  @include row-centered-list;
  justify-content: center;
  background-color: white;
  .tab__bar__item {
    position: relative;
    font-size: .16rem;
    color: $font-black;
    height: .2rem;
    line-height: .2rem;
    padding: .15rem .13rem;
    box-sizing: content-box;
    &.active {
      color: $theme-green-btn-bg-color;
      &::after {
        position: absolute;
        content: "";
        display: block;
        height: .03rem;
        width: .2rem;
        background-color: $theme-green-btn-bg-color;
        border-radius: .05rem;
        bottom: .07rem;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
