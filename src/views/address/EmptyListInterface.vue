<template>
  <div class="container">
    <div class="dog__bg">
      <img src="@/assets/img/empty_interface/empty_dog_bg.png"
       alt="" class="dog__bg__img">
    </div>
    <p class="empty__hint">
      还没有地址，快去新建吧
    </p>
    <button class="create__new__address"
     @click="$router.push({ name: 'OperateAddress', params: { type: 'create' } })">
      新建收货地址
    </button>
  </div>
</template>

<script>
export default {
  name: 'EmptyListInterface',
  setup() {

  }

}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';

.container {
  @include column-centered-list;
  padding: .4rem 0;
  gap: .15rem;
  .dog__bg {
    width: 1.6rem;
    height: 1.6rem;
    &__img {
      width: 100%;
      height: 100%;
    }
  }
  .empty__hint {
    margin-top: .05rem;
    color: $font-gray;
    font-size: .15rem;
  }
  .create__new__address {
    background-image: $theme-green-btn-gradiant-bg-img;
    padding: 0 .15rem;
    color: white;
    border-radius: .16rem;
    height: .32rem;
    font-size: .14rem;
    cursor: pointer;
  }
}
</style>
