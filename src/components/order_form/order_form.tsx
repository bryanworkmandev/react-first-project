import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./order_form.scss";

type OrderFormProps = {
  role: string;
};

type InternalFormData = {
  lookTitle: string;
  lookType: string;
  priority: string;
  clientAccount: string;
  clientReference: string;
  workOrder: string;
  costCenter: string;
  propertyType: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  gpsCoordinates: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  preferredDate: string;
  availabilityWindow: string;
  accessInstructions: string;
  requiredDeliverables: string[];
  additionalDeliverables: string;
  assignScout: boolean;
  scoutName: string;
  qualityReview: boolean;
  internalNotes: string;
};

type Option = {
  value: string;
  label: string;
  description?: string;
};

const LOOK_TYPES: Option[] = [
  { value: "site_inspection", label: "On-site Inspection" },
  { value: "photo_capture", label: "Photo Capture" },
  { value: "document_pickup", label: "Document Retrieval" },
  { value: "vehicle_condition", label: "Vehicle Condition Report" },
  { value: "property_condition", label: "Property Condition Report" },
];

const PRIORITY_OPTIONS: Option[] = [
  { value: "standard", label: "Standard (3-5 business days)" },
  { value: "expedited", label: "Expedited (48 hours)" },
  { value: "rush", label: "Rush (24 hours)" },
];

const PROPERTY_TYPES: Option[] = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "vehicle", label: "Vehicle" },
  { value: "equipment", label: "Equipment" },
  { value: "other", label: "Other" },
];

const AVAILABILITY_WINDOWS: Option[] = [
  { value: "business_hours", label: "Weekdays (8am - 5pm)" },
  { value: "after_hours", label: "Evenings / Weekends" },
  { value: "on_call", label: "On-call / Flexible" },
];

const DELIVERABLE_OPTIONS: Option[] = [
  { value: "exterior_photos", label: "Exterior Photos" },
  { value: "interior_photos", label: "Interior Photos" },
  { value: "measurements", label: "Measurements" },
  { value: "damage_assessment", label: "Damage Assessment" },
  { value: "document_upload", label: "Document Upload" },
  { value: "signature_capture", label: "Signature Capture" },
];

const STATE_OPTIONS: Option[] = [
  { value: "AL", label: "AL" },
  { value: "AK", label: "AK" },
  { value: "AZ", label: "AZ" },
  { value: "AR", label: "AR" },
  { value: "CA", label: "CA" },
  { value: "CO", label: "CO" },
  { value: "CT", label: "CT" },
  { value: "DE", label: "DE" },
  { value: "FL", label: "FL" },
  { value: "GA", label: "GA" },
  { value: "HI", label: "HI" },
  { value: "ID", label: "ID" },
  { value: "IL", label: "IL" },
  { value: "IN", label: "IN" },
  { value: "IA", label: "IA" },
  { value: "KS", label: "KS" },
  { value: "KY", label: "KY" },
  { value: "LA", label: "LA" },
  { value: "ME", label: "ME" },
  { value: "MD", label: "MD" },
  { value: "MA", label: "MA" },
  { value: "MI", label: "MI" },
  { value: "MN", label: "MN" },
  { value: "MS", label: "MS" },
  { value: "MO", label: "MO" },
  { value: "MT", label: "MT" },
  { value: "NE", label: "NE" },
  { value: "NV", label: "NV" },
  { value: "NH", label: "NH" },
  { value: "NJ", label: "NJ" },
  { value: "NM", label: "NM" },
  { value: "NY", label: "NY" },
  { value: "NC", label: "NC" },
  { value: "ND", label: "ND" },
  { value: "OH", label: "OH" },
  { value: "OK", label: "OK" },
  { value: "OR", label: "OR" },
  { value: "PA", label: "PA" },
  { value: "RI", label: "RI" },
  { value: "SC", label: "SC" },
  { value: "SD", label: "SD" },
  { value: "TN", label: "TN" },
  { value: "TX", label: "TX" },
  { value: "UT", label: "UT" },
  { value: "VT", label: "VT" },
  { value: "VA", label: "VA" },
  { value: "WA", label: "WA" },
  { value: "WV", label: "WV" },
  { value: "WI", label: "WI" },
  { value: "WY", label: "WY" },
];

const getInitialInternalFormState = (): InternalFormData => ({
  lookTitle: "",
  lookType: "site_inspection",
  priority: "standard",
  clientAccount: "",
  clientReference: "",
  workOrder: "",
  costCenter: "",
  propertyType: "residential",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  gpsCoordinates: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  preferredDate: "",
  availabilityWindow: "business_hours",
  accessInstructions: "",
  requiredDeliverables: ["exterior_photos", "damage_assessment"],
  additionalDeliverables: "",
  assignScout: false,
  scoutName: "",
  qualityReview: true,
  internalNotes: "",
});

function OrderForm({ role }: OrderFormProps) {
  const [internalFormData, setInternalFormData] = useState<InternalFormData>(
    () => getInitialInternalFormState()
  );
  const [submittedInternalData, setSubmittedInternalData] =
    useState<InternalFormData | null>(null);

  const isInternalUser = useMemo(() => role === "internal", [role]);

  useEffect(() => {
    setInternalFormData(getInitialInternalFormState());
    setSubmittedInternalData(null);
  }, [role]);

  const handleInternalInputChange = useCallback(
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = event.target;
      setInternalFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleInternalBooleanChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event.target;
      setInternalFormData((prev) => {
        const next = {
          ...prev,
          [name]: checked,
        } as InternalFormData;

        if (name === "assignScout" && !checked) {
          next.scoutName = "";
        }

        return next;
      });
    },
    []
  );

  const handleDeliverablesChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = event.target;
      setInternalFormData((prev) => {
        const alreadySelected = prev.requiredDeliverables.includes(value);
        const requiredDeliverables = checked
          ? alreadySelected
            ? prev.requiredDeliverables
            : [...prev.requiredDeliverables, value]
          : prev.requiredDeliverables.filter((item) => item !== value);

        return {
          ...prev,
          requiredDeliverables,
        };
      });
    },
    []
  );

  const handleInternalSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmittedInternalData({
        ...internalFormData,
        requiredDeliverables: [...internalFormData.requiredDeliverables],
      });
    },
    [internalFormData]
  );

  if (!isInternalUser) {
    return (
      <div className="order-form">
        <div className="order-form__card">
          <header className="order-form__header">
            <h1 className="order-form__title">Order Form</h1>
            <p className="order-form__description">
              Forms for this role are coming soon. Switch to the internal user to
              create a WeGoLook request.
            </p>
          </header>
        </div>
      </div>
    );
  }

  return (
    <div className="order-form">
      <div className="order-form__card" role="region" aria-live="polite">
        <header className="order-form__header">
          <h1 className="order-form__title">Internal Look Request</h1>
          <p className="order-form__description">
            Capture the baseline details needed to dispatch a WeGoLook scout.
            Required deliverables default to our standard damage assessment
            package but can be tailored below.
          </p>
        </header>
        <form className="order-form__form" onSubmit={handleInternalSubmit}>
          <fieldset className="order-form__fieldset">
            <legend className="order-form__legend">Request Summary</legend>
            <div className="order-form__fields">
              <div className="order-form__field">
                <label htmlFor="lookTitle">Look title</label>
                <input
                  id="lookTitle"
                  name="lookTitle"
                  className="order-form__control"
                  value={internalFormData.lookTitle}
                  onChange={handleInternalInputChange}
                  placeholder="Example: Storm damage inspection"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="order-form__field">
                <label htmlFor="lookType">Look type</label>
                <select
                  id="lookType"
                  name="lookType"
                  className="order-form__control"
                  value={internalFormData.lookType}
                  onChange={handleInternalInputChange}
                >
                  {LOOK_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="order-form__field">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  className="order-form__control"
                  value={internalFormData.priority}
                  onChange={handleInternalInputChange}
                >
                  {PRIORITY_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="order-form__field">
                <label htmlFor="clientAccount">Client account</label>
                <input
                  id="clientAccount"
                  name="clientAccount"
                  className="order-form__control"
                  value={internalFormData.clientAccount}
                  onChange={handleInternalInputChange}
                  placeholder="Carrier or enterprise client name"
                  autoComplete="organization"
                  required
                />
              </div>

              <div className="order-form__field">
                <label htmlFor="clientReference">Client reference #</label>
                <input
                  id="clientReference"
                  name="clientReference"
                  className="order-form__control"
                  value={internalFormData.clientReference}
                  onChange={handleInternalInputChange}
                  placeholder="Ticket or claim number"
                  autoComplete="off"
                />
              </div>

              <div className="order-form__field">
                <label htmlFor="workOrder">Work order #</label>
                <input
                  id="workOrder"
                  name="workOrder"
                  className="order-form__control"
                  value={internalFormData.workOrder}
                  onChange={handleInternalInputChange}
                  placeholder="Optional internal tracking number"
                  autoComplete="off"
                />
              </div>

              <div className="order-form__field">
                <label htmlFor="costCenter">Cost center</label>
                <input
                  id="costCenter"
                  name="costCenter"
                  className="order-form__control"
                  value={internalFormData.costCenter}
                  onChange={handleInternalInputChange}
                  placeholder="Internal billing code"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="order-form__field">
                <label htmlFor="propertyType">Asset / property type</label>
                <select
                  id="propertyType"
                  name="propertyType"
                  className="order-form__control"
                  value={internalFormData.propertyType}
                  onChange={handleInternalInputChange}
                >
                  {PROPERTY_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset className="order-form__fieldset">
            <legend className="order-form__legend">Location</legend>
            <div className="order-form__fields order-form__fields--address">
              <div className="order-form__field order-form__field--span">
                <label htmlFor="addressLine1">Address</label>
                <input
                  id="addressLine1"
                  name="addressLine1"
                  className="order-form__control"
                  value={internalFormData.addressLine1}
                  onChange={handleInternalInputChange}
                  placeholder="Street address"
                  autoComplete="address-line1"
                  required
                />
              </div>

              <div className="order-form__field order-form__field--span">
                <label htmlFor="addressLine2">Address 2</label>
                <input
                  id="addressLine2"
                  name="addressLine2"
                  className="order-form__control"
                  value={internalFormData.addressLine2}
                  onChange={handleInternalInputChange}
                  placeholder="Suite or unit (optional)"
                  autoComplete="address-line2"
                />
              </div>

              <div className="order-form__field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  className="order-form__control"
                  value={internalFormData.city}
                  onChange={handleInternalInputChange}
                  placeholder="City"
                  autoComplete="address-level2"
                  required
                />
              </div>

              <div className="order-form__field">
                <label htmlFor="state">State</label>
                <select
                  id="state"
                  name="state"
                  className="order-form__control"
                  value={internalFormData.state}
                  onChange={handleInternalInputChange}
                  required
                >
                  <option value="" disabled>
                    Select state
                  </option>
                  {STATE_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="order-form__field">
                <label htmlFor="postalCode">Postal code</label>
                <input
                  id="postalCode"
                  name="postalCode"
                  className="order-form__control"
                  value={internalFormData.postalCode}
                  onChange={handleInternalInputChange}
                  placeholder="ZIP"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  required
                />
              </div>

              <div className="order-form__field order-form__field--span">
                <label htmlFor="gpsCoordinates">GPS coordinates</label>
                <input
                  id="gpsCoordinates"
                  name="gpsCoordinates"
                  className="order-form__control"
                  value={internalFormData.gpsCoordinates}
                  onChange={handleInternalInputChange}
                  placeholder="Optional latitude, longitude"
                  autoComplete="off"
                />
                <span className="order-form__hint">
                  Include when the property lacks a traditional street address.
                </span>
              </div>
            </div>
          </fieldset>

          <fieldset className="order-form__fieldset">
            <legend className="order-form__legend">Onsite Contact & Scheduling</legend>
            <div className="order-form__fields">
              <div className="order-form__field">
                <label htmlFor="contactName">Primary contact</label>
                <input
                  id="contactName"
                  name="contactName"
                  className="order-form__control"
                  value={internalFormData.contactName}
                  onChange={handleInternalInputChange}
                  placeholder="Onsite contact name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="order-form__field">
                <label htmlFor="contactPhone">Contact phone</label>
                <input
                  id="contactPhone"
                  name="contactPhone"
                  className="order-form__control"
                  value={internalFormData.contactPhone}
                  onChange={handleInternalInputChange}
                  placeholder="(555) 123-4567"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                />
              </div>

              <div className="order-form__field">
                <label htmlFor="contactEmail">Contact email</label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  className="order-form__control"
                  value={internalFormData.contactEmail}
                  onChange={handleInternalInputChange}
                  placeholder="contact@example.com"
                  autoComplete="email"
                  type="email"
                />
              </div>

              <div className="order-form__field">
                <label htmlFor="preferredDate">Preferred completion date</label>
                <input
                  id="preferredDate"
                  name="preferredDate"
                  className="order-form__control"
                  value={internalFormData.preferredDate}
                  onChange={handleInternalInputChange}
                  type="date"
                  required
                />
              </div>

              <div className="order-form__field">
                <label htmlFor="availabilityWindow">Availability window</label>
                <select
                  id="availabilityWindow"
                  name="availabilityWindow"
                  className="order-form__control"
                  value={internalFormData.availabilityWindow}
                  onChange={handleInternalInputChange}
                >
                  {AVAILABILITY_WINDOWS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="order-form__field order-form__field--span">
              <label htmlFor="accessInstructions">Access instructions</label>
              <textarea
                id="accessInstructions"
                name="accessInstructions"
                className="order-form__control order-form__control--textarea"
                value={internalFormData.accessInstructions}
                onChange={handleInternalInputChange}
                rows={3}
                placeholder="Gate codes, parking guidance, PPE requirements"
              />
            </div>
          </fieldset>

          <fieldset className="order-form__fieldset">
            <legend className="order-form__legend">Deliverables</legend>
            <div className="order-form__checkboxes">
              {DELIVERABLE_OPTIONS.map(({ value, label }) => (
                <label key={value} className="order-form__checkbox">
                  <input
                    type="checkbox"
                    name="requiredDeliverables"
                    value={value}
                    checked={internalFormData.requiredDeliverables.includes(
                      value
                    )}
                    onChange={handleDeliverablesChange}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <div className="order-form__field order-form__field--span">
              <label htmlFor="additionalDeliverables">Special instructions</label>
              <textarea
                id="additionalDeliverables"
                name="additionalDeliverables"
                className="order-form__control order-form__control--textarea"
                value={internalFormData.additionalDeliverables}
                onChange={handleInternalInputChange}
                rows={3}
                placeholder="List any additional evidence, forms, or data points to capture"
              />
            </div>
          </fieldset>

          <fieldset className="order-form__fieldset">
            <legend className="order-form__legend">Internal Routing</legend>
            <div className="order-form__toggles">
              <label className="order-form__checkbox order-form__checkbox--toggle">
                <input
                  type="checkbox"
                  name="assignScout"
                  checked={internalFormData.assignScout}
                  onChange={handleInternalBooleanChange}
                />
                <span>Pre-assign preferred scout</span>
              </label>

              <label className="order-form__checkbox order-form__checkbox--toggle">
                <input
                  type="checkbox"
                  name="qualityReview"
                  checked={internalFormData.qualityReview}
                  onChange={handleInternalBooleanChange}
                />
                <span>Include Quality Review checkpoint</span>
              </label>
            </div>

            {internalFormData.assignScout ? (
              <div className="order-form__field">
                <label htmlFor="scoutName">Preferred scout</label>
                <input
                  id="scoutName"
                  name="scoutName"
                  className="order-form__control"
                  value={internalFormData.scoutName}
                  onChange={handleInternalInputChange}
                  placeholder="Scout name or ID"
                  autoComplete="off"
                />
              </div>
            ) : null}

            <div className="order-form__field order-form__field--span">
              <label htmlFor="internalNotes">Internal notes</label>
              <textarea
                id="internalNotes"
                name="internalNotes"
                className="order-form__control order-form__control--textarea"
                value={internalFormData.internalNotes}
                onChange={handleInternalInputChange}
                rows={3}
                placeholder="Context for dispatchers, risk considerations, or escalation guidance"
              />
            </div>
          </fieldset>

          <div className="order-form__actions">
            <button type="submit" className="order-form__button">
              Create Look request
            </button>
            <button
              type="button"
              className="order-form__button order-form__button--secondary"
              onClick={() => {
                setInternalFormData(getInitialInternalFormState());
                setSubmittedInternalData(null);
              }}
            >
              Reset form
            </button>
          </div>
        </form>

        {submittedInternalData ? (
          <section className="order-form__summary" aria-live="polite">
            <h2 className="order-form__summary-title">Submission preview</h2>
            <div className="order-form__summary-grid">
              <div>
                <strong>Title</strong>
                <p>{submittedInternalData.lookTitle || "—"}</p>
              </div>
              <div>
                <strong>Look type</strong>
                <p>{
                  LOOK_TYPES.find(({ value }) => value === submittedInternalData.lookType)?.label ??
                  submittedInternalData.lookType
                }</p>
              </div>
              <div>
                <strong>Priority</strong>
                <p>{
                  PRIORITY_OPTIONS.find(({ value }) => value === submittedInternalData.priority)?.label ??
                  submittedInternalData.priority
                }</p>
              </div>
              <div>
                <strong>Client</strong>
                <p>{submittedInternalData.clientAccount || "—"}</p>
              </div>
              <div>
                <strong>Deliverables</strong>
                <p>
                  {submittedInternalData.requiredDeliverables.length > 0
                    ? submittedInternalData.requiredDeliverables
                        .map(
                          (item) =>
                            DELIVERABLE_OPTIONS.find(({ value }) => value === item)?.label || item
                        )
                        .join(", ")
                    : "None"}
                </p>
              </div>
              <div className="order-form__summary-notes">
                <strong>Notes</strong>
                <p>
                  {submittedInternalData.internalNotes ||
                    submittedInternalData.additionalDeliverables ||
                    "—"}
                </p>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

export default OrderForm;