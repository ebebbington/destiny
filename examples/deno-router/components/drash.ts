import { Component, xml, HashRouter } from "../src/mod.ts";

export default interface Drash {
    pathParams: {
        version?: string
    }
}
export default class Drash extends Component {


    override template = xml`
      <p>drash</p>
    `
}