import { DestinyElement, xml } from "../../mod.ts";

export class AsyncComponent extends DestinyElement {
  template = xml`
    foo
    <slot />
    bar
  `;
}
