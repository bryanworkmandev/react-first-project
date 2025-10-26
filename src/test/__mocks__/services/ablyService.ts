// Mock implementation of AblyService for testing
export const ablyService = {
  publishNewRequest: vi.fn(),
  publishCompletion: vi.fn(),
  subscribeToNewRequests: vi.fn(),
  subscribeToCompletions: vi.fn(),
  unsubscribe: vi.fn()
}

export type ServiceRequestData = {
  id: string
  requestTitle: string
  serviceType: string
  priority: string
  clientAccount: string
  addressLine1: string
  city: string
  state: string
  postalCode: string
  contactName: string
  contactPhone: string
  preferredDate: string
  availabilityWindow: string
  requiredDeliverables: string[]
  notes: string
}

export type ServiceRequestMessage = {
  id: string
  type: string
  data: ServiceRequestData
  timestamp: number
  requestedBy: 'internal' | 'external'
  requestedTo: 'internal' | 'external'
}

export type ServiceCompletionMessage = {
  id: string
  type: string
  data: ServiceRequestData
  timestamp: number
  completedBy: 'internal' | 'external'
  notifying: 'internal' | 'external'
}
