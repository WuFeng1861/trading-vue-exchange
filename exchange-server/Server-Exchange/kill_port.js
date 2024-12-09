import {exec} from "child_process";

let args = process.argv.slice(2);
if (args.length === 0) {
  args = [54000, 55000];
}
const ports = args;
let killedPids = [];
for (let i = 0; i < ports.length; i++) {
  const port = ports[i];
  // kill process on port windows
  exec(`netstat -aon|findstr ${port}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    const lines = stdout.trim().split('\n');
    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];
      const parts = line.trim().split(' ');
      if (parts.length < 4) {
        continue;
      }
      const pid = parts[parts.length - 1];
      if (killedPids.includes(pid)) {
        continue;
      }
      killedPids.push(pid);
      console.log(`Killing process on port ${port} with pid ${pid}`);
      exec(`taskkill /pid ${pid} /f`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`Killed process on port ${port} with pid ${pid}`);
      });
    }
  });
}

