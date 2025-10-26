import { useState } from 'react';
import './App.scss'
import Topbar from './components/topbar/topbar'
import OrderForm from './components/order_form/order_form';

function App() {
  const [selectedRole, setSelectedRole] = useState("internal");

  return (
    <>
      <Topbar value={selectedRole} onChange={setSelectedRole} />
      <OrderForm role={selectedRole} />
    </>
  )
}

export default App
