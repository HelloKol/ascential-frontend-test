import React from "react";
import { Flex, Text, Button } from "@chakra-ui/react";

interface PaginationProps {
  total: number;
  perPage: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({
  total,
  perPage,
  page,
  setPage,
}) => {
  // calculate total pages by dividing total by how many item to display per page
  const totalPages = Math.ceil(total / perPage);
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <Flex justifyContent="center" alignItems="center" mt={6} mb={6} gap={4}>
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
  );
};

export default Pagination;
