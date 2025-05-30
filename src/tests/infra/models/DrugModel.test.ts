import { DrugModel, IDrugDocument } from '@/infra/models/DrugModel';

describe('Drug Model', () => {
  it('should be defined', () => {
    expect(DrugModel).toBeDefined();
  });

  it('should have the correct schema properties', () => {
    const schema = DrugModel.schema.obj;
    
    expect(schema).toHaveProperty('name');
    expect(schema).toHaveProperty('identificationCode');
    expect(schema).toHaveProperty('indications');
    expect(schema).toHaveProperty('dosage');

    expect(schema.name).toHaveProperty('type', String);
    expect(schema.name).toHaveProperty('required', true);
    expect(schema.name).toHaveProperty('unique', true);

    expect(schema.identificationCode).toHaveProperty('type', String);
    expect(schema.identificationCode).toHaveProperty('required', true);
    expect(schema.identificationCode).toHaveProperty('unique', true);
  });

}); 