import { scripts } from "./import_scripts.js";

const args = process.argv.slice(2);

if (args.length === 1 && args[0] === "all") {
  for (let usecase in scripts) {
    await scripts[usecase]();
  }
} else {
  for (let arg of args) {
    if (arg in scripts) {
      await scripts[arg]();
    } else {
      console.log("USE CASE", arg, "was not found!\n");
    }
  }
}
