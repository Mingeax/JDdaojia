<template>
  <div class="normal__page" v-show="+isLogin">
    <TabContent />
    <TabBar />
  </div>
  <NoLoginPage v-show="!+isLogin" />
</template>

<script>
import NoLoginPage from '@/components/NoLoginPage.vue'
import TabContent from './TabContent.vue'
import TabBar from './TabBar.vue'
import { ref } from '@vue/reactivity'
import { watchEffect } from '@vue/runtime-core'

const useLoginEffect = () => {
  const isLogin = ref(0)
  watchEffect(() => {
    isLogin.value = sessionStorage.getItem('isLogin')
  })

  return { isLogin }
}

export default {
  name: 'Discovery',
  components: { NoLoginPage, TabContent, TabBar },
  setup() {
    const { isLogin } = useLoginEffect()
    return { isLogin }
  }
}
</script>

<style lang="scss" scoped>

</style>
