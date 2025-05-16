"use client"

import { usePathname } from "next/navigation"
import { Box, Flex, Link, Text } from "@chakra-ui/react"
import NextLink from "next/link"

import { NavLink } from "@/configs/routes"
import { useI18n } from "@/locales/client"

type SidebarProps = {
  routes: NavLink[]
}

type MenuItemProps = {
  route: NavLink
}

function activeRoute(pathname: string, routeName: string): boolean {
  if (routeName === "/") {
    return pathname.length <= 3
  }
  return pathname.includes(routeName)
}

function MenuItem({ route }: MenuItemProps) {
  const pathname = usePathname()
  const t = useI18n()
  const isActive = !route.children ? activeRoute(pathname, route.path) : false

  return (
    <Box
      {...(isActive && {
        bg: "blue.100",
        borderRadius: 20,
        mr: "20px",
      })}
    >
      <Link
        asChild
        w="100%"
        display="flex"
        alignItems="center"
        px="15px"
        py="10px"
        pointerEvents={route.children ? "none" : "auto"}
        _focus={{ outline: "none" }}
      >
        <NextLink href={route.path}>
          <Flex alignItems="center">
            {route.icon ? (
              <Box mr="5px" color={isActive ? "blue.800" : "$black"}>
                {route.icon}
              </Box>
            ) : null}

            <Text
              color={isActive ? "blue.800" : "$black"}
              fontWeight={isActive ? "bold" : "normal"}
              fontSize="14px"
            >
              {t(`nav.${route.name}`)}
            </Text>
          </Flex>
        </NextLink>
      </Link>
      {route.children && route.children.length > 0 && (
        <Box>
          {route.children.map((childRoute, index) => {
            const isChildActive = activeRoute(pathname, childRoute.path)
            return (
              <Box
                key={index}
                ml="30px"
                w="100%"
                maxW={180}
                {...(isChildActive && {
                  bg: "blue.100",
                  borderRadius: 20,
                  marginRight: 20,
                })}
              >
                <Link
                  asChild
                  key={childRoute.path}
                  width="100%"
                  display="flex"
                  alignItems="center"
                  flexDirection="row"
                  px="15px"
                  py="10px"
                  _focus={{ outline: "none" }}
                >
                  <NextLink href={childRoute.path}>
                    <Text
                      mr="auto"
                      color={isChildActive ? "blue.800" : "$black"}
                      fontWeight={isChildActive ? "bold" : "normal"}
                      fontSize="14px"
                    >
                      {t(`nav.${childRoute.name}`)}
                    </Text>
                  </NextLink>
                </Link>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

export default function Sidebar(props: SidebarProps) {
  const { routes } = props

  // SIDEBAR
  return (
    <Box
      transition="0.2s linear"
      maxW={220}
      w="100%"
      minH="100%"
      overflow="hidden"
      borderRightWidth={1}
      borderColor="borderLine"
    >
      <Flex direction="column" h="100%" py="15px" rounded="md">
        <Box>
          {routes.map((route, index) => (
            <MenuItem key={index} route={route} />
          ))}
        </Box>
      </Flex>
    </Box>
  )
}
