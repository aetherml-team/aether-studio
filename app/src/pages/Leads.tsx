import { useMemo } from 'react'
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs'
import { Users, Search, UserCheck, UserX, Sparkles } from 'lucide-react'
import { type ColumnDef, type SortingState } from '@tanstack/react-table'
import type { SectionConfig } from 'aether-core-ui'
import { PageWrapper, DataTable, FilterBar, EmptyState, StatCard, Avatar } from 'aether-core-ui'
import { leads, type Lead } from '@/data/mockLeads'

const totalCount = leads.length
const newCount = leads.filter((l) => l.status === 'new').length
const qualifiedCount = leads.filter((l) => l.status === 'qualified').length

const statusStyle: Record<Lead['status'], string> = {
  new: 'badge-premium badge-premium--active',
  contacted: 'badge-premium badge-premium--warning',
  qualified: 'badge-premium',
  lost: 'badge-premium badge-premium--inactive',
}

const columns: ColumnDef<Lead, any>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.original.name} size="sm" />
        <div>
          <span className="font-medium text-text">{row.original.name}</span>
          <span className="block text-xs text-text-muted">{row.original.email}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ getValue }) => <span className="text-text-muted text-sm">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const s = getValue<Lead['status']>()
      return (
        <span className={statusStyle[s]}>
          <span className="badge-premium__dot" />
          {s}
        </span>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ getValue }) => {
      const d = new Date(getValue<string>())
      return <span className="text-text-muted">{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    },
  },
]

export default function Leads({ section }: { section: SectionConfig }) {
  const [q, setQ] = useQueryState('q', parseAsString.withDefault(''))
  const [status, setStatus] = useQueryState('status', parseAsString)
  const [sort, setSort] = useQueryState('sort', parseAsString)
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const filtered = useMemo(() => {
    if (!status) return leads
    return leads.filter((l) => l.status === status)
  }, [status])

  const sorting: SortingState = useMemo(() => {
    if (!sort) return []
    const desc = sort.startsWith('-')
    const id = desc ? sort.slice(1) : sort
    return [{ id, desc }]
  }, [sort])

  function handleSortingChange(next: SortingState) {
    if (next.length === 0) setSort(null)
    else setSort(next[0].desc ? `-${next[0].id}` : next[0].id)
  }

  const pageIndex = page - 1
  function handlePageChange(idx: number) {
    setPage(idx + 1 <= 1 ? null as any : idx + 1)
  }

  const filterChips = useMemo(() => {
    const chips = []
    if (q) chips.push({ key: 'q', label: 'Search', value: q, onRemove: () => setQ(null) })
    if (status) chips.push({ key: 'status', label: 'Status', value: status, onRemove: () => setStatus(null) })
    if (sort) chips.push({ key: 'sort', label: 'Sort', value: sort.replace('-', '↓ ').replace(/^(?!↓)/, '↑ '), onRemove: () => setSort(null) })
    return chips
  }, [q, status, sort, setQ, setStatus, setSort])

  function clearAll() {
    setQ(null); setStatus(null); setSort(null); setPage(null as any)
  }

  const statusFilters: Lead['status'][] = ['new', 'contacted', 'qualified', 'lost']

  return (
    <PageWrapper>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="animate-fade-in-up delay-1">
            <StatCard icon={Users} label="Total Leads" value={totalCount.toString()} />
          </div>
          <div className="animate-fade-in-up delay-2">
            <StatCard icon={Sparkles} label="New" value={newCount.toString()} changeType="positive" />
          </div>
          <div className="animate-fade-in-up delay-3">
            <StatCard icon={UserCheck} label="Qualified" value={qualifiedCount.toString()} change={`${Math.round((qualifiedCount / totalCount) * 100)}%`} changeType="positive" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative group flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" />
            <input type="text" placeholder="Search leads..." value={q} onChange={(e) => setQ(e.target.value || null)} className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-border text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200" />
          </div>
          <div className="flex items-center gap-2">
            {statusFilters.map((s) => (
              <button key={s} onClick={() => setStatus(status === s ? null : s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${status === s ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border text-text-muted hover:text-text'}`}>{s}</button>
            ))}
          </div>
        </div>

        <FilterBar chips={filterChips} onClearAll={clearAll} />

        <div className="bg-surface/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.2),0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState icon={UserX} title="No leads found" description="Try adjusting your filters." />
          ) : (
            <DataTable data={filtered} columns={columns} searchValue={q} sorting={sorting} onSortingChange={handleSortingChange} pageIndex={pageIndex} onPageChange={handlePageChange} pageSize={15} />
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
