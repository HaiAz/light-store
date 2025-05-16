import { Flex, Heading } from "@chakra-ui/react"
import { JSX } from "react"

type TitleProps = {
  title: string
  buttonView?: JSX.Element
}

export function Title(props: TitleProps) {
  const { title, buttonView } = props
  return (
    <Flex
      w="100%"
      pl="6"
      py="4"
      borderBottomWidth="1px"
      borderColor="borderLine"
      alignItems="center"
      justifyContent="space-between"
    >
      <Heading as="h1" size="2xl">
        {title}
      </Heading>
      {buttonView}
    </Flex>
  )
}
