// Database Query Script - View Service Providers
// Run this in browser console at http://localhost:5173

const API_URL = 'http://localhost:8080/api';

async function viewServiceProviders() {
    try {
        console.log('Fetching all users...');
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();

        // Filter providers
        const providers = users.filter(u => u.role === 'PROVIDER');

        console.log('\n========================================');
        console.log('SERVICE PROVIDER LOGIN DETAILS');
        console.log('========================================\n');

        if (providers.length === 0) {
            console.log('No service providers found in database.');
            return;
        }

        // Fetch service centers
        const centersResponse = await fetch(`${API_URL}/service-centers`);
        const centers = await centersResponse.json();

        providers.forEach((provider, index) => {
            const center = centers.find(c => c.id === provider.serviceCenterId);

            console.log(`\n--- PROVIDER ${index + 1} ---`);
            console.log(`ID: ${provider.id}`);
            console.log(`Name: ${provider.name}`);
            console.log(`Login Email: ${provider.email}`);
            console.log(`Password: ${provider.passwordHash}`);
            console.log(`Phone: ${provider.phone}`);
            console.log(`Address: ${provider.address}`);
            console.log(`Role: ${provider.role}`);
            if (center) {
                console.log(`Service Center: ${center.name} - ${center.location}`);
                console.log(`Center Contact: ${center.contact}`);
            } else {
                console.log(`Service Center: Not assigned`);
            }
            console.log('---');
        });

        console.log('\n========================================');
        console.log(`Total Providers: ${providers.length}`);
        console.log('========================================\n');

        // Also create a formatted table
        console.table(providers.map(p => ({
            ID: p.id,
            Name: p.name,
            'Login Email': p.email,
            Password: p.passwordHash,
            Phone: p.phone,
            'Service Center ID': p.serviceCenterId
        })));

    } catch (error) {
        console.error('Error fetching providers:', error);
    }
}

viewServiceProviders();
