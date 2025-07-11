import { Box, Skeleton, SkeletonText } from "@chakra-ui/react";

interface SkeletonCardProps {
  showBadge?: boolean;
  showImage?: boolean;
  showButton?: boolean;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showBadge = true,
  showImage = false,
  showButton = true,
}) => (
  <Box
    p={[4, 6]}
    bg="gray.50"
    borderColor="gray.200"
    borderWidth="1px"
    rounded="lg"
  >
    {showBadge && (
      <Skeleton height="20px" width="120px" mb="2" borderRadius="md" />
    )}
    {showImage && <Skeleton height="200px" mb="4" borderRadius="md" />}
    <Skeleton height="24px" mb="2" borderRadius="md" />
    <SkeletonText noOfLines={1} spacing="2" mb="2" />
    {showButton && <Skeleton height="32px" width="80px" />}
  </Box>
);

export default SkeletonCard;
