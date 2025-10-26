import { client, CHANNELS, EVENTS } from '../ably.ts';
import type { ServiceRequestMessage as AblyServiceRequestMessage, ServiceCompletionMessage } from '../ably.ts';

export interface ServiceRequestData {
  id: string;
  requestTitle: string;
  serviceType: string;
  priority: string;
  clientAccount: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  contactName: string;
  contactPhone: string;
  preferredDate: string;
  availabilityWindow: string;
  requiredDeliverables: string[];
  notes: string;
}

export type { AblyServiceRequestMessage as ServiceRequestMessage, ServiceCompletionMessage };

class AblyService {
  private requestChannel = client.channels.get(CHANNELS.SERVICE_REQUESTS);
  private completionChannel = client.channels.get(CHANNELS.SERVICE_COMPLETIONS);

  // Publish a new service request (internal → external)
  async publishNewRequest(requestData: ServiceRequestData, requestedBy: 'internal' | 'external'): Promise<void> {
    const message = {
      id: requestData.id,
      type: EVENTS.NEW_REQUEST,
      data: requestData,
      timestamp: Date.now(),
      requestedBy,
      requestedTo: requestedBy === 'internal' ? 'external' : 'internal',
    };

    await this.requestChannel.publish(EVENTS.NEW_REQUEST, message);
    console.log('Published new service request:', message);
  }

  // Publish service completion (external → internal)
  async publishCompletion(requestData: ServiceRequestData, completedBy: 'internal' | 'external'): Promise<void> {
    const message = {
      id: requestData.id,
      type: EVENTS.COMPLETED_REQUEST,
      data: requestData,
      timestamp: Date.now(),
      completedBy,
      notifying: completedBy === 'external' ? 'internal' : 'external',
    };

    await this.completionChannel.publish(EVENTS.COMPLETED_REQUEST, message);
    console.log('Published service completion:', message);
  }

  // Subscribe to new service requests
  subscribeToNewRequests(callback: (message: { data?: AblyServiceRequestMessage }) => void): void {
    this.requestChannel.subscribe(EVENTS.NEW_REQUEST, callback);
    console.log('Subscribed to new service requests');
  }

  // Subscribe to service completions
  subscribeToCompletions(callback: (message: { data?: ServiceCompletionMessage }) => void): void {
    this.completionChannel.subscribe(EVENTS.COMPLETED_REQUEST, callback);
    console.log('Subscribed to service completions');
  }

  // Unsubscribe from all channels
  unsubscribe(): void {
    this.requestChannel.unsubscribe();
    this.completionChannel.unsubscribe();
    console.log('Unsubscribed from all channels');
  }
}

export const ablyService = new AblyService();
