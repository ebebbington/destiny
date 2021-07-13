var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AppRoot_routes;
import { Component, register, xml, Router } from "../src/mod.js";
class AppRoot extends Component {
    constructor() {
        super(...arguments);
        _AppRoot_routes.set(this, new Map()
            .set("/", {
            content: "/components/landing.js",
            exact: true
        }).set("/drash/:version?", {
            content: "/components/drash.js",
            exact: false
        }));
        Object.defineProperty(this, "template", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: xml `
      <${Router} prop:routes=${__classPrivateFieldGet(this, _AppRoot_routes, "f")}></${Router}>
    `
        });
    }
}
_AppRoot_routes = new WeakMap();
register(AppRoot);
