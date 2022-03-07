<template>
  <div class="tab__contents">
    <div class="tab__content__block sub__block">
      <h2 class="tab__content__title">新年运势丨虎年到，焕星年</h2>
      <p class="tab__content__desc">点击开启2022的心动>></p>
      <div class="tab__content__picture">
        <img src="@/assets/img/discovery/recommend/1/pic_1.jpg" alt="" class="tab__content__picture__img">
      </div>
      <div class="tab__content__brand">
        <div class="brand__icon">
          <img class="brand__icon__img" src="@\assets\img\discovery\recommend\1\icon_1.jpg" alt="">
        </div>
        <div class="brand__name">联合利华U兔</div>
      </div>
    </div>
    <div class="tab__content__block sub__block">
      <h2 class="tab__content__title">2022新年送礼，靠“快”取胜</h2>
      <p class="tab__content__desc">最快30分钟到家！</p>
      <div class="tab__content__picture">
        <img src="@/assets/img/discovery/recommend/2/pic_2.jpg" alt="" class="tab__content__picture__img">
      </div>
      <div class="tab__content__brand">
        <div class="brand__icon">
          <img class="brand__icon__img" src="@\assets\img\discovery\recommend\2\icon_2.jpg" alt="">
        </div>
        <div class="brand__name">祝你新年快乐的欧莱雅</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabContent'
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';

.sub__block {
  @include column-sub-block;
}
.tab__contents {
  @include column-sub-block;
  margin: .5rem 0;
  padding: .1rem;
  gap: .1rem;
  .tab__content__block {
    padding: .1rem;
    gap: .1rem;
    border-radius: .12rem;
    background-color: white;
    .tab__content__title {
      line-height: .22rem;
    }
    .tab__content__desc {
      font-size: .14rem;
      color: $font-gray;
    }
    .tab__content__picture {
      width: 100%;
      border-radius: .06rem;
      overflow: hidden;
      &__img {
        width: 100%;
      }
    }
    .tab__content__brand {
      @include row-centered-list;
      gap: .05rem;
      .brand__icon {
        height: .2rem;
        width: .2rem;
        overflow: hidden;
        border-radius: .1rem;
        &__img {
          width: 100%;
          height: 100%;
        }
      }
      .brand__name {
        font-size: .12rem;
        font-weight: 300;
        color: $font-gray;
      }
    }
  }
}
</style>
