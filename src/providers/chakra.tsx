"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import { PropsWithChildren } from "react"

import { system } from "@/theme/theme"

export function ChakraProviderWrapper({ children }: PropsWithChildren) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider
        enableSystem={false}
        defaultTheme="light"
        attribute="class"
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}
