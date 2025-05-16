import { Box, Flex } from "@chakra-ui/react"

import HomeScreen from "./screen"

export default async function Home() {
  return (
    <Box>
      <Flex direction="column" mt={5} pl={5}>
        <HomeScreen />
      </Flex>
    </Box>
  )
}
