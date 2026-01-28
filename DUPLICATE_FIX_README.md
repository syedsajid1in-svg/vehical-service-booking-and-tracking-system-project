# Fix for Duplicate Service Centers Issue

## Problem
When users click on "Book Service" and open the "Choose Center" dropdown, duplicate service centers appear in the list (e.g., "City Auto Care - Downtown" appears multiple times).

## Root Cause
The database contains duplicate service center records with the same name and location. This happened because:
1. No unique constraint was enforced on the ServiceCenter table
2. Service centers may have been added multiple times during testing/development

## Solution Implemented

### 1. Backend Changes

#### A. Added Unique Constraint to ServiceCenter Entity
**File:** `backend/src/main/java/com/vehicle/service/model/ServiceCenter.java`

Added `@Table` annotation with unique constraint on (name, location) combination:
```java
@Entity
@Data
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"name", "location"}))
public class ServiceCenter {
    // ... fields
}
```

**Impact:** Prevents future duplicate service centers from being created in the database.

#### B. Added Duplicate Removal Method
**File:** `backend/src/main/java/com/vehicle/service/service/ServiceCenterService.java`

Added method to remove existing duplicates:
```java
public void removeDuplicateServiceCenters() {
    List<ServiceCenter> allCenters = serviceCenterRepository.findAll();
    Map<String, ServiceCenter> uniqueCenters = new HashMap<>();
    
    for (ServiceCenter center : allCenters) {
        String key = center.getName() + "|" + center.getLocation();
        if (!uniqueCenters.containsKey(key)) {
            uniqueCenters.put(key, center);
        } else {
            serviceCenterRepository.deleteById(center.getId());
        }
    }
}
```

#### C. Added API Endpoint
**File:** `backend/src/main/java/com/vehicle/service/controller/ServiceCenterController.java`

Added endpoint to trigger duplicate removal:
```java
@PostMapping("/service-centers/remove-duplicates")
public ResponseEntity<String> removeDuplicates() {
    serviceCenterService.removeDuplicateServiceCenters();
    return ResponseEntity.ok("Duplicate service centers removed successfully");
}
```

**Endpoint:** `POST http://localhost:8080/api/service-centers/remove-duplicates`

### 2. Frontend Changes

#### Client-Side Deduplication
**File:** `frontend/src/pages/BookService.jsx`

Added logic to filter duplicates on the client side as a safety measure:
```javascript
getServiceCenters().then(res => {
    // Remove duplicates based on name and location
    const uniqueCenters = [];
    const seen = new Set();
    
    res.data.forEach(center => {
        const key = `${center.name}|${center.location}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueCenters.push(center);
        }
    });
    
    setCenters(uniqueCenters);
});
```

**Impact:** Even if the backend returns duplicates, the frontend will filter them out.

## How to Fix the Current Issue

### Step 1: Wait for Backend to Restart
The backend should automatically restart after the code changes. Wait for it to complete.

### Step 2: Remove Existing Duplicates
Open the file: `remove-duplicates.html` in your browser:
1. Navigate to: `c:/Users/vipul/OneDrive/Desktop/Vehicle/remove-duplicates.html`
2. Double-click to open in your browser
3. Click the "Remove Duplicate Service Centers" button
4. Wait for the success message

### Step 3: Test the Fix
1. Go to your application: http://localhost:5173
2. Login as a user
3. Click "Book Service"
4. Open the "Choose Center" dropdown
5. Verify that each service center appears only once

## Prevention
- The unique constraint on the database ensures duplicates cannot be created in the future
- The frontend deduplication provides an additional safety layer
- Any attempt to add a duplicate service center will now fail at the database level

## Files Modified
1. `backend/src/main/java/com/vehicle/service/model/ServiceCenter.java`
2. `backend/src/main/java/com/vehicle/service/service/ServiceCenterService.java`
3. `backend/src/main/java/com/vehicle/service/controller/ServiceCenterController.java`
4. `frontend/src/pages/BookService.jsx`

## Files Created
1. `remove-duplicates.html` - Utility page to trigger duplicate removal
2. `removeDuplicates.js` - Node.js script (alternative method)

## Testing Checklist
- [ ] Backend restarted successfully
- [ ] Ran duplicate removal endpoint
- [ ] Verified dropdown shows unique centers only
- [ ] Tested booking a service with a center
- [ ] Confirmed no duplicates can be created
