<template>
  <router-view></router-view>
  <Docker></Docker>
</template>

<style lang="scss" scoped>
</style>

<script>
import Docker from '@/components/Docker.vue'

export default {
  name: 'FrontPage',
  components: { Docker },
  setup() {
  }
}
</script>
