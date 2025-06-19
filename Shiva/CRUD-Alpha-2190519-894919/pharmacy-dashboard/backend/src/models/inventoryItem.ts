import mongoose, { Document, Schema } from 'mongoose';

// Define category groups enum
export enum CategoryGroup {
  CORE_MEDICATION = 'Core Medication',
  ADDITIONAL = 'Additional',
  ADMINISTRATIVE = 'Administrative'
}

// Define subcategories enum
export enum Subcategory {
  PRESCRIPTION = 'Prescription Medications',
  OTC = 'Over-the-Counter (OTC) Medications',
  MEDICAL_SUPPLIES = 'Medical Supplies',
  VITAMINS_SUPPLEMENTS = 'Vitamins and Supplements',
  PERSONAL_CARE = 'Personal Care Products',
  CONTROLLED_SUBSTANCES = 'Controlled Substances',
  INVENTORY_ATTRIBUTES = 'Inventory Attributes'
}

// Define categories enum
export enum Category {
  // Prescription Medications
  ANTIBIOTICS = 'Antibiotics',
  ANTIHYPERTENSIVES = 'Antihypertensives',
  ANTIDIABETICS = 'Antidiabetics',
  CARDIOVASCULAR = 'Cardiovascular',
  PAIN_MANAGEMENT = 'Pain Management',
  PSYCHIATRIC = 'Psychiatric',
  ANTICOAGULANTS = 'Anticoagulants',
  GASTROINTESTINAL = 'Gastrointestinal',
  RESPIRATORY = 'Respiratory',
  DERMATOLOGICAL = 'Dermatological',

  // OTC Medications
  PAIN_RELIEVERS = 'Pain Relievers',
  COUGH_COLD = 'Cough and Cold',
  ALLERGY = 'Allergy',
  DIGESTIVE_AIDS = 'Digestive Aids',
  SLEEP_AIDS = 'Sleep Aids',
  TOPICAL_TREATMENTS = 'Topical Treatments',

  // Medical Supplies
  FIRST_AID = 'First Aid',
  BANDAGES = 'Bandages and Dressings',
  SYRINGES = 'Syringes and Needles',
  GLUCOSE_MONITORING = 'Glucose Monitoring',
  MOBILITY_AIDS = 'Mobility Aids',

  // Vitamins and Supplements
  MULTIVITAMINS = 'Multivitamins',
  MINERALS = 'Minerals',
  HERBAL = 'Herbal Supplements',
  PROTEIN = 'Protein Supplements',
  SPECIALTY_SUPPLEMENTS = 'Specialty Supplements',

  // Personal Care
  SKIN_CARE = 'Skin Care',
  DENTAL_CARE = 'Dental Care',
  EYE_CARE = 'Eye Care',
  BABY_CARE = 'Baby Care',
  FEMININE_HYGIENE = 'Feminine Hygiene',

  // Controlled Substances
  SCHEDULE_II = 'Schedule II',
  SCHEDULE_III = 'Schedule III',
  SCHEDULE_IV = 'Schedule IV',
  SCHEDULE_V = 'Schedule V',
  
  // Inventory Attributes
  TEMPERATURE_CONTROLLED = 'Temperature-controlled',
  REFRIGERATED = 'Refrigerated',
  SPECIALTY = 'Specialty',
  RECALL_AFFECTED = 'Recall-affected',
  EXPIRING = 'Expiring'
}

// Category to subcategory mapping
export const CATEGORY_SUBCATEGORY_MAP: Record<Category, Subcategory> = {
  // Prescription Medications
  [Category.ANTIBIOTICS]: Subcategory.PRESCRIPTION,
  [Category.ANTIHYPERTENSIVES]: Subcategory.PRESCRIPTION,
  [Category.ANTIDIABETICS]: Subcategory.PRESCRIPTION,
  [Category.CARDIOVASCULAR]: Subcategory.PRESCRIPTION,
  [Category.PAIN_MANAGEMENT]: Subcategory.PRESCRIPTION,
  [Category.PSYCHIATRIC]: Subcategory.PRESCRIPTION,
  [Category.ANTICOAGULANTS]: Subcategory.PRESCRIPTION,
  [Category.GASTROINTESTINAL]: Subcategory.PRESCRIPTION,
  [Category.RESPIRATORY]: Subcategory.PRESCRIPTION,
  [Category.DERMATOLOGICAL]: Subcategory.PRESCRIPTION,

  // OTC Medications
  [Category.PAIN_RELIEVERS]: Subcategory.OTC,
  [Category.COUGH_COLD]: Subcategory.OTC,
  [Category.ALLERGY]: Subcategory.OTC,
  [Category.DIGESTIVE_AIDS]: Subcategory.OTC,
  [Category.SLEEP_AIDS]: Subcategory.OTC,
  [Category.TOPICAL_TREATMENTS]: Subcategory.OTC,

  // Medical Supplies
  [Category.FIRST_AID]: Subcategory.MEDICAL_SUPPLIES,
  [Category.BANDAGES]: Subcategory.MEDICAL_SUPPLIES,
  [Category.SYRINGES]: Subcategory.MEDICAL_SUPPLIES,
  [Category.GLUCOSE_MONITORING]: Subcategory.MEDICAL_SUPPLIES,
  [Category.MOBILITY_AIDS]: Subcategory.MEDICAL_SUPPLIES,

  // Vitamins and Supplements
  [Category.MULTIVITAMINS]: Subcategory.VITAMINS_SUPPLEMENTS,
  [Category.MINERALS]: Subcategory.VITAMINS_SUPPLEMENTS,
  [Category.HERBAL]: Subcategory.VITAMINS_SUPPLEMENTS,
  [Category.PROTEIN]: Subcategory.VITAMINS_SUPPLEMENTS,
  [Category.SPECIALTY_SUPPLEMENTS]: Subcategory.VITAMINS_SUPPLEMENTS,

  // Personal Care
  [Category.SKIN_CARE]: Subcategory.PERSONAL_CARE,
  [Category.DENTAL_CARE]: Subcategory.PERSONAL_CARE,
  [Category.EYE_CARE]: Subcategory.PERSONAL_CARE,
  [Category.BABY_CARE]: Subcategory.PERSONAL_CARE,
  [Category.FEMININE_HYGIENE]: Subcategory.PERSONAL_CARE,

  // Controlled Substances
  [Category.SCHEDULE_II]: Subcategory.CONTROLLED_SUBSTANCES,
  [Category.SCHEDULE_III]: Subcategory.CONTROLLED_SUBSTANCES,
  [Category.SCHEDULE_IV]: Subcategory.CONTROLLED_SUBSTANCES,
  [Category.SCHEDULE_V]: Subcategory.CONTROLLED_SUBSTANCES,
  
  // Inventory Attributes
  [Category.TEMPERATURE_CONTROLLED]: Subcategory.INVENTORY_ATTRIBUTES,
  [Category.REFRIGERATED]: Subcategory.INVENTORY_ATTRIBUTES,
  [Category.SPECIALTY]: Subcategory.INVENTORY_ATTRIBUTES,
  [Category.RECALL_AFFECTED]: Subcategory.INVENTORY_ATTRIBUTES,
  [Category.EXPIRING]: Subcategory.INVENTORY_ATTRIBUTES
}

// Define storage types
export enum StorageType {
  ROOM_TEMPERATURE = 'Room Temperature',
  REFRIGERATED = 'Refrigerated',
  SPECIALTY = 'Specialty Storage',
}

// Define notification types for preference settings
export enum NotificationType {
  LOW_STOCK = 'Low Stock',
  OUT_OF_STOCK = 'Out of Stock',
  EXPIRY_30_DAYS = 'Expiry 30 Days',
  EXPIRY_60_DAYS = 'Expiry 60 Days',
  EXPIRY_90_DAYS = 'Expiry 90 Days',
  PRICE_CHANGE = 'Price Change'
}

// Interface for InventoryItem document
export interface IInventoryItem extends Document {
  name: string;
  description: string;
  sku: string;
  category: Category;
  subcategory?: Subcategory;
  categoryGroup?: CategoryGroup;
  price: number;
  cost: number;
  quantity: number;
  reorderLevel: number;
  autoFillEnabled: boolean;
  autoFillQuantity: number;
  expiryDate: Date;
  batchNumber: string;
  manufacturer: string;
  storageType: StorageType;
  isControlledSubstance: boolean;
  priceHistory: { price: number; date: Date }[];
  notificationPreferences: NotificationType[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema for InventoryItem
const InventoryItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, enum: Object.values(Category), required: true },
    subcategory: { 
      type: String, 
      enum: Object.values(Subcategory),
      // Virtual field, calculated from category
    },
    categoryGroup: {
      type: String,
      enum: Object.values(CategoryGroup),
      // Virtual field, calculated from subcategory
    },
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
    reorderLevel: { type: Number, required: true, default: 10 },
    autoFillEnabled: { type: Boolean, default: false },
    autoFillQuantity: { type: Number, default: 20 },
    priceHistory: [{
      price: { type: Number },
      date: { type: Date, default: Date.now }
    }],
    notificationPreferences: [{
      type: String,
      enum: Object.values(NotificationType),
      default: [NotificationType.LOW_STOCK, NotificationType.OUT_OF_STOCK]
    }],
    expiryDate: { type: Date },
    batchNumber: { type: String },
    manufacturer: { type: String },
    storageType: { 
      type: String, 
      enum: Object.values(StorageType), 
      default: StorageType.ROOM_TEMPERATURE 
    },
    isControlledSubstance: { type: Boolean, default: false },
  },  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for subcategory - derived from category
InventoryItemSchema.virtual('subcategory').get(function(this: IInventoryItem) {
  return CATEGORY_SUBCATEGORY_MAP[this.category as Category];
});

// Map subcategories to category groups
const SUBCATEGORY_GROUP_MAP: Record<Subcategory, CategoryGroup> = {
  [Subcategory.PRESCRIPTION]: CategoryGroup.CORE_MEDICATION,
  [Subcategory.OTC]: CategoryGroup.CORE_MEDICATION,
  [Subcategory.MEDICAL_SUPPLIES]: CategoryGroup.ADDITIONAL,
  [Subcategory.VITAMINS_SUPPLEMENTS]: CategoryGroup.ADDITIONAL,
  [Subcategory.PERSONAL_CARE]: CategoryGroup.ADDITIONAL,
  [Subcategory.CONTROLLED_SUBSTANCES]: CategoryGroup.ADMINISTRATIVE,
  [Subcategory.INVENTORY_ATTRIBUTES]: CategoryGroup.ADMINISTRATIVE
};

// Virtual for category group - derived from subcategory
InventoryItemSchema.virtual('categoryGroup').get(function(this: IInventoryItem) {
  const subcategory = CATEGORY_SUBCATEGORY_MAP[this.category as Category];
  return SUBCATEGORY_GROUP_MAP[subcategory];
});

export default mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema);
