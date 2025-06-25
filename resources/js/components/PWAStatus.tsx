import { useEffect, useState } from 'react';
import { RefreshCw, Wifi, WifiOff, X } from 'lucide-react';

interface PWAStatusProps {
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
}

export function PWAStatus({ onNeedRefresh, onOfflineReady }: PWAStatusProps) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showUpdateNotification, setShowUpdateNotification] = useState(false);
    const [showOfflineNotification, setShowOfflineNotification] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (onNeedRefresh) {
            setShowUpdateNotification(true);
        }
    }, [onNeedRefresh]);

    useEffect(() => {
        if (onOfflineReady && !isOnline) {
            setShowOfflineNotification(true);
        }
    }, [onOfflineReady, isOnline]);

    const handleRefresh = () => {
        window.location.reload();
    };

    const dismissUpdateNotification = () => {
        setShowUpdateNotification(false);
    };

    const dismissOfflineNotification = () => {
        setShowOfflineNotification(false);
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {/* Online/Offline Status */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isOnline 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
                {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            {/* Update Available Notification */}
            {showUpdateNotification && (
                <div className="bg-blue-100 border border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-200 px-4 py-3 rounded-md shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <RefreshCw size={16} />
                            <span className="text-sm font-medium">Update Available</span>
                        </div>
                        <button
                            onClick={dismissUpdateNotification}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <p className="text-xs mt-1">A new version is available. Refresh to update.</p>
                    <button
                        onClick={handleRefresh}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                        Refresh Now
                    </button>
                </div>
            )}

            {/* Offline Ready Notification */}
            {showOfflineNotification && (
                <div className="bg-green-100 border border-green-200 text-green-800 dark:bg-green-900 dark:border-green-800 dark:text-green-200 px-4 py-3 rounded-md shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <WifiOff size={16} />
                            <span className="text-sm font-medium">Ready for Offline Use</span>
                        </div>
                        <button
                            onClick={dismissOfflineNotification}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <p className="text-xs mt-1">You can now use the app offline!</p>
                </div>
            )}
        </div>
    );
}