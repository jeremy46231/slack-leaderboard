import * as echarts from 'echarts'
import parse from 'html-react-parser'
import SvgTextToPath from 'svg-text-to-path'
import { Temporal } from 'temporal-polyfill'
import type { dayInfo } from './report'
import { svgTextToPathFonts } from './image'

type ChartPoint = {
  date: string
  messages: number
}

function buildSeries(
  activityByDate: Map<string, dayInfo>,
  startDate: Temporal.PlainDate,
  endDate: Temporal.PlainDate
) {
  const points: ChartPoint[] = []
  let current = startDate

  while (Temporal.PlainDate.compare(current, endDate) <= 0) {
    points.push({
      date: current.toString(),
      messages: activityByDate.get(current.toString())?.messages_posted ?? 0,
    })
    current = current.add({ days: 1 })
  }

  return points
}

export async function makeChart(
  activityByDate: Map<string, dayInfo>,
  startDate: Temporal.PlainDate,
  endDate: Temporal.PlainDate,
  width = 800,
  height = 150
) {
  const points = buildSeries(activityByDate, startDate, endDate)
  const chart = echarts.init(null, null, {
    renderer: 'svg',
    ssr: true,
    width,
    height,
  })

  chart.setOption({
    backgroundColor: 'transparent',
    animation: false,
    grid: {
      left: 26,
      right: 5,
      top: 12,
      bottom: 24,
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: points.map((point) => point.date),
      axisLabel: {
        color: '#64748b',
        fontFamily: 'Roboto',
        fontSize: 10,
        interval: Math.max(0, Math.floor(points.length / 6)),
        formatter: (value: string) => {
          const date = Temporal.PlainDate.from(value)
          return date.toLocaleString('en-US', { month: 'short', day: 'numeric' })
        },
      },
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitNumber: 3,
      axisLabel: {
        color: '#64748b',
        fontFamily: 'Roboto',
        fontSize: 10,
        align: 'right',
        margin: 6,
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
    },
    tooltip: { show: false },
    series: [
      {
        name: 'Messages',
        type: 'line',
        smooth: 0.2,
        symbol: 'none',
        data: points.map((point) => point.messages),
        lineStyle: {
          color: '#0ea5e9',
          width: 2,
        },
        areaStyle: {
          color: '#bae6fd',
          opacity: 0.45,
        },
      },
    ],
  })

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
