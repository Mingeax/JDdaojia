<template>
  <div class="head__bg" />
  <BasicInfo
   @call-address-sheet="callAddressSheet()"
   @submit-chosen-address="applyChosenAddress"
   :chosen-address="appliedAddress" />
  <Products />
  <Submit :applied-address="appliedAddress" />
  <AddressActionSheet
   :activity-toggle="addressSheetToggleKey"
   @submit-chosen-address="applyChosenAddress"
   :applied-address-index="appliedAddress.index" />
</template>

<script>
// appliedAddress是本父组件专用变量,最后要随订单一起提交给后端.
// 子组件用submit-chosen-address把自己的chosenAddress变量提交上来,以修改appliedAddress.
// 父组件把appliedAddress用props传递给子组件供其使用.
// 页面加载时,BasicInfo会把默认地址(列表中第一个地址)提交上来.

import BasicInfo from './BasicInfo.vue'
import Products from './Products.vue'
import Submit from './Submit.vue'
import AddressActionSheet from './AddressActionSheet.vue'
import { reactive, ref } from '@vue/reactivity'
import { nextTick } from '@vue/runtime-core'

const ctrlAddressSheetCall = () => {
  const addressSheetToggleKey = ref(false)

  const callAddressSheet = async() => {
    const changeToggleKey = (boolean) => {
      addressSheetToggleKey.value = boolean
    }

    changeToggleKey(true)
    await nextTick()
    changeToggleKey(false)
  }

  return { addressSheetToggleKey, callAddressSheet }
}

const useAppliedAddressEffect = () => {
  const appliedAddress = reactive({ index: NaN, recipient: '', telNum: '', address: '', id: NaN, isEmpty: false })

  const applyChosenAddress = chosenAddress => {
    if (chosenAddress.isEmpty === true) {
      appliedAddress.isEmpty = true
      return
    }
    appliedAddress.index = chosenAddress.index
    appliedAddress.recipient = chosenAddress.recipient
    appliedAddress.telNum = chosenAddress.telNum
    appliedAddress.address = chosenAddress.address
    appliedAddress.id = chosenAddress.id
  }

  return { appliedAddress, applyChosenAddress }
}

export default {
  name: 'OrderConfirm',
  components: { BasicInfo, Products, Submit, AddressActionSheet },
  setup() {
    const { addressSheetToggleKey, callAddressSheet } = ctrlAddressSheetCall()
    const { appliedAddress, applyChosenAddress } = useAppliedAddressEffect()

    return { addressSheetToggleKey, appliedAddress, callAddressSheet, applyChosenAddress }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
@import '@/style/icon-font.scss';
@import '@/style/viriables.scss';

.head__bg {
  @include head-green-bg;
  height: .96rem;
}
.sub__block {
  @include column-sub-block;
  margin: .1rem;
  padding: .15rem;
  border-radius: .12rem;
  background-color: white;
  .sub__title {
    font-size: .16rem;
    font-weight: bold;
    color: $font-black;
  }
}
.with__rightward__arrow::after {
  @include with-rightward-arrow;
}
</style>
