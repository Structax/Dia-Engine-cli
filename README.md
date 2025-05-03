# DiaEngine

**DiaEngine** is a minimal, intent-driven web backend runtime.
It enforces executable semantics, structured context, and safe side-effects.

---

## 🚀 Getting Started

### 1. Initialize your project

```bash
npx dia-engine init my-app
cd my-app
npm install
```

### 2. Run tests (verify intent behavior)

```bash
npm run test
```

### 3. Build your backend

```bash
npm run build
```

### 4. Execute your intent

```bash
npx tsx bin/dia-engine.ts run \
  --intent=task.mark_done \
  --input="{\"id\":\"123\"}" \
  --token=eyJpZCI6InUxIiwicm9sZXMiOlsidXNlciJdLCJ0ZW5hbnRJZCI6InQxIn0=
```

---

## 📁 Template Structure

```bash
my-app/
├── src/
│   ├── intents/              # DiaIntents
│   ├── context.ts            # Context generator (user/session/signal/trace)
│   ├── runIntent.ts          # Intent executor
│   ├── runEffect.ts          # Side-effect executor
│   ├── auth.ts               # Auth condition evaluator
│   ├── authRegistry.ts       # Custom auth rule registration
│   ├── emit.ts               # Emit helper (structured event output)
│   └── intentMap.ts          # Maps intentId -> implementation
├── shared/
│   └── types.ts              # Shared types: DiaContext, DiaIntent, DomainEvent
├── __tests__/
│   └── markDone.test.ts      # Example test with uvu
├── bin/
│   └── dia-engine.ts         # CLI entrypoint
├── tsconfig.json             # TS config
├── package.json              # Scripts: build, test, bin
└── README.md
```

---

## 💡 Philosophy

DiaEngine enforces **intent-based design** over route-based programming:

- 🔹 Define behavior by *what it means*, not by URL
- 🔹 Ensure that all execution paths are testable and traceable
- 🔹 Use structured context (user, session, traceId) in every intent
- 🔹 Emit events as structured, typed history
- 🔹 Eliminate any usage with unsafe types like `any`

---

## 🧪 Testing

```bash
npm run test
```

We use `uvu` + `runIntentTest()` to ensure that all DiaIntents are:

- structurally valid
- authorization rules evaluated
- emits correctly structured events

---

## 📦 CLI

### Run an intent:

```bash
npx dia-engine run --intent=task.mark_done --input='{"id": "123"}'
```

### Initialize a new project:

```bash
npx dia-engine init my-app
```

This downloads the full working template from GitHub.

---

## 🧠 Extending

- Add new DiaIntents to `src/intents/`
- Register them in `intentMap.ts`
- Test them with `runIntentTest()`
- Add custom auth rules with `registerAuthRule()`

---

## 🤝 License

MIT — created by [@Structax](https://github.com/Structax)

Build safely. Run with intent.

---