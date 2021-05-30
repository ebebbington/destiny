import { reactive, ReactiveArray } from "../../mod.ts";
import { isSpecialCaseObject } from "../reactiveObject/specialCaseObjects.ts";
import { isReactive } from "../../typeChecks/isReactive.ts";
import { isObject } from "../../typeChecks/isObject.ts";
import type { TArrayValueType } from "../types/IArrayValueType.ts";

/**
 * Converts a given array of values into a reactive value recursively if it's not to be treated as a primitive. I.E. `Array`s and most `Object`s will be converted, but primitive values will not. This is useful for `ReactiveArrays`, whose direct children are managed directly by the class itself, but whose deeply nested descendants need to be tracked separately.
 * @param items The items to be converted
 * @param parent Another reactive object to whom any reactive items created should report to when updating, so updates can correctly propagate to the highest level
 */
export function makeNonPrimitiveItemsReactive<InputType> (
  items: Array<InputType | TArrayValueType<InputType>>,
  parent: ReactiveArray<InputType>,
): Array<TArrayValueType<InputType>> {
  return items.map((v: unknown) => {
    return (
      isReactive(v) || !isObject(v) || isSpecialCaseObject(v)
      ? v
      : reactive<unknown>(
          v,
          {parent: parent as ReactiveArray<unknown>},
        )
    ) as TArrayValueType<InputType>;
  });
}
