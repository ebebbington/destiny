import { Component, register, xml, Router } from "../src/mod.ts";
// has router
class AppRoot extends Component {
    #routes: Map<string, { content: string, exact?: boolean}> = new Map()
      .set("/", {
          content: "/components/landing.js",
          exact: true
      }).set("/drash/:version?", {
          content: "/components/drash.js",
          exact: false
      })
    override template = xml`
      <${Router} prop:routes=${this.#routes}></${Router}>
    `;
}


register(AppRoot)