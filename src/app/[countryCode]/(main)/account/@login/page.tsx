import { Metadata } from "next"

import { getI18n } from "@lib/i18n/server"
import LoginTemplate from "@modules/account/templates/login-template"

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n()

  return {
    title: messages.account.signIn,
    description: messages.account.signInSubtitle,
  }
}

export default function Login() {
  return <LoginTemplate />
}
