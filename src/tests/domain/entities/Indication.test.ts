import { Indication } from '@/domain/entities/Indication';
import { IndicationCode } from '@/domain/value-objects/IndicationCode';
import { Condition } from '@/domain/value-objects/Condition';
import { Description } from '@/domain/value-objects/Description';

describe('Indication', () => {
  let code: IndicationCode;
  let condition: Condition;
  let description: Description;
  let limitations: Description;

  beforeEach(() => {
    code = new IndicationCode('1.1');
    condition = new Condition('Atopic Dermatitis');
    description = new Description('Dupixent is indicated for the treatment of adult and pediatric patients aged 6 months and older with moderate-to-severe atopic dermatitis (AD) whose disease is not adequately controlled with topical prescription therapies or when those therapies are not advisable.');
    limitations = new Description('Dupixent is not indicated for the relief of acute bronchospasm or status asthmaticus.');
  });

  describe('instantiation', () => {
    it('should exist', () => {
      expect(Indication).toBeDefined();
    });

    it('should be instantiable with valid parameters', () => {
      const indication = new Indication(code, condition, description);
      expect(indication).toBeInstanceOf(Indication);
    });

    it('should be instantiable with optional limitations', () => {
      const indication = new Indication(code, condition, description, limitations);
      expect(indication).toBeInstanceOf(Indication);
    });
  });

  describe('getters', () => {
    it('should return correct code', () => {
      const indication = new Indication(code, condition, description);
      expect(indication.getCode()).toBe(code);
    });

    it('should return correct condition', () => {
      const indication = new Indication(code, condition, description);
      expect(indication.getCondition()).toBe(condition);
    });

    it('should return correct description', () => {
      const indication = new Indication(code, condition, description);
      expect(indication.getDescription()).toBe(description);
    });

    it('should return undefined limitations when not provided', () => {
      const indication = new Indication(code, condition, description);
      expect(indication.getLimitations()).toBeUndefined();
    });

    it('should return correct limitations when provided', () => {
      const indication = new Indication(code, condition, description, limitations);
      expect(indication.getLimitations()).toBe(limitations);
    });
  });
}); 