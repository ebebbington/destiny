import { DestinyElement, xml, Ref } from "../../../mod.ts";

/**
 * An example of a component that forwards its props to a child.
 */
export class TextField extends DestinyElement {
  forwardProps = new Ref;
  static captureProps = true;

  template = xml`
    <input type="text" destiny:ref="${this.forwardProps}" />
  `;
}
