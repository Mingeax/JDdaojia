<template>
  <div class="form__list">
    <div class="address sub__item">
      <label for="address__ipt" class="ipt__lbl">地址：</label>
      <input type="text" id="address__ipt" class="ipt" maxlength="60"
       placeholder="例如：市政府小区A座906室" v-model="address">
    </div>
    <div class="recipient sub__item">
      <label for="recipient__ipt" class="ipt__lbl">收货人：</label>
      <input type="text" id="recipient__ipt" class="ipt" maxlength="60"
       placeholder="请填写收货人姓名" v-model="recipient">
    </div>
    <div class="tel__num sub__item">
      <label for="tel__num__ipt" class="ipt__lbl">联系电话：</label>
      <input type="text" id="tel__num__ipt" class="ipt" maxlength="60"
       placeholder="请填写收货人电话号码" v-model="telNum">
    </div>
  </div>
  <div class="save">
    <button class="save__btn" @click="handleSaveBtn(address, recipient, telNum)">保存</button>
  </div>
  <div class="delete" v-if="pageType === 'edit'">
    <button class="delete__btn" @click="handleDeleteBtn">
      <div class="iconfont icon-shanchu"></div>
    </button>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import { post } from '../../utils/request'
import { onBeforeMount, watch } from '@vue/runtime-core'

const usePageTypeEffect = () => {
  // 根据路径参数展现适合的页面。
  const route = useRoute()
  const router = useRouter()

  const pageType = route.params.type
  const addressId = route.params.addressId
  const accountId = sessionStorage.getItem('accountId')

  // 修改地址时,ipt默认值应是储存的原值.

  if (!['edit', 'create'].includes(pageType)) router.push({ name: 'AddressList', replace: true })

  const addressIptData = reactive({ address: '', recipient: '', telNum: '' })
  const { address, recipient, telNum } = toRefs(addressIptData)

  const fetchAddressDataById = async() => {
    // 在修改页面获取服务器端的具体地址信息,用来设定edit时表单的默认值.
    // 在创建页面只返回空reactive.
    switch (pageType) {
      case 'edit': {
        try {
          const result = await post('/address-list', { accountId, addressId })
          if (+result.errno !== 0) {
            alert(result.message)
            return
          }
          const addressData = result.data.addressDataById
          address.value = addressData.address
          recipient.value = addressData.recipient
          telNum.value = addressData.telNum
          // 注: 后期可以用http状态码的方式传递错误信息.
        } catch (e) {
          alert(e)
          console.log('error:', e)
        }
        break
      }
      case 'create': {
        break
      }
    }
  }
  const handleSaveBtn = async() => {
    switch (pageType) {
      case 'edit':
        try {
          const result = await post('operate-address/edit/' + String(addressId),
            {
              accountId,
              operateData: {
                address: address.value, recipient: recipient.value, telNum: telNum.value
              }
            }
          )
          console.log('result:', result)
          if (result.errno === 0) alert('地址修改成功!')
          else alert('地址修改失败.')
          break
        } catch (e) {
          alert(e)
          console.log('error:', e)
        }

        break
      case 'create':
        try {
          const result = await post('operate-address/create',
            {
              accountId,
              operateData: {
                address: address.value, recipient: recipient.value, telNum: telNum.value
              }
            }
          )
          console.log('result:', result)
          if (result.errno === 0) alert('新地址创建成功!')
          break
        } catch (e) {
          alert(e)
          console.log('error:', e)
        }
        break
    }
    setTimeout(router.back(), 1000)
  }

  const handleDeleteBtn = async() => {
    try {
      const result = await post('operate-address/edit/' + String(addressId),
        {
          accountId,
          operateData: {
            address: address.value, recipient: recipient.value, telNum: telNum.value
          },
          isDelete: true
        }
      )
      console.log('result:', result)
      if (result.errno === 0) alert('地址删除成功!')
      else alert('地址删除失败.')
    } catch (e) {
      alert(e)
      console.log('error:', e)
    }
    setTimeout(router.back(), 1000)
  }
  return { pageType, address, recipient, telNum, handleSaveBtn, handleDeleteBtn, fetchAddressDataById }
}

export default {
  name: 'OperateAddress',
  setup() {
    const route = useRoute()
    const { pageType, address, recipient, telNum, handleSaveBtn, handleDeleteBtn, fetchAddressDataById } = usePageTypeEffect()

    watch(() => route.params, (newParams, oldParams) => {
      if (
        route.name === 'OperateAddress' &&
        newParams !== oldParams
      ) location.reload()
    })
    // 注: 数据获取方法不够完善, 最好能改进:
    onBeforeMount(async() => await fetchAddressDataById())

    return {
      pageType,
      address,
      recipient,
      telNum,
      handleSaveBtn,
      handleDeleteBtn
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/icon-font.scss';
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';

.form__list {
  @include column-sub-block;
  font-size: .15rem;
  background-color: white;
  padding-left: .1rem;
  .sub__item {
    @include row-stretched-list;
    height: .45rem;
    border-bottom: 1px solid $border-white;
    .ipt__lbl {
      width: max-content;
      line-height: .45rem;
      color: $font-black;
    }
    .ipt {
      width: 55%;
      padding-left: .1rem;
      &::placeholder {
        color: rgb(85, 85, 85);
      }
    }
  }
}
.save,
.delete {
  @include single-item-centered;
  width: 100%;
}
.save {
  height: .4rem;
  padding: 0 .1rem;
  margin-top: .3rem;
  &__btn {
    @include theme-green-long-btn;
    flex: 1 1 auto;
  }
}
.delete {
  margin-top: .5rem;
  &__btn {
    height: .4rem;
    width: .4rem;
    background-color: white;
    border-radius: .2rem;
    .icon-shanchu {
      font-size: .21rem;
      color: $font-translucence;
    }
  }
}
</style>
