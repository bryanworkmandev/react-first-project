import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import "./service_request_form.scss";
import type { FormData, OrderFormProps } from "../../constants/constants";
import {
  AVAILABILITY_WINDOWS,
  PRIORITY_OPTIONS,
  SERVICE_TYPES,
  STATE_OPTIONS,
  getInitialFormState,
  getEditableFields,
} from "../../constants/constants";
import {
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DeliverablesAndNotes from "../deliverables_and_notes/deliverables_and_notes";
import { ablyService } from "../../../../services/ablyService";
import type { ServiceRequestData } from "../../../../services/ablyService";

function ServiceRequestForm({ role, loadedData, showActions = true }: OrderFormProps) {
  const [formData, setFormData] = useState<FormData>(() => getInitialFormState(role));
  const [editableFields, setEditableFields] = useState(() => getEditableFields(role));

  useEffect(() => {
    setFormData(getInitialFormState(role));
    setEditableFields(getEditableFields(role));
  }, [role]);

  // Load data from notification when it's provided
  useEffect(() => {
    if (loadedData) {
      const loadedFormData: FormData = {
        requestTitle: loadedData.requestTitle || '',
        serviceType: loadedData.serviceType || '',
        priority: loadedData.priority || '',
        clientAccount: loadedData.clientAccount || '',
        addressLine1: loadedData.addressLine1 || '',
        city: loadedData.city || '',
        state: loadedData.state || '',
        postalCode: loadedData.postalCode || '',
        contactName: loadedData.contactName || '',
        contactPhone: loadedData.contactPhone || '',
        preferredDate: loadedData.preferredDate || '',
        availabilityWindow: loadedData.availabilityWindow || '',
        requiredDeliverables: loadedData.requiredDeliverables || [],
        notes: loadedData.notes || '',
      };
      setFormData(loadedFormData);
    }
  }, [loadedData]);

  const handleFormDataChange = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleTextChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      if (!name || !editableFields[name as keyof FormData]) {
        return;
      }
      handleFormDataChange({ [name]: value });
    },
    [editableFields, handleFormDataChange]
  );

  const handleSelectChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      if (!name || !editableFields[name as keyof FormData]) {
        return;
      }
      handleFormDataChange({ [name]: value });
    },
    [editableFields, handleFormDataChange]
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const submittedFormData = {
        ...formData,
        requiredDeliverables: [...formData.requiredDeliverables],
      };

      // Create a unique ID for this request
      const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Convert FormData to ServiceRequestData format
      const serviceRequestData: ServiceRequestData = {
        id: requestId,
        requestTitle: submittedFormData.requestTitle,
        serviceType: submittedFormData.serviceType,
        priority: submittedFormData.priority,
        clientAccount: submittedFormData.clientAccount,
        addressLine1: submittedFormData.addressLine1,
        city: submittedFormData.city,
        state: submittedFormData.state,
        postalCode: submittedFormData.postalCode,
        contactName: submittedFormData.contactName,
        contactPhone: submittedFormData.contactPhone,
        preferredDate: submittedFormData.preferredDate,
        availabilityWindow: submittedFormData.availabilityWindow,
        requiredDeliverables: submittedFormData.requiredDeliverables,
        notes: submittedFormData.notes,
      };

      try {
        if (role === 'internal') {
          // Internal user submits a request → notify external user
          await ablyService.publishNewRequest(serviceRequestData, 'internal');
        } else {
          // External user completes a request → notify internal user
          await ablyService.publishCompletion(serviceRequestData, 'external');
        }
      } catch (error) {
        console.error('Error publishing notification:', error);
      }
    },
    [formData, role]
  );

  const handleReset = useCallback(() => {
    setFormData(getInitialFormState(role));
  }, [role]);

  const isFieldEditable = (fieldName: keyof FormData) => {
    return editableFields[fieldName];
  };

  const getFormTitle = () => {
    return role === "internal" ? "Internal Service Request" : "External Service Request";
  };

  const getFormDescription = () => {
    return role === "internal" 
      ? "Capture the essential details needed to dispatch a field services scout. Tailor the deliverables and notes as needed."
      : "Submit your service request. Some fields are pre-filled and cannot be modified.";
  };

  return (
    <div className="service-request-form">
      <div className="service-request-form__card" role="region" aria-live="polite">
        <header className="service-request-form__header">
          <h1 className="service-request-form__title">{getFormTitle()}</h1>
          <p className="service-request-form__description">
            {getFormDescription()}
          </p>
        </header>
        <form className="service-request-form__form" onSubmit={handleSubmit}>
          <fieldset className="service-request-form__fieldset">
            <legend className="service-request-form__legend">Request Summary</legend>
            <div className="service-request-form__fields">
              <div className="service-request-form__field service-request-form__field--span">
                <TextField
                  id="requestTitle"
                  name="requestTitle"
                  label="Request title"
                  value={formData.requestTitle}
                  onChange={handleTextChange}
                  placeholder="Example: Storm damage inspection"
                  autoComplete="off"
                  required
                  fullWidth
                  disabled={!isFieldEditable("requestTitle")}
                  slotProps={{
                    input: {
                      endAdornment: formData.requestTitle && isFieldEditable("requestTitle") ? (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Clear"
                            edge="end"
                            onClick={() => handleFormDataChange({ requestTitle: "" })}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                />
              </div>

              <div className="service-request-form__field">
                <TextField
                  select
                  id="serviceType"
                  name="serviceType"
                  label="Service type"
                  value={formData.serviceType}
                  onChange={handleSelectChange}
                  fullWidth
                  disabled={!isFieldEditable("serviceType")}
                >
                  {SERVICE_TYPES.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              <div className="service-request-form__field">
                <TextField
                  select
                  id="priority"
                  name="priority"
                  label="Priority"
                  value={formData.priority}
                  onChange={handleSelectChange}
                  fullWidth
                  disabled={!isFieldEditable("priority")}
                >
                  {PRIORITY_OPTIONS.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              <div className="service-request-form__field">
                <TextField
                  id="clientAccount"
                  name="clientAccount"
                  label="Client account"
                  value={formData.clientAccount}
                  onChange={handleTextChange}
                  placeholder="Carrier or enterprise client name"
                  autoComplete="organization"
                  required
                  fullWidth
                  disabled={!isFieldEditable("clientAccount")}
                  slotProps={{
                    input: {
                      endAdornment: formData.clientAccount && isFieldEditable("clientAccount") ? (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Clear"
                            edge="end"
                            onClick={() => handleFormDataChange({ clientAccount: "" })}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="service-request-form__fieldset">
            <legend className="service-request-form__legend">Location</legend>
            <div className="service-request-form__fields service-request-form__fields--address">
              <div className="service-request-form__field service-request-form__field--span">
                <TextField
                  id="addressLine1"
                  name="addressLine1"
                  label="Address"
                  value={formData.addressLine1}
                  onChange={handleTextChange}
                  placeholder="Street address"
                  autoComplete="address-line1"
                  required
                  fullWidth
                  disabled={!isFieldEditable("addressLine1")}
                  slotProps={{
                    input: {
                      endAdornment: formData.addressLine1 && isFieldEditable("addressLine1") ? (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Clear"
                            edge="end"
                            onClick={() => handleFormDataChange({ addressLine1: "" })}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                />
              </div>

              <div className="service-request-form__field">
                <TextField
                  id="city"
                  name="city"
                  label="City"
                  value={formData.city}
                  onChange={handleTextChange}
                  placeholder="City"
                  autoComplete="address-level2"
                  required
                  fullWidth
                  disabled={!isFieldEditable("city")}
                  slotProps={{
                    input: {
                      endAdornment: formData.city && isFieldEditable("city") ? (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Clear"
                            edge="end"
                            onClick={() => handleFormDataChange({ city: "" })}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                />
              </div>

              <div className="service-request-form__field">
                <TextField
                  select
                  id="state"
                  name="state"
                  label="State"
                  value={formData.state}
                  onChange={handleSelectChange}
                  required
                  fullWidth
                  disabled={!isFieldEditable("state")}
                  placeholder=""
                >
                  {STATE_OPTIONS.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              <div className="service-request-form__field">
                <TextField
                  id="postalCode"
                  name="postalCode"
                  label="Postal code"
                  value={formData.postalCode}
                  onChange={handleTextChange}
                  placeholder="ZIP"
                  autoComplete="postal-code"
                  required
                  fullWidth
                  inputProps={{ inputMode: "numeric" }}
                  disabled={!isFieldEditable("postalCode")}
                  slotProps={{
                    input: {
                      endAdornment: formData.postalCode && isFieldEditable("postalCode") ? (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Clear"
                            edge="end"
                            onClick={() => handleFormDataChange({ postalCode: "" })}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="service-request-form__fieldset">
            <legend className="service-request-form__legend">Contact & Scheduling</legend>
            <div className="service-request-form__fields">
              <div className="service-request-form__field">
                <TextField
                  id="contactName"
                  name="contactName"
                  label="Primary contact"
                  value={formData.contactName}
                  onChange={handleTextChange}
                  placeholder="Onsite contact name"
                  autoComplete="name"
                  required
                  fullWidth
                  disabled={!isFieldEditable("contactName")}
                  slotProps={{
                    input: {
                      endAdornment: formData.contactName && isFieldEditable("contactName") ? (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Clear"
                            edge="end"
                            onClick={() => handleFormDataChange({ contactName: "" })}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                />
              </div>

              <div className="service-request-form__field">
                <TextField
                  id="contactPhone"
                  name="contactPhone"
                  label="Contact phone"
                  value={formData.contactPhone}
                  onChange={handleTextChange}
                  placeholder="(555) 123-4567"
                  autoComplete="tel"
                  required
                  fullWidth
                  inputProps={{ inputMode: "tel" }}
                  disabled={!isFieldEditable("contactPhone")}
                  slotProps={{
                    input: {
                      endAdornment: formData.contactPhone && isFieldEditable("contactPhone") ? (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Clear"
                            edge="end"
                            onClick={() => handleFormDataChange({ contactPhone: "" })}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                />
              </div>

              <div className="service-request-form__field">
                <TextField
                  id="preferredDate"
                  name="preferredDate"
                  label="Preferred completion date"
                  type="date"
                  value={formData.preferredDate}
                  onChange={handleTextChange}
                  required
                  fullWidth
                  disabled={!isFieldEditable("preferredDate")}
                  InputLabelProps={{ shrink: true }}
                />
              </div>

              <div className="service-request-form__field">
                <TextField
                  select
                  id="availabilityWindow"
                  name="availabilityWindow"
                  label="Availability window"
                  value={formData.availabilityWindow}
                  onChange={handleSelectChange}
                  fullWidth
                  disabled={!isFieldEditable("availabilityWindow")}
                >
                  {AVAILABILITY_WINDOWS.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>
          </fieldset>

          <DeliverablesAndNotes
            formData={formData}
            onFormDataChange={handleFormDataChange}
            role={role}
          />

          {showActions && (
            <div className="service-request-form__actions">
              <Button type="submit" className="service-request-form__button" variant="contained">
                {role === "internal" ? "Submit Service Request" : "Complete Service Request"}
              </Button>
              <Button
                type="button"
                className="service-request-form__button service-request-form__button--secondary"
                variant="outlined"
                onClick={handleReset}
              >
                Reset form
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ServiceRequestForm;
