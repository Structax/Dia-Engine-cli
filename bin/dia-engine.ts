#!/usr/bin/env node

import { execSync } from "child_process"
import * as fs from "fs"
import * as path from "path"

// -------------------- CLI Entry --------------------
const args = parseArgs(process.argv.slice(2))

if (args._[0] === "init" && args._[1]) {
  const targetDir = args._[1]
  const repo = "nishikawatakeshiki/dia-template"

  console.log(`📦 Downloading DiaEngine template to '${targetDir}'...`)
  execSync(`npx degit ${repo} ${targetDir}`, { stdio: "inherit" })
  console.log(`\n🎉 DiaEngine project created at ${targetDir}`)
  process.exit(0)
}

if (args._[0] === "run") {
  (async () => {
    const intentId = args.intent
    const inputRaw = args.input

    if (!intentId || !inputRaw) {
      console.error("❌ Usage: npx dia-engine run --intent=... --input='{}'")
      process.exit(1)
    }

    try {
      const input = JSON.parse(typeof inputRaw === "string" ? inputRaw : inputRaw.join(""))
      const { getIntentById } = require(path.resolve("./src/intentMap"))
      const { createContext } = require(path.resolve("./src/context"))
      const { runIntent } = require(path.resolve("./src/runIntent"))

      const intent = getIntentById(intentId)
      const ctx = await createContext({ headers: {} } as any)
      const { result, emits } = await runIntent(intent, ctx, input)

      console.log("\n✅ Intent executed successfully")
      console.log("Result:", result)
      console.log("Emits:", emits)
      process.exit(0)
    } catch (err: any) {
      console.error("❌ Execution failed:", err.message)
      process.exit(1)
    }
  })()
}

console.log("❌ Unknown command. Usage:")
console.log("  npx dia-engine init my-app")
console.log("  npx dia-engine run --intent=... --input='{}'")
process.exit(1)

function parseArgs(argv: string[]) {
  const out: { [key: string]: string | string[] } & { _: string[] } = { _: [] }
  argv.forEach(arg => {
    if (arg.startsWith("--")) {
      const [k, v] = arg.replace(/^--/, "").split("=")
      out[k] = v
    } else {
      out._.push(arg)
    }
  })
  return out
}
