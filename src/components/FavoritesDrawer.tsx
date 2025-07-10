import { Link } from "react-router-dom";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Button,
  VStack,
  Text,
  Box,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useFavorites } from "../context/FavoritesContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FavoritesDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { favorites, removeFavorite } = useFavorites();

  const renderFavorites = () =>
    favorites.map((item) => (
      <Box
        key={item.id}
        borderWidth="1px"
        p="3"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Link to={`/${item.type}/${item.id}`}>
          <Text fontWeight="bold">{item.name}</Text>
        </Link>
        <Button
          size="sm"
          variant="ghost"
          colorScheme="red"
          aria-label="Remove from favorites"
          onClick={() => removeFavorite(item.id, item.type)}
        >
          <CloseIcon boxSize={3} />
        </Button>
      </Box>
    ));

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Favorites</DrawerHeader>
        <DrawerBody>
          {favorites.length === 0 ? (
            <Text>No favorites yet.</Text>
          ) : (
            <VStack align="stretch" spacing={4}>
              {renderFavorites()}
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
