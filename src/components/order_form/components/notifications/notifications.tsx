import { useState, useEffect } from 'react';
import { Alert, Snackbar, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ablyService } from '../../../../services/ablyService';
import type { ServiceRequestData, ServiceRequestMessage, ServiceCompletionMessage } from '../../../../services/ablyService';
import './notifications.scss';

interface Notification {
  id: string;
  type: 'new_request' | 'completed_request';
  message: string;
  data: ServiceRequestData;
  timestamp: number;
}

interface NotificationsProps {
  role: string;
  onNotificationClick: (data: ServiceRequestData) => void;
}

function Notifications({ role, onNotificationClick }: NotificationsProps) {
  const [, setNotifications] = useState<Notification[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    // Subscribe to new service requests (external users receive these)
    const newRequestCallback = (message: { data?: ServiceRequestMessage }) => {
      console.log('Received new request notification:', message);
      if (!message.data) return;
      const notification: Notification = {
        id: message.data.id || Date.now().toString(),
        type: 'new_request',
        message: `New service request: ${message.data.data.requestTitle || 'Untitled Request'}`,
        data: message.data.data,
        timestamp: message.data.timestamp || Date.now(),
      };
      
      setNotifications((prev) => [notification, ...prev]);
      setCurrentNotification(notification);
      setOpenSnackbar(true);
    };

    // Subscribe to completions (internal users receive these)
    const completionCallback = (message: { data?: ServiceCompletionMessage }) => {
      console.log('Received completion notification:', message);
      if (!message.data) return;
      const notification: Notification = {
        id: message.data.id || Date.now().toString(),
        type: 'completed_request',
        message: `Service request completed: ${message.data.data.requestTitle || 'Untitled Request'}`,
        data: message.data.data,
        timestamp: message.data.timestamp || Date.now(),
      };
      
      setNotifications((prev) => [notification, ...prev]);
      setCurrentNotification(notification);
      setOpenSnackbar(true);
    };

    if (role === 'external') {
      ablyService.subscribeToNewRequests(newRequestCallback);
    } else if (role === 'internal') {
      ablyService.subscribeToCompletions(completionCallback);
    }

    return () => {
      ablyService.unsubscribe();
    };
  }, [role]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleViewDetails = () => {
    if (currentNotification) {
      setOpenSnackbar(false);
      setDetailDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
  };

  const handleOpenForm = () => {
    if (currentNotification) {
      onNotificationClick(currentNotification.data);
      setDetailDialogOpen(false);
    }
  };

  const getNotificationSeverity = () => {
    if (currentNotification?.type === 'new_request') {
      return 'info' as const;
    }
    return 'success' as const;
  };

  const getNotificationAction = () => {
    if (currentNotification?.type === 'new_request') {
      return (
        <>
          <Button color="inherit" size="small" onClick={handleViewDetails}>
            View Details
          </Button>
          <Button color="inherit" size="small" onClick={handleOpenForm}>
            Open Form
          </Button>
        </>
      );
    }
    return null;
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={getNotificationSeverity()}
          action={getNotificationAction()}
          sx={{ width: '100%' }}
        >
          {currentNotification?.message}
        </Alert>
      </Snackbar>

      <Dialog open={detailDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Service Request Details
        </DialogTitle>
        <DialogContent>
          {currentNotification && (
            <div className="notification-details">
              <div className="notification-details__section">
                <h3>Title</h3>
                <p>{currentNotification.data.requestTitle}</p>
              </div>
              <div className="notification-details__section">
                <h3>Service Type</h3>
                <p>{currentNotification.data.serviceType}</p>
              </div>
              <div className="notification-details__section">
                <h3>Priority</h3>
                <p>{currentNotification.data.priority}</p>
              </div>
              <div className="notification-details__section">
                <h3>Address</h3>
                <p>
                  {currentNotification.data.addressLine1}<br />
                  {currentNotification.data.city}, {currentNotification.data.state} {currentNotification.data.postalCode}
                </p>
              </div>
              <div className="notification-details__section">
                <h3>Contact</h3>
                <p>
                  {currentNotification.data.contactName}<br />
                  {currentNotification.data.contactPhone}
                </p>
              </div>
              {currentNotification.data.notes && (
                <div className="notification-details__section">
                  <h3>Notes</h3>
                  <p>{currentNotification.data.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button onClick={handleOpenForm} variant="contained" color="primary">
            Open in Form
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Notifications;
