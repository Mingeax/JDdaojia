<template>
  <ShopHeader :cnName="cnName" :enName="enName" />
  <div class="search">
    <div class="search__field">
      <label for="search__input">
      <span class="iconfont icon-sousuo1" />
      </label>
      <input type="text" id="search__input"
       placeholder="搜索店内6242件商品">
    </div>
  </div>
  <Content :shopCnName="cnName" />
  <Cart />
  <Toast v-if='show' :message='toastMessage' />
</template>

<script>
import Cart from './Cart.vue'
import Content from './Content.vue'
import ShopHeader from './ShopHeader.vue'
import { get } from '@/utils/request.js'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import Toast, { useToastEffect } from '@/components/Toast'
import { ref, reactive, toRefs } from '@vue/reactivity'
import { watchEffect } from '@vue/runtime-core'

const { show, toastMessage, showToast } = useToastEffect()

const useShopInfoEffect = shopId => {
  const nameData = reactive({ enName: '', cnName: '' })
  const getShopInfo = async(shopId) => {
    try {
      const results = await get(`/shop/${shopId.value}`)
      if (results?.errno) {
        console.log('error: Failed To Get Shop Information', results.errno)
        showToast('请求失败')
      } else if (+shopId.value !== results.id) {
        console.log('error: Get Wrong Shop Information')
        showToast('请求失败')
      } else {
        nameData.enName = results.enName
        nameData.cnName = results.cnName
      }
    } catch (e) {
      console.log(e)
      showToast('请求失败')
    }
  }
  watchEffect(() => getShopInfo(shopId))

  const { enName, cnName } = toRefs(nameData)
  return { enName, cnName }
}

export default {
  name: 'Shop',
  components: { Cart, Content, ShopHeader, Toast },
  setup() {
    const route = useRoute()
    const shopId = ref(route.params.id)
    const { enName, cnName } = useShopInfoEffect(shopId)

    onBeforeRouteUpdate(async(to, from) => {
      // 仅当 id 更改时才更新，例如当 hash 值更改了
      if (to.params.id !== from.params.id) {
        shopId.value = to.params.id
      }
    })
    return {
      show,
      toastMessage,
      showToast,
      shopId,
      enName,
      cnName
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';

.search {
  width: 100%;
  background-color: white;
  padding: 0 .12rem .15rem .12rem;
  .search__field {
    padding: 0 .08rem;
    line-height: .3rem;
    height: .3rem;
    border-radius: .15rem;
    background: rgb(244, 244, 244);
    label[for=search__input] {
      color: $font-light-gray;
    }
    #search__input {
      font-size: .14rem;
      text-align: left;
      line-height: .3rem;
      &::placeholder {
        color: rgb(85, 85, 85);
      }
    }
  }

}

</style>
