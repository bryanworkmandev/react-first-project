import { describe, it, expect } from 'vitest'
import {
  SERVICE_TYPES,
  PRIORITY_OPTIONS,
  STATE_OPTIONS,
  AVAILABILITY_WINDOWS,
  DELIVERABLE_OPTIONS,
  getInitialFormState,
  getEditableFields
} from './constants'

describe('Constants', () => {
  describe('SERVICE_TYPES', () => {
    it('contains expected service types', () => {
      expect(SERVICE_TYPES).toHaveLength(5)
      expect(SERVICE_TYPES[0]).toEqual({
        value: 'site_inspection',
        label: 'On-site Inspection'
      })
      expect(SERVICE_TYPES[1]).toEqual({
        value: 'photo_capture',
        label: 'Photo Capture'
      })
      expect(SERVICE_TYPES[2]).toEqual({
        value: 'document_pickup',
        label: 'Document Retrieval'
      })
    })
  })

  describe('PRIORITY_OPTIONS', () => {
    it('contains expected priority levels', () => {
      expect(PRIORITY_OPTIONS).toHaveLength(3)
      expect(PRIORITY_OPTIONS[0]).toEqual({
        value: 'standard',
        label: 'Standard (3-5 business days)'
      })
      expect(PRIORITY_OPTIONS[1]).toEqual({
        value: 'expedited',
        label: 'Expedited (48 hours)'
      })
      expect(PRIORITY_OPTIONS[2]).toEqual({
        value: 'rush',
        label: 'Rush (24 hours)'
      })
    })
  })

  describe('STATE_OPTIONS', () => {
    it('contains expected states', () => {
      expect(STATE_OPTIONS).toHaveLength(50) // All US states
      expect(STATE_OPTIONS[0]).toEqual({
        value: 'AL',
        label: 'AL'
      })
      expect(STATE_OPTIONS[49]).toEqual({
        value: 'WY',
        label: 'WY'
      })
    })
  })

  describe('AVAILABILITY_WINDOWS', () => {
    it('contains expected time windows', () => {
      expect(AVAILABILITY_WINDOWS).toHaveLength(3)
      expect(AVAILABILITY_WINDOWS[0]).toEqual({
        value: 'business_hours',
        label: 'Weekdays (8am - 5pm)'
      })
      expect(AVAILABILITY_WINDOWS[1]).toEqual({
        value: 'after_hours',
        label: 'Evenings / Weekends'
      })
      expect(AVAILABILITY_WINDOWS[2]).toEqual({
        value: 'on_call',
        label: 'On-call / Flexible'
      })
    })
  })

  describe('DELIVERABLE_OPTIONS', () => {
    it('contains expected deliverable options', () => {
      expect(DELIVERABLE_OPTIONS).toHaveLength(3)
      expect(DELIVERABLE_OPTIONS[0]).toEqual({
        value: 'exterior_photos',
        label: 'Exterior Photos'
      })
      expect(DELIVERABLE_OPTIONS[1]).toEqual({
        value: 'damage_assessment',
        label: 'Damage Assessment'
      })
      expect(DELIVERABLE_OPTIONS[2]).toEqual({
        value: 'document_upload',
        label: 'Document Upload'
      })
    })
  })

  describe('getInitialFormState', () => {
    it('returns initial state for internal role', () => {
      const state = getInitialFormState('internal')
      
      expect(state).toEqual({
        requestTitle: '',
        serviceType: 'site_inspection',
        priority: 'standard',
        clientAccount: '',
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
        contactName: '',
        contactPhone: '',
        preferredDate: '',
        availabilityWindow: 'business_hours',
        requiredDeliverables: [],
        notes: ''
      })
    })

    it('returns initial state for external role', () => {
      const state = getInitialFormState('external')
      
      expect(state).toEqual({
        requestTitle: '',
        serviceType: 'site_inspection',
        priority: 'standard',
        clientAccount: 'External Client Account',
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
        contactName: '',
        contactPhone: '',
        preferredDate: '',
        availabilityWindow: 'business_hours',
        requiredDeliverables: [],
        notes: ''
      })
    })
  })

  describe('getEditableFields', () => {
    it('returns editable fields for internal role', () => {
      const fields = getEditableFields('internal')
      
      expect(fields).toEqual({
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
        requiredDeliverables: false,
        notes: false
      })
    })

    it('returns editable fields for external role', () => {
      const fields = getEditableFields('external')
      
      expect(fields).toEqual({
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
        requiredDeliverables: true,
        notes: true
      })
    })
  })
})
