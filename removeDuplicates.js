// Utility script to remove duplicate service centers from the database
// Run this with: node removeDuplicates.js

const API_URL = 'http://localhost:8080/api/service-centers/remove-duplicates';

async function removeDuplicates() {
    try {
        console.log('Removing duplicate service centers...');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const message = await response.text();
            console.log('✅ Success:', message);
        } else {
            console.error('❌ Error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('❌ Failed to remove duplicates:', error.message);
    }
}

removeDuplicates();
