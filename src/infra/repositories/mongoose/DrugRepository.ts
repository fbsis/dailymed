import { Drug } from '@/domain/entities/Drug';
import { DrugRepository } from '@/domain/repositories/DrugRepository';
import { DrugModel } from '@/infra/models/DrugModel';
import { DrugMapper } from '@/infra/mappers/DrugMapper';

export class MongooseDrugRepository implements DrugRepository {
  async findByName(name: string): Promise<Drug | null> {
    const drugDoc = await DrugModel.findOne({ name: name.toLowerCase() });
    return drugDoc ? DrugMapper.toDomain(drugDoc) : null;
  }

  async save(drug: Drug): Promise<void> {
    const drugDoc = DrugMapper.toPersistence(drug);
    await DrugModel.create(drugDoc);
  }

  async findAll(): Promise<Drug[]> {
    const drugDocs = await DrugModel.find();
    return drugDocs.map(DrugMapper.toDomain);
  }

  async update(drug: Drug): Promise<void> {
    const drugDoc = DrugMapper.toPersistence(drug);
    const updatedDoc = await DrugModel.findOneAndUpdate(
      { name: drug.getName().getValue().toLowerCase() },
      drugDoc,
      { new: true }
    );

    if (!updatedDoc) {
      throw new Error('Drug not found for update');
    }

    return
  }

  async delete(name: string): Promise<void> {
    await DrugModel.deleteOne({ name: name.toLowerCase() });
  }
} 