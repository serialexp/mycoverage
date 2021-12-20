module.exports = {
  apps: [
    {
      name: "frontend",
      script: "npm run start:frontend",
    },
    {
      name: "worker",
      script: "npm run start:worker",
      instances: 1,
    },
  ],
}
