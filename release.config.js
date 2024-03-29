module.exports = {
  branches: ["master"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/changelog",
    "@semantic-release/github",
    [
      "@codedependant/semantic-release-docker",
      {
        dockerTags: ["latest", "{{version}}", "{{major}}-latest", "{{major}}.{{minor}}"],
        dockerImage: "mycoverage",
        dockerFile: "Dockerfile",
        dockerProject: "aeolun",
        dockerArgs: {
          API_TOKEN: true,
          RELEASE_DATE: new Date().toISOString(),
          RELEASE_VERSION: "{{next.version}}",
        },
      },
    ],
    [
      "@semantic-release/git",
      {
        message: "chore(release): ${nextRelease.version} [skip release]\n\n${nextRelease.notes}",
        assets: ["CHANGELOG.md", "package.json", "package-lock.json", "npm-shrinkwrap.json"],
      },
    ],
  ],
}
