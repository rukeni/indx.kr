type Case<T> = {
  when: boolean | (() => boolean);
  then: T;
};

type GivenConfig<T> = {
  cases: Case<T>[];
  defaultValue: T;
};

function evaluateCondition(condition: boolean | (() => boolean)): boolean {
  return typeof condition === 'boolean' ? condition : condition();
}

function findMatchingCase<T>(cases: Case<T>[]): Case<T> | null {
  return cases.find((caseItem) => evaluateCondition(caseItem.when)) || null;
}

function given<T>({ cases, defaultValue }: GivenConfig<T>): T {
  const matchingCase = findMatchingCase(cases);

  return matchingCase ? matchingCase.then : defaultValue;
}

export default given;
