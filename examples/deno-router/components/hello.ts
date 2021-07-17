import { Component, xml, HashRouter } from "../src/mod.ts";

export default class Hello extends Component {
    override template = xml`
      <p>hello</p>
    `
}