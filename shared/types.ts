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

export interface DiaContext {
  user: DiaUser | null
  session: { expiresAt: Date } | null
  signal: AbortSignal
  traceId: string
  services: Record<string, any>
}
export interface AuthPredicate<Input = any> {
  (user: DiaUser | null, input: Input): boolean
}
export interface DiaIntent<Input, Output> {
  id: string
  input: ZodType<Input>
  require?: AuthCondition<Input>
  effect: (ctx: DiaContext, input: Input) => EffectResult<Output>
}

export const __exports = {
  DiaIntent: null as unknown as DiaIntent<any, any>,
  DiaContext: null as unknown as DiaContext,
  DomainEvent: null as unknown as DomainEvent<any>
}
// shared/types.ts の末尾に追加
export const DiaIntent = null as unknown as DiaIntent<any, any>
export const DiaContext = null as unknown as DiaContext
export const DomainEvent = null as unknown as DomainEvent<any>