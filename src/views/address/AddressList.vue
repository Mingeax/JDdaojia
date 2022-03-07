<template>
  <div class="container" v-if="addressData?.length !== 0 && Array.isArray(addressData)">
    <div class="title">我的收货地址</div>
    <div class="address__list">
    <div class="address__item" v-for="(item, index) in addressData" :key="index">
      <div class="recipient__info">
        <div class="recipient__name">{{item.recipient}}</div>
        <div class="recipient__tel__num">{{item.telNum}}</div>
      </div>
      <p class="address__info">
        {{item.address}}
      </p>
      <div class="iconfont icon-xiugai"
       @click="$router.push({
       name: 'OperateAddress',
       params: { type: 'edit', addressId: item.id }
       })" />
    </div>
    </div>
    <div class="create__new__address">
    <button class="create__new__address__btn"
     @click="$router.push({ name: 'OperateAddress', params: { type: 'create' } })">新建收货地址</button>
    </div>
  </div>
  <EmptyListInterface v-else />
</template>

<script>
import { post } from '@/utils/request.js'
import EmptyListInterface from './EmptyListInterface.vue'

const fetchAddressList = async(next) => {
  // 获取地址列表.
  const accountId = sessionStorage.getItem('accountId')
  try {
    const result = await post('/address-list', { accountId })
    console.log('result:', result)
    const addressData = result.data.addressesByUserId
    next(addressData)
  } catch (e) {
    alert(e)
    console.log('error:', e)
  }
}

export default {
  name: 'AddressList',
  components: { EmptyListInterface },
  data() {
    return {
      addressData: null
    }
  },
  beforeRouteEnter(to, from, next) {
    fetchAddressList(addressData => {
      next(vm => {
        vm.$data.addressData = addressData
        console.log('vm:', vm)
      })
    })
  },
  setup() {}
}
</script>

<style lang="scss" scoped>
@import '@/style/icon-font.scss';
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';

.container{
  .title {
  color: $font-gray;
  font-size: .14rem;
  padding: .1rem .15rem;
  line-height: .17rem;
}
  .address__list {
    background-color: white;
    .address__item {
      display: grid;
      grid-template-areas:
      "recipient iconfont"
      "address iconfont";
      row-gap: .1rem;
      column-gap: .05rem;
      padding: .15rem .13rem .15rem 0;
      margin-left: .1rem;
      font-size: .14rem;
      border-bottom: 1px solid $border-white;
      .recipient__info {
        font-size: .16rem;
        grid-area: recipient;
        line-height: .2rem;
        color: $font-gray;
        @include row-centered-list;
        gap: .05rem;
      }
      .address__info {
        grid-area: address;
        line-height: .18rem;
        color: $font-black;
      }
      .icon-xiugai {
        height: .16rem;
        width: .16rem;
        font-size: .14rem;
        grid-area: iconfont;
        place-self: center flex-end;
        opacity: .5;
        cursor: pointer;
      }
    }
  }
  .create__new__address {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: .55rem;
    background-color: white;
    @include single-item-centered;
    &__btn {
      @include theme-green-long-btn;
      width: 100%;
      margin: 0 .1rem;
    }
  }
}

</style>
