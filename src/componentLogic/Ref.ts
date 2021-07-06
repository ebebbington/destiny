export abstract class RefPromise<T> {
  // The rule is seemingly broken. Return type annotations are not allowed for setters.
  abstract set value (
    element: T,
  );

  abstract then<R> (
    callbackFn: (value: T) => R,
  ): RefPromise<R>; 
}

export class Ref<T extends HTMLElement> {
  #resolve!: (value: T) => void;
  #promise = new Promise<T>(resolve => {
    this.#resolve = resolve;
  });

  set value (
    element: T,
  ) {
    this.#resolve(element);
  }

  then<R> (
    callbackFn: (value: T) => R,
  ): RefPromise<R> {
    this.#promise = this.#promise.then(callbackFn) as unknown as Promise<T>;
  
    return this as unknown as RefPromise<R>;
  }

  catch<R> (
    callbackFn: (reason: unknown) => R,
  ): RefPromise<R | T> {
    this.#promise = this.#promise.then(callbackFn) as unknown as Promise<T>;
  
    return this as unknown as RefPromise<R | T>;
  }

  finally (
    callbackFn: () => void,
  ): this {
    this.#promise.finally(callbackFn);
  
    return this;
  }
}
