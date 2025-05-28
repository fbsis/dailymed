import { IndicationCode } from '../value-objects/IndicationCode';
import { Condition } from '../value-objects/Condition';
import { Description } from '../value-objects/Description';

export class Indication {
  constructor(
    private readonly code: IndicationCode,
    private readonly condition: Condition,
    private readonly description: Description,
    private readonly limitations?: Description
  ) {}

  getCode(): IndicationCode {
    return this.code;
  }

  getCondition(): Condition {
    return this.condition;
  }

  getDescription(): Description {
    return this.description;
  }

  getLimitations(): Description | undefined {
    return this.limitations;
  }
} 