import { walkSync } from "./deps.ts"
const rootDir = "src"
const outDir = "dist"
const encoder = new TextEncoder()
const cwd = Deno.cwd()

/**
 * For a given directory or file, compile it using `Deno.emit`, and place the generated content into same location, BUT under the `dist` directory
 *
 * @param fileOrDir - The file to compile. Must be within the `src` directory
 */
async function compileFileOrDir (fileOrDir: string): Promise<void> {
  // TODO :: Get diagnostics, handle if set
  const { files } = await Deno.emit(fileOrDir, {
    compilerOptions: {
      declaration: true,
      sourceMap: true,
      target: "es2020",
      module: "esnext",
      removeComments: true,
      downlevelIteration: true,
      useDefineForClassFields: true,
      strict: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      importsNotUsedAsValues: "remove", // is this right? it was "true" so im assuming that means allow them
      paths: {
        "/dist/*": ["src/*"],
      },
      "baseUrl": "./"
    }
  })
  const filenames = Object.keys(files)
  for (const filename of filenames) {
    const file = files[filename]
    let outPath = filename.replace(rootDir, outDir)
    outPath = "." + outPath.split(cwd)[1]
    Deno.writeFileSync(outPath, encoder.encode(file))
  }
  const filePathWithoutExt = filenames[0].split(".")[0] // just grab the first one, it doesnt matter which, we're just getting the file without the ext
  const pathInDist = filePathWithoutExt.replace(rootDir, outDir)
  const prettyPath = `.${pathInDist.split(cwd)[1]}`
  console.info(`create ${prettyPath}`)
}

// get dirs we need to create, and create them so they exist when we bundle the files from `src` into `dist`
{
  const dirs: string[] = []
  for (const entry of walkSync(rootDir)) {
    if (entry.isDirectory) {
      if (entry.name === rootDir) {
        continue
      }
      const dir = entry.path.replace(rootDir, outDir)
      dirs.push(dir)
    }
  }
  try {
    Deno.mkdirSync(outDir)
    console.info(`mkdir ${outDir}`)
    for (const dir of dirs) {
      Deno.mkdirSync(dir)
      console.info(`mkdir ${dir}`)
    }
  } catch (err) {
    // most likely the dir already exists. if so, thats ok.
    // TODO :: Check instance of error. If it's file already exists error then thats ok, we can pass. Else throw an error because we aren't expecting anything else
  }
}

{
// Bundle the files
  for (const entry of walkSync(rootDir)) {
    if (entry.isFile === false) {
      continue // We only want to compile files
    }
    // TODO :: We could probably move this out of the loop, and just use `rootDir` instead of `entry.path` right? Im assuming this will return every file in the src dir

    // TODO :: Check if that file already exists, if it does the we dont nneed to compile it again
    //await compileFileOrDir(entry.path)
  }
}

const args = Deno.args
if (args.includes("--watch")) {
  console.info("Watching...\n")
  for await (const event of Deno.watchFs(rootDir)) {
    // TODO :: For some reason, it sends 2 events for the same file with the same kind after an edit. For example i edit src/mod.ts. We get two events, so this logic will compile the file twice (which of course isn't needed)

    if (event.kind === "modify") {
      if (event.paths[0].endsWith("~")) {
        continue
      }
      console.info(`Compiling ${event.paths[0]}...`)
      const path = event.paths[0]
      await compileFileOrDir(path)
      console.info("Done.\n")
    }
  }
}
