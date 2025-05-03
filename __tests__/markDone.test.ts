import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { registerAuthRule } from "../src/authRegistry"
import { markDone } from '../src/intents/markDone'
import { runIntentTest, mockContext } from '../src/testUtils'

registerAuthRule("user:authenticated", (user: { id: string; roles: string[]; tenantId: string } | null) => !!user)

const ctx = mockContext({
  user: { id: 'u1', roles: ['user'], tenantId: 't1' }
})

test('markDone intent emits task.done event', async () => {
  const { result, emits } = await runIntentTest(markDone, { id: '123' }, ctx)

  assert.equal(result, {}) // emit only intent returns empty result
  assert.equal(emits.length, 1)
  assert.equal(emits[0].type, 'task.done')
  assert.equal(emits[0].payload.id, '123')
})

test.run()
