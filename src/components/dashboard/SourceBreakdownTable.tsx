import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { SourceStat } from '@/types/chart'

interface SourceBreakdownTableProps {
  data?: SourceStat[]
  loading?: boolean
}

export function SourceBreakdownTable({ data, loading }: SourceBreakdownTableProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-700">Source Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Source
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Total
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    In Prog.
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Done
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((row, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-slate-700">{row.source}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600">{row.total}</td>
                    <td className="px-4 py-2.5 text-right text-amber-600">{row.inProgress}</td>
                    <td className="px-4 py-2.5 text-right text-green-600">{row.completed}</td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-green-500 transition-all"
                            style={{ width: `${row.rate}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 w-8 text-right">{row.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
