import { useState, useCallback } from 'react'

const STORAGE_KEY = 'oshiwatch:favourites'

function loadFavourites(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveFavourites(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // storage full or unavailable — fail silently
  }
}

export function useFavourites() {
  const [favourites, setFavourites] = useState<string[]>(loadFavourites)

  const toggleFavourite = useCallback((channelId: string) => {
    setFavourites(prev => {
      const updated = prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
      saveFavourites(updated)
      return updated
    })
  }, [])

  const isFavourite = useCallback(
    (channelId: string) => favourites.includes(channelId),
    [favourites]
  )

  return { favourites, toggleFavourite, isFavourite }
}
