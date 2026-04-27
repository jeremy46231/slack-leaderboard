import * as echarts from 'echarts'
import parse, { Element } from 'html-react-parser'
import SvgTextToPath from 'svg-text-to-path'
import { Temporal } from 'temporal-polyfill'
import type { dayInfo } from './report'
import { svgTextToPathFonts } from './image'

export async function makeChart(
  activityByDate: Map<string, dayInfo>,
  startDate: Temporal.PlainDate,
  endDate: Temporal.PlainDate,
  width = 800,
  height = 150
) {
  const chart = echarts.init(null, null, {
    renderer: 'svg',
    ssr: true,
    width,
    height,
  })

  chart.setOption({
    title: {
      text: 'ECharts Getting Started Example',
    },
    tooltip: {},
    xAxis: {
      data: ['shirt', 'cardigan', 'chiffon', 'pants', 'heels', 'socks'],
    },
    yAxis: {},
    series: [
      {
        name: 'sales',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
    animation: false,
  })

  const svg = chart.renderToSVGString()
  chart.dispose()

  const svgTextToPath = new SvgTextToPath(svg, {
    fonts: svgTextToPathFonts,
  })

  await Bun.write('tmp-image-debug.html', svg)
  // await Bun.write('tmp-image-debug.svg', svg)

  const parsed = parse(svg, {

    replace: (node) => {
      if (!(node instanceof Element)) return
      if (node.name === 'style') return 
      if (node.name === 'text') {

        return <></>
      }
    },
  })

  const element = parsed

  console.log(element)

  return element
}
