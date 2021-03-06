/**
 * Lists elements which are to be waited on before removal. See `attributeNamespaces/destiny.js` for details (`destiny:unmount`).
 */
export const deferredElements = new Map<
  HTMLElement,
  (element: HTMLElement) => Promise<void> | void
>();
