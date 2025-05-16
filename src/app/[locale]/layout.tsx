import { Suspense } from "react"

import Loading from "./loading"

import { ChakraProviderWrapper } from "@/providers/chakra"
import LocaleProvider from "@/providers/locale"
import { NextAuthProvider } from "@/providers/next-auth"
import { QueryProvider } from "@/providers/react-query"

export default async function AppLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>
  children: React.ReactNode
}) {
  const { locale } = await params

  return (
    <QueryProvider>
      <ChakraProviderWrapper>
        <NextAuthProvider>
          <LocaleProvider locale={locale}>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </LocaleProvider>
        </NextAuthProvider>
      </ChakraProviderWrapper>
    </QueryProvider>
  )
}
