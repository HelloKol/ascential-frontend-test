import React, { useState, useEffect, useRef } from "react";
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
  Select,
  Button,
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
  const [page, setPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  // debounce search query to avoid too many requests
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data, error } = useSeatGeek("/events", {
    type: eventType,
    q: debouncedSearch || "",
    sort: "score.desc",
    per_page: "24",
    page: page.toString(),
  });

  // re-focus on search bar when component re-renders after fetching new data
  useEffect(() => {
    if (data && inputRef.current) {
      inputRef.current.focus();
    }
  }, [data]);

  // reset page state when searching/filtering data
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, eventType]);

  if (error) return <Error />;

  if (!data) {
    return (
      <Flex justifyContent="center" alignItems="center" minHeight="50vh">
        <Spinner size="lg" />
      </Flex>
    );
  }

  // calculate total pages by dividing total by how many item to display per page
  const totalPages = Math.ceil(data.meta.total / data.meta.per_page);
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Events" }]} />

      <Flex gap={4} px={6} mt={4} flexWrap="wrap">
        <Input
          ref={inputRef}
          placeholder="Search for events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          width="300px"
        />

        <Select
          width="200px"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          <option value="concert">Concert</option>
          <option value="sports">Sports</option>
          <option value="theater">Theater</option>
        </Select>
      </Flex>

      {data.events.length === 0 ? (
        <Flex justifyContent="center" alignItems="center" margin="50px 0 0 0">
          <Text fontSize="xl" color="gray.600">
            No data found
          </Text>
        </Flex>
      ) : (
        <>
          <SimpleGrid spacing="6" m="6" minChildWidth="350px">
            {data.events?.map((event: EventProps) => (
              <EventItem key={event.id.toString()} event={event} />
            ))}
          </SimpleGrid>

          {data.meta && (
            <Flex
              justifyContent="center"
              alignItems="center"
              mt={6}
              mb={6}
              gap={4}
            >
              <Button
                onClick={() => setPage((prev) => prev - 1)}
                isDisabled={isFirstPage}
              >
                Previous
              </Button>
              <Text>
                Page {page} of {totalPages}
              </Text>
              <Button
                onClick={() => setPage((prev) => prev + 1)}
                isDisabled={isLastPage}
              >
                Next
              </Button>
            </Flex>
          )}
        </>
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
