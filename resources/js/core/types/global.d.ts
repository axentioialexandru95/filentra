import type { Ref, RefCallback } from 'react';
import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;

    namespace JSX {
        interface IntrinsicAttributes {
            ref?: Ref<unknown> | RefCallback<unknown>;
        }
    }
}

// Disable PropTypes in favor of TypeScript
declare module 'prop-types' {
    const PropTypes: unknown;
    export = PropTypes;
}
