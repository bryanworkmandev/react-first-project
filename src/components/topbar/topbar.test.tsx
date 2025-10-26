import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Topbar from './topbar'

// Mock the BasicSelect component
vi.mock('./components/basic_select/basic_select', () => ({
  default: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <select 
      data-testid="role-select" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="internal">Internal User</option>
      <option value="external">External User</option>
    </select>
  )
}))

describe('Topbar', () => {
  it('renders the title and role selector', () => {
    const mockOnChange = vi.fn()
    render(<Topbar value="internal" onChange={mockOnChange} />)
    
    expect(screen.getByText('Interview Project')).toBeInTheDocument()
    expect(screen.getByTestId('role-select')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Internal User')).toBeInTheDocument()
  })

  it('calls onChange when role is changed', () => {
    const mockOnChange = vi.fn()
    render(<Topbar value="internal" onChange={mockOnChange} />)
    
    const select = screen.getByTestId('role-select')
    fireEvent.change(select, { target: { value: 'external' } })
    
    expect(mockOnChange).toHaveBeenCalledWith('external')
  })

  it('renders GitHub link with correct attributes', () => {
    const mockOnChange = vi.fn()
    render(<Topbar value="internal" onChange={mockOnChange} />)
    
    const githubLink = screen.getByLabelText('View project repository on GitHub')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/bryanworkmandev/react-first-project')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
