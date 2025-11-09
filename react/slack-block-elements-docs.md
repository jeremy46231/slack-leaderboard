## Button element[]

**Allows users a direct path to performing basic actions.**

_Interactive component_ - see our [guide to enabling interactivity].

| Available in surfaces           | Works with block types |
| ------------------------------- | ---------------------- |
| [Modals] [Messages] [Home tabs] | [Section] [Actions]    |

Example:

![Image 1: Three buttons showing default, primary, and danger color styles]

### Fields[]

| Field       | Type   | Description                                                                                                                                                                                                                                         | Required? |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`      | String | The type of element. In this case `type` is always `button`.                                                                                                                                                                                        | Yes       |
| `text`      | Object | A [text object] that defines the button's text. Can only be of `type: plain_text`. `text` may truncate with ~30 characters. Maximum length for the `text` in this field is 75 characters.                                                           | Yes       |
| `action_id` | String | An identifier for this action. You can use this when you receive an interaction payload to [identify the source of the action]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters.            | No        |
| `url`       | String | A URL to load in the user's browser when the button is clicked. Maximum length is 3000 characters. If you're using `url`, you'll still receive an [interaction payload] and will need to [send an acknowledgement response].                        | No        |
| `value`     | String | The value to send along with the [interaction payload]. Maximum length is 2000 characters.                                                                                                                                                          | No        |
| `style`     | String | Decorates buttons with alternative visual color schemes. Use this option with restraint.`primary` gives buttons a green outline and text, ideal for affirmation or confirmation actions. `primary` should only be used for one button within a set. |

`danger` gives buttons a red outline and text, and should be used when the action is destructive. Use `danger` even more sparingly than `primary`.

If you don't include this field, the default button style will be used.

| No |
| `confirm` | Object | A [confirm object] that defines an optional confirmation dialog after the button is clicked. | No |
| `accessibility_label` | String | A label for longer descriptive text about a button element. This label will be read out by screen readers _instead of_ the button [`text`] object. Maximum length is 75 characters. | No |

### Examples[]

A regular interactive button:

```
{
  "type": "button",
  "text": {
    "type": "plain_text",
    "text": "Click Me"
  },
  "value": "click_me_123",
  "action_id": "button"
}
```

A button with a `primary` `style` attribute:

```
{
  "type": "button",
  "text": {
    "type": "plain_text",
    "text": "Save"
  },
  "style": "primary",
  "value": "click_me_123",
  "action_id": "button"
}
```

A link button:

```
{
  "type": "button",
  "text": {
    "type": "plain_text",
    "text": "Link Button"
  },
  "url": "https://api.slack.com/block-kit"
}
```

[View an example in Block Kit builder]

## Checkboxes element[]

**Allows users to choose multiple items from a list of options.**

_Interactive component_ - see our [guide to enabling interactivity].

| Available in surfaces           | Works with block types      |
| ------------------------------- | --------------------------- |
| [Modals] [Messages] [Home tabs] | [Section] [Actions] [Input] |

Example:

![Image 2: An example of a checkbox element]

### Fields[]

| Field             | Type       | Description                                                                                                                                                                                                                                                                          | Required? |
| ----------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `type`            | String     | The type of element. In this case `type` is always `checkboxes`.                                                                                                                                                                                                                     | Yes       |
| `action_id`       | String     | An identifier for the action triggered when the checkbox group is changed. You can use this when you receive an interaction payload to [identify the source of the action]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters. | No        |
| `options`         | Object\[\] | An array of [option objects]. A maximum of 10 options are allowed.                                                                                                                                                                                                                   | Yes       |
| `initial_options` | Object\[\] | An array of [option objects] that exactly matches one or more of the options within `options`. These options will be selected when the checkbox group initially loads.                                                                                                               | No        |
| `confirm`         | Object     | A [confirm object] that defines an optional confirmation dialog that appears after clicking one of the checkboxes in this element.                                                                                                                                                   | No        |
| `focus_on_load`   | Boolean    | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                      | No        |

### Example[]

A section block containing a group of checkboxes:

```
{
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "My App",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": "Check out these charming checkboxes"
			},
			"accessory": {
				"type": "checkboxes",
				"action_id": "this_is_an_action_id",
				"initial_options": [{
					"value": "A1",
					"text": {
						"type": "plain_text",
						"text": "Checkbox 1"
					}
				}],
				"options": [
					{
						"value": "A1",
						"text": {
							"type": "plain_text",
							"text": "Checkbox 1"
						}
					},
					{
						"value": "A2",
						"text": {
							"type": "plain_text",
							"text": "Checkbox 2"
						},
						"description": {
							"type": "mrkdwn",
							"text": "*A description of option two*"
						},
					}
				]
			}
		}
	]
}
```

[View an example in Block Kit builder]

## Date picker element[]

**Allows users to select a date from a calendar style UI.**

_Interactive component_ - see our [guide to enabling interactivity].

| Available in surfaces           | Works with block types      |
| ------------------------------- | --------------------------- |
| [Modals] [Messages] [Home tabs] | [Section] [Actions] [Input] |

Example:

![Image 3: An example of a datepicker element]

### Fields[]

| Field           | Type    | Description                                                                                                                                                                                                                                                                      | Required? |
| --------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`          | String  | The type of element. In this case `type` is always `datepicker`.                                                                                                                                                                                                                 | Yes       |
| `action_id`     | String  | An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to [identify the source of the action]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters. | No        |
| `initial_date`  | String  | The initial date that is selected when the element is loaded. This should be in the format `YYYY-MM-DD`.                                                                                                                                                                         | No        |
| `confirm`       | Object  | A [confirm object] that defines an optional confirmation dialog that appears after a date is selected.                                                                                                                                                                           | No        |
| `focus_on_load` | Boolean | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                  | No        |
| `placeholder`   | Object  | A [`plain_text`] only text object that defines the placeholder text shown on the datepicker. Maximum length for the `text` in this field is 150 characters.                                                                                                                      | No        |

### Example[]

A section block containing a datepicker element:

```
{
  "type": "section",
  "block_id": "section1234",
  "text": {
    "type": "mrkdwn",
    "text": "Pick a date for the deadline."
  },
  "accessory": {
    "type": "datepicker",
    "action_id": "datepicker123",
    "initial_date": "1990-04-28",
    "placeholder": {
      "type": "plain_text",
      "text": "Select a date"
    }
  }
}
```

[View an example in Block Kit builder]

## Datetime picker element[]

**Allows users to select both a date and a time of day, formatted as a Unix timestamp.**

_Interactive component_ - see our [guide to enabling interactivity].

On desktop clients, the time picker will take the form of a dropdown list and the date picker will take the form of a dropdown calendar. Both options will have free-text entry for precise choices. On mobile clients, the time picker and date picker will use native UIs.

| Available in surfaces | Works with block types |
| --------------------- | ---------------------- |
| [Modals] [Messages]   | [Actions] [Input]      |

Example:

![Image 4: An example of a date time picker element]

### Fields[]

| Fields              | Type    | Description                                                                                                                                                                                                                                                                                | Required? |
| ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `type`              | String  | The type of element. In this case `type` is always `datetimepicker`.                                                                                                                                                                                                                       | Yes       |
| `action_id`         | String  | An identifier for the input value when the parent modal is submitted. You can use this when you receive a `view_submission` payload [to identify the value of the input element]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters. | No        |
| `initial_date_time` | Integer | The initial date and time that is selected when the element is loaded, represented as a UNIX timestamp in seconds. This should be in the format of 10 digits, for example `1628633820` represents the date and time August 10th, 2021 at 03:17pm PST.                                      | No        |
| `confirm`           | Object  | A [confirm object] that defines an optional confirmation dialog that appears after a time is selected.                                                                                                                                                                                     | No        |
| `focus_on_load`     | Boolean | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                            | No        |

### Example[]

An input block containing a datetime picker element:

```
{
  "type": "input",
  "element": {
    "type": "datetimepicker",
    "action_id": "datetimepicker-action"
  },
  "hint": {
    "type": "plain_text",
    "text": "This is some hint text",
    "emoji": true
  },
  "label": {
    "type": "plain_text",
    "text": "Start date",
    "emoji": true
  }
}
```

## Email input element[]

**Allows user to enter an email into a single-line field.**

_Interactive component_ - see our [guide to enabling interactivity].

| Available in surfaces | Works with block types |
| --------------------- | ---------------------- |
| [Modals]              | [Input]                |

### Fields[]

| Fields                   | Type    | Description                                                                                                                                                                                                                                                                                | Required? |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `type`                   | String  | The type of element. In this case `type` is always `email_text_input`.                                                                                                                                                                                                                     | Yes       |
| `action_id`              | String  | An identifier for the input value when the parent modal is submitted. You can use this when you receive a `view_submission` payload [to identify the value of the input element]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters. | No        |
| `initial_value`          | String  | The initial value in the email input when it is loaded.                                                                                                                                                                                                                                    | No        |
| `dispatch_action_config` | Object  | A [dispatch configuration object] that determines when during text input the element returns a [`block_actions` payload].                                                                                                                                                                  | No        |
| `focus_on_load`          | Boolean | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                            | No        |
| `placeholder`            | Object  | A [`plain_text`] only text object that defines the placeholder text shown in the email input. Maximum length for the `text` in this field is 150 characters.                                                                                                                               | No        |

### Example[]

An input block containing a email-text input element.

```
{
  "type": "input",
  "block_id": "input123",
  "label": {
    "type": "plain_text",
    "text": "Email Address"
  },
  "element": {
    "type": "email_text_input",
    "action_id": "email_text_input-action",
    "placeholder": {
      "type": "plain_text",
      "text": "Enter an email"
    }
  }
}
```

## File input element[]

**Allows user to upload files.**

In order to use the `file_input` element within your app, your app must have the [`files:read`] scope. There is a 10MB file size limit.

| Available in surfaces | Works with block types |
| --------------------- | ---------------------- |
| [Modals]              | [Input]                |

### Fields[]

| Fields      | Type       | Description                                                                                                                                                                                                                                                                                 | Required? |
| ----------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`      | String     | The type of element. In this case `type` is always `file_input`.                                                                                                                                                                                                                            | Yes       |
| `action_id` | String     | An identifier for the input value when the parent modal is submitted. You can use this when you receive a `view_submission` payload [to identify the value of the input element]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters.  | No        |
| `filetypes` | String\[\] | An array of valid [file extensions] that will be accepted for this element. All file extensions will be accepted if filetypes is not specified. This validation is provided for convenience only, and you should perform your own file type validation based on what you expect to receive. | No        |
| `max_files` | Integer    | Maximum number of files that can be uploaded for this `file_input` element. Minimum of 1, maximum of 10. Defaults to 10 if not specified.                                                                                                                                                   | No        |

### Example[]

An [input block] containing a `file_input` input element.

```
{
  "type": "input",
  "block_id": "input_block_id",
  "label": {
    "type": "plain_text",
    "text": "Upload Files"
  },
  "element": {
    "type": "file_input",
    "action_id": "file_input_action_id_1",
    "filetypes": ["jpg", "png"],
    "max_files": 5,
  },
}
```

## Image element[]

**Displays an image as part of a larger block of content.**

Use the [`image`] block if you want a block with _only_ an image in it.

| Available in surfaces           | Works with block types |
| ------------------------------- | ---------------------- |
| [Modals] [Messages] [Home tabs] | [Section] [Context]    |

Example:

![Image 5: An example of an image element]

### Fields[]

| Field        | Type   | Description                                                                                                                                    | Required? |
| ------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`       | String | The type of element. In this case `type` is always `image`.                                                                                    | Yes       |
| `alt_text`   | String | A plain-text summary of the image. This should not contain any markup.                                                                         | Yes       |
| `image_url`  | String | The URL for a publicly hosted image. You must provide either an `image_url` or `slack_file`. Maximum length for this field is 3000 characters. | No        |
| `slack_file` | Object | A [Slack image file object] that defines the source of the image.                                                                              | No        |

### Example[]

```
{
  "type": "image",
  "image_url": "http://placekitten.com/700/500",
  "alt_text": "Multiple cute kittens"
}
```

[View an example in Block Kit builder]

An image block using `slack_file` with a `url`:

```
{
  "type": "image",
  "slack_file": {
    "url": "https://files.slack.com/files-pri/T0123456-F0123456/xyz.png"
  },
  "alt_text": "Slack file object."
}
```

An image block using `slack_file` with a `id`:

```
{
  "type": "image",
  "slack_file": {
    "id": "F0123456",
  },
  "alt_text": "Slack file object."
}
```

## Multi-select menu element[]

**Allows users to select multiple items from a list of options.**

_Interactive component_ - see our [guide to enabling interactivity].

Just like regular [select menus], multi-select menus also include type-ahead functionality, where a user can type a part or all of an option string to filter the list.

There are different types of multi-select menu that depend on different data sources for their lists of options:

- [Menu with static options]
- [Menu with external data source]
- [Menu with user list]
- [Menu with conversations list]
- [Menu with channels list]

| Available in surfaces           | Works with block types      |
| ------------------------------- | --------------------------- |
| [Modals] [Messages] [Home tabs] | [Section] [Actions] [Input] |

Example:

![Image 6: An example of a multi-select element]

---

### Static options[]

This is the most basic form of select menu, with a static list of options passed in when defining the element.

#### Fields[]

| Field                | Type       | Description                                                                                                                                                                                                                                                                      | Required? |
| -------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`               | String     | The type of element. In this case `type` is always `multi_static_select`.                                                                                                                                                                                                        | Yes       |
| `action_id`          | String     | An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to [identify the source of the action]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters. | No        |
| `options`            | Object\[\] | An array of [option objects]. Maximum number of options is 100. Each option must be less than 76 characters. If `option_groups` is specified, this field should not be.                                                                                                          | Yes       |
| `option_groups`      | Object\[\] | An array of [option group objects]. Maximum number of option groups is 100. If `options` is specified, this field should not be.                                                                                                                                                 | No        |
| `initial_options`    | Object\[\] | An array of [option objects] that exactly match one or more of the options within `options` or `option_groups`. These options will be selected when the menu initially loads.                                                                                                    | No        |
| `confirm`            | Object     | A [confirm object] that defines an optional confirmation dialog that appears before the multi-select choices are submitted.                                                                                                                                                      | No        |
| `max_selected_items` | Integer    | Specifies the maximum number of items that can be selected in the menu. Minimum number is 1.                                                                                                                                                                                     | No        |
| `focus_on_load`      | Boolean    | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                  | No        |
| `placeholder`        | Object     | A [`plain_text` only text object] that defines the placeholder text shown on the menu. Maximum length for the `text` in this field is 150 characters.                                                                                                                            | No        |

#### Example[]

A static multi-select menu

```
[
  {
    "type": "section",
    "block_id": "section678",
    "text": {
      "type": "mrkdwn",
      "text": "Pick items from the list"
    },
    "accessory": {
      "action_id": "text1234",
      "type": "multi_static_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Select items"
      },
      "options": [
        {
          "text": {
            "type": "plain_text",
            "text": "*this is plain_text text*"
          },
          "value": "value-0"
        },
        {
          "text": {
            "type": "plain_text",
            "text": "*this is plain_text text*"
          },
          "value": "value-1"
        },
        {
          "text": {
            "type": "plain_text",
            "text": "*this is plain_text text*"
          },
          "value": "value-2"
        }
      ]
    }
  }
]
```

[View an example in Block Kit builder]

---

### External data source[]

This menu will load its options from an external data source, allowing for a dynamic list of options.

#### Setup[]

To use this menu type, you'll need to configure your app first:

1.  Go to your [app's settings page] and select **Interactivity & Shortcuts** from the sidebar.
2.  Add a URL to the **Options Load URL** under Select Menus.
3.  Save changes.

Each time a menu of this type is opened or the user starts typing in the typeahead field, we'll send a request to your specified URL. Your app should return an HTTP 200 OK response, along with an `application/json` post body with an object containing either:

- an [`options`] array
- an [`option_groups`] array

The `option_groups` array can have a maximum number of 100 option groups with a maximum of 100 options.

Here's an example response:

```
{
  "options": [
    {
      "text": {
        "type": "plain_text",
        "text": "*this is plain_text text*"
      },
      "value": "value-0"
    },
    {
      "text": {
        "type": "plain_text",
        "text": "*this is plain_text text*"
      },
      "value": "value-1"
    },
    {
      "text": {
        "type": "plain_text",
        "text": "*this is plain_text text*"
      },
      "value": "value-2"
    }
  ]
}
```

#### Making the element optional[]

By default, external multi-select menu elements require a user to select at least one option from the drop-down menu. However, there is a way to make a selection from this element optional. This is done by containing the element within an [input block], and using its `optional` field to designate the input element as an optional element. (In fact, any Block Kit element can be made optional this way!)

#### Fields[]

| Field                | Type       | Description                                                                                                                                                                                                                                                                                  | Required? |
| -------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`               | String     | The type of element. In this case `type` is always `multi_external_select`.                                                                                                                                                                                                                  | Yes       |
| `action_id`          | String     | An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to [identify the source of the action]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters.             | No        |
| `min_query_length`   | Integer    | When the typeahead field is used, a request will be sent on every character change. If you prefer fewer requests or more fully ideated queries, use the `min_query_length` attribute to tell Slack the fewest number of typed characters required before dispatch. The default value is `3`. | No        |
| `initial_options`    | Object\[\] | An array of [option objects] that exactly match one or more of the options within `options` or `option_groups`. These options will be selected when the menu initially loads.                                                                                                                | No        |
| `confirm`            | Object     | A [confirm object] that defines an optional confirmation dialog that appears before the multi-select choices are submitted.                                                                                                                                                                  | No        |
| `max_selected_items` | Integer    | Specifies the maximum number of items that can be selected in the menu. Minimum number is 1.                                                                                                                                                                                                 | No        |
| `focus_on_load`      | Boolean    | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                              | No        |
| `placeholder`        | Object     | A [`plain_text`] only text object that defines the placeholder text shown on the menu. Maximum length for the `text` in this field is 150 characters.                                                                                                                                        | No        |

#### Example[]

A multi-select menu in a section block with an external data source:

```
[
  {
    "type": "section",
    "block_id": "section678",
    "text": {
      "type": "mrkdwn",
      "text": "Pick items from the list"
    },
    "accessory": {
      "action_id": "text1234",
      "type": "multi_external_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Select items"
      },
      "min_query_length": 3
    }
  }
]
```

---

### User list[]

This multi-select menu will populate its options with a list of Slack users visible to the current user in the active workspace.

#### Fields[]

| Field                | Type       | Description                                                                                                                                                                                                                                                                      | Required? |
| -------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`               | String     | The type of element. In this case `type` is always `multi_users_select`.                                                                                                                                                                                                         | Yes       |
| `action_id`          | String     | An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to [identify the source of the action]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters. | No        |
| `initial_users`      | String\[\] | An array of user IDs of any valid users to be pre-selected when the menu loads.                                                                                                                                                                                                  | No        |
| `confirm`            | Object     | A [confirm object] that defines an optional confirmation dialog that appears before the multi-select choices are submitted.                                                                                                                                                      | No        |
| `max_selected_items` | Integer    | Specifies the maximum number of items that can be selected in the menu. Minimum number is 1.                                                                                                                                                                                     | No        |
| `focus_on_load`      | Boolean    | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                  | No        |
| `placeholder`        | Object     | A [`plain_text`] only text object that defines the placeholder text shown on the menu. Maximum length for the `text` in this field is 150 characters.                                                                                                                            | No        |

#### Example[]

A multi-select menu in a section block showing a list of users:

```
[
  {
    "type": "section",
    "block_id": "section678",
    "text": {
      "type": "mrkdwn",
      "text": "Pick users from the list"
    },
    "accessory": {
      "action_id": "text1234",
      "type": "multi_users_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Select users"
      }
    }
  }
]
```

---

### Conversations list[]

This multi-select menu will populate its options with a list of public and private channels, DMs, and MPIMs visible to the current user in the active workspace.

#### Fields[]

| Field                             | Type       | Description                                                                                                                                                                                                                                                                      | Required? |
| --------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`                            | String     | The type of element. In this case `type` is always `multi_conversations_select`.                                                                                                                                                                                                 | Yes       |
| `action_id`                       | String     | An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to [identify the source of the action]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters. | No        |
| `initial_conversations`           | String\[\] | An array of one or more IDs of any valid conversations to be pre-selected when the menu loads. If `default_to_current_conversation` is also supplied, `initial_conversations` will be ignored.                                                                                   | No        |
| `default_to_current_conversation` | Boolean    | Pre-populates the select menu with the conversation that the user was viewing when they opened the modal, if available. Default is `false`.                                                                                                                                      | No        |
| `confirm`                         | Object     | A [confirm object] that defines an optional confirmation dialog that appears before the multi-select choices are submitted.                                                                                                                                                      | No        |
| `max_selected_items`              | Integer    | Specifies the maximum number of items that can be selected in the menu. Minimum number is 1.                                                                                                                                                                                     | No        |
| `filter`                          | Object     | A [filter object] that reduces the list of available conversations using the specified criteria.                                                                                                                                                                                 | No        |
| `focus_on_load`                   | Boolean    | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                  | No        |
| `placeholder`                     | Object     | A [`plain_text`] only text object that defines the placeholder text shown on the menu. Maximum length for the `text` in this field is 150 characters.                                                                                                                            | No        |

#### Example[]

A multi-select menu in a section block showing a list of conversations:

```
[
  {
    "type": "section",
    "block_id": "section678",
    "text": {
      "type": "mrkdwn",
      "text": "Pick conversations from the list"
    },
    "accessory": {
      "action_id": "text1234",
      "type": "multi_conversations_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Select conversations"
      }
    }
  }
]
```

---

### Public channels select[]

This multi-select menu will populate its options with a list of public channels visible to the current user in the active workspace.

#### Fields[]

| Field                | Type       | Description                                                                                                                                                                                                                                                                      | Required? |
| -------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`               | String     | The type of element. In this case `type` is always `multi_channels_select`.                                                                                                                                                                                                      | Yes       |
| `action_id`          | String     | An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to [identify the source of the action]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters. | No        |
| `initial_channels`   | String\[\] | An array of one or more IDs of any valid public channel to be pre-selected when the menu loads.                                                                                                                                                                                  | No        |
| `confirm`            | Object     | A [confirm object] that defines an optional confirmation dialog that appears before the multi-select choices are submitted.                                                                                                                                                      | No        |
| `max_selected_items` | Integer    | Specifies the maximum number of items that can be selected in the menu. Minimum number is 1.                                                                                                                                                                                     | No        |
| `focus_on_load`      | Boolean    | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                  | No        |
| `placeholder`        | Object     | A [`plain_text`] only text object that defines the placeholder text shown on the menu. Maximum length for the `text` in this field is 150 characters.                                                                                                                            | No        |

#### Example[]

A multi-select menu in a section block showing a list of channels:

```
[
  {
    "type": "section",
    "block_id": "section678",
    "text": {
      "type": "mrkdwn",
      "text": "Pick channels from the list"
    },
    "accessory": {
      "action_id": "text1234",
      "type": "multi_channels_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Select channels"
      }
    }
  }
]
```

## Number input element[]

**Allows user to enter a number into a single-line field.**

_Interactive component_ - see our [guide to enabling interactivity].

The number input element accepts both whole and decimal numbers. For example, 0.25, 5.5, and -10 are all valid input values. Decimal numbers are only allowed when `is_decimal_allowed` is equal to `true`.

| Available in surfaces | Works with block types |
| --------------------- | ---------------------- |
| [Modals]              | [Input]                |

Example:

![Image 7: An example of a Number input element]

### Fields[]

| Fields                   | Type    | Description                                                                                                                                                                                                                                                                                | Required? |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `type`                   | String  | The type of element. In this case `type` is always `number_input`.                                                                                                                                                                                                                         | Yes       |
| `is_decimal_allowed`     | Boolean | Decimal numbers are allowed if `is_decimal_allowed`\= `true`, set the value to `false` otherwise.                                                                                                                                                                                          | Yes       |
| `action_id`              | String  | An identifier for the input value when the parent modal is submitted. You can use this when you receive a `view_submission` payload [to identify the value of the input element]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters. | No        |
| `initial_value`          | String  | The initial value in the plain-text input when it is loaded.                                                                                                                                                                                                                               | No        |
| `min_value`              | String  | The minimum value, cannot be greater than `max_value`.                                                                                                                                                                                                                                     | No        |
| `max_value`              | String  | The maximum value, cannot be less than `min_value`.                                                                                                                                                                                                                                        | No        |
| `dispatch_action_config` | Object  | A [dispatch configuration object] that determines when during text input the element returns a [`block_actions` payload].                                                                                                                                                                  | No        |
| `focus_on_load`          | Boolean | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                            | No        |
| `placeholder`            | Object  | A [`plain_text`] only text object that defines the placeholder text shown in the number input. Maximum length for the `text` in this field is 150 characters.                                                                                                                              | No        |

### Example[]

```
{
"type": "input",
  "element": {
    "type": "number_input",
    "is_decimal_allowed": false,
    "action_id": "number_input-action"
  },
  "label": {
    "type": "plain_text",
    "text": "Label",
    "emoji": true
  }
}
```

## Overflow menu element[]

**Allows users to press a button to view a list of options.**

_Interactive component_ - see our [guide to enabling interactivity].

Unlike the select menu, there is no typeahead field, and the button always appears with an ellipsis ("…") rather than customizable text. As such, it is usually used if you want a more compact layout than a select menu, or to supply a list of less visually important actions after a row of buttons. You can also specify URL links as overflow menu options, instead of actions.

| Available in surfaces           | Works with block types |
| ------------------------------- | ---------------------- |
| [Modals] [Messages] [Home tabs] | [Section] [Actions]    |

Example:

![Image 8: An example of an overflow element]

### Fields[]

| Field       | Type       | Description                                                                                                                                                                                                                                                                      | Required? |
| ----------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`      | String     | The type of element. In this case `type` is always `overflow`.                                                                                                                                                                                                                   | Yes       |
| `action_id` | String     | An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to [identify the source of the action]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters. | No        |
| `options`   | Object\[\] | An array of up to five [option objects] to display in the menu.                                                                                                                                                                                                                  | Yes       |
| `confirm`   | Object     | A [confirm object] that defines an optional confirmation dialog that appears after a menu item is selected.                                                                                                                                                                      | No        |

### Example[]

A section block with an overflow menu:

```
{
  "type": "section",
  "block_id": "section 890",
  "text": {
    "type": "mrkdwn",
    "text": "This is a section block with an overflow menu."
  },
  "accessory": {
    "type": "overflow",
    "options": [
      {
        "text": {
          "type": "plain_text",
          "text": "*this is plain_text text*"
        },
        "value": "value-0"
      },
      {
        "text": {
          "type": "plain_text",
          "text": "*this is plain_text text*"
        },
        "value": "value-1"
      },
      {
        "text": {
          "type": "plain_text",
          "text": "*this is plain_text text*"
        },
        "value": "value-2"
      },
      {
        "text": {
          "type": "plain_text",
          "text": "*this is plain_text text*"
        },
        "value": "value-3"
      },
      {
        "text": {
          "type": "plain_text",
          "text": "*this is plain_text text*"
        },
        "value": "value-4"
      }
    ],
    "action_id": "overflow"
  }
}
```

[View an example in Block Kit builder]

## Plain-text input element[]

**Allows users to enter freeform text data into a single-line or multi-line field.**

_Interactive component_ - see our [guide to enabling interactivity].

| Available in surfaces           | Works with block types |
| ------------------------------- | ---------------------- |
| [Modals] [Messages] [Home tabs] | [Input]                |

Example:

![Image 9: An example of a plain-text element]

### Fields[]

| Field                    | Type    | Description                                                                                                                                                                                                                                                                                | Required? |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `type`                   | String  | The type of element. In this case `type` is always `plain_text_input`.                                                                                                                                                                                                                     | Yes       |
| `action_id`              | String  | An identifier for the input value when the parent modal is submitted. You can use this when you receive a `view_submission` payload [to identify the value of the input element]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters. | No        |
| `initial_value`          | String  | The initial value in the plain-text input when it is loaded.                                                                                                                                                                                                                               | No        |
| `multiline`              | Boolean | Indicates whether the input will be a single line (`false`) or a larger textarea (`true`). Defaults to `false`.                                                                                                                                                                            | No        |
| `min_length`             | Integer | The minimum length of input that the user must provide. If the user provides less, they will receive an error. Acceptable values for this field are between 0 and 3000, inclusive.                                                                                                         | No        |
| `max_length`             | Integer | The maximum length of input that the user can provide. If the user provides more, they will receive an error. Acceptable values for this field are between 1 and 3000, inclusive.                                                                                                          | No        |
| `dispatch_action_config` | Object  | A [dispatch configuration object] that determines when during text input the element returns a [`block_actions` payload].                                                                                                                                                                  | No        |
| `focus_on_load`          | Boolean | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                            | No        |
| `placeholder`            | Object  | A [`plain_text`] only text object that defines the placeholder text shown in the plain-text input. Maximum length for the `text` in this field is 150 characters.                                                                                                                          | No        |

### Example[]

An input block containing a plain-text input element.

```
{
  "type": "input",
  "block_id": "input123",
  "label": {
    "type": "plain_text",
    "text": "Label of input"
  },
  "element": {
    "type": "plain_text_input",
    "action_id": "plain_input",
    "placeholder": {
      "type": "plain_text",
      "text": "Enter some plain text"
    }
  }
}
```

[View an example in Block Kit builder]

## Radio button group element[]

**Allows users to choose one item from a list of possible options.**

_Interactive component_ - see our [guide to enabling interactivity].

| Available in surfaces           | Works with block types      |
| ------------------------------- | --------------------------- |
| [Modals] [Messages] [Home tabs] | [Section] [Actions] [Input] |

Example:

![Image 10: An example of a radio button element]

### Fields[]

| Field            | Type       | Description                                                                                                                                                                                                                                                                              | Required? |
| ---------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`           | String     | The type of element. In this case `type` is always `radio_buttons`.                                                                                                                                                                                                                      | Yes       |
| `action_id`      | String     | An identifier for the action triggered when the radio button group is changed. You can use this when you receive an interaction payload to [identify the source of the action]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters. | No        |
| `options`        | Object\[\] | An array of [option objects]. A maximum of 10 options are allowed.                                                                                                                                                                                                                       | Yes       |
| `initial_option` | Object     | An [option object] that exactly matches one of the options within `options`. This option will be selected when the radio button group initially loads.                                                                                                                                   | No        |
| `confirm`        | Object     | A [confirm object] that defines an optional confirmation dialog that appears after clicking one of the radio buttons in this element.                                                                                                                                                    | No        |
| `focus_on_load`  | Boolean    | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                          | No        |

### Example[]

A section block containing a set of radio buttons:

```
{
  "type": "modal",
  "title": {
    "type": "plain_text",
    "text": "My App",
    "emoji": true
  },
  "submit": {
    "type": "plain_text",
    "text": "Submit",
    "emoji": true
  },
  "close": {
    "type": "plain_text",
    "text": "Cancel",
    "emoji": true
  },
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": "Check out these rad radio buttons"
      },
      "accessory": {
        "type": "radio_buttons",
        "action_id": "this_is_an_action_id",
        "initial_option": {
          "value": "A1",
          "text": {
            "type": "plain_text",
            "text": "Radio 1"
          }
        },
        "options": [
          {
            "value": "A1",
            "text": {
              "type": "plain_text",
              "text": "Radio 1"
            }
          },
          {
            "value": "A2",
            "text": {
              "type": "plain_text",
              "text": "Radio 2"
            },
            "description": {
              "type": "mrkdwn",
              "text": "*Option two*"
            },
          }
        ]
      }
    }
  ]
}
```

[View an example in Block Kit builder]

---

## Rich text input element[]

**Allows users to enter formatted text in a WYSIWYG composer, offering the same messaging writing experience as in Slack.**

_Interactive component_ - see our [guide to enabling interactivity].

| Available in surfaces | Works with block types |
| --------------------- | ---------------------- |
| [Modals] [Home tabs]  | [Input]                |

![Image 11: An example of a rich text input element]

### Fields[]

| Field                    | Type        | Description                                                                                                                                                                                                                                                   | Required? |
| ------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`                   | String      | The type of element. In this case `type` is always `rich_text_input`.                                                                                                                                                                                         | Yes       |
| `action_id`              | String      | An identifier for the input value when the parent modal is submitted. You can use this when you receive a `view_submission` payload [to identify the value of the input element]. Should be unique in the containing block. Maximum length is 255 characters. | Yes       |
| `initial_value`          | [Rich text] | The initial value in the rich text input when it is loaded.                                                                                                                                                                                                   | No        |
| `dispatch_action_config` | Object      | A [dispatch configuration object] that determines when during text input the element returns a [`block_actions`] payload.                                                                                                                                     | No        |
| `focus_on_load`          | Boolean     | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                               | No        |
| `placeholder`            | Object      | A [`plain_text`] object that defines the placeholder text shown in the plain-text input. Maximum length for the `text` in this field is 150 characters.                                                                                                       | No        |

### Example[]

An input block containing a rich text input element.

```
{
  "type": "rich_text_input",
  "action_id": "rich_text_input-action",
  "dispatch_action_config": {
    "trigger_actions_on": [
      "on_character_entered"
    ]
  },
  "focus_on_load": true,
  "placeholder": {
    "type": "plain_text",
    "text": "Enter text"
  }
}
```

---

## Select menu element[]

**Allows users to choose an option from a drop down menu.**

_Interactive component_ - see our [guide to enabling interactivity].

The select menu also includes type-ahead functionality, where a user can type a part or all of an option string to filter the list.

There are different types of select menu elements that depend on different data sources for their lists of options:

- [Select menu of static options]
- [Select menu of external data source]
- [Select menu of users]
- [Select menu of conversations]
- [Select menu of public channels]

| Available in surfaces           | Works with block types      |
| ------------------------------- | --------------------------- |
| [Modals] [Messages] [Home tabs] | [Section] [Actions] [Input] |

![Image 12: An example of a select menu element]

---

### Select menu of static options[]

This is the most basic form of select menu, with a static list of options passed in when defining the element.

#### Fields[]

| Field            | Type       | Description                                                                                                                                                                                                                                                                      | Required? |
| ---------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`           | String     | The type of element. In this case `type` is always `static_select`.                                                                                                                                                                                                              | Yes       |
| `action_id`      | String     | An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to [identify the source of the action]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters. | No        |
| `options`        | Object\[\] | An array of [option objects]. Maximum number of options is 100. If `option_groups` is specified, this field should not be.                                                                                                                                                       | Yes       |
| `option_groups`  | Object\[\] | An array of [option group objects]. Maximum number of option groups is 100. If `options` is specified, this field should not be.                                                                                                                                                 | No        |
| `initial_option` | Object     | A single option that exactly matches one of the options within `options` or `option_groups`. This option will be selected when the menu initially loads.                                                                                                                         | No        |
| `confirm`        | Object     | A [confirm object] that defines an optional confirmation dialog that appears after a menu item is selected.                                                                                                                                                                      | No        |
| `focus_on_load`  | Boolean    | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                  | No        |
| `placeholder`    | Object     | A [`plain_text`] only text object that defines the placeholder text shown on the menu. Maximum length for the `text` in this field is 150 characters.                                                                                                                            | No        |

#### Example[]

A static select menu

```
[
  {
    "type": "section",
    "block_id": "section678",
    "text": {
      "type": "mrkdwn",
      "text": "Pick an item from the dropdown list"
    },
    "accessory": {
      "action_id": "text1234",
      "type": "static_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Select an item"
      },
      "options": [
        {
          "text": {
            "type": "plain_text",
            "text": "*this is plain_text text*"
          },
          "value": "value-0"
        },
        {
          "text": {
            "type": "plain_text",
            "text": "*this is plain_text text*"
          },
          "value": "value-1"
        },
        {
          "text": {
            "type": "plain_text",
            "text": "*this is plain_text text*"
          },
          "value": "value-2"
        }
      ]
    }
  }
]
```

---

### Select menu of external data source[]

This select menu will load its options from an external data source, allowing for a dynamic list of options.

#### Setup[]

If you don't have [Socket Mode] enabled, you'll need to configure your app to use this menu type:

1.  Go to your [app's settings page] and select **Interactivity & Shortcuts** from the sidebar.
2.  Add a URL to the **Options Load URL** under Select Menus.
3.  Save changes.

Each time a select menu of this type is opened or the user starts typing in the typeahead field, we'll send a request to your specified URL. Your app should return an HTTP 200 OK response, along with an `application/json` post body with an object containing either:

- an [`options`] array
- an [`option_groups`] array

The `options` array can have a maximum number of 100 options.

The `option_groups` array can have a maximum number of 100 option groups, with each option group allowing up to 100 options.

Here's an example response:

```
{
  "options": [
    {
      "text": {
        "type": "plain_text",
        "text": "*this is plain_text text*"
      },
      "value": "value-0"
    },
    {
      "text": {
        "type": "plain_text",
        "text": "*this is plain_text text*"
      },
      "value": "value-1"
    },
    {
      "text": {
        "type": "plain_text",
        "text": "*this is plain_text text*"
      },
      "value": "value-2"
    }
  ]
}
```

Refer to [`options`] and [`option_groups`] for more information about their related fields.

#### Fields[]

| Field              | Type    | Description                                                                                                                                                                                                                                                                                  | Required? |
| ------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`             | String  | The type of element. In this case `type` is always `external_select`.                                                                                                                                                                                                                        | Yes       |
| `action_id`        | String  | An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to [identify the source of the action]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters.             | No        |
| `initial_option`   | Object  | A single option that exactly matches one of the options within the `options` or `option_groups` loaded from the external data source. This option will be selected when the menu initially loads.                                                                                            | No        |
| `min_query_length` | Integer | When the typeahead field is used, a request will be sent on every character change. If you prefer fewer requests or more fully ideated queries, use the `min_query_length` attribute to tell Slack the fewest number of typed characters required before dispatch. The default value is `3`. | No        |
| `confirm`          | Object  | A [confirm object] that defines an optional confirmation dialog that appears after a menu item is selected.                                                                                                                                                                                  | No        |
| `focus_on_load`    | Boolean | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                              | No        |
| `placeholder`      | Object  | A [`plain_text`] only text object that defines the placeholder text shown on the menu. Maximum length for the `text` in this field is 150 characters.                                                                                                                                        | No        |

#### Example[]

A select menu in a section block with an external data source:

```
[
  {
    "type": "section",
    "block_id": "section678",
    "text": {
      "type": "mrkdwn",
      "text": "Pick an item from the dropdown list"
    },
    "accessory": {
      "action_id": "text1234",
      "type": "external_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Select an item"
      },
      "min_query_length": 3
    }
  }
]
```

---

### Select menu of users[]

This select menu will populate its options with a list of Slack users visible to the current user in the active workspace.

#### Fields[]

| Field           | Type    | Description                                                                                                                                                                                                                                                                      | Required? |
| --------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`          | String  | The type of element. In this case `type` is always `users_select`.                                                                                                                                                                                                               | Yes       |
| `action_id`     | String  | An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to [identify the source of the action]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters. | No        |
| `initial_user`  | String  | The user ID of any valid user to be pre-selected when the menu loads.                                                                                                                                                                                                            | No        |
| `confirm`       | Object  | A [confirm object] that defines an optional confirmation dialog that appears after a menu item is selected.                                                                                                                                                                      | No        |
| `focus_on_load` | Boolean | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                  | No        |
| `placeholder`   | Object  | A [`plain_text`] only text object that defines the placeholder text shown on the menu. Maximum length for the `text` in this field is 150 characters.                                                                                                                            | No        |

#### Example[]

A select menu in a section block showing a list of users:

```
[
  {
    "type": "section",
    "block_id": "section678",
    "text": {
      "type": "mrkdwn",
      "text": "Pick a user from the dropdown list"
    },
    "accessory": {
      "action_id": "text1234",
      "type": "users_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Select an item"
      }
    }
  }
]
```

---

### Select menu of conversations[]

This select menu will populate its options with a list of public and private channels, DMs, and MPIMs visible to the current user in the active workspace.

#### Fields[]

| Field                             | Type    | Description                                                                                                                                                                                                                                                                                                                             | Required? |
| --------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`                            | String  | The type of element. In this case `type` is always `conversations_select`.                                                                                                                                                                                                                                                              | Yes       |
| `action_id`                       | String  | An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to [identify the source of the action]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters.                                                        | No        |
| `initial_conversation`            | String  | The ID of any valid conversation to be pre-selected when the menu loads. If `default_to_current_conversation` is also supplied, `initial_conversation` will take precedence.                                                                                                                                                            | No        |
| `default_to_current_conversation` | Boolean | Pre-populates the select menu with the conversation that the user was viewing when they opened the modal, if available. Default is `false`.                                                                                                                                                                                             | No        |
| `confirm`                         | Object  | A [confirm object] that defines an optional confirmation dialog that appears after a menu item is selected.                                                                                                                                                                                                                             | No        |
| `response_url_enabled`            | Boolean | **This field only works with menus in [input blocks] in [modals].**When set to `true`, the [`view_submission` payload] from the menu's parent view will contain a `response_url`. This `response_url` can be used for [message responses]. The target conversation for the message will be determined by the value of this select menu. |
| No                                |
| `filter`                          | Object  | A [filter object] that reduces the list of available conversations using the specified criteria.                                                                                                                                                                                                                                        | No        |
| `focus_on_load`                   | Boolean | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                                                                         | No        |
| `placeholder`                     | Object  | A [`plain_text`] only text object that defines the placeholder text shown on the menu. Maximum length for the `text` in this field is 150 characters.                                                                                                                                                                                   | No        |

#### Example[]

A select menu in a section block showing a list of conversations:

```
[
  {
    "type": "section",
    "block_id": "section678",
    "text": {
      "type": "mrkdwn",
      "text": "Pick a conversation from the dropdown list"
    },
    "accessory": {
      "action_id": "text1234",
      "type": "conversations_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Select an item"
      }
    }
  }
]
```

---

### Select menu of public channels[]

This select menu will populate its options with a list of public channels visible to the current user in the active workspace.

#### Fields[]

| Field                  | Type    | Description                                                                                                                                                                                                                                                                                                                        | Required? |
| ---------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`                 | String  | The type of element. In this case `type` is always `channels_select`.                                                                                                                                                                                                                                                              | Yes       |
| `action_id`            | String  | An identifier for the action triggered when a menu option is selected. You can use this when you receive an interaction payload to [identify the source of the action]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters.                                                   | No        |
| `initial_channel`      | String  | The ID of any valid public channel to be pre-selected when the menu loads.                                                                                                                                                                                                                                                         | No        |
| `confirm`              | Object  | A [confirm object] that defines an optional confirmation dialog that appears after a menu item is selected.                                                                                                                                                                                                                        | No        |
| `response_url_enabled` | Boolean | **This field only works with menus in [input blocks] in [modals].**When set to `true`, the [`view_submission` payload] from the menu's parent view will contain a `response_url`. This `response_url` can be used for [message responses]. The target channel for the message will be determined by the value of this select menu. |
| No                     |
| `focus_on_load`        | Boolean | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                                                                    | No        |
| `placeholder`          | Object  | A [`plain_text`] only text object that defines the placeholder text shown on the menu. Maximum length for the `text` in this field is 150 characters.                                                                                                                                                                              | No        |

#### Example[]

A select menu in a section block showing a list of channels:

```
[
  {
    "type": "section",
    "block_id": "section678",
    "text": {
      "type": "mrkdwn",
      "text": "Pick a channel from the dropdown list"
    },
    "accessory": {
      "action_id": "text1234",
      "type": "channels_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Select an item"
      }
    }
  }
]
```

## Time picker element[]

**Allows users to select a time of day.**

_Interactive component_ - see our [guide to enabling interactivity].

On desktop clients, this time picker will take the form of a dropdown list with free-text entry for precise choices. On mobile clients, the time picker will use native time picker UIs.

| Available in surfaces           | Works with block types      |
| ------------------------------- | --------------------------- |
| [Modals] [Messages] [Home tabs] | [Section] [Actions] [Input] |

### Fields[]

| Field           | Type    | Description                                                                                                                                                                                                                                                               | Required? |
| --------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`          | String  | The type of element. In this case `type` is always `timepicker`.                                                                                                                                                                                                          | Yes       |
| `action_id`     | String  | An identifier for the action triggered when a time is selected. You can use this when you receive an interaction payload to [identify the source of the action]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters. | No        |
| `initial_time`  | String  | The initial time that is selected when the element is loaded. This should be in the format `HH:mm`, where `HH` is the 24-hour format of an hour (00 to 23) and `mm` is minutes with leading zeros (00 to 59), for example `22:25` for 10:25pm.                            | No        |
| `confirm`       | Object  | A [confirm object] that defines an optional confirmation dialog that appears after a time is selected.                                                                                                                                                                    | No        |
| `focus_on_load` | Boolean | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                           | No        |
| `placeholder`   | Object  | A [`plain_text`] only text object that defines the placeholder text shown on the time picker. Maximum length for the `text` in this field is 150 characters.                                                                                                              | No        |
| `timezone`      | String  | A string in the IANA format, e.g. "America/Chicago". The timezone is displayed to end users as hint text underneath the time picker. It is also passed to the app upon certain interactions, such as `view_submission`.                                                   | No        |

### Example[]

A section block containing a time picker element, with the initial time set to 11:40am:

```
{
  "type": "section",
  "block_id": "section1234",
  "text": {
    "type": "mrkdwn",
    "text": "Pick a date for the deadline."
  },
  "accessory": {
    "type": "timepicker",
    "timezone": "America/Los_Angeles",
    "action_id": "timepicker123",
    "initial_time": "11:40",
    "placeholder": {
      "type": "plain_text",
      "text": "Select a time"
    }
  }
}
```

[View an example in Block Kit builder]

## URL input element[]

**Allows user to enter a URL into a single-line field.**

_Interactive component_ - see our [guide to enabling interactivity].

| Available in surfaces | Works with block types |
| --------------------- | ---------------------- |
| [Modals]              | [Input]                |

### Fields[]

| Fields                   | Type    | Description                                                                                                                                                                                                                                                                                | Required? |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `type`                   | String  | The type of element. In this case `type` is always `url_text_input`.                                                                                                                                                                                                                       | Yes       |
| `action_id`              | String  | An identifier for the input value when the parent modal is submitted. You can use this when you receive a `view_submission` payload [to identify the value of the input element]. Should be unique among all other `action_id`s in the containing block. Maximum length is 255 characters. | No        |
| `initial_value`          | String  | The initial value in the URL input when it is loaded.                                                                                                                                                                                                                                      | No        |
| `dispatch_action_config` | Object  | A [dispatch configuration object] that determines when during text input the element returns a [`block_actions` payload].                                                                                                                                                                  | No        |
| `focus_on_load`          | Boolean | Indicates whether the element will be set to auto focus within the [`view object`]. Only one element can be set to `true`. Defaults to `false`.                                                                                                                                            | No        |
| `placeholder`            | Object  | A [`plain_text`] only text object that defines the placeholder text shown in the URL input. Maximum length for the `text` in this field is 150 characters.                                                                                                                                 | No        |

### Example[]

An input block containing a URL-text input element.

```
{
  "type": "input",
  "element": {
    "type": "url_text_input",
    "action_id": "url_text_input-action"
  },
  "label": {
    "type": "plain_text",
    "text": "Label",
    "emoji": true
  }
}
```

## Workflow button element[]

**Allows users to run a [link trigger] with customizable inputs**

_Interactive component_ - but interactions with workflow button elements will not send `block_actions` events, since these are used to start new workflow runs.

| Available in surfaces | Works with block types |
| --------------------- | ---------------------- |
| [Messages]            | [Section] [Actions]    |

Example:

![Image 13: Three buttons showing default, primary, and danger color style]

### Fields[]

| Field       | Type   | Description                                                                                                                                                                                                                                         | Required? |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `type`      | String | The type of element. In this case `type` is always `workflow_button`.                                                                                                                                                                               | Yes       |
| `text`      | Object | A [text object] that defines the button's text. Can only be of `type: plain_text`. `text` may truncate with ~30 characters. Maximum length for the `text` in this field is 75 characters.                                                           | Yes       |
| `workflow`  | Object | A [workflow object] that contains details about the workflow that will run when the button is clicked.                                                                                                                                              | Yes       |
| `action_id` | String | An identifier for the action. Use this when you receive an interaction payload to [identify the source of the action]. Every `action_id` in a block should be unique. Maximum length is 255 characters.                                             | Yes       |
| `style`     | String | Decorates buttons with alternative visual color schemes. Use this option with restraint.`primary` gives buttons a green outline and text, ideal for affirmation or confirmation actions. `primary` should only be used for one button within a set. |

`danger` gives buttons a red outline and text, and should be used when the action is destructive. Use `danger` even more sparingly than `primary`.

If you don't include this field, the default button style will be used.

| No |
| `accessibility_label` | String | A label for longer descriptive text about a button element. This label will be read out by screen readers _instead of_ the button [`text` object]. Maximum length is 75 characters. | No |

### Example[]

```
{
  "type": "workflow_button",
  "text": {
    "type": "plain_text",
    "text": "Run Workflow"
  },
  "action_id": "workflowbutton123",
  "workflow": {
    "trigger": {
        "url": "https://slack.com/shortcuts/Ft0123ABC456/xyz...zyx",
        "customizable_input_parameters": [
          {
            "name": "input_parameter_a",
            "value": "Value for input param A"
          },
          {
            "name": "input_parameter_b",
            "value": "Value for input param B"
          }
        ]
    }
  }
}
```
