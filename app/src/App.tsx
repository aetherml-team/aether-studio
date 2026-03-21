import { AetherApp, registerSection } from 'aether-core-ui'
import config from './customer.config.json'
import Leads from './pages/Leads'
import Subscriptions from './pages/Subscriptions'

registerSection('leads', Leads)
registerSection('subscriptions', Subscriptions)

export default function App() {
  return <AetherApp config={config} />
}
