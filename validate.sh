hyperfine \
  "node_modules/.bin/ts-node --project tsconfig.worker.json performance/validate-ajv.ts" \
  "node_modules/.bin/ts-node --project tsconfig.worker.json performance/validate-zod.ts"
