import { CheckCircle2, ChevronDownIcon } from 'lucide-react'
import { InOrbitIcon } from './in-orbit-icon'
import { Button } from './ui/button'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import {
  deleteGoalCompletion,
  type MonthSummaryResponse,
} from '@/actions/dataFetch'
import { PendingMonthGoals } from './PendingMonthGoals'
import { useState } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import * as Accordion from '@radix-ui/react-accordion'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

dayjs.locale(ptBR)

export function MonthSummary({ summary, categories }: MonthSummaryResponse) {
  const month = dayjs().startOf('month').format('MMMM')
  const [value, setValue] = useState('all')
  const queryClient = useQueryClient()

  const completedPercentage =
    Math.round((summary.completed * 100) / summary.total) | 0

  async function handleUnDoGoalCompletion(goalCompletionId: string) {
    try {
      const { data } = await deleteGoalCompletion({ goalCompletionId })
      console.log(data)
      toast.success('Registro deletado com sucesso!')

      queryClient.invalidateQueries({ queryKey: ['pending-goals-month'] })
      queryClient.invalidateQueries({ queryKey: ['summary-week'] })
      queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
      queryClient.invalidateQueries({ queryKey: ['summary-month'] })
    } catch (error) {
      toast.error('Erro ao deletar registro')
    }
  }
  return (
    <Accordion.Root
      className="max-w-[540px] w-full py-10 md:px-5 mx-auto flex flex-col gap-6"
      type="single"
      defaultValue="item-1"
      collapsible
    >
      <AccordionItem
        value="item-1"
        className="flex items-center justify-between w-full flex-col"
      >
        <AccordionTrigger className="flex items-center justify-between w-full flex-col gap-6 group">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <InOrbitIcon />
              <span className="text-md font-semibold capitalize">{month}</span>
            </div>
            <Button className="hover:bg-violet-500" size="sm">
              <ChevronDownIcon
                className="group-data-[state=open]:rotate-180 transform"
                aria-hidden
              />
              Mensal
            </Button>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Progress value={summary.completed} max={summary.total}>
              <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
            </Progress>

            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>
                Você completou{' '}
                <span className="text-zinc-100">{summary.completed}</span> de{' '}
                <span className="text-zinc-100">{summary.total | 0}</span> metas
                neste mês.
              </span>
              <span>{completedPercentage}%</span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent asChild>
          <main className="max-w-[540px] w-full py-6 md:px-5 mx-auto flex flex-col gap-6">
            <Separator />
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Categorias</h2>
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
                  )
                })}
                <ToggleGroup.Item
                  className="capitalize flex items-center px-3 py-2 gap-2 leading-none rounded-full border border-dashed border-zinc-800 text-sm text-zinc-300 hover:border-zinc-700  data-[state=on]:bg-violet-600 data-[state=on]:text-violet-200 disabled:opacity-50 disabled:pointer-events-none outline-none focus-visible:border-pink-500 ring-pink-500/10 focus-visible:ring-4"
                  value={'all'}
                >
                  Todas
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>
            <Separator />
            <h2 className="text-xl font-medium">Metas Mensais</h2>
            {/* <PendingGoals /> */}
            <PendingMonthGoals category={value} />
            <Separator />

            <div className="space-y-6">
              <h2 className="text-xl font-medium">Seu mês</h2>

              {summary.goalsPerWeek?.map((item, index) => {
                const firstDayOfMonth = dayjs().startOf('month')
                const firstWeekDay = firstDayOfMonth
                  .add(item.weekOfMonth - 1, 'week')
                  .startOf('week')
                const lastWeekDay = firstWeekDay.endOf('week')

                return (
                  <div className="space-y-4" key={item.weekOfMonth}>
                    <h3 className="font-medium ">
                      {index === 0
                        ? 'Semana Atual'
                        : `Semana ${item.weekOfMonth}`}{' '}
                      <span className="text-zinc-400 text-xs">
                        ({firstWeekDay.format('D')} a{' '}
                        {lastWeekDay.format('D [ de ] MMM')})
                      </span>
                    </h3>

                    <ul className="space-y-3">
                      {item.completions.map(goal => {
                        const parsedTime = dayjs(goal.completedAt).format(
                          'D[ de ]MMM HH:mm[h]'
                        )
                        if (value === 'all') {
                          return (
                            <li
                              className="flex items-center gap-2"
                              key={goal.id}
                            >
                              <CheckCircle2 className="size-4 text-pink-500" />
                              <span className="text-sm text-zinc-400">
                                Você completou "
                                <span className="text-zinc-100">
                                  {goal.title}
                                </span>
                                " às{' '}
                                <span className="text-zinc-100">
                                  {parsedTime}
                                </span>
                                <span className="text-sm text-zinc-400">
                                  {' '}
                                  ({goal.category})
                                </span>
                                <button
                                  type="button"
                                  className="text-sm text-zinc-400 hover:text-zinc-300 cursor-pointer"
                                  onClick={() =>
                                    handleUnDoGoalCompletion(goal.id)
                                  }
                                >
                                  ({'desfazer'})
                                </button>
                              </span>
                            </li>
                          )
                        }
                        if (goal.category === value) {
                          return (
                            <li
                              className="flex items-center gap-2"
                              key={goal.id}
                            >
                              <CheckCircle2 className="size-4 text-pink-500" />
                              <span className="text-sm text-zinc-400">
                                Você completou "
                                <span className="text-zinc-100">
                                  {goal.title}
                                </span>
                                " às{' '}
                                <span className="text-zinc-100">
                                  {parsedTime}
                                </span>
                                <span className="text-sm text-zinc-400">
                                  {' '}
                                  ({goal.category}){' '}
                                </span>
                                <button
                                  type="button"
                                  className="text-sm text-zinc-400 hover:text-zinc-300 cursor-pointer"
                                  onClick={() =>
                                    handleUnDoGoalCompletion(goal.id)
                                  }
                                >
                                  ({'desfazer'})
                                </button>
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
        </AccordionContent>
      </AccordionItem>
    </Accordion.Root>
  )
}
