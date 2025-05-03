#!/usr/bin/env node
import { execSync } from "child_process";
import * as path from "path";
import minimist from "minimist";
const args = minimist(process.argv.slice(2));
// -------------------- CLI Entry --------------------
console.log(process.argv.slice(2));
console.log("args:", args);
console.log("args._[0]:", args._[0]);
if (args._[0] === "init" && args._[1]) {
    const targetDir = args._[1];
    const repo = "Structax/Dia-Engine-cli";
    console.log(`📦 Downloading DiaEngine template to '${targetDir}'...`);
    execSync(`npx degit ${repo} ${targetDir}`, { stdio: "inherit" });
    console.log(`\n🎉 DiaEngine project created at ${targetDir}`);
    process.exit(0);
}
else if (args._[0] === "run") {
    (async () => {
        const intentId = args.intent;
        const inputRaw = args.input;
        if (!intentId || !inputRaw) {
            console.error("❌ Usage: npx dia-engine run --intent=... --input='{}'");
            process.exit(1);
        }
        try {
            const input = JSON.parse(typeof inputRaw === "string" ? inputRaw : inputRaw.join(""));
            const { getIntentById } = await import(path.resolve("./src/intentMap.js"));
            const { createContext } = await import(path.resolve("./src/context.js"));
            const { runIntent } = await import(path.resolve("./src/runIntent.js"));
            const intent = getIntentById(intentId);
            const mockReq = {
                headers: {
                    authorization: `Bearer ${args.token || ""}`
                }
            };
            const ctx = await createContext(mockReq);
            const { result, emits } = await runIntent(intent, ctx, input);
            console.log("\n✅ Intent executed successfully");
            console.log("Result:", result);
            console.log("Emits:", emits);
            process.exit(0);
        }
        catch (err) {
            console.error("❌ Execution failed:", err.message);
            process.exit(1);
        }
    })();
}
else {
    console.log("❌ Unknown command. Usage:");
    console.log("  npx dia-engine init my-app");
    console.log("  npx dia-engine run --intent=... --input='{}'");
    process.exit(1);
}
