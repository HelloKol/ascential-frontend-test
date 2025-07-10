import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Venues from "./components/Venues";
import Venue from "./components/Venue";
import Events from "./components/Events";
import Event from "./components/Event";
import { FavoritesDrawer } from "./components/FavoritesDrawer";
import { FavoritesProvider } from "./context/FavoritesContext";
import { Button, Flex, Heading } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const App: React.FC = () => (
  <FavoritesProvider>
    <Router>
      <Nav />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/venues" Component={Venues} />
        <Route path="/venues/:venueId" Component={Venue} />
        <Route path="/events" Component={Events} />
        <Route path="/events/:eventId" Component={Event} />
      </Routes>
    </Router>
  </FavoritesProvider>
);

const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Flex
      as="nav"
      bg="gray.700"
      color="white"
      padding="24px"
      gap="20px"
      alignItems="center"
    >
      <Button onClick={() => setIsOpen(true)}>
        <HamburgerIcon boxSize={6} />
      </Button>
      <FavoritesDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <Heading size="md">Ascential Front End Challenge</Heading>
    </Flex>
  );
};

export default App;
