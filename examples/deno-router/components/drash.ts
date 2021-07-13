import { Component, xml } from "../src/mod.ts";

export default interface Drash {
    pathParams: {
        version?: string
    }
}
export default class Drash extends Component {
    connectedCallback () { console.log(Object.keys(this))}

    override template = xml`<p>drash</p>`
}