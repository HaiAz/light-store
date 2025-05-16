import { Flex, type FlexboxProps } from '@chakra-ui/react';

type HSeparatorProps = Omit<FlexboxProps, 'h' | 'w' | 'bg'>

const HSeparator = (props: HSeparatorProps) => {
  return <Flex h="1px" w="100%" bg="rgba(135, 140, 189, 0.3)" {...props} />;
};

export { HSeparator };
