import faker from 'faker';
import runSpec from '../../../testUtils/runSpec';

runSpec(vest => {
  const { test, validate } = vest;

  const createSuite = tests => {
    validate(faker.random.word(), tests);
  };

  describe('Draft', () => {
    it('Should be exposed as a function from vest', () => {
      createSuite(() => {
        expect(typeof vest.draft).toBe('function');
      });
    });

    it('Should return a deep copy on each run', () => {
      createSuite(() => {
        const a = vest.draft();
        const b = vest.draft();
        expect(a).isDeepCopyOf(b);
      });
    });
    it('Should only contain has/get callbacks', () => {
      createSuite(() => {
        expect(typeof vest.draft().hasErrors).toBe('function');
        expect(typeof vest.draft().getErrors).toBe('function');
        expect(typeof vest.draft().hasWarnings).toBe('function');
        expect(typeof vest.draft().getWarnings).toBe('function');
        expect(typeof vest.draft().done).not.toBe('function');
        expect(typeof vest.draft().cancel).not.toBe('function');
      });
    });

    it('Should contain intermediate test result', () => {
      // This test is so long because it tests `draft` throughout
      // A suite's life cycle, both as an argument, and as an import
      createSuite(() => {
        expect(vest.draft().errorCount).toBe(0);
        expect(vest.draft().warnCount).toBe(0);
        expect(vest.draft().hasErrors()).toBe(false);
        expect(vest.draft().hasWarnings()).toBe(false);
        expect(vest.draft().hasErrors('field1')).toBe(false);
        test('field1', 'message', () => expect(1).toBe(2));
        expect(vest.draft().errorCount).toBe(1);
        expect(vest.draft().warnCount).toBe(0);
        expect(vest.draft().hasErrors()).toBe(true);
        expect(vest.draft().hasErrors('field1')).toBe(true);
        expect(vest.draft().hasWarnings()).toBe(false);
        test('field2', 'message', () => expect(2).toBe(2));
        expect(vest.draft().errorCount).toBe(1);
        expect(vest.draft().warnCount).toBe(0);
        expect(vest.draft().hasErrors()).toBe(true);
        expect(vest.draft().hasWarnings()).toBe(false);
        expect(vest.draft().hasWarnings('field3')).toBe(false);
        test('field3', 'message', () => {
          vest.warn();
          expect(2).toBe(1);
        });
        expect(vest.draft().errorCount).toBe(1);
        expect(vest.draft().warnCount).toBe(1);
        expect(vest.draft().hasErrors()).toBe(true);
        expect(vest.draft().hasWarnings()).toBe(true);
        expect(vest.draft().hasWarnings('field3')).toBe(true);
        test('field4', 'message', () => {
          vest.warn();
          return Promise.resolve();
        });
        expect(vest.draft().errorCount).toBe(1);
        expect(vest.draft().warnCount).toBe(1);
        expect(vest.draft().hasErrors()).toBe(true);
        expect(vest.draft().hasWarnings()).toBe(true);
        expect(vest.draft().hasWarnings('field4')).toBe(false);
      });
    });
  });
});
