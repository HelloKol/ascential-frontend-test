import { Button } from "@chakra-ui/react";
import { useFavorites } from "../context/FavoritesContext";

const FavoriteButton: React.FC<{
  id: number;
  name: string;
  type: "events" | "venues";
}> = ({ id, name, type }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isFav = isFavorite(id, type);

  // If event/venue is already favorite then remove it otherwise add to local storage
  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(id, type);
    } else {
      addFavorite({ id, name, type });
    }
  };

  return (
    <Button
      aria-label="Toggle favorite"
      colorScheme={"yellow"}
      isActive={isFav}
      onClick={toggleFavorite}
    >
      {isFav ? "Remove from Favorites" : "Add to favorites"}
    </Button>
  );
};

export default FavoriteButton;
