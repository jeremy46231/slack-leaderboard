import * as echarts from 'echarts'
import type { ECBasicOption } from 'echarts/types/dist/shared'
import parse from 'html-react-parser'
import SvgTextToPath from 'svg-text-to-path'
import { svgTextToPathFonts } from './image'

export async function renderEchartsAsJsx(
  option: ECBasicOption,
  width: number,
  height: number
) {
  const chart = echarts.init(null, null, {
    renderer: 'svg',
    ssr: true,
    width,
    height,
  })

  chart.setOption(option)

  const svg = chart.renderToSVGString()
  chart.dispose()

  const session = new SvgTextToPath(svg, {
    fonts: svgTextToPathFonts,
    decimals: 2,
  })

  try {
    await session.replaceAll()
    const sanitizedSvg = session
      .getSvgString()
      .replace(/<style[\s\S]*?<\/style>/g, '')
    const parsed = parse(sanitizedSvg)

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width,
          height,
          overflow: 'hidden',
          backgroundColor: 'transparent',
        }}
      >
        {parsed}
      </div>
    )
  } finally {
    session.destroy()
  }
}
