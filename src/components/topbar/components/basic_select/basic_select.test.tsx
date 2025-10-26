import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import BasicSelect from './basic_select'
import { ROLE_OPTIONS } from '../../role_options'

describe('BasicSelect', () => {
  it('renders with correct options', () => {
    const mockOnChange = vi.fn()
    render(<BasicSelect value="internal" onChange={mockOnChange} />)
    
    // Open the select to see options
    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)
    
    expect(screen.getAllByText('Internal User')).toHaveLength(2) // One in select, one in dropdown
    expect(screen.getByText('External User')).toBeInTheDocument()
  })

  it('calls onChange when selection changes', () => {
    const mockOnChange = vi.fn()
    render(<BasicSelect value="internal" onChange={mockOnChange} />)
    
    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)
    
    const externalOption = screen.getByText('External User')
    fireEvent.click(externalOption)
    
    expect(mockOnChange).toHaveBeenCalledWith('external')
  })

  it('displays the correct selected value', () => {
    const mockOnChange = vi.fn()
    render(<BasicSelect value="external" onChange={mockOnChange} />)
    
    expect(screen.getByText('External User')).toBeInTheDocument()
  })

  it('renders all role options', () => {
    const mockOnChange = vi.fn()
    render(<BasicSelect value="internal" onChange={mockOnChange} />)
    
    // Open the select to see options
    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)
    
    ROLE_OPTIONS.forEach(option => {
      if (option.value === 'internal') {
        expect(screen.getAllByText(option.label)).toHaveLength(2) // One in select, one in dropdown
      } else {
        expect(screen.getByText(option.label)).toBeInTheDocument()
      }
    })
  })
})
