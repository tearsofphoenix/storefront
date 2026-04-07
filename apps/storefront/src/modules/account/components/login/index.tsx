import { login } from "@lib/data/customer"
import { useI18n } from "@lib/i18n/use-i18n"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"
import GoogleAuthButton from "../google-auth-button"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)
  const { messages } = useI18n()

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-large-semi uppercase mb-6">
        {messages.account.welcomeBack}
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        {messages.account.signInSubtitle}
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label={messages.common.email}
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label={messages.common.password}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6">
          {messages.account.signIn}
        </SubmitButton>
        <GoogleAuthButton />
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        {messages.account.notMember}{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="register-button"
        >
          {messages.account.joinUs}
        </button>
        .
      </span>
    </div>
  )
}

export default Login
