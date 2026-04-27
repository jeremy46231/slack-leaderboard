import satori, { type Font as SatoriFont } from 'satori'
import { Resvg, type ResvgRenderOptions } from '@resvg/resvg-js'
import type { ReactNode } from 'react'

type SvgTextToPathFonts = {
  [name: string]: {
    source: string
    wght?: number | [number, number]
    wdth?: number | [number, number]
    ital?: number | [number, number]
    slnt?: number | [number, number]
  }[]
}

const fontBuffer = async (specifier: string) => {
  const file = Bun.file(new URL(import.meta.resolve(specifier)))
  return await file.arrayBuffer()
}

const fonts = [
  {
    specifier: 'roboto-fontface/fonts/roboto/Roboto-Regular.woff',
    name: 'Roboto',
    weight: 400 as SatoriFont['weight'],
    style: 'normal' as SatoriFont['style'],
  },
]
const satoriFonts: SatoriFont[] = await Promise.all(
  fonts.map(async (font) => ({
    name: font.name,
    data: await fontBuffer(font.specifier),
    weight: font.weight,
    style: font.style,
  }))
)
export const svgTextToPathFonts: SvgTextToPathFonts = fonts.reduce(
  (acc, font) => {
    acc[font.name] ??= []
    acc[font.name].push({
      source: new URL(import.meta.resolve(font.specifier)).pathname,
      wght: font.weight,
      ital: font.style === 'italic' ? 1 : 0,
    })
    return acc
  },
  {} as SvgTextToPathFonts
)

// const fontPaths = fonts.map(
//   ({ specifier }) => new URL(import.meta.resolve(specifier)).pathname
// )

export async function renderImage(
  jsx: ReactNode,
  width: number,
  height: number,
  fitTo?: ResvgRenderOptions['fitTo']
) {
  console.time('svg generation')
  const svg = await satori(jsx, {
    width,
    height,
    fonts: satoriFonts,
    embedFont: true,
  })
  console.timeEnd('svg generation')
  await Bun.write('tmp-image-debug.svg', svg)
  console.time('image rendering')
  const resvg = new Resvg(svg, {
    font: {
      // fontFiles: fontPaths,
      loadSystemFonts: false,
    },
    fitTo,
  })
  const pngData = resvg.render().asPng()
  console.timeEnd('image rendering')
  return pngData
}

if (import.meta.main) {
  console.time('image generation')
  const pngData = await renderImage(
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
        fontFamily: 'Roboto',
      }}
    >
      <h1 style={{ color: 'black' }}>hello world :3</h1>
    </div>,
    800,
    400,
    { mode: 'zoom', value: 2 }
  )
  console.timeEnd('image generation')

  await Bun.write('./tmp-image.png', pngData)
}
