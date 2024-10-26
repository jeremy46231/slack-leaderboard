import { Temporal } from 'temporal-polyfill'

import type { Instance, TextInstance } from './renderer.ts'
import type { types as Slack } from '@slack/bolt'
import { assertNoChildren, getTextChild, getTextProperty } from './helpers.ts'

type BlockElement =
  | Slack.SectionBlockAccessory
  | Slack.InputBlockElement
  | Slack.ActionsBlockElement
  | Slack.ContextBlockElement
type BlockElementType = BlockElement['type']

export function jsxToBlockElement(jsx: Instance | TextInstance): BlockElement {


  if (jsx.type === 'text') {
    throw new Error('Text nodes not allowed as block elements')
  }

  if (jsx.element === 'button') {
    return {
      type: 'button',
      text: {
        type: 'plain_text',
        text: getTextChild(jsx),
      },
      url: getTextProperty(jsx.props.url),
      style: jsx.props.primary ? 'primary' : jsx.props.danger ? 'danger' : undefined,
      confirm: jsx.props.confirm as Slack.ConfirmationDialog | undefined,
      accessibility_label: getTextProperty(jsx.props.alt),
    }
  }
  if (jsx.element === 'checkbox') {
    return {
      type: 'checkboxes',
      options: jsx.children.map((child) => ({
        text: {
          type: 'plain_text',
          text: getTextChild(child),
        },
        value: getTextProperty(child.props.value, true),
      })),
      action_id: getTextProperty(jsx.props.action_id, true),
    }
  }
}

jsxToBlockElement({} as any)
