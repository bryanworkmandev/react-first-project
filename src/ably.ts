import * as Ably from 'ably';
import { AblyProvider as ReactAblyProvider, ChannelProvider, useChannel, useConnectionStateListener } from 'ably/react';

// Initialize Ably client
const client = new Ably.Realtime({ 
  key: 'fwXqDg.p_6jtw:QfkGCcjYjB1E4vmhpP2Lct4otGsl1NyLZx1rtfqrXrM'
});

// Service request channels
const CHANNELS = {
  SERVICE_REQUESTS: 'service-requests', // For new service request notifications
  SERVICE_COMPLETIONS: 'service-completions', // For completion notifications
  SERVICE_UPDATES: 'service-updates', // For any updates to existing requests
};

// Event types
const EVENTS = {
  NEW_REQUEST: 'new_request',
  COMPLETED_REQUEST: 'completed_request',
  REQUEST_ASSIGNED: 'request_assigned',
  REQUEST_UPDATED: 'request_updated',
};

// Message types
export type ServiceRequestMessage = {
  id: string;
  type: typeof EVENTS.NEW_REQUEST;
  data: any;
  timestamp: number;
  requestedBy: 'internal' | 'external';
  requestedTo: 'internal' | 'external';
};

export type ServiceCompletionMessage = {
  id: string;
  type: typeof EVENTS.COMPLETED_REQUEST;
  data: any;
  timestamp: number;
  completedBy: 'internal' | 'external';
  notifying: 'internal' | 'external';
};

// Export provider and hooks
export { ReactAblyProvider as AblyProvider, ChannelProvider, useChannel, useConnectionStateListener };
export { client, CHANNELS, EVENTS };
