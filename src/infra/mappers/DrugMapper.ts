import { Drug } from "@/domain/entities/Drug";
import { DrugName } from "@/domain/value-objects/DrugName";
import { IdentificationCode } from "@/domain/value-objects/IdentificationCode";
import { Indication } from "@/domain/entities/Indication";
import { Dosage } from "@/domain/entities/Dosage";
import { IDrugDocument } from "../models/DrugModel";
import { Condition } from "@/domain/value-objects/Condition";
import { Description } from "@/domain/value-objects/Description";
import { IndicationCode } from "@/domain/value-objects/IndicationCode";
import { DosageValue } from "@/domain/value-objects/DosageValue";
import { AgeRange } from "@/domain/value-objects/AgeRange";
import { AgeBasedDosage } from "@/domain/entities/AgeBasedDosage";
import { AgeGroups } from "@/domain/entities/AgeGroups";
import { WeightRange } from "@/domain/value-objects/WeightRange";

export class DrugMapper {
  static toDomain(doc: IDrugDocument): Drug {
    const indications = doc.indications.map(
      (ind) =>
        new Indication(
          new IndicationCode(ind.code),
          new Condition(ind.description),
          new Description(ind.description)
        )
    );

    const dosage = new Dosage(
      [new Description(doc.dosage.value)],
      new AgeGroups([
        new AgeBasedDosage(
          new AgeRange(0, 12, "years"),
          new Map([
            [new WeightRange(0, 12, "kg"), new DosageValue(doc.dosage.value)],
          ])
        ),
      ])
    );

    return new Drug(
      new DrugName(doc.name),
      new IdentificationCode(doc.identificationCode),
      indications,
      dosage
    );
  }

  static toPersistence(drug: Drug): Pick<IDrugDocument, 'name' | 'identificationCode' | 'indications' | 'dosage'> {
    return {
      name: drug.getName().getValue(),
      identificationCode: drug.getIdentificationCode().getValue(),
      indications: drug.getIndications().map((ind) => ({
        code: ind.getCode().getValue(),
        description: ind.getDescription().getValue(),
      })),
      dosage: {
        value: drug.getDosage().getImportantAdministrationInstructions()[0].getValue(),
        unit: drug.getDosage().getImportantAdministrationInstructions()[0].getValue().split(" ")[1],
      },
    };
  }
}
