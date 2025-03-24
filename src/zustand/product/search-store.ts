import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchState {
  searchQuery: string
  selectedLocation: {
    country: string
    state: string
  } | null
  setSearchQuery: (query: string) => void
  setSelectedLocation: (location: { country: string; state: string } | null) => void
  clearSearch: () => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searchQuery: '',
      selectedLocation: null,
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedLocation: (location) => set({ selectedLocation: location }),
      clearSearch: () => set({ searchQuery: '', selectedLocation: null }),
    }),
    {
      name: 'search-store',
    }
  )
)
