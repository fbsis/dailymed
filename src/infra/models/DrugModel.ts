import mongoose, { Schema, Document } from 'mongoose';

export interface IDrugDocument extends Document {
  name: string;
  identificationCode: string;
  indications: Array<{
    code: string;
    description: string;
  }>;
  dosage: {
    value: string;
    unit: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const DrugSchema = new Schema<IDrugDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    identificationCode: {
      type: String,
      required: true,
      unique: true
    },
    indications: [{
      code: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }],
    dosage: {
      value: {
        type: String,
        required: true
      },
      unit: {
        type: String,
        required: true,
        enum: ['mg', 'g']
      }
    }
  },
  {
    timestamps: true
  }
);

// Indexes
DrugSchema.index({ name: 1 });
DrugSchema.index({ identificationCode: 1 });

export const DrugModel = mongoose.model<IDrugDocument>('Drug', DrugSchema); 