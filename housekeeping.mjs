import fs from "fs"
import cp from "child_process"

const recordFolderSize = (folder) => {
  const tempFolderSize = cp.execSync("du -sh " + folder)
  console.log("size: " + folder + ", " + tempFolderSize.toString())
}

const cleanup = () => {
  console.log("cleaning up")

  console.log("disk space usage")
  const diskSpaceInUse = cp.execSync("df -h")
  console.log(diskSpaceInUse.toString())

  console.log("size of folders")
  recordFolderSize("/tmp")
  recordFolderSize("~/.npm")
  recordFolderSize("/var/log")

  console.log("removing files older than 7 days from .npm dir")
  cp.execSync("find ~/.npm -type f -mtime +7 -execdir rm -- '{}' \\;")
}

cleanup()

console.log("starting scheduled housekeeping")
// every hour
setInterval(cleanup, 1000 * 60 * 60)
