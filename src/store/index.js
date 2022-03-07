import { createStore } from 'vuex'

const setStorage = (key, value) => {
  const JSONValue = JSON.stringify(value)
  sessionStorage.setItem(key, JSONValue)
}

const getStorageByKey = (key) => {
  const data = sessionStorage.getItem(key)
  return JSON.parse(data)
}

export default createStore({
  state: {
    // cartList的初始值从会话存储中获取.
    // 商品的排列顺序以加入购物车的时间先后为准.
    cartList: getStorageByKey('cartList') || {},
    // 1(shopId): {
    //   1(productNo, 商品的次序): {
    //     id(productId): 1,
    //     name: '蜜瓜 约1.3kg /份',
    //     imgURL: '/img/1.6ebef687.jpg',
    //     sales: 14,
    //     price: 14.9,
    //     count: 1,
    //     check: true
    //   }
    // }

    shopNameList: {
      // { shopId: shopCnName }
      1: '卜蜂莲花',
      2: '华润万家',
      3: '永辉超市',
      4: '人人乐',
      5: '怡康大药房'
    },

    newOrder: getStorageByKey('newOrder') || {},
    // 提交购物车是newOrder.
    // 提交购物车后,把initialOrder存入state的newOrder,
    // 确认订单后,把相应订单从此处移除.
    // newOrder含商店、商店名、商品信息、支付额,其中后两者用后端返回的数据
    // {
    //   shopId: xxx,
    //   shopCnName: xxx,
    //   shopEnName: xxx,
    //   // 注: 日后加上 addressId: xxx,
    //   payment: xxx,
    //   products: [
    //     {
    //       id: xxx,
    //       count: xxx,
    //       totalPrice: xxx,
    //     }
    //   ]
    // }

    orderForPay: getStorageByKey('orderForPay') || {}
    // orderForPay是确认订单后暂存的信息,用于支付时使用.
    // 包含shopId, shopCnName, payment, orderId.
  },
  mutations: {
    changeCartItem(state, payload) {
    // 先找对应商店,再找对应商品
    // 根据+num后的值,创建\删除\保留以及赋值给该商店/商品
    // payload中,shopName一般非必需,但必须确定商店已在state.cartList中.
    // payload.product的结构示例:
    // {
    //   id: 3 * **
    //   name: "火龙果 约450g /份" **
    //   price: 11.88 **
    //   sales: 34 **
    //   count: 2
    //   check: true
    //   imgURL: "/img/3.a7ed8080.jpg"
    // }
    // 带*的条目是必需的(如果确信store中已有该商品信息,只是想增减数量的话).
    // 带**的条目是从服务器直接获取的.

      const { shopId, product, num, shopCnName } = payload
      console.log('payload:', payload)
      const shopIdList = Object.keys(state.cartList)
      if (!shopIdList.includes(String(shopId))) {
        // 检索商店是否已在store中.
        if (num > 0) {
          state.cartList[shopId] = {}
          if (shopCnName) {
            state.shopNameList[shopId] = shopCnName
            setStorage('shopNameList', state.shopNameList)
            setStorage('cartList', state.cartList)
          }
        } else return
      }
      const shopInfo = state.cartList[shopId]
      let isProductInCart = false
      for (const productNo in shopInfo) {
        // 检索商品是否已在store中.
        const productInfo = shopInfo[productNo]
        if (productInfo.id === product.id) {
          productInfo.count += num
          productInfo.check = true
          if (productInfo.count <= 0) {
            // 每删除一个商品,都要将商品列表紧凑排序一遍(稠密化)
            delete shopInfo[productNo]
            const productNoList = Object.keys(state.cartList[shopId])
            const newShopInfo = {}
            productNoList.forEach((productNo1, index) => {
              newShopInfo[index + 1] = shopInfo[productNo1]
            })
            state.cartList[shopId] = newShopInfo
            setStorage('cartList', state.cartList)
            return
          }
          setStorage('cartList', state.cartList)
          isProductInCart = true
          break
        }
      }
      if (!isProductInCart && num > 0) {
        // 在store中创建新商品.
        product.count = num
        product.check = true
        const nextProductNo = Object.keys(state.cartList[shopId]).length + 1
        shopInfo[nextProductNo] = product
        setStorage('cartList', state.cartList)
      }
    },
    clearCartProducts(state, payload) {
      const { shopId } = payload
      state.cartList[shopId] = {}
      setStorage('cartList', state.cartList)
    },
    toggleCartProductCheck(state, payload) {
    // 若productNo未传参,则切换此shopId下所有商品的check.
    // 遍历中若遇到一个false的check,则把它和剩下所有checks都设为true;
    // 若所有checks都为true,则将所有checks设为false.
      const { shopId, productNo } = payload

      if (!productNo) {
        const shopInfo = state.cartList[shopId]
        let productNo = 0
        for (const productNo1 in shopInfo) {
          if (!shopInfo[productNo1].check) {
            productNo = productNo1
            break
          }
        }
        if (productNo) {
          for (const productNo2 in shopInfo) {
            const product = shopInfo[+productNo + +productNo2 - 1]
            if (!product) {
              setStorage('cartList', state.cartList)
              return
            }
            product.check = true
          }
        } else {
          for (productNo in shopInfo) shopInfo[productNo].check = false
          setStorage('cartList', state.cartList)
        }
      } else if (productNo <= 0) console.log('Wrong argument.')
      else {
        const product = state.cartList[shopId][productNo]
        product.check = !(product.check)
        setStorage('cartList', state.cartList)
      }
    },
    removeCartProducts(state, payload) {
      // 将一个商店内的若干指定商品清空.
      // payload需包含商店和商品序号列表.
      const { shopId, productIds } = payload
      const products = state.cartList[shopId]
      for (const productNo in products) {
        const product = products[productNo]
        if (productIds.includes(product.id)) delete products[productNo]
      }
      // 清空所有的目标商品后, 对cartList中该商店的商品列表进行稠密化排列,逻辑与changeCartItem中相似.
      const productNoList = Object.keys(products)
      const remainingProducts = {}
      productNoList.forEach((productNo1, index) => {
        remainingProducts[index + 1] = products[productNo1]
      })
      console.log('remainingProducts', remainingProducts)
      state.cartList[shopId] = remainingProducts
      setStorage('cartList', state.cartList)
      console.log('Removing cart products successfully')
    },
    clearNewOrder(state) {
      // 用于清除提交订单的缓存.
      state.newOrder = {}
      setStorage('newOrder', state.newOrder)
    },
    submitNewOrder(state, payload) {
      const { shopId, shopCnName, payment, products } = payload
      console.log('shopId:', shopId, 'shopCnName:', shopCnName,
        'payment:', payment, 'products:', products)
      if (!(shopId && shopCnName && payment && products)) {
        console.log('Need necessary properties in payload.')
        return
      }
      state.newOrder = payload
      state.newOrder.payment = (+payment).toFixed(2)
      setStorage('newOrder', state.newOrder)
      console.log('Sucessfully submitNewOrder !')
    },
    removeNewOrder(state) {
      state.newOrder = {}
      setStorage('newOrder', state.newOrder)
    },
    submitOrderForPay(state, payload) {
      const { shopId, shopCnName, payment, orderId } = payload
      console.log('{ shopId, shopCnName, payment }:', { shopId, shopCnName, payment })
      if (!(shopId && shopCnName && payment && orderId)) {
        console.log('Need necessary properties in payload.')
        return
      }
      state.orderForPay = payload
      setStorage('orderForPay', state.orderForPay)
      return 'Sucessfully submitOrderForPay !'
    }
  },
  actions: {
  },
  modules: {
  }
})
