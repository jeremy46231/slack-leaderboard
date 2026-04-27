declare module 'svg-text-to-path' {
  type FontSource = {
    source: string
    wght?: number | [number, number]
    wdth?: number | [number, number]
    ital?: number | [number, number]
    slnt?: number | [number, number]
  }

  export default class SvgTextToPath {
    constructor(
      svg: string,
      params?: {
        fonts?: Record<string, FontSource[]>
        decimals?: number
        split?: boolean
        keepFontAttrs?: boolean
      }
    )
    replaceAll(selector?: string): Promise<unknown>
    getSvgString(): string
    destroy(): void
  }
}
