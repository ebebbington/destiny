import { ensureDirSync } from "../deps.ts"

const encoder = new TextEncoder();

function checkDiagnostics(diagnostics: Deno.Diagnostic[]): void {
  console.log(diagnostics[0])
  // Check if there were errors when bundling the clients code
  if (diagnostics && diagnostics.length) {
    const diagnostic = diagnostics[0]; // we only really care about throwing the first error
    const filename = diagnostic.fileName;
    const start = diagnostic.start;
    if (filename && start) {
      const cwd = Deno.cwd();
      const separator = Deno.build.os === "windows" ? "\\" : "/";
      const cwdSplit = cwd.split(separator);
      const rootDir = cwdSplit[cwdSplit.length - 1];
      const filenameSplit = filename.split(rootDir);
      const pathToBrokenFile = "." +
        filenameSplit[filenameSplit.length - 1]; // a shorter, cleaner display, eg "./server_typescript/..." instead of "file:///Users/..."
      throw new Error(
        `User error. ${pathToBrokenFile}:${start.line}:${start.character} - ${diagnostic.messageText}`,
      );
    } else {
      throw new Error(`User error. ${diagnostic.messageText}`);
    }
  }
}

async function compile(specificFile?: string) {
  const source = specificFile ?? "./src/mod.ts"

const { diagnostics, files } = await Deno.emit(source, {
  compilerOptions: {
    declaration: true,
    sourceMap: true,
    target: "es2020",
    module: "esnext",
    lib: [
      "dom",
      "DOM.Iterable",
      "es2020",
      "esnext",
    ],
    removeComments: true,
    downlevelIteration: true,
    useDefineForClassFields: true,
    strict: true,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,
    importsNotUsedAsValues: "error",
    paths: {
      "/dist/*": ["src/*"],
    },
    baseUrl: "./",
  },
});

checkDiagnostics(diagnostics);

const fileKeys = Object.keys(files).filter((filename) => {
  if (filename.includes(".map")) {
    return false
  }
  if (filename.includes("_examples/")) {
    return false
  }
  return true
});

// Write file
for (const filename of fileKeys) {
  const outputStr = files[filename];
  const outPath = filename.replace("src", "dist");
  ensureDirSync(outPath)
  Deno.writeFileSync(
    outPath,
    encoder.encode(outputStr.replace(/\/\/\# sourceMapping.+/, "")), // contents
  );
}
console.log("Finished compilation");
}

await compile()

const args = Deno.args
if (args[0] === "--watch") {
  const watcher = Deno.watchFs("./src");
  for await (const event of watcher) {
    if (event.kind !== "modify") {
      continue;
    }
    const paths = event.paths;
    const path = paths[0]
    await compile(path);
  }
}
