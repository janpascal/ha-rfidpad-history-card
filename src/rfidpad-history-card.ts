/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LitElement,
  html,
  customElement,
  property,
  CSSResult,
  TemplateResult,
  css,
  PropertyValues,
  internalProperty,
} from 'lit-element';
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  ActionHandlerEvent,
  handleAction,
  LovelaceCardEditor,
  getLovelace,
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types

import './editor';

import type { RFIDPadHistoryCardConfig } from './types';
import { CARD_VERSION } from './const';
import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
  `%c  rfidpad-history-card \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'rfidpad-history-card',
  name: 'RFIDPad History Card',
  description: 'A custom card that that the RFIDPad tag usage history',
});

// TODO Name your custom element
@customElement('rfidpad-history-card')
export class RFIDPadHistoryCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('rfidpad-history-card-editor');
  }

  public static getStubConfig(): object {
    return {};
  }

  // TODO Add any properities that should cause your element to re-render here
  // https://lit-element.polymer-project.org/guide/properties
  @property({ attribute: false }) public hass!: HomeAssistant;
  @internalProperty() private config!: RFIDPadHistoryCardConfig;

  // https://lit-element.polymer-project.org/guide/properties#accessors-custom
  public setConfig(config: RFIDPadHistoryCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      name: 'RFIDPad History',
      ...config,
    };
  }

  // https://lit-element.polymer-project.org/guide/lifecycle#shouldupdate
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    return hasConfigOrEntityChanged(this, changedProps, false);
      }

  renderStyle(): TemplateResult {
    return html`
      <style>
        paper-toggle-button {
          padding-top: 16px;
        }
        paper-item-body [secondary] {
            font-size: x-small;
        }
        ha-card.lock_history {
            overflow-y: auto;
            height: 400px;
        }
      </style>
    `;
  }

  renderHistory(): TemplateResult {
    if (!this.config.entity) {
     return html``;
    }

    const history = this.hass.states[this.config.entity].attributes["history"];

    return  html`${history.map(item => html`
      <paper-icon-item .item=${item}>
        <ha-icon
            icon=${item.button == "DISARM" ? "mdi:home" : "mdi:lock"}
            slot="item-icon">
        </ha-icon>
        <paper-item-body two-line>
            <div>${item.tag_name}
                ${item.tag_valid ? "" : " (INVALID)"}
            </div>
          <div secondary>${item.date}</div>
        </paper-item-body>
      </paper-item>
      `)}
    `;
  }

  // https://lit-element.polymer-project.org/guide/templates
  protected render(): TemplateResult | void {
    // TODO Check for stateObj or other necessary things and render a warning if missing
    if (this.config.show_warning) {
      return this._showWarning(localize('common.show_warning'));
    }

    if (this.config.show_error) {
      return this._showError(localize('common.show_error'));
    }

    return html`
      ${this.renderStyle()}
      <ha-card
        header="RFIDPad History"
        class="lock_history"
        tabindex="0"
        .label=${`RFIDPad History: ${this.config.entity || 'No Entity Defined'}`}
      >
        ${this.renderHistory()}
      </ha-card>
    `;
  }

  private _handleAction(ev: ActionHandlerEvent): void {
    if (this.hass && this.config && ev.detail.action) {
      handleAction(this, this.hass, this.config, ev.detail.action);
    }
  }

  private _showWarning(warning: string): TemplateResult {
    return html`
      <hui-warning>${warning}</hui-warning>
    `;
  }

  private _showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card');
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this.config,
    });

    return html`
      ${errorCard}
    `;
  }

  // https://lit-element.polymer-project.org/guide/styles
  static get styles(): CSSResult {
    return css``;
  }
}
