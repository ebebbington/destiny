import type { ReactiveArray, ReactivePrimitive } from "../../mod.ts";

export type TReactiveEntity<T> = (
  | ReactivePrimitive<T>
  | ReactiveArray<T>
);
