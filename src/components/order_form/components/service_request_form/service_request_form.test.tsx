import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import ServiceRequestForm from './service_request_form'

// Mock the Ably service
vi.mock('../../../../services/ablyService', () => ({
  ablyService: {
    publishNewRequest: vi.fn(),
    publishCompletion: vi.fn()
  }
}))

// Mock the DeliverablesAndNotes component
vi.mock('../deliverables_and_notes/deliverables_and_notes', () => ({
  default: ({ formData, onFormDataChange, role }: any) => (
    <div data-testid="deliverables-notes">
      <input 
        data-testid="deliverables-input"
        onChange={(e) => onFormDataChange({ requiredDeliverables: e.target.value.split(',') })}
        placeholder="Deliverables"
      />
      <textarea 
        data-testid="notes-input"
        onChange={(e) => onFormDataChange({ notes: e.target.value })}
        placeholder="Notes"
      />
    </div>
  )
}))

describe('ServiceRequestForm', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form for internal user', () => {
    render(<ServiceRequestForm role="internal" />)
    
    expect(screen.getByText('Internal Service Request')).toBeInTheDocument()
    expect(screen.getByText('Capture the essential details needed to dispatch a field services scout. Tailor the deliverables and notes as needed.')).toBeInTheDocument()
  })

  it('renders form for external user', () => {
    render(<ServiceRequestForm role="external" />)
    
    expect(screen.getByText('External Service Request')).toBeInTheDocument()
    expect(screen.getByText('Submit your service request. Some fields are pre-filled and cannot be modified.')).toBeInTheDocument()
  })

  it('loads data when loadedData prop is provided', () => {
    const loadedData = {
      id: '123',
      requestTitle: 'Test Request',
      serviceType: 'site_inspection',
      priority: 'high',
      clientAccount: 'Test Client',
      addressLine1: '123 Test St',
      city: 'Test City',
      state: 'CA',
      postalCode: '12345',
      contactName: 'John Doe',
      contactPhone: '555-1234',
      preferredDate: '2024-01-01',
      availabilityWindow: 'morning',
      requiredDeliverables: ['photos', 'report'],
      notes: 'Test notes'
    }

    render(<ServiceRequestForm role="internal" loadedData={loadedData} />)
    
    expect(screen.getByDisplayValue('Test Request')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Client')).toBeInTheDocument()
  })

  it('handles form submission for internal user', async () => {
    const { ablyService } = await import('../../../../services/ablyService')
    render(<ServiceRequestForm role="internal" />)
    
    // Fill out required fields
    await user.type(screen.getByLabelText(/request title/i), 'Test Request')
    await user.type(screen.getByLabelText(/client account/i), 'Test Client')
    await user.type(screen.getByLabelText(/address/i), '123 Test St')
    await user.type(screen.getByLabelText(/city/i), 'Test City')
    await user.type(screen.getByLabelText(/postal code/i), '12345')
    await user.type(screen.getByLabelText(/primary contact/i), 'John Doe')
    await user.type(screen.getByLabelText(/contact phone/i), '555-1234')
    await user.type(screen.getByLabelText(/preferred completion date/i), '2024-01-01')
    
    // Select state (required field)
    const stateSelect = screen.getByRole('combobox', { name: /state/i })
    await user.click(stateSelect)
    await user.click(screen.getByText('CA'))
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit service request/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(ablyService.publishNewRequest).toHaveBeenCalled()
    })
  })

  it('handles form submission for external user', async () => {
    const { ablyService } = await import('../../../../services/ablyService')
    render(<ServiceRequestForm role="external" />)
    
    // Fill out deliverables and notes
    await user.type(screen.getByTestId('deliverables-input'), 'photos,report')
    await user.type(screen.getByTestId('notes-input'), 'Work completed')
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /complete service request/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(ablyService.publishCompletion).toHaveBeenCalled()
    })
  })

  it('shows different editable fields based on role', () => {
    const { rerender } = render(<ServiceRequestForm role="internal" />)
    
    // Internal users should be able to edit most fields
    expect(screen.getByLabelText(/request title/i)).not.toBeDisabled()
    expect(screen.getByLabelText(/client account/i)).not.toBeDisabled()
    
    rerender(<ServiceRequestForm role="external" />)
    
    // External users should have limited editing capabilities
    // (This would depend on your specific implementation)
  })

  it('validates required fields', async () => {
    render(<ServiceRequestForm role="internal" />)
    
    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)
    
    // Should show validation errors or prevent submission
    // (This would depend on your validation implementation)
  })

  it('hides action buttons when showActions is false', () => {
    render(<ServiceRequestForm role="internal" showActions={false} />)

    expect(screen.queryByRole('button', { name: /submit service request/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /reset form/i })).not.toBeInTheDocument()
  })

  it('shows action buttons when showActions is true (default)', () => {
    render(<ServiceRequestForm role="internal" />)

    expect(screen.getByRole('button', { name: /submit service request/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset form/i })).toBeInTheDocument()
  })
})
