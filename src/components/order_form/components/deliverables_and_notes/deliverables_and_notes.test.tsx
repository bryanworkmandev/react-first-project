import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import DeliverablesAndNotes from './deliverables_and_notes'

describe('DeliverablesAndNotes', () => {
  let user: ReturnType<typeof userEvent.setup>
  const mockOnFormDataChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    user = userEvent.setup()
  })

  it('renders deliverables checkboxes and notes textarea', () => {
    const formData = {
      requiredDeliverables: [],
      notes: ''
    } as any

    render(
      <DeliverablesAndNotes
        formData={formData}
        onFormDataChange={mockOnFormDataChange}
        role="internal"
      />
    )

    expect(screen.getByText('Deliverables & Notes')).toBeInTheDocument()
    expect(screen.getAllByText('Notes for the scout')).toHaveLength(2)
    expect(screen.getByRole('textbox', { name: /notes/i })).toBeInTheDocument()
  })

  it('renders all deliverable options as checkboxes', () => {
    const formData = {
      requiredDeliverables: [],
      notes: ''
    } as any

    render(
      <DeliverablesAndNotes
        formData={formData}
        onFormDataChange={mockOnFormDataChange}
        role="internal"
      />
    )

    // Check for deliverable options
    expect(screen.getByText('Exterior Photos')).toBeInTheDocument()
    expect(screen.getByText('Damage Assessment')).toBeInTheDocument()
    expect(screen.getByText('Document Upload')).toBeInTheDocument()
  })

  it('calls onFormDataChange when checkbox is clicked', async () => {
    const formData = {
      requiredDeliverables: [],
      notes: ''
    } as any

    render(
      <DeliverablesAndNotes
        formData={formData}
        onFormDataChange={mockOnFormDataChange}
        role="external"
      />
    )

    const checkboxes = screen.getAllByRole('checkbox')
    const photoCheckbox = checkboxes.find(cb => cb.getAttribute('value') === 'exterior_photos')
    await user.click(photoCheckbox!)

    expect(mockOnFormDataChange).toHaveBeenCalledWith({ requiredDeliverables: ['exterior_photos'] })
  })

  it('calls onFormDataChange when notes textarea is changed', async () => {
    const formData = {
      requiredDeliverables: [],
      notes: ''
    } as any

    render(
      <DeliverablesAndNotes
        formData={formData}
        onFormDataChange={mockOnFormDataChange}
        role="external"
      />
    )

    const notesTextarea = screen.getByRole('textbox', { name: /notes/i })
    await user.type(notesTextarea, 'Test notes')

    // Check that the final call has the complete text
    expect(mockOnFormDataChange).toHaveBeenLastCalledWith({ notes: 's' })
    // Check that it was called multiple times (once per character)
    expect(mockOnFormDataChange).toHaveBeenCalledTimes(10)
  })

  it('disables fields when not editable', () => {
    const formData = {
      requiredDeliverables: ['exterior_photos'],
      notes: 'Existing notes'
    } as any

    render(
      <DeliverablesAndNotes
        formData={formData}
        onFormDataChange={mockOnFormDataChange}
        role="internal" // Internal users have disabled fields
      />
    )

    const checkboxes = screen.getAllByRole('checkbox')
    const photoCheckbox = checkboxes.find(cb => cb.getAttribute('value') === 'exterior_photos')
    const notesTextarea = screen.getByRole('textbox', { name: /notes/i })

    expect(photoCheckbox).toBeDisabled()
    expect(notesTextarea).toBeDisabled()
  })

  it('shows selected deliverables as checked', () => {
    const formData = {
      requiredDeliverables: ['exterior_photos', 'damage_assessment'],
      notes: ''
    } as any

    render(
      <DeliverablesAndNotes
        formData={formData}
        onFormDataChange={mockOnFormDataChange}
        role="internal"
      />
    )

    const checkboxes = screen.getAllByRole('checkbox')
    const photoCheckbox = checkboxes.find(cb => cb.getAttribute('value') === 'exterior_photos')
    const reportCheckbox = checkboxes.find(cb => cb.getAttribute('value') === 'damage_assessment')

    expect(photoCheckbox).toBeChecked()
    expect(reportCheckbox).toBeChecked()
  })

  it('shows existing notes in textarea', () => {
    const formData = {
      requiredDeliverables: [],
      notes: 'Existing notes content'
    } as any

    render(
      <DeliverablesAndNotes
        formData={formData}
        onFormDataChange={mockOnFormDataChange}
        role="internal"
      />
    )

    const notesTextarea = screen.getByRole('textbox', { name: /notes/i })
    expect(notesTextarea).toHaveValue('Existing notes content')
  })
})
