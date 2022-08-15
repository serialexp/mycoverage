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
  {
    name: "housekeeping",
    command: "npm run housekeeping",
  },
]
if (process.env.WORKER) {
  if (typeof process.env.WORKER === "string" && process.env.WORKER.includes(";")) {
    commands = [
      {
        name: "housekeeping",
        command: "npm run housekeeping",
      },
    ]
    process.env.WORKER.split(";").forEach((worker) => {
      const workerName = worker.split(":")[0]
      const workerCount = worker.split(":")[1]
      for (let i = 0; i < workerCount; i++) {
        commands.push({
          name: workerName + ":" + i,
          command: "npm run start:worker -- --worker=" + workerName,
        })
      }
    })
  } else {
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
        name: "worker:combinecoverage",
        command: "npm run start:worker -- --worker=combinecoverage",
      },
      {
        name: "worker:combinecoverage",
        command: "npm run start:worker -- --worker=combinecoverage",
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
        name: "housekeeping",
        command: "npm run housekeeping",
      },
    ]
  }
}
if (process.env.FRONTEND) {
  commands = [
    {
      name: "frontend",
      command: "npm:start:frontend",
    },
  ]
}

// start concurrently
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
