import { kebabToCamel } from "../../../utils/kebabToCamel.ts";
import { isValidNamespace } from "./isValidNamespace.ts";
import type { TNamespace } from "./TNamespace.ts";

export function parseAttributeName (
  input: string,
): [TNamespace, string] {
  const {
    namespace = "attribute",
    attributeNameRaw,
  } = (
    /(?:(?<namespace>[a-z]+):)?(?<attributeNameRaw>.+)/
    .exec(input)
    ?.groups
    ?? {}
  );

  const attributeName = (
    namespace !== "attribute"
    ? kebabToCamel(attributeNameRaw)
    : attributeNameRaw
  );

  if (!isValidNamespace(namespace)) {
    throw new Error("Invalid namespace");
  }

  return [namespace, attributeName];
}
