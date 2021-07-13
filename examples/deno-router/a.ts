import { Drash } from "https://deno.land/x/drash/mod.ts"
class Res extends Drash.Http.Resource {
    static paths = ["/", "/drash/:version?"]
    public GET() {
        this.response.body = new TextDecoder().decode(Deno.readFileSync("./index.html"))
        this.response.headers.set("Content-Type", "text/html")
        return this.response
    }
}
class FilesResource extends Drash.Http.Resource {
    static paths = ["/components/:file", "/src/:fileOrDir/:dor2?/:dof3?/:dof4?/:dof5?"]
    public GET () {
        this.response.body = new TextDecoder().decode(Deno.readFileSync("." + this.request.url))
        this.response.headers.set("Content-Type", "application/javascript")
        return this.response
    }
}
const server = new Drash.Http.Server({
    resources: [FilesResource, Res]
})
await server.run({
    port: 1445
})
console.log('running on http://localhost:1445')