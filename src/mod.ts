export { DestinyElement    } from "./elementLogic/DestinyElement.ts";
export { register          } from "./elementLogic/register.ts";
export { Ref               } from "./elementLogic/Ref.ts";
export { ReactivePrimitive } from "./reactive/ReactivePrimitive.ts";
export { reactiveObject    } from "./reactive/reactiveObject/reactiveObject.ts";
export { ReactiveArray     } from "./reactive/ReactiveArray/_ReactiveArray.ts";
export { expression        } from "./reactive/reactiveExpression.ts";
export { reactive          } from "./reactive/reactive.ts";
export { xml               } from "./parsing/_xml.ts";

export type { TReactiveValueType } from "./reactive/types/IReactiveValueType.ts";
export type { TReactiveObject    } from "./reactive/types/IReactiveObject.ts";
export type { TReactiveEntity    } from "./reactive/types/IReactiveEntity.ts";
export type { TReactive          } from "./reactive/types/IReactive.ts";
export type { TemplateResult     } from "./parsing/TemplateResult.ts";

// Purely so we can compile the example dir into dist
import "./_examples/main.ts"
