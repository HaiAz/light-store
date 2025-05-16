"use client"

import { PropsWithChildren, useState } from "react"
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { createToast } from "@/components/Toaster"

export function QueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
        mutationCache: new MutationCache({
          onError: (error) => {
            // TODO: show proper error here? Maybe implement error type that has title and message?
            console.log("API Error", error.message)
          },
          onSuccess: () => {
            // TODO: show proper message here?
            createToast.create({
              description: "Mutation Success!",
              type: "success",
              duration: 2000,
            })
          },
        }),
        queryCache: new QueryCache({
          onError: (error) => {
            // TODO: show proper error here? Maybe implement error type that has title and message?
            console.log("API Error", error)
            createToast.create({
              description: error.message,
              type: "error",
              duration: 2000,
            })
          },
        }),
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
