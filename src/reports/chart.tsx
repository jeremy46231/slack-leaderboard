import { Temporal } from 'temporal-polyfill'
import type { dayInfo } from './report'
import { renderEchartsAsJsx } from './echarts'

type ChartPoint = {
  date: string
  totalMessages: number
  reactions: number
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
      totalMessages:
        activityByDate.get(current.toString())?.messages_posted ?? 0,
      reactions: activityByDate.get(current.toString())?.reactions_added ?? 0,
    })
    current = current.add({ days: 1 })
  }

  return points
}

export async function makeChart(
  activityByDate: Map<string, dayInfo>,
  startDate: Temporal.PlainDate,
  endDate: Temporal.PlainDate,
  width: number,
  height: number
) {
  const points = buildSeries(activityByDate, startDate, endDate)
  return renderEchartsAsJsx(
    {
      backgroundColor: 'transparent',
      animation: false,
      grid: {
        left: 26,
        right: 5,
        top: 24,
        bottom: 0,
        containLabel: false,
      },
      legend: {
        show: true,
        top: 0,
        left: 26,
        itemWidth: 10,
        itemHeight: 4,
        icon: 'roundRect',
        textStyle: {
          color: '#374151',
          fontFamily: 'Roboto',
          fontSize: 10,
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: points.map((point) => point.date),
        axisLabel: {
          show: false,
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        splitNumber: 3,
        axisLabel: {
          color: '#000000',
          fontFamily: 'Roboto',
          fontSize: 10,
          width: 24,
          margin: 10,
          formatter: (value: number) => {
            if (value >= 1000) {
              return `${(value / 1000).toFixed(1)}k`
            }
            return Math.round(value).toString()
          },
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
          color: '#0ea5e9',
          smooth: 0.2,
          symbol: 'none',
          z: 3,
          zlevel: 0,
          data: points.map((point) => point.totalMessages),
          lineStyle: {
            color: '#0ea5e9',
            width: 2,
          },
          areaStyle: {
            color: '#0ea5e9',
            opacity: 0.2,
          },
        },
        {
          name: 'Reactions',
          type: 'line',
          color: '#ef4444',
          smooth: 0.2,
          symbol: 'none',
          z: 2,
          zlevel: 0,
          data: points.map((point) => point.reactions),
          lineStyle: {
            color: '#ef4444',
            width: 2,
          },
        },
      ],
    },
    width,
    height
  )
}
