import React, { useState, useEffect } from "react";
import {
  SimpleGrid,
  Flex,
  Spinner,
  Heading,
  Text,
  Box,
  Card,
  CardBody,
  Stack,
  Image,
  LinkBox,
  LinkOverlay,
  Input,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";
import Error from "./Error";
import FavoriteButton from "./FavoriteButton";
import { useSeatGeek } from "../utils/useSeatGeek";
import { formatDateTime } from "../utils/formatDateTime";

export interface Performers {
  image: string;
}

export interface Venue {
  name_v2: string;
  display_location: string;
}

export interface EventProps {
  id: number;
  short_title: string;
  datetime_utc: Date;
  performers: Performers[];
  venue: Venue;
}

interface EventItemProps {
  event: EventProps;
}

const Events: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [eventType, setEventType] = useState("concert");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // debounce search query to avoid too many requests
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data, error } = useSeatGeek("/events", {
    type: eventType,
    q: debouncedSearch,
    sort: "score.desc",
    per_page: "24",
  });

  if (error) return <Error />;

  if (!data) {
    return (
      <Flex justifyContent="center" alignItems="center" minHeight="50vh">
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Events" }]} />

      <Flex gap={4} px={6} mt={4} flexWrap="wrap">
        <Input
          placeholder="Search for events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          width="300px"
        />
      </Flex>

      {data.events.length === 0 ? (
        <Flex justifyContent="center" alignItems="center" margin="50px 0 0 0">
          <Text fontSize="xl" color="gray.600">
            No data found
          </Text>
        </Flex>
      ) : (
        <SimpleGrid spacing="6" m="6" minChildWidth="350px">
          {data.events?.map((event: EventProps) => (
            <EventItem key={event.id.toString()} event={event} />
          ))}
        </SimpleGrid>
      )}
    </>
  );
};

const EventItem: React.FC<EventItemProps> = ({ event }) => (
  <LinkBox
    as={Card}
    variant="outline"
    overflow="hidden"
    bg="gray.50"
    borderColor="gray.200"
    _hover={{ bg: "gray.100" }}
  >
    <Image src={event.performers[0].image} />
    <CardBody>
      <Stack spacing="2" height="100%">
        <Heading size="md">
          <LinkOverlay as={Link} to={`/events/${event.id}`}>
            {event.short_title}
          </LinkOverlay>
        </Heading>
        <Box>
          <Text fontSize="sm" color="gray.600">
            {event.venue.name_v2}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {event.venue.display_location}
          </Text>
        </Box>
        <Text
          fontSize="sm"
          fontWeight="bold"
          color="gray.600"
          justifySelf={"end"}
        >
          {formatDateTime(event.datetime_utc)}
        </Text>

        <Box margin="auto 0 0 0">
          <FavoriteButton
            id={event.id}
            name={event.short_title}
            type="events"
          />
        </Box>
      </Stack>
    </CardBody>
  </LinkBox>
);

export default Events;
