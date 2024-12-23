import { isMobile, isTablet } from 'react-device-detect';

export function getDeviceType() {
    if (isMobile) return 'Mobile';
    if (isTablet) return 'Tablet';
    return 'Desktop';
}
