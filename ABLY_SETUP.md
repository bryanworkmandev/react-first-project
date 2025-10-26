# Ably Service Request System

This application uses Ably for real-time communication between internal and external users in a service request workflow.

## How It Works

### Workflow

1. **Internal User** fills out and submits a service request form
2. **External User** receives a real-time notification about the new request
3. **External User** can click the notification to open the form and start working
4. **External User** completes the work by filling out deliverables & notes and submitting
5. **Internal User** receives a real-time notification that the service request is completed

### Technical Implementation

#### Ably Setup (`src/ably.ts`)
- Configures the Ably Realtime client with the API key
- Defines channels for different event types:
  - `service-requests`: For new service request notifications
  - `service-completions`: For completion notifications
- Defines event types for message filtering

#### Ably Service (`src/components/order_form/services/ablyService.ts`)
Provides the following methods:
- `publishNewRequest()`: Publish a new service request (internal → external)
- `publishCompletion()`: Publish a service completion (external → internal)
- `subscribeToNewRequests()`: Subscribe to new request notifications
- `subscribeToCompletions()`: Subscribe to completion notifications

#### Notifications Component (`src/components/order_form/components/notifications/notifications.tsx`)
- Displays real-time notifications as Material-UI Snackbars
- Shows a dialog with request details when the user clicks "View Details"
- Allows users to open the form with pre-populated data

#### Form Integration
- Service request form automatically publishes events when submitted
- Notifications can pre-populate the form when clicked
- Different fields are editable based on user role

### User Roles

**Internal User:**
- Can edit all form fields EXCEPT deliverables and notes
- Receives notifications when external users complete service requests
- Publishes notifications when submitting a new service request

**External User:**
- Can ONLY edit deliverables and notes
- Receives notifications when internal users submit service requests
- Publishes notifications when completing a service request

### Testing the System

1. Open the application in two browser windows/tabs
2. Set one window to "Internal User" and the other to "External User"
3. In the Internal User window, fill out and submit the service request form
4. Check the External User window - you should see a notification appear
5. Click "Open Form" in the notification to see the pre-populated form
6. Complete the deliverable checkboxes and add notes in the External User window
7. Submit the form as the External User
8. Check the Internal User window - you should see a completion notification

### Ably API Key

The current API key is hardcoded in `src/ably.ts`. For production, consider:
- Moving the API key to environment variables
- Using Ably's token authentication for better security
- Implementing proper authentication/authorization

### Ably React Hooks

The system is set up to use Ably's React hooks (from `ably/react`) for optimal React integration. The `AblyProvider` wraps the entire application in `src/App.tsx`.

### Future Enhancements

- Persistent storage for service requests
- User authentication and authorization
- Request history and tracking
- Real-time updates as users are typing (optional)
- File uploads for deliverables
- Email notifications as a fallback
