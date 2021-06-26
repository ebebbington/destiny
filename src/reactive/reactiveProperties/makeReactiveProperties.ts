import { reactive } from "../reactive.js";
import { reactivePropertiesFlag } from "./reactivePropertiesFlag.js";
import { describeType } from "/dist/utils/describeType.js";
import type { TMakeReactiveProperties } from "./TMakeReactiveProperties.js";
import type { ReactiveValue } from "../ReactiveValue/ReactiveValue.js";
import type { ReadonlyReactiveArray } from "../ReactiveArray/_ReactiveArray.js";

/**
 * Takes an object, and passes each of its enumerable properties to `reactive()`, which makes the entire structure reactive recursively.
 * 
 * @param input The object whose properties are to be made reactive
 * @param parent Another reactive entity to which any reactive items created should report to when updating, so updates can correctly propagate to the highest level
 */
export function makeReactiveProperties<
  T extends Readonly<Record<string, unknown>>,
  K = unknown,
> (
  input: T,
  parent?: ReactiveValue<K> | ReadonlyReactiveArray<K>,
): TMakeReactiveProperties<T> {
  // TS is incapable of figuring out the type correctly here, so it will throw a runtime error instead.
  if (![null, Object].includes(input.constructor as ObjectConstructor)) {
    throw new TypeError(`Illegal object ${describeType(input)} passed to makeReactiveProperties. You must either pass in objects that have \`Object\` or \`null\` as their prototype, or wrap the objects using ReactiveValue.`);
  }
  
  const result = Object.fromEntries(
    Object
    .entries(input)
    .map(entry => (entry[1] = reactive(entry[1], {parent}), entry))
  ) as {
    [key: string]: unknown,
    [reactivePropertiesFlag]: true,
  };
  result[reactivePropertiesFlag] = true;

  return Object.freeze(result) as TMakeReactiveProperties<T>;
}