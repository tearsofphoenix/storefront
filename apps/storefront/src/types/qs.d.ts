declare module "qs" {
  export type StringifyOptions = {
    addQueryPrefix?: boolean
    encodeValuesOnly?: boolean
  }

  export function stringify(
    value: unknown,
    options?: StringifyOptions
  ): string

  const qs: {
    stringify: typeof stringify
  }

  export default qs
}
