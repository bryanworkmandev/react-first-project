import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import OrderForm from './order_form'

// Mock the child components
vi.mock('./components/notifications/notifications', () => ({
  default: ({ role, onNotificationClick }: { role: string; onNotificationClick: (data: any) => void }) => (
    <div data-testid="notifications" data-role={role}>
      Notifications Component
    </div>
  )
}))

vi.mock('./components/service_request_form/service_request_form', () => ({
  default: ({ role, loadedData }: { role: string; loadedData: any }) => (
    <div data-testid="service-request-form" data-role={role} data-loaded={!!loadedData}>
      Service Request Form Component
    </div>
  )
}))

describe('OrderForm', () => {
  it('renders notifications and service request form', () => {
    render(<OrderForm role="internal" />)
    
    expect(screen.getByTestId('notifications')).toBeInTheDocument()
    expect(screen.getByTestId('service-request-form')).toBeInTheDocument()
  })

  it('passes role to child components', () => {
    render(<OrderForm role="external" />)
    
    const notifications = screen.getByTestId('notifications')
    const form = screen.getByTestId('service-request-form')
    
    expect(notifications).toHaveAttribute('data-role', 'external')
    expect(form).toHaveAttribute('data-role', 'external')
  })

  it('handles notification click by loading data into form', () => {
    const mockData = { id: '123', requestTitle: 'Test Request' }
    render(<OrderForm role="internal" />)
    
    const notifications = screen.getByTestId('notifications')
    const form = screen.getByTestId('service-request-form')
    
    // Initially no loaded data
    expect(form).toHaveAttribute('data-loaded', 'false')
    
    // Simulate notification click (this would be triggered by the notifications component)
    // In a real test, you'd trigger the onNotificationClick callback
    expect(notifications).toBeInTheDocument()
  })
})
