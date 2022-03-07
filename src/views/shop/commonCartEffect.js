import { computed } from 'vue'
import { post } from '@/utils/request.js'
import router from '@/router/index.js'
import store from '@/store/index.js'

export const useCommonCartEffect = shopId => {
  const cartList = computed(() => store.state.cartList)
  const shopNameList = computed(() => store.state.shopNameList)

  const findCartItemCount = productId => {
    // 查询购物车中某个商品的数量
    const count = computed(() => {
      for (const productNo in cartList.value?.[shopId]) {
        // productId必须存在
        if (cartList.value[shopId]?.[productNo]?.id === productId) {
          return cartList.value[shopId]?.[productNo]?.count
        }
      }
      return 0
    })
    return count
  }

  const changeCartItem = (product, num, shopId, shopCnName) => {
    // shopCnName非必需,除非该商店未在cartList内.
    store.commit('changeCartItem', {
      shopId, product, num, shopCnName
    })
  }

  const isShopAllChecked = shopId => {
    // 产品的check与否影响总价,不影响总数.
    const isAllChecked = computed(() => {
      let checks = true
      const shop = store.state.cartList[shopId]
      for (const productNo in shop) {
        if (!shop[productNo].check) {
          checks = false
          break
        }
      }
      return checks
    })
    return isAllChecked
  }
  const isShopAllUnchecked = shopId => {
    const isAllUnchecked = computed(() => {
      let checks = true
      const shop = store.state.cartList[shopId]
      for (const productNo in shop) {
        if (shop[productNo].check) {
          checks = false
          break
        }
      }
      return checks
    })
    return isAllUnchecked
  }
  const isShopEmpty = shopId => {
    const isShopEmpty = computed(() => {
      const shop = store.state.cartList[shopId]
      if (!Object.keys(shop).length) return true
      else return false
    })
    return isShopEmpty
  }
  const isCartListEmpty = () => {
    const isCartListEmpty = computed(() => {
      let isCartListEmpty = true
      for (const shopId in store.state.cartList) {
        if (!isShopEmpty(shopId).value) {
          isCartListEmpty = false
          break
        }
      }
      return isCartListEmpty
    })
    return isCartListEmpty
  }

  const calculateAmountAndPayment = computed(() => {
    // 供订单使用.
    let totalAmount = 0
    let actualPayment = 0
    const productList = cartList.value?.[shopId]
    if (productList) {
      for (const productNo in productList) {
        const product = productList[productNo]
        if (!product.check) continue
        totalAmount += product.count
        actualPayment += product.count * product.price
      }
    }
    actualPayment = actualPayment.toFixed(2)
    return { totalAmount, actualPayment }
  })

  function InitialOrder(shopId) {
    // 确认订单时准备的订单信息.
    // 含有验证登录状态的环节.
    // 包含用户、商店和地址ID,以及各商品的ID数量.
    // this.accountId = sessionStorage.getItem('accountId')
    // 提示: 对cartList和products做逐一解构并赋值.
    // this.shopId = router.currentRoute.value.params.id
    if (!+sessionStorage.getItem('isLogin')) return {}
    this.shopId = shopId
    this.accountId = sessionStorage.getItem('accountId')
    const productList = cartList?.value[shopId]
    // const productList = cartList.value?.[shopId]
    const products = []
    if (!productList && !this.shopId) {
      console.log('Can\'t find the productList or shopId')
      return {}
    }
    for (const productNo in productList) {
      const product = productList[productNo]
      if (!product.check) {
        continue
      }
      const processedProduct = {
        id: product.id,
        count: product.count,
        imgURL: product.imgURL
      }
      products.push(processedProduct)
    }
    this.products = products
  }

  const confirmOrder = async(shopId) => {
    // 等response订单数据传回后,把该订单信息存入vuex,之后才进入支付页面.
    console.log('confirmed')
    const initialOrder = new InitialOrder(shopId)
    console.log('initialOrder:', initialOrder)

    try {
      const result = await post('user/order', { ...initialOrder, processCode: 1 })
      const { payment, products, shopCnName } = result.data
      for (const i in initialOrder.products) {
        const productId = initialOrder.products[i].id
        products.find(product => product.id === productId).imgURL = initialOrder.products[i].imgURL
      }
      store.commit('submitNewOrder', { shopId, shopCnName, payment, products })
      router.push({ name: 'OrderConfirm' })
    } catch (e) {
      alert(e)
      console.log('error:', e)
    }
  }

  return {
    cartList,
    shopNameList,
    calculateAmountAndPayment,
    InitialOrder,
    findCartItemCount,
    isShopAllChecked,
    isShopAllUnchecked,
    isShopEmpty,
    isCartListEmpty,
    changeCartItem,
    confirmOrder
  }
}
