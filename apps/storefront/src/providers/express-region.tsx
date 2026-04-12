"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"

type RegionContextType = {
  region?: HttpTypes.StoreRegion
  regions: HttpTypes.StoreRegion[]
  setRegion: React.Dispatch<
    React.SetStateAction<HttpTypes.StoreRegion | undefined>
  >
}

const RegionContext = createContext<RegionContextType | null>(null)

type RegionProviderProps = {
  children: React.ReactNode
}

export const ExpressRegionProvider = (
  { children }: RegionProviderProps
) => {
  const [regions, setRegions] = useState<
    HttpTypes.StoreRegion[]
  >([])
  const [region, setRegion] = useState<
    HttpTypes.StoreRegion
  >()

  const clearStoredRegion = useCallback(() => {
    localStorage.removeItem("express_region_id")
    setRegion(undefined)
  }, [])

  useEffect(() => {
    if (regions.length) {
      return
    }

    sdk.store.region.list()
      .then(({ regions }) => {
        setRegions(regions)
      })
      .catch(() => {
        setRegions([])
      })
  }, [regions.length])

  useEffect(() => {
    if (region) {
      localStorage.setItem("express_region_id", region.id)
      return
    }

    const regionId = localStorage.getItem("express_region_id")
    if (!regionId) {
      if (regions.length) {
        setRegion(regions[0])
      }
    } else {
      sdk.store.region.retrieve(regionId)
        .then(({ region: dataRegion }) => {
          setRegion(dataRegion)
        })
        .catch(() => {
          clearStoredRegion()
          if (regions.length) {
            setRegion(regions[0])
          }
        })
    }
  }, [clearStoredRegion, region, regions])

  return (
    <RegionContext.Provider value={{
      region,
      regions,
      setRegion,
    }}>
      {children}
    </RegionContext.Provider>
  )
}

export const useExpressRegion = () => {
  const context = useContext(RegionContext)

  if (!context) {
    throw new Error("useExpressRegion must be used within an ExpressRegionProvider")
  }

  return context
}
