import { leads } from './mockLeads'

export type SubStatus = 'Active' | 'Trial' | 'Cancelled'

export interface Subscription {
  id: string
  lead_id: string
  client_name: string
  plan: 'Starter' | 'Growth' | 'Pro'
  amount: number
  status: SubStatus
  startedAt: string
  renewsAt: string
}

function seeded(i: number) {
  return ((Math.sin(i * 9301 + 4927) + 1) / 2)
}

const plans: Subscription['plan'][] = ['Starter', 'Growth', 'Pro']
const prices: Record<Subscription['plan'], number> = { Starter: 29, Growth: 79, Pro: 199 }
const statuses: SubStatus[] = ['Active', 'Trial', 'Cancelled']

function generateSubscriptions(): Subscription[] {
  const qualified = leads.filter((l) => l.status === 'qualified')
  return qualified.map((lead, i) => {
    const plan = plans[Math.floor(seeded(i * 7) * plans.length)]
    const daysAgo = Math.floor(seeded(i * 13) * 120)
    const started = new Date()
    started.setDate(started.getDate() - daysAgo)
    const renews = new Date(started)
    renews.setMonth(renews.getMonth() + 1)
    return {
      id: `sub-${String(i + 1).padStart(3, '0')}`,
      lead_id: lead.id,
      client_name: lead.name,
      plan,
      amount: prices[plan],
      status: statuses[Math.floor(seeded(i * 3 + 2) * statuses.length)],
      startedAt: started.toISOString().split('T')[0],
      renewsAt: renews.toISOString().split('T')[0],
    }
  })
}

export const subscriptions = generateSubscriptions()
