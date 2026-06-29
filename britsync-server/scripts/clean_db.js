require('dotenv').config();
const mongoose = require('mongoose');

async function clean() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI is not configured in .env');
        process.exit(1);
    }

    console.log('Connecting to database...');
    await mongoose.connect(uri, {
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true
    });
    console.log('Connected successfully!');

    try {
        console.log('Clearing database collections...');
        
        const collections = [
            'docu_users',
            'docu_workspaces',
            'docu_workspace_members',
            'docu_join_requests',
            'docu_invites',
            'docu_subscriptions',
            'docu_usage_counters',
            'docu_documents',
            'docu_templates',
            'docu_contacts',
            'docu_notifications',
            'docu_audit_logs'
        ];

        for (const name of collections) {
            try {
                await mongoose.connection.collection(name).deleteMany({});
                console.log(`✓ Cleared collection: ${name}`);
            } catch (err) {
                console.warn(`⚠ Could not clear ${name}:`, err.message);
            }
        }

        console.log('Database successfully cleared! All users and SaaS configurations have been deleted.');
    } catch (err) {
        console.error('Cleanup failed:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

clean();
