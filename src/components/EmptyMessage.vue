<template>
  <div id="empty__message">
    <span class="exclamation__point__icon">
      !
    </span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'EmptyMessage'
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';
#empty__message {
    @include row-centered-list;
    justify-content: center;
    height: .58rem;
    margin-top: .15rem;
    gap: .04rem;
    color: $font-gray;
    font-size: .14rem;
    .exclamation__point__icon {
      height: .14rem;
      width: .14rem;
      line-height: .14rem;
      border-radius: .07rem;
      color: white;
      font-size: .1rem;
      background-color: rgb(206, 206, 206);
      text-align: center;
    }
}
</style>
