import { html, computed, BaseRouter } from "../mod.ts";
import type { Routes } from "./BaseRouter.ts"

export class Router extends BaseRouter {
  // TODO User can pass in custom 404 slot?
  #error404 = html`
    <slot name="404">
      404 — route "${window.location.pathname}" not found
    </slot>
  `;

  #routes: Routes = this.assignRoutes()

  override template = computed(() => {
    const result = this.tryMatchRoute(this.#routes, window.location.pathname)
    return (
      result
      ? this.render(result)
      : this.#error404
    );
  });
}
