import { createContext, useContext, useState, useCallback } from "react";

export interface FavoriteItem {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  image: string;
  gender: string;
  notes: string;
  description: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  toggle: (item: FavoriteItem) => void;
  isFavorite: (id: string) => boolean;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const toggle = useCallback((item: FavoriteItem) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === item.id);
      if (exists) return prev.filter(f => f.id !== item.id);
      return [...prev, item];
    });
  }, []);

  const isFavorite = useCallback((id: string) => {
    return favorites.some(f => f.id === id);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite, count: favorites.length }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
