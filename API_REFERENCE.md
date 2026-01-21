# Viduz Pharmacy - API Quick Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+94771234567",
  "password": "password123",
  "role": "CUSTOMER",
  "address": {
    "street": "123 Main St",
    "city": "Colombo",
    "province": "Western",
    "postalCode": "00100"
  },
  "pharmacistData": {  // Only if role is PHARMACIST
    "licenseNumber": "SLMC12345",
    "nic": "123456789V",
    "qualifications": "B.Pharm",
    "yearsOfExperience": 5
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

## Products

### Get All Products
```http
GET /api/products?page=1&limit=12&search=panadol&category=<categoryId>&prescriptionRequired=false&minPrice=0&maxPrice=1000&inStock=true&sort=-createdAt
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `search` - Search term (searches name, generic name, brand, description)
- `category` - Category ID
- `prescriptionRequired` - true/false
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `inStock` - true/false
- `sort` - Sort field (prefix with - for descending)

### Get Single Product
```http
GET /api/products/:id
```

### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Panadol",
  "genericName": "Paracetamol",
  "brand": "GSK",
  "category": "<categoryId>",
  "description": "Pain relief and fever reduction",
  "dosageForm": "Tablet",
  "strength": "500mg",
  "price": 45,
  "stock": 500,
  "prescriptionRequired": false,
  "manufacturer": "GlaxoSmithKline",
  "usage": "Take 1-2 tablets every 4-6 hours",
  "warnings": "Do not exceed 8 tablets in 24 hours",
  "activeIngredients": ["Paracetamol 500mg"],
  "tags": ["pain relief", "fever"]
}
```

### Update Stock
```http
PATCH /api/products/:id/stock
Authorization: Bearer <admin-or-pharmacist-token>
Content-Type: application/json

{
  "stock": 450
}
```

## Orders

### Create Order (OTC Products)
```http
POST /api/orders
Authorization: Bearer <customer-token>
Content-Type: application/json

{
  "items": [
    {
      "product": "<productId>",
      "quantity": 2
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Colombo",
    "province": "Western",
    "postalCode": "00100",
    "contactPhone": "+94771234567"
  },
  "paymentMethod": "COD",
  "customerNotes": "Please deliver in the evening"
}
```

### Get My Orders
```http
GET /api/orders/my-orders?page=1&limit=10&status=PAID
Authorization: Bearer <customer-token>
```

### Get Order Details
```http
GET /api/orders/:id
Authorization: Bearer <token>
```

### Update Order Status (Pharmacist/Admin)
```http
PATCH /api/orders/:id/status
Authorization: Bearer <pharmacist-or-admin-token>
Content-Type: application/json

{
  "status": "PREPARING",
  "note": "Order is being prepared"
}
```

**Valid Statuses:**
- PENDING_REVIEW
- APPROVED
- AWAITING_PAYMENT
- PAID
- PREPARING
- READY_FOR_DELIVERY
- OUT_FOR_DELIVERY
- DELIVERED
- CANCELLED
- REJECTED

### Cancel Order
```http
PATCH /api/orders/:id/cancel
Authorization: Bearer <customer-token>
```

## Prescriptions

### Upload Prescription
```http
POST /api/prescriptions
Authorization: Bearer <customer-token>
Content-Type: multipart/form-data

Form Data:
- prescriptions: [File, File] (up to 5 files)
- requestedMedicines: JSON string of array
- customerNotes: "Need urgently"
- deliveryAddress: JSON string of address object

Example requestedMedicines:
[
  {
    "productName": "Amoxicillin 500mg",
    "quantity": 10,
    "notes": "As prescribed"
  }
]
```

### Get My Prescriptions
```http
GET /api/prescriptions/my-prescriptions?page=1&limit=10&status=PENDING
Authorization: Bearer <customer-token>
```

### Get Pending Prescriptions (Pharmacist)
```http
GET /api/prescriptions/pending?page=1&limit=20
Authorization: Bearer <pharmacist-token>
```

### Review Prescription (Pharmacist)
```http
PATCH /api/prescriptions/:id/review
Authorization: Bearer <pharmacist-token>
Content-Type: application/json

// Approve
{
  "status": "APPROVED",
  "reviewNotes": "Prescription is valid",
  "items": [
    {
      "product": "<productId>",
      "quantity": 10
    }
  ],
  "deliveryFee": 300
}

// Reject
{
  "status": "REJECTED",
  "rejectionReason": "Prescription is not clear"
}

// Request Reupload
{
  "status": "REUPLOAD_REQUIRED",
  "rejectionReason": "Please upload a clearer image"
}
```

## Admin

### Get Pending Pharmacists
```http
GET /api/admin/pharmacists/pending?page=1&limit=20
Authorization: Bearer <admin-token>
```

### Approve/Reject Pharmacist
```http
PATCH /api/admin/pharmacists/:id/approval
Authorization: Bearer <admin-token>
Content-Type: application/json

// Approve
{
  "approvalStatus": "APPROVED"
}

// Reject
{
  "approvalStatus": "REJECTED",
  "rejectionReason": "Invalid license number"
}
```

### Get All Users
```http
GET /api/admin/users?page=1&limit=20&role=CUSTOMER&status=ACTIVE&search=john
Authorization: Bearer <admin-token>
```

### Update User Status
```http
PATCH /api/admin/users/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "BLOCKED"  // or "ACTIVE"
}
```

### Get Dashboard Statistics
```http
GET /api/admin/dashboard/stats
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "customers": 120,
      "pharmacists": 25,
      "pendingPharmacists": 5
    },
    "products": {
      "total": 200,
      "lowStock": 15
    },
    "orders": {
      "total": 500,
      "pending": 20,
      "today": 15
    },
    "revenue": {
      "total": 250000
    }
  }
}
```

### Get Audit Logs
```http
GET /api/admin/audit-logs?page=1&limit=50&user=<userId>&action=PHARMACIST_APPROVED&targetModel=User
Authorization: Bearer <admin-token>
```

### Categories

#### Get All Categories
```http
GET /api/admin/categories
```

#### Create Category
```http
POST /api/admin/categories
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Pain Relief",
  "description": "Medicines for pain management",
  "icon": "pill-icon.svg"
}
```

#### Update Category
```http
PUT /api/admin/categories/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Pain Relief & Fever",
  "description": "Updated description"
}
```

#### Delete Category
```http
DELETE /api/admin/categories/:id
Authorization: Bearer <admin-token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... }  // Optional validation errors
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Common Headers

```http
Content-Type: application/json
Authorization: Bearer <token>
```

For file uploads:
```http
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

## Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@viduzpharmacy.lk","password":"Admin@123"}'
```

### Get Products Example
```bash
curl http://localhost:5000/api/products?search=panadol
```

### Create Order Example
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [{"product":"PRODUCT_ID","quantity":2}],
    "deliveryAddress": {
      "street":"123 Main St",
      "city":"Colombo",
      "province":"Western",
      "postalCode":"00100",
      "contactPhone":"+94771234567"
    },
    "paymentMethod":"COD"
  }'
```

## Rate Limiting

Currently no rate limiting is implemented. For production, consider:
- 100 requests per 15 minutes for general API
- 5 login attempts per 15 minutes
- 10 file uploads per hour

## File Upload Limits

- Maximum file size: 5MB
- Allowed formats: JPEG, JPG, PNG, PDF
- Maximum files per upload: 5 (prescriptions)

---

**For detailed API documentation, see the full API_DOCUMENTATION.md file.**

**Last Updated:** January 2026
