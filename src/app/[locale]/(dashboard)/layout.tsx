import { PropsWithChildren, Suspense } from "react"
import { Box, Container, Flex } from "@chakra-ui/react"
import { Toaster } from "@/components/Toaster"
import Sidebar from "@/components/Sidebar"
import Loading from "@/components/Loading"
import Footer from "@/components/Footer"
import routes from "@/configs/routes"
import Header from "@/components/Header"

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Flex h="100vh" pos="relative" direction="column" w="100%">
      <Header />
      <Container display="flex" flexDir="row" w="100%" flex={1}>
        <Sidebar routes={routes}></Sidebar>
        <Suspense fallback={<Loading />}>
          <Box flex={1}>{children}</Box>
        </Suspense>
      </Container>
      <Box mt="auto" borderColor="borderLine" borderTopWidth="1px">
        <Footer />
      </Box>
      <Toaster />
    </Flex>
  )
}
