<template>
  <div class="basic__info sub__block">
    <div class="user__info with__rightward__arrow"
     @click="handleUserInfoClick()"
     v-if="addressData.isEmpty === false">
      <div class="address">{{addressData.address}}</div>
      <div class="other__info">
        <span class="recipient">{{addressData.recipient}}</span>
        <span class="tel__num">{{addressData.telNum}}</span>
      </div>
    </div>
    <div class="user__info--empty with__rightward__arrow"
     @click="$router.push({ name: 'OperateAddress', params: { type: 'create' } })" v-else>
      <div class="create__new__address">新建收货地址</div>
    </div>
    <div class="deliver__info with__rightward__arrow">
      <div class="arrive__time sub__title">
        送达时间
        <span class="arrive__time__result">
          12月24日 [12:00-13:55]
        </span>
      </div>
      <div id="deliver__tips">
        无接触配送，可填写下方备注，如放门口或前台等位置
      </div>
    </div>
  </div>
</template>

<script>
import { post } from '@/utils/request'
import { onBeforeMount, reactive, toRefs, watch } from '@vue/runtime-core'

const getDefaultAddressData = async(addressData) => {
  const accountId = sessionStorage.getItem('accountId')
  try {
    const result = await post('/address-list', { accountId, addressId: -1 })
    console.log('result:', result)
    if (
      result.data.firstAddressData === undefined &&
      result.data.msg === 'This user have no address yet.'
    ) {
      addressData.isEmpty = true
      return
    }
    const firstAddressData = result.data.firstAddressData
    const { recipient, address, telNum } = toRefs(addressData)
    recipient.value = firstAddressData.recipient
    address.value = firstAddressData.address
    telNum.value = firstAddressData.telNum
  } catch (e) {
    alert(e)
    console.log('error:', e)
  }
}

const applyChosenAddress = (addressData, chosenAddress) => {
  const { recipient, address, telNum } = toRefs(addressData)
  recipient.value = chosenAddress.recipient
  address.value = chosenAddress.address
  telNum.value = chosenAddress.telNum
}

export default {
  name: 'BasicInfo',
  emits: ['callAddressSheet', 'submitChosenAddress'],
  props: { chosenAddress: Object },
  setup(props, context) {
    const addressData = reactive({ index: 0, recipient: '', address: '', telNum: '', isEmpty: false })
    onBeforeMount(async() => {
      await getDefaultAddressData(addressData)
      context.emit('submitChosenAddress', addressData)
    })

    const handleUserInfoClick = () => {
      context.emit('callAddressSheet')
    }

    watch(() => props.chosenAddress, newValue => {
      console.log('newValue:', newValue)
      applyChosenAddress(addressData, newValue)
    }, { deep: true })

    return { addressData, handleUserInfoClick, applyChosenAddress }
  }
}
</script>

<style scoped lang="scss">
@import '@/style/mixin.scss';
@import '@/style/icon-font.scss';
@import '@/style/viriables.scss';

.with__rightward__arrow::after {
  @include with-rightward-arrow;
  border-color: $font-light-gray;
}
.basic__info {
  background-color: white;
  margin: .1rem;
  padding: .15rem;
  border-radius: .12rem;
  .user__info,
  .user__info--empty {
    position: relative;
    cursor: pointer;
    .address,
    .create__new__address {
      font-size: .2rem;
      font-weight: bold;
      color: $font-black;
      @include ellipsis;
      max-width: 80%;
    }
    &::after {
      right: 0;
      top: .1rem;
    }
    .other__info {
      color: $font-gray;
      font-weight: 300;
      font-size: .14rem;
      margin-top: .05rem;
      padding-bottom: .15rem;
      border-bottom: 1px solid $border-gray;
      .recipient {
        margin-right: .15rem;
      }
    }
  }
  .deliver__info {
    position: relative;
    width: 100%;
    padding-top: .15rem;
    padding-right: .18rem;
    font-size: .16rem;
    font-weight: bold;
    color: $font-black;
    line-height: .20rem;
    .arrive__time {
      @include bilateral-flex;
      .arrive__time__result {
        color: rgb(52, 139, 237);
        font-size: .16rem;
        font-weight: 400;
        text-align: right;
      }
    }
    &::after {
      right: 0;
      top: 0.22rem;
    }
    #deliver__tips {
      color: $striking-red;
      margin-top: .05rem;
      font-size: .1rem;
      font-weight: 400;
    }
  }
}
</style>
