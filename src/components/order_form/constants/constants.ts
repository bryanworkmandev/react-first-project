export type OrderFormProps = {
    role: string;
    loadedData?: any | null;
    showActions?: boolean;
};

export type InternalFormData = {
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
};

// Shared form data type for both internal and external users
export type FormData = {
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
};

export type Option = {
    value: string;
    label: string;
    description?: string;
};

export const SERVICE_TYPES: Option[] = [
    { value: "site_inspection", label: "On-site Inspection" },
    { value: "photo_capture", label: "Photo Capture" },
    { value: "document_pickup", label: "Document Retrieval" },
    { value: "vehicle_condition", label: "Vehicle Condition Report" },
    { value: "property_condition", label: "Property Condition Report" },
];

export const PRIORITY_OPTIONS: Option[] = [
    { value: "standard", label: "Standard (3-5 business days)" },
    { value: "expedited", label: "Expedited (48 hours)" },
    { value: "rush", label: "Rush (24 hours)" },
];

export const AVAILABILITY_WINDOWS: Option[] = [
    { value: "business_hours", label: "Weekdays (8am - 5pm)" },
    { value: "after_hours", label: "Evenings / Weekends" },
    { value: "on_call", label: "On-call / Flexible" },
];

export const DELIVERABLE_OPTIONS: Option[] = [
    { value: "exterior_photos", label: "Exterior Photos" },
    { value: "damage_assessment", label: "Damage Assessment" },
    { value: "document_upload", label: "Document Upload" },
];

export const STATE_OPTIONS: Option[] = [
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

export const getInitialInternalFormState = (): InternalFormData => ({
    requestTitle: "",
    serviceType: "site_inspection",
    priority: "standard",
    clientAccount: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    contactName: "",
    contactPhone: "",
    preferredDate: "",
    availabilityWindow: "business_hours",
    requiredDeliverables: [],
    notes: "",
});

export const getInitialFormState = (role: string): FormData => {
    const baseState = {
        requestTitle: "",
        serviceType: "site_inspection",
        priority: "standard",
        clientAccount: "",
        addressLine1: "",
        city: "",
        state: "",
        postalCode: "",
        contactName: "",
        contactPhone: "",
        preferredDate: "",
        availabilityWindow: "business_hours",
        requiredDeliverables: [],
        notes: "",
    };

    if (role === "external") {
        return {
            ...baseState,
            clientAccount: "External Client Account",
            requiredDeliverables: [],
        };
    }

    return {
        ...baseState,
        requiredDeliverables: [],
    };
};

// Configuration for which fields can be edited based on role
export const getEditableFields = (role: string): Record<keyof FormData, boolean> => {
    if (role === "external") {
        // External users can ONLY edit Deliverables & Notes
        return {
            requestTitle: false,
            serviceType: false,
            priority: false,
            clientAccount: false,
            addressLine1: false,
            city: false,
            state: false,
            postalCode: false,
            contactName: false,
            contactPhone: false,
            preferredDate: false,
            availabilityWindow: false,
            requiredDeliverables: true,   // External users can edit deliverables
            notes: true,                  // External users can edit notes
        };
    }

    // Internal users can edit everything EXCEPT Deliverables & Notes
    return {
        requestTitle: true,
        serviceType: true,
        priority: true,
        clientAccount: true,
        addressLine1: true,
        city: true,
        state: true,
        postalCode: true,
        contactName: true,
        contactPhone: true,
        preferredDate: true,
        availabilityWindow: true,
        requiredDeliverables: false,     // Internal users cannot edit deliverables
        notes: false,                    // Internal users cannot edit notes
    };
};