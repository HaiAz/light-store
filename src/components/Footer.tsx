import { Box, Flex, Link, Text } from "@chakra-ui/react"

import { getI18n } from "@/locales/server"

export default async function Footer() {
  const t = await getI18n()
  return (
    <Flex
      zIndex={3}
      flexDirection={{ sm: "column" }}
      alignItems={{ sm: "center", base: "flex-start" }}
      justifyContent="space-between"
      p="15px"
    >
      <Box color="$secondaryDark" textAlign={{ md: "center" }} mb="15px">
        <Text fontWeight="500" ml={4}>
          {t("copyright", {
            date: new Date().getFullYear(),
            name: (
              <Link
                color="$secondaryDark"
                href="https://kyberosc.com/"
                target="_blank"
                fontWeight="700"
              >
                Hello World!!!
              </Link>
            ),
          })}
        </Text>
      </Box>
    </Flex>
  )
}
