import { Polybase } from '@polybase/client';

export const polybase = new Polybase({
  defaultNamespace: process.env.NEXT_PUBLIC_POLYBASE_DEFAULT_NAMESPACE,
});
