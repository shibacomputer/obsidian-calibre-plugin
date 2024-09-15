import { ItemView, WorkspaceLeaf } from "obsidian";
import { CalibrePluginSettings } from "./settings";
import * as ip from "ip";

export const CALIBRE_VIEW_TYPE = "calibre-view";

export class CalibreView extends ItemView {
  constructor(leaf: WorkspaceLeaf, private settings: CalibrePluginSettings) {
    super(leaf);
  }

  getViewType() {
    return CALIBRE_VIEW_TYPE;
  }

  getDisplayText() {
    return this.settings.displayText;
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    try {
      const iframe = container.createEl('iframe');
      iframe.setAttribute('sandbox', 'allow-forms allow-presentation allow-same-origin allow-scripts allow-modals allow-downloads allow-popups');
      let address = this.settings.replaceLocalIp
        ? this.settings.address.replace('localhost', ip.address())
        : this.settings.address;
      if (this.settings.username && this.settings.password) {
        let url = new URL(address);
        url.username = encodeURIComponent(this.settings.username);
        url.password = encodeURIComponent(this.settings.password);
        address = url.toString();
      }
      iframe.src = address;
    } catch (e) {
      console.error(e);
      const error = container.createDiv({ text: e.toString() });
      error.style.color = 'var(--text-title-h1)';
    }
  }
  async onClose() {
    // Nothing to clean up.
  }
}
