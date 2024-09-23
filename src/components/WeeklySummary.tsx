import { CheckCircle2, Plus } from 'lucide-react'
import { InOrbitIcon } from './in-orbit-icon'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Button } from './ui/button'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
// import { PendingGoals } from './pending-goals'
import type { cateoryListType, SummaryResponse } from '@/actions/dataFetch'
import { PendingWeekGoals } from './PendingWeekGoals'
import { OutlineButton } from './ui/outline-button'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { useState } from 'react'

dayjs.locale(ptBR)

interface WeeklySummaryProps {
  summary: SummaryResponse['summary']
  categories: cateoryListType
}

export function WeeklySummary({ summary, categories }: WeeklySummaryProps) {
  const fromDate = dayjs().startOf('week').format('D[ de ]MMM')
  const toDate = dayjs().endOf('week').format('D[ de ]MMM')
  const [value, setValue] = useState('all')
  const completedPercentage =
    Math.round((summary.completed * 100) / summary.total) | 0

  return (
    <main className="max-w-[540px] w-full py-10 px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-semibold">
            {fromDate} - {toDate}
          </span>
        </div>
        <Button disabled className="hover:bg-violet-500" size="sm">
          Semanal
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <Progress value={summary.completed} max={summary.total}>
          <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
        </Progress>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou{' '}
            <span className="text-zinc-100">{summary.completed}</span> de{' '}
            <span className="text-zinc-100">{summary.total | 0}</span> metas
            nessa semana.
          </span>
          <span>{completedPercentage}%</span>
        </div>
      </div>

      <Separator />
      <div className="space-y-6">
        <h2 className="text-xl font-medium">Categorias</h2>
        {/* <div className="flex flex-wrap gap-3"> */}
        <ToggleGroup.Root
          type="single"
          value={value}
          className="flex flex-wrap gap-3"
          onValueChange={value => {
            if (value) setValue(value)
          }}
        >
          {categories.userCategories.map(item => {
            return (
              <ToggleGroup.Item
                className="capitalize flex items-center px-3 py-2 gap-2 leading-none rounded-full border border-dashed border-zinc-800 text-sm text-zinc-300 hover:border-zinc-700  data-[state=on]:bg-violet-600 data-[state=on]:text-violet-200 disabled:opacity-50 disabled:pointer-events-none outline-none focus-visible:border-pink-500 ring-pink-500/10 focus-visible:ring-4"
                value={item.name}
                key={item.id}
              >
                {item.name}
              </ToggleGroup.Item>
              // <OutlineButton
              //   key={item.id}
              //   // onClick={() => handleCreateGoalCompletion(goal.id)}
              //   // disabled={goal.completionCount >= goal.desiredFrequency}
              // >
              //   {item.name}
              // </OutlineButton>
            )
          })}
          <ToggleGroup.Item
            className="capitalize flex items-center px-3 py-2 gap-2 leading-none rounded-full border border-dashed border-zinc-800 text-sm text-zinc-300 hover:border-zinc-700  data-[state=on]:bg-violet-600 data-[state=on]:text-violet-200 disabled:opacity-50 disabled:pointer-events-none outline-none focus-visible:border-pink-500 ring-pink-500/10 focus-visible:ring-4"
            value={'all'}
          >
            Todas
          </ToggleGroup.Item>
        </ToggleGroup.Root>
        {/* </div> */}
      </div>
      <Separator />
      <h2 className="text-xl font-medium">Metas Semanais</h2>
      <PendingWeekGoals category={value} />
      <Separator />

      <div className="space-y-6">
        <h2 className="text-xl font-medium">Sua semana</h2>

        {summary.goalsPerDay?.map(item => {
          const weekDay = dayjs(item.completedAtDate).format('dddd')
          const parsedDate = dayjs(item.completedAtDate).format('D[ de ]MMM')

          return (
            <div className="space-y-4" key={item.completedAtDate}>
              <h3 className="font-medium capitalize">
                {weekDay}{' '}
                <span className="text-zinc-400 text-xs">({parsedDate})</span>
              </h3>

              <ul className="space-y-3">
                {item.completions.map(goal => {
                  if (value === 'all') {
                    const parsedTime = dayjs(goal.completedAt).format(
                      'HH:mm[h]'
                    )

                    return (
                      <li className="flex items-center gap-2" key={goal.id}>
                        <CheckCircle2 className="size-4 text-pink-500" />
                        <span className="text-sm text-zinc-400">
                          Você completou "
                          <span className="text-zinc-100">{goal.title}</span>"
                          às <span className="text-zinc-100">{parsedTime}</span>
                          <span className="text-sm text-zinc-400">
                            {' '}
                            ({goal.category})
                          </span>
                        </span>
                      </li>
                    )
                  }
                  if (goal.category === value) {
                    const parsedTime = dayjs(goal.completedAt).format(
                      'HH:mm[h]'
                    )

                    return (
                      <li className="flex items-center gap-2" key={goal.id}>
                        <CheckCircle2 className="size-4 text-pink-500" />
                        <span className="text-sm text-zinc-400">
                          Você completou "
                          <span className="text-zinc-100">{goal.title}</span>"
                          às <span className="text-zinc-100">{parsedTime}</span>
                          <span className="text-sm text-zinc-400">
                            {' '}
                            ({goal.category})
                          </span>
                        </span>
                      </li>
                    )
                  }
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </main>
  )
}
