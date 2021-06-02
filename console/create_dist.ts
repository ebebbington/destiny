import { ensureDirSync, fromFileUrlUnix, fromFileUrlWin } from "../deps.ts";

const encoder = new TextEncoder();

function checkDiagnostics(diagnostics: Deno.Diagnostic[]): void {
  // Check if there were errors when bundling the clients code
  if (diagnostics && diagnostics.length) {
    const diagnostic = diagnostics[0]; // we only really care about throwing the first error
    const filename = diagnostic.fileName;
    const start = diagnostic.start;
    const messageText = diagnostic.messageText ??
      // @ts-ignore Deno tells us `messageText` does not exist on `messageChain`, but it 100% is (bug with deno)
      diagnostic.messageChain!.messageText;
    const sourceLine = diagnostic.sourceLine;
    const brief = diagnostic.messageChain
      // @ts-ignore Deno tells us `messageText` does not exist on `messageChain`, but it 100% is (bug with deno)
      ? diagnostic.messageChain.next![0].messageText
      : "";
    if (filename && start) {
      const cwd = Deno.cwd();
      const separator = Deno.build.os === "windows" ? "\\" : "/";
      const cwdSplit = cwd.split(separator);
      const rootDir = cwdSplit[cwdSplit.length - 1];
      const filenameSplit = filename.split(rootDir);
      const pathToBrokenFile = "." +
        filenameSplit[filenameSplit.length - 1]; // a shorter, cleaner display, eg "./server_typescript/..." instead of "file:///Users/..."
      throw new Error(
        `${pathToBrokenFile}:${start.line}:${start.character} - ${messageText}\n${brief}\n${sourceLine}\n`,
      );
    } else {
      throw new Error(`${messageText}\n${brief}\n`);
    }
  }
}

async function compile(file: string) {
  const source = file;

  const { diagnostics, files } = await Deno.emit(source, {
    compilerOptions: {
      declaration: true,
      sourceMap: true,
      target: "es2020",
      module: "esnext",
      lib: [
        "dom",
        "DOM.Iterable",
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
      return false;
    }
    return true;
  });

  // Write file
  for (const filename of fileKeys) {
    const outPath = filename.replace("src", "dist");
    if (outPath.endsWith(".ts.d.ts") || outPath.endsWith(".ts.js")) { // ensure directory(s) file is in, exists
      const pathSplit = outPath.split("/");
      pathSplit.pop();
      const parentDirOfFile = pathSplit.join("/");
      const validPath = Deno.build.os === "windows"
        ? fromFileUrlWin(parentDirOfFile)
        : parentDirOfFile; // because `ensureDirSync` will throw an error if the path is a file url on windows
      ensureDirSync(validPath);
    }

    // Because imports inside the files are still using a .ts extension, we're going to make them use .js:
    let outputStr = files[filename].replace(/import { ([a-zA-Z].*) } from "(.*)";/gm, (_str, importValues, fileImportedFrom) => {
      const jsImport = fileImportedFrom.replace(".ts", ".js")
      return `import { ${importValues} } from \"${jsImport}\";`
    })
    outputStr = files[filename].replace(/export { ([a-zA-Z].*) } from "(.*)";/gm, (_str, importValues, fileImportedFrom) => {
      const jsImport = fileImportedFrom.replace(".ts", ".js")
      return `export { ${importValues} } from \"${jsImport}\";`
    })

    const validPath = Deno.build.os === "windows"
      ? fromFileUrlWin(outPath)
      : outPath; // Same again
    Deno.writeFileSync(
      validPath,
      encoder.encode(outputStr.replace(/\/\/\# sourceMapping.+/, "")), // contents
    );
  }
  console.log("Finished compilation");
}

await compile("./src/mod.ts");

const args = Deno.args;
if (args[0] === "--watch") {
  const watcher = Deno.watchFs("./src");
  for await (const event of watcher) {
    if (event.kind !== "modify") {
      continue;
    }
    const paths = event.paths;
    const path = paths[0];
    await compile(path);
  }
}
