import { toNumber } from "../../utils/toNumber.ts";
import type { ReactiveArray } from "../../mod.ts";

/**
 * Configuration object for the `Proxy` created by `ReactiveArray`. The proxy is used for enabling dynamic index access using the bracket notation (ex: `arr[0] = "foo"`). 
 */ 
export const reactiveArrayProxyConfig = {
  deleteProperty<InputType>(
    target: ReactiveArray<InputType>,
    property: symbol | string,
  ): boolean {
    const index = toNumber(property);
    if (!Number.isNaN(index)) {
      target.splice(index, 1);
      return true;
    } else {
      return false;
    }
  },

  get<InputType>(
    target: ReactiveArray<InputType>,
    property: symbol | string,
  ): any {
    const index = toNumber(property);
    if (!Number.isNaN(index)) { // Was valid number key (i.e. array index)
      return target.get(index);
    } else { // Was a string or symbol key
      // @ts-ignore tsc is wrongfully saying this implicitely has any type (even if we explicitely set it as any)
      const value = target[property];
      return (typeof value === "function"
        ? value.bind(target) // Without binding, #private fields break in Proxies
        : value
      ) as any;
    }
  },

  set<InputType>(
    target: ReactiveArray<InputType>,
    property: symbol | string,
    value: InputType,
  ): boolean {
    const index = toNumber(property);
    if (!Number.isNaN(index)) {
      target.splice(index, 1, value);
      return true;
    } else {
      return false;
    }
  },
};
