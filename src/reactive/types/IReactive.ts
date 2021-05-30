import type { ReactiveArray, ReactivePrimitive } from "../../mod.ts";
import type { TReactiveObject } from "./IReactiveObject.ts";

export type TReactive<T> = (
  | ReactiveArray<T>
  | ReactivePrimitive<T>
  | TReactiveObject<T>
);
