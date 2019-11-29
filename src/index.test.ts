import test from 'ava';

import { answer } from '.';

test('answer', t => {
  t.is(answer, 42);
});
