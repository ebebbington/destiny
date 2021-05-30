import { attribute } from "./attribute.ts";
import { destiny } from "./destiny.ts";
import { prop } from "./prop.ts";
import { call } from "./call.ts";
import { on } from "./on.ts";
import type { TElementData } from "../TElementData.ts";

/**
 * Takes care of hooking up data to an element.
 * 
 * @param element Element to assign it on
 * @param data    What to assign
 */
export function assignElementData (
  element: HTMLElement,
  data: TElementData,
): void {
  // console.log(element, data);
  attribute(data.attribute, element);
  destiny(data.destiny, element);
  prop(data.prop, element);
  call(data.call, element);
  on(data.on, element);
}
