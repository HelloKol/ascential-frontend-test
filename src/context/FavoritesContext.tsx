import React, { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

type FavoriteItem = {
  id: number;
  type: "events" | "venues";
  name: string;
};

interface FavoritesContextProps {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: number, type: "events" | "venues") => void;
  isFavorite: (id: number, type: "events" | "venues") => boolean;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites, isFavoritesLoading] = useLocalStorage<
    FavoriteItem[]
  >("favorites", []);

  const addFavorite = (item: FavoriteItem) => {
    if (!isFavorite(item.id, item.type)) {
      setFavorites((prev) => [...prev, item]);
    }
  };

  const removeFavorite = (id: number, type: "events" | "venues") => {
    setFavorites((prev) =>
      prev.filter((f) => !(f.id === id && f.type === type))
    );
  };

  const isFavorite = (id: number, type: "events" | "venues") =>
    favorites.some((f) => f.id === id && f.type === type);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
};
