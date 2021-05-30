import { destinyOut } from "./destinyOut.ts";
import { destinyIn } from "./destinyIn.ts";
import { destinyRef } from "./destinyRef.ts";
import type { TElementData } from "../TElementData.ts";

/**
 * Handler for destiny-namespaced attributes. See referenced methods for details.
 */
export function destiny (
  data: TElementData["destiny"],
  element: HTMLElement,
): void {
  for (const [key, value] of data) {
    switch (key) {
      case "ref":
        destinyRef(value, element);
      break;

      case "in":
        destinyIn(value, element);
      break;

      case "out":
        destinyOut(element, value);
      break;

      default:
        throw new Error(`Invalid property "destiny:${key}" on element:\n${element.outerHTML}.`);
    }
  }
}
