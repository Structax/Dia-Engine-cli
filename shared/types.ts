import { ZodType } from "zod"

export interface DomainEvent<T = any> {
  type: string
  payload: T
  emittedAt: string
  traceId: string
}

export interface IntentResult<T = unknown> {
  emit?: DomainEvent<T> | DomainEvent<T>[]
}

export type EffectResult<T> =
  | Promise<T>
  | Promise<IntentResult<T>>
  | Promise<DomainEvent<T>>

export type AuthCondition<Input = any> =
  | string
  | ((user: DiaUser | null, input: Input) => boolean)
  | {
      and?: AuthCondition<Input>[]
      or?: AuthCondition<Input>[]
      not?: AuthCondition<Input>
      when?: string
    }

export interface DiaUser {
  id: string
  roles: string[]
  tenantId: string
}

export default interface DiaContext {
  user: DiaUser | null
  session: { expiresAt: Date } | null
  signal: AbortSignal
  traceId: string
  services: Record<string, any>
}

export interface DiaIntent<Input, Output> {
  id: string
  input: ZodType<Input>
  require?: AuthCondition<Input>
  effect: (ctx: DiaContext, input: Input) => EffectResult<Output>
}
export type AuthPredicate<Input = any> = (
  user: DiaUser | null,
  input: Input
) => boolean
