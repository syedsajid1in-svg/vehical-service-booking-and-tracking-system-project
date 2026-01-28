// Script to clean up duplicate service centers and add 5 new ones
// Run this in browser console while on http://localhost:5173

const API_URL = 'http://localhost:8080/api';

async function cleanupAndAddServiceCenters() {
    try {
        // Step 1: Get all service centers
        console.log('Fetching all service centers...');
        const response = await fetch(`${API_URL}/service-centers`);
        const centers = await response.json();
        console.log('Found service centers:', centers);

        // Step 2: Delete all existing service centers
        console.log('Deleting all service centers...');
        for (const center of centers) {
            try {
                await fetch(`${API_URL}/service-centers/${center.id}`, {
                    method: 'DELETE'
                });
                console.log(`Deleted: ${center.name}`);
            } catch (err) {
                console.error(`Failed to delete ${center.name}:`, err);
            }
        }

        // Step 3: Add 5 new unique service centers
        console.log('Adding 5 new service centers...');
        const newCenters = [
            {
                name: 'Premium Auto Works',
                location: 'Downtown Mumbai',
                contact: '+91-9876543210'
            },
            {
                name: 'Elite Car Service',
                location: 'Bandra West',
                contact: '+91-9876543211'
            },
            {
                name: 'Quick Fix Garage',
                location: 'Andheri East',
                contact: '+91-9876543212'
            },
            {
                name: 'Speedy Motors',
                location: 'Powai',
                contact: '+91-9876543213'
            },
            {
                name: 'AutoCare Plus',
                location: 'Thane West',
                contact: '+91-9876543214'
            }
        ];

        for (const center of newCenters) {
            const res = await fetch(`${API_URL}/service-centers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(center)
            });
            const created = await res.json();
            console.log(`Created: ${created.name} (ID: ${created.id})`);
        }

        console.log('✅ Successfully cleaned up and added 5 new service centers!');
        console.log('Please refresh the provider registration page.');
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Run the cleanup
cleanupAndAddServiceCenters();
