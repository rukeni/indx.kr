function given<T>({
  cases,
  defaultValue,
}: {
  cases: Array<{
    when: boolean | (() => boolean);
    then: T;
  }>;
  defaultValue: T;
}): T {
  if (cases.length === 0) return defaultValue;

  for (const { when, then } of cases) {
    if (typeof when === 'boolean' && when) {
      return then;
    }
    if (typeof when === 'function' && when()) {
      return then;
    }
  }

  return defaultValue;
}

export default given;
