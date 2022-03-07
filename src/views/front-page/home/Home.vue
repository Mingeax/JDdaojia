<template>
<div class="scroll__content">
 <Header />
 <Service />
 <Nearby />
</div>
</template>

<script>
import Header from './Header.vue'
import Service from './Service.vue'
import Nearby from './Nearby.vue'

export default ({
  name: 'Home',
  components: { Header, Service, Nearby },
  setup() {

  }
})
</script>

<style>
.scroll__content {
  overflow: scroll;
  height: calc(100vh - .5rem);
}
</style>
