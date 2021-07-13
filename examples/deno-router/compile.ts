import { Crumpets } from "../../deps.ts"

const crumpets = new Crumpets({
    rootFile: "./main.ts",
    compilerOptions: {
        "target": "es2020",
        "module": "esnext",
        "lib": ["dom", "DOM.Iterable", "ESNext"],
        "sourceMap": false
    }
})
await crumpets.run()