import React, { useState } from 'react';
import { apiCall } from '../../utils/api';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import { Download, FileSpreadsheet } from 'lucide-react';

export const SuperAdminExports: React.FC = () => {
    const [exporting, setExporting] = useState<string | null>(null);

    const downloadCSV = (data: any[], filename: string) => {
        if (!data || data.length === 0) {
            alert('No data available to export.');
            return;
        }
        
        // Extract flat headers
        const sample = data[0];
        const headers = Object.keys(sample).filter(k => typeof sample[k] !== 'object');
        
        const csvRows = [headers.join(',')];
        
        for (const row of data) {
            const values = headers.map(header => {
                const val = row[header];
                const escaped = String(val === undefined || val === null ? '' : val).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExport = async (type: 'users' | 'workspaces' | 'billing' | 'audit-logs') => {
        setExporting(type);
        try {
            let endpoint = '';
            if (type === 'users') endpoint = 'super-admin/users';
            if (type === 'workspaces') endpoint = 'super-admin/workspaces';
            if (type === 'billing') endpoint = 'super-admin/billing';
            if (type === 'audit-logs') endpoint = 'super-admin/audit-logs';

            const data = await apiCall(endpoint);
            downloadCSV(data, `${type}-export-${new Date().toISOString().split('T')[0]}.csv`);
        } catch (err: any) {
            alert(err.message || 'Export failed');
        } finally {
            setExporting(null);
        }
    };

    const items = [
        { label: 'Users Directory CSV', description: 'Export platform-wide user database metadata including verified statuses and login records.', type: 'users' as const },
        { label: 'Workspaces Database CSV', description: 'Export all personal and corporate workspaces, ownership linkages, and active plans.', type: 'workspaces' as const },
        { label: 'Subscriptions Billing CSV', description: 'Export SaaS subscriptions, amounts, cycle ends, and Stripe subscription matches.', type: 'billing' as const },
        { label: 'Administrative Audit Trails CSV', description: 'Export immutable administrator operations logs and target resources.', type: 'audit-logs' as const },
    ];

    return (
        <SuperAdminLayout title="SaaS Data Exports">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {items.map((item) => (
                    <div 
                        key={item.label}
                        style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                        }}
                    >
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.05)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                            <FileSpreadsheet size={20} />
                        </div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{item.label}</h3>
                        <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem', flexGrow: 1 }}>{item.description}</p>
                        
                        <button 
                            className="btn btn-primary"
                            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
                            onClick={() => handleExport(item.type)}
                            disabled={exporting !== null}
                        >
                            <Download size={14} style={{ marginRight: '6px' }} />
                            {exporting === item.type ? 'Exporting...' : 'Download CSV'}
                        </button>
                    </div>
                ))}
            </div>
        </SuperAdminLayout>
    );
};

export default SuperAdminExports;
