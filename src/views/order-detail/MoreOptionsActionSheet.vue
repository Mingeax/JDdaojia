<template>
  <div class="mask" @click="deactivate"
   :class="{ 'mask--deactive': !isActive }" />
  <div class="other__options__action__sheet"
   :class="{ 'other__options__action__sheet--deactive': !isActive }">
    <div class="sheet">
      <button class="sheet__item" id="connect__help">
        联系客服
      </button>
      <button class="sheet__item" id="delete__order" @click="handleDeleteBtn(orderId)">
        删除订单
      </button>
      <button class="sheet__item close__btn" @click="deactivate">
        关闭
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { post } from '../../utils/request'
import { useRouter } from 'vue-router'

const useActiveEffect = () => {
  const isActive = ref(false)

  const deactivate = () => {
    isActive.value = false
  }
  const activate = () => {
    isActive.value = true
  }

  return { isActive, deactivate, activate }
}

const useDeleteOrderEffect = () => {
  const router = useRouter()
  const handleDeleteBtn = async(orderId) => {
    const accountId = sessionStorage.getItem('accountId')
    try {
      const result = await post('user/operate-order', { accountId, orderId, operation: 'delete' })
      if (
        result.errno === 0 &&
      result.data.msg === 'Order deleted successfully.'
      ) {
        alert('删除订单成功.')
        router.push({ name: 'Order', replace: true })
      } else if (result.errno !== 0) throw Error(result.data.msg)
    } catch (e) {
      alert(e)
      console.log('error:', e)
    }
  }

  return { handleDeleteBtn }
}

export default {
  name: 'MoreOptionsActionSheet',
  props: { activityToggle: Boolean, orderId: Number },
  setup(props) {
    const { isActive, deactivate, activate } = useActiveEffect()
    watch(() => props.activityToggle, newValue => {
      if (newValue === true) {
        console.log('activate')
        activate()
      }
    })

    const { handleDeleteBtn } = useDeleteOrderEffect()

    return { isActive, deactivate, activate, handleDeleteBtn }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';

.mask {
  @include mask-with-transition;
  &--deactive {
    @include mask-with-transition-deactived;
  }
}
.other__options__action__sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(0);
  transition: transform .3s ease-in 0s;
  z-index: 100;
  &--deactive {
    transform: translateY(100%)
  }
  .sheet {
    @include column-stretched-list;
    border-radius: .1rem .1rem 0 0;
    overflow: hidden;
    background-color: $border-gray;
    &__item {
      height: .56rem;
      font-size: .18rem;
      background-color: white;
      color: $font-gray;
      border-bottom: 1px solid $border-gray;
      cursor: pointer;
    }
  }
  .close__btn {
    margin-top: .1rem;
  }
}
</style>
