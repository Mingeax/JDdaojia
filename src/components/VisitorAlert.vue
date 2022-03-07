<template>
  <div class="mask">
    <div class="alert--visitor" v-show="alertShow">
    <!-- CSS Animation 在pc端的Firefox似乎有bug, 会在页面加载的短时间内重复播放.
     此处用计时器设置播放延迟, 以避免显示错误 -->
      <h2 class="alert__title">温馨提示</h2>
      <div class="alert__msg--visitor">您还没有登录</div>
      <div class="alert__options">
        <button class="alert__option cancel__btn"
         @click="cancelAlert()" type="button">
         取消
        </button>
        <button class="alert__option go__register__btn"
         @click="$router.push({ name: 'LoginRegister' }), cancelAlert()" type="button">
         去登录
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// 使用提示:
// <VisitorAlert @cancelAlert="cancelAlert()" v-show="isAlertShow" />
/* import VisitorAlert from '@/components/VisitorAlert.vue'
import { ref } from '@vue/reactivity'

{
  name: '...',
  components: { VisitorAlert },
  setup() {
    const isAlertShow = ref(true)
    const generateAlert = () => {
      isAlertShow.value = true
    }
    const cancelAlert = () => {
      isAlertShow.value = false
    }
    return { isAlertShow, cancelAlert, generateAlert }
  }
} */
import { ref } from '@vue/reactivity'
export default {
  name: 'VisitorAlert',
  emits: ['cancelAlert'],
  setup(porps, ctx) {
    const ctrlAlertShow = () => {
      const alertShow = ref(false)
      const loadPromise = new Promise((resolve, reject) => {
        setTimeout(resolve, 800)
        setTimeout(reject, 1500)
      })
      loadPromise.then(
        () => (alertShow.value = true),
        error => alert(error)
      )
      return alertShow
    }
    const alertShow = ctrlAlertShow()
    const cancelAlert = () => {
      ctx.emit('cancelAlert')
    }
    return { alertShow, cancelAlert }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
@import '@/style/viriables.scss';

.mask {
  @include bg;
  background-color: rgba(0,0,0,.8);
  .alert--visitor {
    @include column-centered-list;
    // 注：或许可以用height来控制动画。
    // 需从js返回子条目结点数量，再在scss中根据此结点数量计算实际的父容器height.计算的height要与实际height精确吻合.
    @keyframes alertShow {
      from {
        transform: translate(-50%, -50%) scale(0);
      }
      to {
        transform: translate(-50%, -50%) scale(1);
      }
    }
    z-index: 1000;
    position: absolute;
    width: 2.7rem;
    color: $font-black;
    border-radius: .12rem;
    background-color: white;
    overflow: hidden;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0);
    animation: alertShow .2s linear 1 0s normal forwards;
    .alert__title {
      margin: .2rem 0 .1rem;
      line-height: .25rem;
    }
    .alert__msg--visitor {
      font-size: .14rem;
      margin-bottom: .2rem;
      line-height: .19rem;
    }
    .alert__options {
      @include row-stretched-list;
      width: 100%;
      height: .52rem;
      .alert__option {
        flex: 0 0 50%;
        font-size: .18rem;
        cursor: pointer;
        &.cancel__btn {
          color: $font-light-gray;
        }
        &.go__register__btn {
          color: $theme-green-btn-bg-color;
          font-weight: 700;
        }
      }
    }
  }
}
</style>
