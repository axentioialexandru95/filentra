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

declare module 'prop-types' {
    const PropTypes: unknown;
    export = PropTypes;
}
