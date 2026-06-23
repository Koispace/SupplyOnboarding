import { create } from 'zustand'

const generateEmptySku = () => ({
  id: crypto.randomUUID(),
  dbId: null,
  skuName: '',
  skuCode: '',
  variant: '',
  size: '',
  barcode: '',
  mrp: '',
  supplierCost: '',
  sellingPrice: '',
  status: 'draft'
})

export const useProductCreationStore = create((set, get) => ({
  currentStep: 1,
  productId: null,
  
  basicInfo: {
    name: '',
    category: '',
    shortDescription: '',
    longDescription: '',
    claims: []
  },

  assets: {
    nutritionLabel: null,
    ingredientLabel: null,
    packagingImages: [],
    barcodeFile: null,
    barcodeText: ''
  },

  compliance: {
    certifications: [],
    labReports: [],
    evidenceNotes: ''
  },

  skus: [generateEmptySku()],

  // Actions
  setCurrentStep: (step) => set({ currentStep: step }),
  setProductId: (id) => set({ productId: id }),
  
  updateBasicInfo: (data) => set((state) => ({
    basicInfo: { ...state.basicInfo, ...data }
  })),

  updateAssets: (data) => set((state) => ({
    assets: { ...state.assets, ...data }
  })),

  updateCompliance: (data) => set((state) => ({
    compliance: { ...state.compliance, ...data }
  })),

  addSku: () => set((state) => ({
    skus: [...state.skus, generateEmptySku()]
  })),

  updateSku: (id, field, value) => set((state) => ({
    skus: state.skus.map(sku => sku.id === id ? { ...sku, [field]: value } : sku)
  })),

  duplicateSku: (id) => set((state) => {
    const skuToCopy = state.skus.find(s => s.id === id)
    if (!skuToCopy) return state
    return {
      skus: [...state.skus, { 
        ...skuToCopy, 
        id: crypto.randomUUID(), 
        dbId: null, 
        skuCode: skuToCopy.skuCode ? `${skuToCopy.skuCode}-COPY` : '',
        skuName: skuToCopy.skuName ? `${skuToCopy.skuName} (Copy)` : ''
      }]
    }
  }),

  removeSku: (id) => set((state) => ({
    skus: state.skus.filter(sku => sku.id !== id)
  })),

  saveSkus: (dbSkus) => set((state) => {
    return { skus: state.skus.map(s => {
      const matched = dbSkus.find(db => db.sku_code === s.skuCode)
      if (matched) return { ...s, dbId: matched.id }
      return s
    })}
  }),

  resetStore: () => set({
    currentStep: 1,
    productId: null,
    basicInfo: {
      name: '',
      category: '',
      shortDescription: '',
      longDescription: '',
      claims: []
    },
    assets: {
      nutritionLabel: null,
      ingredientLabel: null,
      packagingImages: [],
      barcodeFile: null,
      barcodeText: ''
    },
    compliance: {
      certifications: [],
      labReports: [],
      evidenceNotes: ''
    },
    skus: [generateEmptySku()]
  })
}))
