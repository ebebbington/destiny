import { Component, register, xml, Router, Route, HashRouter } from "../src/mod.ts";
// has router
class AppRoot extends Component {
    override template = xml`
      <${Router}>
        <${Route} prop:path=${"/"} prop:content=${"/components/landing.js"}></${Route}>
        <${Route} prop:path=${"/drash/:version?"} prop:content=${"/components/drash.js"}></${Route}>
      </${Router}>
    `;
    // <${HashRouter}>
    //   <${Route} prop:path=${"/hello"} prop:content=${"/components/hello.js"}></${Route}>
    //   <${Route} prop:path=${"/bye"} prop:content=${"/components/bye.js"}></${Route}>
    // </${HashRouter}>
}


register(AppRoot)