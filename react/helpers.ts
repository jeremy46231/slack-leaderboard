import { type Root, type Instance, type TextInstance } from './renderer.ts'
import type {
  Middleware,
  types as Slack,
  SlackEventMiddlewareArgs,
  StringIndexed,
} from '@slack/bolt'

export type Block = Slack.AnyBlock
export type middlewareArguments<type extends string> = Parameters<
  Middleware<SlackEventMiddlewareArgs<type>, StringIndexed>
>[0]

export function assertNoChildren(element: Instance) {
  if (element.children.length > 0) {
    throw new Error(
      `Element ${element.element} should not have children: ${element.children}`
    )
  }
}
export function getTextChild(element: Instance): string {
  const children = element.children
  if (children.find((child) => child.type !== 'text')) {
    throw new Error('Only text children allowed')
  }
  const string = children.map((child) => child.text).join('')
  return string
}
export function getTextProperty(value: unknown, assert: true): string
export function getTextProperty(value: unknown, assert?: false): string | undefined
export function getTextProperty(value: unknown, assert = false): string | undefined {
  if (typeof value === 'string') {
    return value
  }
  if (assert) {
    throw new Error('Expected string')
  }
  if (value === undefined || value === null) {
    return undefined
  }
  throw new Error('Expected string or undefined')
}