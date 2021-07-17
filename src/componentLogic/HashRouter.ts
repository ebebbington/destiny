import { reactive, html, computed, BaseRouter } from "../mod.ts";
import type { Routes } from "./BaseRouter.ts"

function getHashRoute (
  url: string,
) {
  return "/" + new URL(url).hash.replace(/^#\//u, "");
}

export const route = reactive(getHashRoute(window.location.href));

window.addEventListener("hashchange", e => {
  route.value = getHashRoute(e.newURL);
});

// TODO :: Finish this by doing exaCTLY WHAT rOUTER DID

export interface HashRouter {
  routes: Routes
}
export class HashRouter extends BaseRouter {
  #error404 = html`
    <slot name="404">
      404 — route "${route}" not found
    </slot>
  `;

  #routes: Routes = this.assignRoutes();

  override template = computed(() => {
    // If we found an exact match, render that
    const result = this.tryMatchRoute(this.#routes, route.value)
    return (
      result
      ? this.render(result)
      : this.#error404
    );
  });
}
