const concurrently = require("concurrently")
// concurrently --restart-tries -1 --restart-after 5000 -n worker,app npm:start:worker npm:start:frontend

let commands = [
  {
    name: "worker:changefrequency",
    command: "npm run start:worker -- --worker=changefrequency",
  },
  {
    name: "worker:combinecoverage",
    command: "npm run start:worker -- --worker=combinecoverage",
  },
  {
    name: "worker:sonarqube",
    command: "npm run start:worker -- --worker=sonarqube",
  },
  {
    name: "worker:upload",
    command: "npm run start:worker -- --worker=upload",
  },
  {
    name: "frontend",
    command: "npm:start:frontend",
  },
]
if (process.env.WORKER) {
  commands = [
    {
      name: "worker:changefrequency",
      command: "npm run start:worker -- --worker=changefrequency",
    },
    {
      name: "worker:combinecoverage",
      command: "npm run start:worker -- --worker=combinecoverage",
    },
    {
      name: "worker:sonarqube",
      command: "npm run start:worker -- --worker=sonarqube",
    },
    {
      name: "worker:upload",
      command: "npm run start:worker -- --worker=upload",
    },
  ]
}
if (process.env.FRONTEND) {
  commands = [
    {
      name: "frontend",
      command: "npm:start:frontend",
    },
  ]
}

const { result, commands: spawnedCommands } = concurrently(commands, {
  restartDelay: 5000,
  restartTries: -1,
})

result.then(
  (result) => {
    console.log("success", result)
  },
  (result) => {
    console.log("error", result)
  }
)
