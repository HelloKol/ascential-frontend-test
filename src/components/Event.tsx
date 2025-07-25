import React from "react";
import { useParams } from "react-router-dom";
import {
  Flex,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Box,
  Spinner,
  Button,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import Breadcrumbs from "./Breadcrumbs";
import Error from "./Error";
import { useSeatGeek } from "../utils/useSeatGeek";
import { formatDateTime } from "../utils/formatDateTime";
import { type Venue } from "./Events";
import FavoriteButton from "./FavoriteButton";

interface EventInfoProps {
  event: {
    id: number;
    short_title: string;
    datetime_utc: Date;
    datetime_local: Date;
    venue: Venue;
    url: string;
  };
}

const Event: React.FC = () => {
  const { eventId } = useParams();
  const { data: event, error } = useSeatGeek(`events/${eventId}`);

  if (error) return <Error />;

  if (!event) {
    return (
      <Flex justifyContent="center" alignItems="center" minHeight="50vh">
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Events", to: "/events" },
          { label: event.short_title },
        ]}
      />
      <Flex bgColor="gray.200" p={[4, 6]}>
        <Heading>{event.short_title}</Heading>
      </Flex>
      <EventInfo event={event} />
    </>
  );
};

const EventInfo: React.FC<EventInfoProps> = ({ event }) => (
  <Stack spacing="6" m="6">
    <SimpleGrid columns={[1, 1, 2]} borderWidth="1px" borderRadius="md" p="4">
      <Stat>
        <StatLabel display="flex">
          <Box as="span">Venue</Box>
        </StatLabel>
        <StatNumber fontSize="xl">{event.venue.name_v2}</StatNumber>
        <StatHelpText>{event.venue.display_location}</StatHelpText>
      </Stat>
      <Stat>
        <StatLabel display="flex">
          <Box as="span">Date</Box>
        </StatLabel>

        <Tooltip
          label={`Your local time: ${formatDateTime(event.datetime_utc)}`}
        >
          <StatNumber fontSize="xl">
            {formatDateTime(event.datetime_local)}
          </StatNumber>
        </Tooltip>
      </Stat>
    </SimpleGrid>
    <Flex gap="3">
      <Button as={"a"} href={event.url} minWidth="0">
        Buy Tickets
      </Button>
      <FavoriteButton id={event.id} name={event.short_title} type="events" />
    </Flex>
  </Stack>
);

export default Event;
