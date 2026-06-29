require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const DocuPlanConfig = require('../models/DocuPlanConfig');
const DocuUser = require('../models/DocuUser');
const DocuWorkspace = require('../models/DocuWorkspace');
const DocuWorkspaceMember = require('../models/DocuWorkspaceMember');
const crypto = require('crypto');

async function seed() {
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
        // 1. Seed Plan Configs
        const defaultPlans = [
            {
                plan_key: 'free',
                display_name: 'Personal Free',
                description: 'Ideal for single users starting with secure document signing.',
                monthly_price_display: 0,
                yearly_price_display: 0,
                limits: {
                    documents_per_month: 5,
                    team_members: 1,
                    templates: 1,
                    storage_mb: 50,
                    bulk_sends: 0
                },
                features: {
                    contacts: true,
                    reminders: true,
                    custom_branding: false,
                    audit_certificate: true,
                    sequential_signing: false,
                    bulk_send: false,
                    signer_otp: false,
                    public_forms: false,
                    webhooks: false,
                    reports: false,
                    api_access: false
                }
            },
            {
                plan_key: 'pro',
                display_name: 'Pro Company',
                description: 'Best for growing startups and smaller teams.',
                monthly_price_display: 0.5,
                yearly_price_display: 5.0,
                limits: {
                    documents_per_month: 50,
                    team_members: 5,
                    templates: 10,
                    storage_mb: 500,
                    bulk_sends: 5
                },
                features: {
                    contacts: true,
                    reminders: true,
                    custom_branding: true,
                    audit_certificate: true,
                    sequential_signing: true,
                    bulk_send: false,
                    signer_otp: false,
                    public_forms: false,
                    webhooks: false,
                    reports: false,
                    api_access: false
                }
            },
            {
                plan_key: 'business',
                display_name: 'Business Company',
                description: 'Full capabilities, bulk delivery, signer auth, and enterprise routing.',
                monthly_price_display: 1.0,
                yearly_price_display: 10.0,
                limits: {
                    documents_per_month: 500,
                    team_members: 50,
                    templates: 50,
                    storage_mb: 2048,
                    bulk_sends: 100
                },
                features: {
                    contacts: true,
                    reminders: true,
                    custom_branding: true,
                    audit_certificate: true,
                    sequential_signing: true,
                    bulk_send: true,
                    signer_otp: true,
                    public_forms: true,
                    webhooks: true,
                    reports: true,
                    api_access: true
                }
            },
            {
                plan_key: 'enterprise',
                display_name: 'Enterprise Contract',
                description: 'Bespoke high-volume solutions for corporate environments.',
                monthly_price_display: 99.0,
                yearly_price_display: 999.0,
                limits: {
                    documents_per_month: 99999,
                    team_members: 9999,
                    templates: 9999,
                    storage_mb: 50000,
                    bulk_sends: 99999
                },
                features: {
                    contacts: true,
                    reminders: true,
                    custom_branding: true,
                    audit_certificate: true,
                    sequential_signing: true,
                    bulk_send: true,
                    signer_otp: true,
                    public_forms: true,
                    webhooks: true,
                    reports: true,
                    api_access: true
                }
            }
        ];

        for (const plan of defaultPlans) {
            await DocuPlanConfig.findOneAndUpdate(
                { plan_key: plan.plan_key },
                plan,
                { upsert: true, new: true }
            );
            console.log(`✓ Seeded/Updated plan config: ${plan.plan_key}`);
        }

        // 2. Setup Super Admin user (waqarshakil.ahmed@gmail.com)
        const adminEmail = 'waqarshakil.ahmed@gmail.com';
        let adminUser = await DocuUser.findOne({ email: adminEmail });
        
        if (!adminUser) {
            console.log(`Creating fresh Super Admin user with email: ${adminEmail}`);
            const passHash = await bcrypt.hash('superadmin123', 10);
            adminUser = new DocuUser({
                full_name: 'Waqar Ahmed (Super Admin)',
                email: adminEmail,
                password_hash: passHash,
                email_verified: true,
                onboarding_completed: true,
                platform_role: 'SUPER_ADMIN',
                status: 'ACTIVE'
            });
            await adminUser.save();

            // Create personal workspace for the admin
            const wsCode = crypto.randomBytes(4).toString('hex').toUpperCase();
            const workspace = new DocuWorkspace({
                name: "Waqar's Personal Workspace",
                owner_id: adminUser._id,
                workspace_type: 'PERSONAL',
                workspace_code: wsCode,
                slug: `ws-${wsCode.toLowerCase()}`,
                plan: 'free',
                subscription_status: 'active'
            });
            const savedWs = await workspace.save();

            await new DocuWorkspaceMember({
                workspace_id: savedWs._id,
                user_id: adminUser._id,
                role: 'owner',
                status: 'joined',
                joined_at: new Date()
            }).save();

            adminUser.personal_workspace_id = savedWs._id;
            adminUser.default_workspace_id = savedWs._id;
            await adminUser.save();
            console.log('✓ Super Admin account successfully created! Use password: superadmin123');
        } else {
            adminUser.platform_role = 'SUPER_ADMIN';
            adminUser.status = 'ACTIVE';
            await adminUser.save();
            console.log('✓ Existing user upgraded to SUPER_ADMIN!');
        }

    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Done!');
        process.exit(0);
    }
}

seed();
