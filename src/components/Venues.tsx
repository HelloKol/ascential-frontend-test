import React, { useState, useEffect, useRef } from "react";
import {
  SimpleGrid,
  Flex,
  Heading,
  Text,
  Box,
  Badge,
  LinkBox,
  LinkOverlay,
  Input,
} from "@chakra-ui/react";
import { Link as BrowserLink } from "react-router-dom";
import { useSeatGeek } from "../utils/useSeatGeek";
import Error from "./Error";
import Breadcrumbs from "./Breadcrumbs";
import FavoriteButton from "./FavoriteButton";
import Pagination from "./Pagination";
import SkeletonCard from "./SkeletonCard";

export interface VenueProps {
  id: number;
  has_upcoming_events: boolean;
  num_upcoming_events: number;
  name_v2: string;
  display_location: string;
}

interface VenuItemProps {
  venue: VenueProps;
}

const Venues: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [page, setPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  // debounce search query to avoid too many requests
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data, error } = useSeatGeek("/venues", {
    q: debouncedSearch || "",
    sort: "score.desc",
    per_page: "24",
    page: page.toString(),
  });

  useEffect(() => {
    if (data && inputRef.current) {
      inputRef.current.focus();
    }
  }, [data]);

  // reset page state when searching/filtering data
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  if (error) return <Error />;

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Venues" }]} />

      <Flex px={6} mt={4}>
        <Input
          ref={inputRef}
          placeholder="Search venues by name or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          width="300px"
        />
      </Flex>

      {!data ? (
        <SimpleGrid spacing="6" m="6" minChildWidth="350px">
          {[...Array(24)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </SimpleGrid>
      ) : data.venues.length === 0 ? (
        <Flex justifyContent="center" alignItems="center" margin="50px 0 0 0">
          <Text fontSize="xl" color="gray.600">
            No venues found
          </Text>
        </Flex>
      ) : (
        <>
          <SimpleGrid spacing="6" m="6" minChildWidth="350px">
            {data.venues.map((venue: VenueProps) => (
              <VenueItem key={venue.id.toString()} venue={venue} />
            ))}
          </SimpleGrid>

          {data.meta && (
            <Pagination
              total={data.meta.total}
              perPage={data.meta.per_page}
              page={page}
              setPage={setPage}
            />
          )}
        </>
      )}
    </>
  );
};

const VenueItem: React.FC<VenuItemProps> = ({ venue }) => (
  <LinkBox>
    <Box
      p={[4, 6]}
      bg="gray.50"
      borderColor="gray.200"
      borderWidth="1px"
      justifyContent="center"
      alignContent="center"
      rounded="lg"
      _hover={{ bg: "gray.100" }}
    >
      <Badge colorScheme={venue.has_upcoming_events ? "green" : "red"} mb="2">
        {`${
          venue.has_upcoming_events ? venue.num_upcoming_events : "No"
        } Upcoming Events`}
      </Badge>
      <Heading size="sm" noOfLines={1}>
        <LinkOverlay as={BrowserLink} to={`/venues/${venue.id}`}>
          {venue.name_v2}
        </LinkOverlay>
      </Heading>
      <Text fontSize="sm" color="gray.500">
        {venue.display_location}
      </Text>
      <Box margin="auto 0 0 0">
        <FavoriteButton id={venue.id} name={venue.name_v2} type="venues" />
      </Box>
    </Box>
  </LinkBox>
);

export default Venues;
