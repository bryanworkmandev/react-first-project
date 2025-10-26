// Mock implementation of Ably for testing
export const client = {
  channels: {
    get: vi.fn(() => ({
      publish: vi.fn(),
      subscribe: vi.fn(),
      unsubscribe: vi.fn()
    }))
  }
}

export const CHANNELS = {
  SERVICE_REQUESTS: 'service-requests',
  SERVICE_COMPLETIONS: 'service-completions',
  SERVICE_UPDATES: 'service-updates'
}

export const EVENTS = {
  NEW_REQUEST: 'new_request',
  COMPLETED_REQUEST: 'completed_request',
  REQUEST_ASSIGNED: 'request_assigned',
  REQUEST_UPDATED: 'request_updated'
}

export const AblyProvider = ({ children }: { children: React.ReactNode }) => children
export const ChannelProvider = ({ children }: { children: React.ReactNode }) => children
export const useChannel = vi.fn()
export const useConnectionStateListener = vi.fn()
