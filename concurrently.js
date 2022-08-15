const concurrently = require("concurrently")
// concurrently --restart-tries -1 --restart-after 5000 -n worker,app npm:start:worker npm:start:frontend

let commands = [
  {
    name: "worker:changefrequency",
    command: "HEALTHCHECK_PORT=8081 npm run start:worker -- --worker=changefrequency",
  },
  {
    name: "worker:combinecoverage",
    command: "HEALTHCHECK_PORT=8082 npm run start:worker -- --worker=combinecoverage",
  },
  {
    name: "worker:sonarqube",
    command: "HEALTHCHECK_PORT=8083 npm run start:worker -- --worker=sonarqube",
  },
  {
    name: "worker:upload",
    command: "HEALTHCHECK_PORT=8084 npm run start:worker -- --worker=upload",
  },
  {
    name: "healthcheck",
    command: "npm run healthcheck -- --ports=8081,8082,8083,8084,3000",
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
    let startPort = 8081
    const hcPorts = []
    process.env.WORKER.split(";").forEach((worker) => {
      const workerName = worker.split(":")[0]
      const workerCount = worker.split(":")[1]
      for (let i = 0; i < workerCount; i++) {
        commands.push({
          name: workerName + ":" + i,
          command:
            "HEALTHCHECK_PORT=" + startPort + " npm run start:worker -- --worker=" + workerName,
        })
        hcPorts.push(startPort)
        startPort++
      }
    })
    commands.push({
      name: "healthcheck",
      command: "npm run healthcheck -- --ports=" + hcPorts.join(","),
    })
  } else {
    commands = [
      {
        name: "worker:changefrequency",
        command: "HEALTHCHECK_PORT=8081 npm run start:worker -- --worker=changefrequency",
      },
      {
        name: "worker:combinecoverage",
        command: "HEALTHCHECK_PORT=8082 npm run start:worker -- --worker=combinecoverage",
      },
      {
        name: "worker:combinecoverage",
        command: "HEALTHCHECK_PORT=8083 npm run start:worker -- --worker=combinecoverage",
      },
      {
        name: "worker:combinecoverage",
        command: "HEALTHCHECK_PORT=8084 npm run start:worker -- --worker=combinecoverage",
      },
      {
        name: "worker:combinecoverage",
        command: "HEALTHCHECK_PORT=8085 npm run start:worker -- --worker=combinecoverage",
      },
      {
        name: "worker:combinecoverage",
        command: "HEALTHCHECK_PORT=8086 npm run start:worker -- --worker=combinecoverage",
      },
      {
        name: "worker:sonarqube",
        command: "HEALTHCHECK_PORT=8087 npm run start:worker -- --worker=sonarqube",
      },
      {
        name: "worker:upload",
        command: "HEALTHCHECK_PORT=8088 npm run start:worker -- --worker=upload",
      },
      {
        name: "healthcheck",
        command: "npm run healthcheck -- --ports=8081,8082,8083,8084,8085,8086,8087,8088",
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
