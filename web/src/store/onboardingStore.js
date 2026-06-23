import { create } from 'zustand'

const steps = [
  'welcome',
  'brand',
  'product',
  'compliance',
  'submitted',
]

export const useOnboardingStore = create((set, get) => ({
  currentStep: 'welcome',
  draftId: null,
  status: 'draft',

  brandData: {
    brandName: '',
    legalEntityName: '',
    website: '',
    salesChannels: [],
    brandDescription: '',
    contactName: '',
    designation: '',
    workEmail: '',
    phoneNumber: '',
    gstNumber: '',
    hqLocation: '',
  },

  productData: {
    catalogFile: null,
    categories: [],
    skus: [
      {
        productName: '',
        nutritionLabelMethod: 'upload',
        nutritionFile: null,
        nutritionLink: '',
        ingredientLabelMethod: 'upload',
        ingredientFile: null,
        ingredientLink: '',
      },
      {
        productName: '',
        nutritionLabelMethod: 'upload',
        nutritionFile: null,
        nutritionLink: '',
        ingredientLabelMethod: 'upload',
        ingredientFile: null,
        ingredientLink: '',
      },
      {
        productName: '',
        nutritionLabelMethod: 'upload',
        nutritionFile: null,
        nutritionLink: '',
        ingredientLabelMethod: 'upload',
        ingredientFile: null,
        ingredientLink: '',
      }
    ],
    skuVolume: '',
    healthDifferentiation: '',
  },

  complianceData: {
    fssaiFile: null,
    organicFiles: [],
    scientificEvidenceFiles: [],
    scientificEvidenceLinks: [],
    claimsSummary: '',
  },

  isSaving: false,
  lastSavedAt: null,

  // Basic Setters
  setField: (field, value) => set({ [field]: value }),

  updateBrandData: (data) =>
    set((state) => ({
      brandData: { ...state.brandData, ...data }
    })),

  updateProductData: (data) =>
    set((state) => ({
      productData: { ...state.productData, ...data }
    })),

  updateComplianceData: (data) =>
    set((state) => ({
      complianceData: { ...state.complianceData, ...data }
    })),

  // Navigation
  nextStep: () =>
    set((state) => ({
      currentStep:
        steps[Math.min(steps.indexOf(state.currentStep) + 1, steps.length - 1)]
    })),

  prevStep: () =>
    set((state) => ({
      currentStep:
        steps[Math.max(steps.indexOf(state.currentStep) - 1, 0)]
    })),

  setSaving: (status) => set({ isSaving: status }),

  // Actions
  saveDraft: async () => {
    // Handled in components or helper, just updates status here
    set({ lastSavedAt: new Date(), status: 'draft' })
  },

  submitOnboarding: async () => {
    // Handled in helper, just updates status here
    set({ status: 'submitted' })
  },

  loadDraft: (draftData) => {
    set({
      draftId: draftData.id,
      brandData: { ...get().brandData, ...draftData.brand_data },
      productData: { ...get().productData, ...draftData.product_data },
      complianceData: { ...get().complianceData, ...draftData.compliance_data },
      status: draftData.status,
    })
  },

  reset: () =>
    set({
      currentStep: 'welcome',
      draftId: null,
      status: 'draft',
      brandData: {
        brandName: '', legalEntityName: '', website: '', salesChannels: [], brandDescription: '', contactName: '', designation: '', workEmail: '', phoneNumber: '', gstNumber: '', hqLocation: '',
      },
      productData: {
        catalogFile: null, categories: [], skuVolume: '', healthDifferentiation: '',
        skus: [
          { productName: '', nutritionLabelMethod: 'upload', nutritionFile: null, nutritionLink: '', ingredientLabelMethod: 'upload', ingredientFile: null, ingredientLink: '' },
          { productName: '', nutritionLabelMethod: 'upload', nutritionFile: null, nutritionLink: '', ingredientLabelMethod: 'upload', ingredientFile: null, ingredientLink: '' },
          { productName: '', nutritionLabelMethod: 'upload', nutritionFile: null, nutritionLink: '', ingredientLabelMethod: 'upload', ingredientFile: null, ingredientLink: '' }
        ],
      },
      complianceData: {
        fssaiFile: null, organicFiles: [], scientificEvidenceFiles: [], scientificEvidenceLinks: [], claimsSummary: '',
      },
      isSaving: false,
      lastSavedAt: null
    })
}))