import { html, computed, BaseRouter } from "../mod.ts";
import type { Routes } from "./BaseRouter.ts"

export interface Router {
    routes: Routes
}
export class Router extends BaseRouter {
  #error404 = html`
    <slot name="404">
      404 — route "${window.location.pathname}" not found
    </slot>
  `;

  override template = computed(() => {
    const result = this.tryMatchRoute(this.routes, window.location.pathname)
    return (
      result
      ? this.render(result)
      : this.#error404
    );
  });
}
