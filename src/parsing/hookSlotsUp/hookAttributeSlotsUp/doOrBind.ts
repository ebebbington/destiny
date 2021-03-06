import { matchChangeWatcher } from "./matchChangeWatcher.js";
import { ReactiveValue } from "../../../reactive/ReactiveValue/_ReactiveValue.js";
import { ReadonlyReactiveValue } from "../../../reactive/ReactiveValue/_ReadonlyReactiveValue.js";
import { PassReactiveValue } from "../../../reactive/ReactiveValue/PassReactiveValue.js";
import type { TWatchedAttribute } from "./matchChangeWatcher.js";

export function doOrBind (
  element: HTMLElement,
  key: string,
  value: unknown,
  whatToDo: (value: unknown) => void,
): void {
  if (value instanceof ReactiveValue) {
    const changeWatcher = matchChangeWatcher(key);
    if (changeWatcher) {
      element.addEventListener(changeWatcher, e => {
        // Sets the value whilst excluding itself of callbacks to call after the change
        value.set(
          (e.currentTarget as HTMLInputElement | null)
          ?.[key as TWatchedAttribute],
          { noUpdate: [whatToDo] },
        );
      });
    }
    value.bind(whatToDo, {dependents: [element]});
  } else if (value instanceof ReadonlyReactiveValue) {
    value.bind(whatToDo, {dependents: [element]});
  } else if (value instanceof PassReactiveValue) {
    whatToDo(value.deref);
  } else {
    whatToDo(value);
  }
}
