import { Metadata } from "next"

import SignInScreen from "./screen"

import { getI18n } from "@/locales/server"

export const metadata: Metadata = {}
export default async function LoginPage() {
  return <SignInScreen />
}
