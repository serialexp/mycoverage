const concurrently = require("concurrently")
// concurrently --restart-tries -1 --restart-after 5000 -n worker,app npm:start:worker npm:start:frontend

let commands = [
  {
    name: "worker",
    command: "npm:start:worker",
  },
  {
    name: "frontend",
    command: "npm:start:frontend",
  },
]
if (process.env.WORKER) {
  commands = [
    {
      name: "worker",
      command: "npm:start:worker",
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
