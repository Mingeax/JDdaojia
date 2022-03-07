<template>
  <div class="mask" @click="deactivateSheet"
   :class="{ 'mask--deactive': !isActive }" />
  <div class="addresses__box"
   :class="{ 'addresses__box--deactive': !isActive }">
    <div class="action__sheet sub__block">
      <h3 class="action__sheet__title">选择收货地址</h3>
      <div class="close__icon" @click="handleClose()">╳</div>
      <div class="address__list sub__block">
      <div class="address__item" v-for="(item, index) in addressesData.addressList" :key="index"
       @click="choseAddress(index), handleClose(index, emitFn)">
        <button class="check__btn" type="button"
         :class="{
           'checked': +chosenAddress.index === index,
           'unchecked': +chosenAddress.index !== index
          }">
          &check;
        </button>
        <div class="address__info">
          <div class="recipient">{{item.recipient}}</div>
          <div class="tel__num">{{item.telNum}}</div>
          <div class="address">{{item.address}}</div>
        </div>
        <div class="iconfont icon-xiugai"
         @click="$router.push({
          name: 'OperateAddress',
          params: { type: 'edit', addressId: item.id }
         })"
        />
      </div>
      </div>
    </div>
    <div class="create__new__address">
      <button class="create__new__address__btn"
       @click="$router.push({ name: 'OperateAddress', params: { type: 'create' } })">
        新建收货地址
      </button>
    </div>
  </div>
</template>

<script>
// 本组件每次被唤醒都会fetch地址列表.

import { reactive, ref } from '@vue/reactivity'
import { post } from '../../utils/request'
import { watch } from '@vue/runtime-core'

const useAddressListEffect = () => {
  const isActive = ref(false)
  const chosenAddress = reactive({ index: NaN, recipient: '', telNum: '', address: '', id: NaN })
  const addressesData = reactive({ addressList: [] })

  const fetchAddressList = async() => {
  // 获取地址列表.
    const accountId = sessionStorage.getItem('accountId')
    try {
      const result = await post('/address-list', { accountId })
      console.log('result:', result)
      if (
        result.data.addressesByUserId === undefined &&
        result.data.msg === 'This user have no address yet.'
      ) {
        addressesData.addressList = null
      } else {
        const addressData = result.data.addressesByUserId
        addressesData.addressList = addressData
      }
    } catch (e) {
      alert(e)
      console.log('error:', e)
    }
  }
  const deactivateSheet = () => {
    isActive.value = false
  }
  const activateSheet = () => {
    isActive.value = true
  }

  const wholeCallSheetProcession = async() => {
    try {
      await fetchAddressList()
      activateSheet()
    } catch (e) {
      alert(e)
      console.log(e)
    }
  }

  const choseAddress = index => {
    chosenAddress.index = index
    chosenAddress.recipient = addressesData.addressList[index].recipient
    chosenAddress.telNum = addressesData.addressList[index].telNum
    chosenAddress.address = addressesData.addressList[index].address
    chosenAddress.id = addressesData.addressList[index].id
  }

  const handleClose = (index = NaN, emitFn) => {
    console.log('index:', index)

    if (Number.isNaN(index)) {
      deactivateSheet()
      // setTimeout(() => {
      //   addressesData.addressList = []
      // }, 1000)
    }

    if (Number.isInteger(index)) {
      emitFn()
      deactivateSheet()
    }
  }

  console.log('isActive:', isActive)

  return {
    addressesData,
    chosenAddress,
    isActive,
    fetchAddressList,
    activateSheet,
    deactivateSheet,
    choseAddress,
    handleClose,
    wholeCallSheetProcession
  }
}

export default {
  name: 'AddressActionSheet',
  props: { activityToggle: Boolean, appliedAddressIndex: Number },
  emits: ['submitChosenAddress'],
  setup(props, context) {
    const {
      addressesData,
      chosenAddress,
      isActive,
      fetchAddressList,
      activateSheet,
      deactivateSheet,
      choseAddress,
      handleClose,
      wholeCallSheetProcession
    } = useAddressListEffect()

    const emitFn = () => {
      context.emit('submitChosenAddress', chosenAddress)
    }

    watch(() => props.activityToggle, async(newValue) => {
      if (newValue === true) {
        try {
          console.log('toggle sheet.')
          await wholeCallSheetProcession()
          console.log('toggle sheet.')
        } catch (e) {
          alert(e)
          console.log(e)
        }
      }
    })

    watch(() => props.appliedAddressIndex, newValue => {
      chosenAddress.index = newValue
    }, { immediate: true })
    return {
      addressesData,
      chosenAddress,
      isActive,
      fetchAddressList,
      activateSheet,
      deactivateSheet,
      choseAddress,
      handleClose,
      emitFn
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/icon-font.scss';
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';

.mask {
  @include mask-with-transition;
  &--deactive {
    @include mask-with-transition-deactived;
  }
}
.sub__block {
  @include column-sub-block;
}
.addresses__box {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 100;
  background-color: white;
  border-radius: .1rem .1rem 0 0;
  overflow: hidden;
  height: calc(400px + 20vh);
  transition: transform .5s ease-in-out 0s;
  &--deactive {
    transform: translateY(100%);
  }
  .action__sheet {
    width: 100%;
    max-height: 4.68rem;
    transform: translateY(0rem);
    overflow: hidden;
    &__title {
      text-align: center;
      font-size: .16rem;
      margin: .15rem 0;
    }
    .close__icon {
      position: absolute;
      right: .07rem;
      top: .1rem;
      font-size: .13rem;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.4);
      height: .3rem;
      width: .3rem;
      line-height: .3rem;
      text-align: center;
      cursor: pointer;
    }
    .address__list {
      height: 70vh;
      overflow-y: scroll;
      scrollbar-width: none;
      .address__item {
        @include row-centered-list;
        padding: .15rem .1rem .15rem 0;
        margin-left: .1rem;
        gap: .15rem;
        border-bottom: 1px solid $border-white;
        cursor: pointer;
        .check__btn {
          @include check-btn;
          width: .22rem;
          height: .22rem;
          border-radius: .11rem;
          &.checked {
            @include checked-btn;
          }
          &.unchecked {
            @include unchecked-btn;
          }
        }
        .address__info {
          display: grid;
          grid-template-areas:
          "recipient telNum"
          "address address";
          flex: 1 0 auto;
          justify-content: start;
          column-gap: .05rem;
          row-gap: .1rem;
          color: $font-gray;
          font-size: .16rem;
          .recipient {
            grid-area: recipient;
          }
          .tel__num {
            grid-area: telNum;
          }
          .address {
            grid-area: address;
            color: $font-black;
            font-size: .14rem;
          }
        }
        .icon-xiugai {
          font-size: .16rem;
          align-self: center;
          opacity: .5;
          cursor: pointer;
        }
      }
    }
  }
  .create__new__address {
    @include single-item-centered;
    height: .4rem;
    width: 100%;
    margin-bottom: .1rem;
    &__btn {
      @include theme-green-long-btn;
      flex: 1 1 auto;
      margin: 0 .1rem;
      padding: 0 .15rem;
    }
  }
}
</style>
