export interface Lead {
  id: string
  name: string
  email: string
  source: 'Landing Page' | 'Referral' | 'Social' | 'Direct'
  status: 'new' | 'contacted' | 'qualified' | 'lost'
  createdAt: string
}

function seeded(i: number) {
  return ((Math.sin(i * 9301 + 4927) + 1) / 2)
}

const firstNames = [
  'Sofia', 'Mateo', 'Valentina', 'Sebastián', 'Isabella', 'Camila',
  'Diego', 'Lucía', 'Andrés', 'Mariana', 'Carlos', 'Daniela',
  'Felipe', 'Natalia', 'Alejandro', 'Gabriela',
]

const lastNames = [
  'García', 'Martínez', 'López', 'Hernández', 'Ramírez', 'Torres',
  'Flores', 'Rivera', 'Gómez', 'Díaz', 'Morales', 'Cruz',
  'Reyes', 'Vargas', 'Castillo', 'Jiménez',
]

const sources: Lead['source'][] = ['Landing Page', 'Referral', 'Social', 'Direct']
const statuses: Lead['status'][] = ['new', 'contacted', 'qualified', 'lost']

function generateLeads(): Lead[] {
  const list: Lead[] = []
  for (let i = 0; i < 60; i++) {
    const first = firstNames[i % firstNames.length]
    const last = lastNames[(i * 7 + 3) % lastNames.length]
    const daysAgo = Math.floor(seeded(i * 11 + 7) * 90)
    const d = new Date()
    d.setDate(d.getDate() - daysAgo)
    list.push({
      id: `lead-${String(i + 1).padStart(3, '0')}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      source: sources[Math.floor(seeded(i * 5) * sources.length)],
      status: statuses[Math.floor(seeded(i * 3 + 1) * statuses.length)],
      createdAt: d.toISOString().split('T')[0],
    })
  }
  list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return list
}

export const leads = generateLeads()
