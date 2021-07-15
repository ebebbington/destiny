import { Component, register, xml, Router, Route } from "../src/mod.ts";
// has router
class AppRoot extends Component {
    override template = xml`
      <${Router}>
        <${Route} prop:path=${"/"} prop:content=${"/components/landing.js"}></${Route}>
        <${Route} prop:path=${"/drash/:version?"} prop:content=${"/components/drash.js"}></${Route}>
      </${Router}>
    `;
}


register(AppRoot)