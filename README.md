# RFIDPad history Card by [@janpascal](https://www.github.com/janpascal)

Based on the Boilerplate Card by [@iantrich](https://www.github.com/iantrich)

A simple Home Assistant Lovelace card that shows the history of tags used to lock and unlock the 
Home Assistant alarm system using an RFIDPad device.

## Options

| Name              | Type    | Requirement  | Description                                 | Default             |
| ----------------- | ------- | ------------ | ------------------------------------------- | ------------------- |
| type              | string  | **Required** | `custom:boilerplate-card`                   |
| name              | string  | **Optional** | Card name                                   | `Boilerplate`       |
| show_error        | boolean | **Optional** | Show what an error looks like for the card  | `false`             |
| show_warning      | boolean | **Optional** | Show what a warning looks like for the card | `false`             |
| entity            | string  | **Optional** | Home Assistant entity ID.                   | `none`              |
| tap_action        | object  | **Optional** | Action to take on tap                       | `action: more-info` |
| hold_action       | object  | **Optional** | Action to take on hold                      | `none`              |
| double_tap_action | object  | **Optional** | Action to take on double tap                | `none`              |

