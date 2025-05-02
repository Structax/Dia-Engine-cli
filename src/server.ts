import http from "http"
import { DiaIntent, runIntent } from "./runIntent.js"
import { createContext } from "./context.js"
import { getIntentById } from "./intentMap.js"
import { registerBuiltInAuthRules } from "./authRules.js"


export function serve(port = 3000): void {
  
  const server = http.createServer(async (req, res) => {
    console.log("🚨 Incoming request:", req.method, req.url)
    // Removed unused variable 'input'
    if (req.method !== "POST" || !req.url?.startsWith("/_intent/")) {
      res.statusCode = 404
      return res.end("Not Found")
    }
  
    
    const intentId = req.url.split("/_intent/")[1]

    try {
      const body = await readJsonBody(req)
      const ctx = await createContext(req)
      const intent = getIntentById(intentId)
      const { result, emits } = await runIntent(intent as unknown as DiaIntent<any, unknown>, ctx, body.input)

      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify({ result, emits }))
    } catch (err: any) {
      if (err.message?.includes("Forbidden")) {
        res.statusCode = 403
      } else {
        res.statusCode = 500
      }
      res.end(JSON.stringify({ error: err.message }))
    }
  })

  server.listen(port, () => {
    console.log(`🚀 DiaEngine listening on http://localhost:${port}`)
  })
}

function readJsonBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = ""
    req.on("data", (chunk) => (body += chunk))
    req.on("end", () => {
      try {
        resolve(JSON.parse(body))
      } catch (e) {
        reject(new Error("Invalid JSON"))
      }
    })
  })
}
registerBuiltInAuthRules()
serve(3000)  // or お好みのポートで