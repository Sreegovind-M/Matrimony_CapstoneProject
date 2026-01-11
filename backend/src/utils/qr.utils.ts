import QRCode from 'qrcode';

/**
 * Generate a QR code for an event
 * @param eventId - The event ID
 * @param baseUrl - The base URL of the frontend application
 * @returns Base64 encoded QR code image as data URL
 */
export async function generateEventQRCode(eventId: number, baseUrl: string = 'http://localhost:4200'): Promise<string> {
    const eventUrl = `${baseUrl}/event/${eventId}`;

    try {
        const qrCodeDataUrl = await QRCode.toDataURL(eventUrl, {
            width: 300,
            margin: 2,
            color: {
                dark: '#1f2a44',
                light: '#ffffff'
            },
            errorCorrectionLevel: 'M'
        });

        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
}

/**
 * Get the public event URL from a QR code
 * @param eventId - The event ID
 * @param baseUrl - The base URL of the frontend application
 * @returns The public URL for the event
 */
export function getEventPublicUrl(eventId: number, baseUrl: string = 'http://localhost:4200'): string {
    return `${baseUrl}/event/${eventId}`;
}
