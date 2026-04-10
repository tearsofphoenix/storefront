"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import { useExpressRegion } from "./express-region"

type CartContextType = {
  cart?: HttpTypes.StoreCart
  addToCart: (variantId: string, quantity: number) => Promise<HttpTypes.StoreCart>
  updateCart: (data: {
    updateData?: HttpTypes.StoreUpdateCart
    shippingMethodData?: HttpTypes.StoreAddCartShippingMethods
  }) => Promise<HttpTypes.StoreCart | undefined>
  refreshCart: () => Promise<HttpTypes.StoreCart | undefined>
  updateItemQuantity: (itemId: string, quantity: number) => Promise<HttpTypes.StoreCart>
  unsetCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

type CartProviderProps = {
  children: React.ReactNode
}

export const ExpressCartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<HttpTypes.StoreCart>()
  const { region } = useExpressRegion()

  useEffect(() => {
    if (!region) {
      return
    }
    if (cart) {
      localStorage.setItem("express_cart_id", cart.id)
      return
    }

    const cartId = localStorage.getItem("express_cart_id")
    if (!cartId) {
      refreshCart()
    } else {
      sdk.store.cart.retrieve(cartId, {
        fields: "+items.variant.*,+items.variant.options.*,+items.variant.options.option.*"
      })
        .then(({ cart: dataCart }) => {
          setCart(dataCart)
        })
    }
  }, [cart, region])

  useEffect(() => {
    if (!cart || !region || cart.region_id === region.id) {
      return
    }

    sdk.store.cart.update(cart.id, {
      region_id: region.id
    })
      .then(({ cart: dataCart }) => {
        setCart(dataCart)
      })
  }, [region])

  const refreshCart = async () => {
    if (!region) {
      return
    }

    const { cart: dataCart } = await sdk.store.cart.create({
      region_id: region.id,
    })

    localStorage.setItem("express_cart_id", dataCart.id)
    setCart(dataCart)

    return dataCart
  }

  const addToCart = async (variantId: string, quantity: number) => {
    const newCart = await refreshCart()
    if (!newCart) {
      throw new Error("Could not create cart")
    }

    const { cart: dataCart } = await sdk.store.cart.createLineItem(newCart.id, {
      variant_id: variantId,
      quantity,
    })
    setCart(dataCart)

    return dataCart
  }

  const updateCart = async ({
    updateData,
    shippingMethodData
  }: {
    updateData?: HttpTypes.StoreUpdateCart
    shippingMethodData?: HttpTypes.StoreAddCartShippingMethods
  }) => {
    if (!updateData && !shippingMethodData) {
      return cart
    }
    let returnedCart = cart
    if (updateData) {
      returnedCart = (await sdk.store.cart.update(cart!.id, updateData)).cart
    }

    if (shippingMethodData) {
      returnedCart = (await sdk.store.cart.addShippingMethod(cart!.id, shippingMethodData)).cart
    }

    setCart(returnedCart)

    return returnedCart
  }

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    const { cart: dataCart } = await sdk.store.cart.updateLineItem(cart!.id, itemId, {
      quantity,
    })
    setCart(dataCart)

    return dataCart
  }

  const unsetCart = () => {
    localStorage.removeItem("express_cart_id")
    setCart(undefined)
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateCart,
      refreshCart,
      updateItemQuantity,
      unsetCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useExpressCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useExpressCart must be used within an ExpressCartProvider")
  }

  return context
}
