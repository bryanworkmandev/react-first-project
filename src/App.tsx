import { useState } from 'react';
import './App.scss'
import Topbar from './components/topbar/topbar'
import OrderForm from './components/order_form/order_form';
import { AblyProvider, client } from './ably.js';

function App() {
  const [selectedRole, setSelectedRole] = useState("internal");

  return (
    <AblyProvider client={client}>
      <Topbar value={selectedRole} onChange={setSelectedRole} />
      <OrderForm role={selectedRole} />
    </AblyProvider>
  )
}

export default App
