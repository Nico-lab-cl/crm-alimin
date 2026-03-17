import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    try {
        // We'll use environment variables for the service account
        // The user will need to provide the FIREBASE_SERVICE_ACCOUNT JSON
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
        
        if (serviceAccount.project_id) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }
    } catch (error) {
        console.error('Firebase Admin Init Error:', error);
    }
}

export async function sendPushNotification(to: string[], title: string, body: string, data?: any) {
    if (!admin.apps.length || to.length === 0) return;

    const message = {
        notification: { title, body },
        data: data || {},
        tokens: to,
    };

    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log('Successfully sent push messages:', response.successCount);
        return response;
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
}
