import { ReactNode } from "react"

export const NAV_SECTIONS = [
  "home",
  "categories",
  "business",
  "products",
  "users",
  "customers",
  "profile",
  "orders",
] as const
type NavSection = (typeof NAV_SECTIONS)[number]

export type NavLink = {
  name: NavSection
  icon?: ReactNode
  children?: NavLink[]
  path: string
}

const routes: NavLink[] = [
  {
    name: "home",
    path: "/",
    // icon: <IconWrapper name="home" color="gray.400" size={13} />,
  },
  {
    name: "categories",
    // icon: <IconWrapper name="atom" color="gray.400" size={13} />,
    path: "#",
    children: [
      {
        name: "products",
        path: "/products",
      },
      {
        name: "users",
        path: "/users",
      },
      {
        name: "customers",
        path: "/customers",
      },
    ],
  },
  {
    name: "business",
    // icon: <IconWrapper name="profile-outline" color="gray.400" size={13} />,
    path: "#",
    children: [
      {
        name: "profile",
        path: "/profile",
      },
      {
        name: "orders",
        path: "/orders",
      },
    ],
  },
]

export default routes
