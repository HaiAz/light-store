"use client"

import { Box, Container, Flex, Image, Separator, Text } from "@chakra-ui/react"
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from "./PopOver"
import { useRouter } from "next/navigation"

import { useI18n } from "@/locales/client"
// import { useAuth } from '@/providers/AuthProvider';

export default function Header() {
  // const { authUser, logout } = useAuth();
  // const [hasMounted, setHasMounted] = useState<boolean>(false)

  // useEffect(() => {
  //   setHasMounted(true)
  // }, [setHasMounted])

  const t = useI18n()
  const router = useRouter()

  return (
    <Box
      w="100%"
      style={{ background: "linear-gradient(183.23deg, #003494 2.67%, #00266B 98.05%)" }}
    >
      <Container>
        <Flex w="100%" h="60px" align="center" justify="space-between">
          <Box>{/* <Image h="30px" src={logo.src} alt="logo" /> */}</Box>
          <PopoverRoot>
            <PopoverTrigger p="5px" border="1px solid #000" borderRadius="50%" background="#fff">
              <Image
                boxSize="28px"
                fit="cover"
                borderRadius="full"
                src="https://prod-kyber-wp-website.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2021/12/21080831/logo_kyberosc.png"
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                <Flex direction="column" gap="2">
                  <Box className="group" onClick={() => router.push("/profile")} cursor="pointer">
                    {/* {
                      (
                        hasMounted && authUser?.firstName && authUser?.lastName
                          ? (
                            <Span _groupHover={{ color: 'blue.400' }}>
                              {`${authUser.firstName} ${authUser.lastName}`}
                            </Span>
                          )
                          : (
                            <Skeleton height="20px" width="100px" />
                          )
                      )
                    } */}
                    Hello
                  </Box>
                  <Separator />
                  <Text
                    _hover={{ fontWeight: "500", color: "red" }}
                    cursor="pointer"
                    my="$s3"
                    // onClick={() => logout()}
                    display="block"
                  >
                    {t("nav.sign-out")}
                  </Text>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>
        </Flex>
      </Container>
    </Box>
  )
}
