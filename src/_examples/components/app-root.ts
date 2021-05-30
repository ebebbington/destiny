import { DestinyElement, xml } from "../../mod.ts";

import { TabView } from "./tab-view.js";

export class AppRoot extends DestinyElement {
  template = xml/*html*/`
    <style>
      :host {
        --element-color:       #777;
        --element-hover-color: #888;
        --element-focus-color: #999;
        --xl: 48px;
        --l:  32px;
        --m:  16px;
        --s:   8px;
        --xs:  4px;
        --border-radius: 3px;
      }
    </style>
    <${TabView} />
  `;
}
