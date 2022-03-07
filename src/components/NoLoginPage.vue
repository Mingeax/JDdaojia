<template>
  <div class="page__container">
    <div class="unlogin__wrap">
      <div class="unlogin__icon">
        <img class="unlogin__icon__img" src="@/assets/img/visitor_guard/icon_unlogin.png" alt="">
      </div>
      <div class="unlogin__tips">登录后才能查看哦</div>
      <button class="unlogin__btn" @click="$router.push({ name: 'LoginRegister' })" type="button">
       立即登录
      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'NoLoginPage',
  setup() {
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';

.page__container {
  height: 100vh;
  position: relative;
}
.unlogin__wrap {
  @include column-centered-list;
  position: absolute;
  bottom: .50rem;
  top: .44rem;
  justify-content: center;
  width: 100%;
  margin: .44rem 0 .5rem;
  .unlogin__icon {
    height: 1.6rem;
    width: 1.6rem;
  }
    .unlogin__icon__img {
      height: 100%;
      width: 100%;
    }
  .unlogin__tips {
    color: $font-gray;
    font-size: .15rem;
    text-align: center;
    margin-top: .2rem;

  }
  .unlogin__btn {
    color: white;
    background-image: $theme-green-btn-gradiant-bg-img;
    border-radius: .16rem;
    min-width: .86rem;
    height: .32rem;
    font-size: .14rem;
    margin-top: .15rem;
    cursor: pointer;
  }
}
</style>
