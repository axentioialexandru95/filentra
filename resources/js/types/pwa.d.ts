declare module 'virtual:pwa-register' {
    export function registerSW(options?: {
        onNeedRefresh?: () => void;
        onOfflineReady?: () => void;
        onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
        onRegisterError?: (error: any) => void;
        immediate?: boolean;
    }): (reloadPage?: boolean) => Promise<void>;
}

declare module 'virtual:pwa-register/react' {
    import type { Dispatch, SetStateAction } from 'react';
    
    export function useRegisterSW(options?: {
        onNeedRefresh?: () => void;
        onOfflineReady?: () => void;
        onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
        onRegisterError?: (error: any) => void;
        immediate?: boolean;
    }): {
        needRefresh: [boolean, Dispatch<SetStateAction<boolean>>];
        offlineReady: [boolean, Dispatch<SetStateAction<boolean>>];
        updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
    };
}