# BritSync Docu — Database Schemas & Table Configurations

This document outlines the database structure of **BritSync Docu**, including the active MongoDB collections used in the application and their equivalent PostgreSQL SQL table schemas.

---

## 🗄️ Part 1: MongoDB Collections (Current Scheme)

The application communicates with MongoDB via the backend `britsync-server` API using the following collections:

### 1. `docu_users`
Stores user registry and authentication credentials.
* `_id` (ObjectId): Primary Key.
* `full_name` (String): Display name.
* `email` (String): Unique registration email.
* `password_hash` (String): Bcrypt password hash.
* `email_verified` (Boolean): Verification status.
* `avatar_url` (String): Optional URL.
* `createdAt` / `updatedAt` (Date).

### 2. `docu_workspaces`
Organizations/tenants to group users and documents.
* `_id` (ObjectId): Primary Key.
* `name` (String): Organization title.
* `logo_url` (String): Optional custom logo URL.
* `brand_color` (String): Hex layout theme color.
* `owner_id` (ObjectId): References `docu_users._id`.
* `createdAt` / `updatedAt` (Date).

### 3. `docu_workspace_members`
Links users to workspaces with granular access roles.
* `_id` (ObjectId): Primary Key.
* `workspace_id` (ObjectId): References `docu_workspaces._id`.
* `user_id` (ObjectId): References `docu_users._id`.
* `role` (String): `owner`, `admin`, `member`, or `viewer`.
* `status` (String): `invited` or `joined`.
* `invited_by` (ObjectId): References `docu_users._id`.
* `createdAt` / `updatedAt` (Date).

### 4. `docu_documents`
Stores document transactions, nested recipient definitions, and coordinate field structures.
* `_id` (ObjectId): Primary Key.
* `workspace_id` (ObjectId): References `docu_workspaces._id`.
* `owner_id` (ObjectId): References `docu_users._id`.
* `document_name` (String): File display name.
* `original_file_url` (String): Link to original uploaded PDF.
* `final_file_url` (String): Link to flat signed completed PDF.
* `audit_report_url` (String): Link to signature audit certificate PDF.
* `original_hash` / `final_hash` (String): SHA-256 integrity hashes.
* `status` (String): `draft`, `sent`, `viewed`, `completed`, `expired`, `archived`, or `declined`.
* `source_type` (String): `upload` or `template`.
* `signing_order_enabled` (Boolean): Default `false`.
* `expires_at` / `sent_at` / `viewed_at` / `completed_at` (Date).
* `recipients` (Array of Recipient Objects):
  * `_id` (ObjectId): Primary Key.
  * `name` / `email` (String)
  * `role` (String): `signer`, `approver`, `viewer`, or `cc`.
  * `signing_order` (Number)
  * `secure_token` (String): Authorization token for secure links.
  * `status` (String): `pending`, `sent`, `viewed`, `completed`, or `declined`.
  * `viewed_at` / `signed_at` / `completed_at` (Date).
  * `ip_address` / `user_agent` (String)
* `fields` (Array of Field Objects):
  * `_id` (ObjectId): Primary Key.
  * `page_number` (Number)
  * `field_type` (String): `text`, `user_signature`, `initials`, `date`, `checkbox`, etc.
  * `label` / `placeholder` (String)
  * `required` (Boolean)
  * `x_percent` / `y_percent` / `width_percent` / `height_percent` (Number): Layout positioning.
  * `value` (String): Captured user input values.
  * `signature_data` (String): Base64 image data-URI.
  * `assigned_recipient_id` (String): References a recipient `_id` or `'sender'`.

### 5. `docu_audit_logs`
Cryptographic trail of actions.
* `_id` (ObjectId): Primary Key.
* `workspace_id` (ObjectId): References `docu_workspaces._id`.
* `document_id` (ObjectId): References `docu_documents._id`.
* `recipient_id` (String): Optional reference.
* `user_id` (ObjectId): Optional reference to `docu_users._id`.
* `event_type` (String): Action name.
* `ip_address` / `user_agent` (String).
* `metadata_json` (String).

---

## 🏛️ Part 2: Relational SQL Tables Schema (PostgreSQL DDL)

If migrating to a relational database (e.g. PostgreSQL), nested documents (`recipients`, `fields`) must be normalized into independent tables linked by foreign keys. 

Run these commands to configure SQL tables:

```sql
-- 1. Users Table
CREATE TABLE docu_users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    avatar_url VARCHAR(255) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Workspaces Table
CREATE TABLE docu_workspaces (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(255) DEFAULT '',
    brand_color VARCHAR(7) DEFAULT '#3b82f6',
    owner_id VARCHAR(36) NOT NULL REFERENCES docu_users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Workspace Members Table
CREATE TABLE docu_workspace_members (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES docu_workspaces(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES docu_users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('invited', 'joined')),
    invited_by VARCHAR(36) REFERENCES docu_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (workspace_id, user_id)
);

-- 4. Documents Table
CREATE TABLE docu_documents (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) NOT NULL REFERENCES docu_workspaces(id) ON DELETE CASCADE,
    owner_id VARCHAR(36) NOT NULL REFERENCES docu_users(id) ON DELETE RESTRICT,
    document_name VARCHAR(255) NOT NULL,
    original_file_url VARCHAR(255) NOT NULL,
    final_file_url VARCHAR(255) DEFAULT '',
    audit_report_url VARCHAR(255) DEFAULT '',
    original_hash VARCHAR(64) DEFAULT '',
    final_hash VARCHAR(64) DEFAULT '',
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'sent', 'viewed', 'completed', 'expired', 'archived', 'declined')),
    source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('upload', 'template')),
    signing_order_enabled BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP,
    sent_at TIMESTAMP,
    viewed_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Recipients Table (Normalized from nested array)
CREATE TABLE docu_recipients (
    id VARCHAR(36) PRIMARY KEY,
    document_id VARCHAR(36) NOT NULL REFERENCES docu_documents(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('signer', 'approver', 'viewer', 'cc')),
    signing_order INT DEFAULT 1,
    secure_token VARCHAR(100) DEFAULT '',
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'sent', 'viewed', 'completed', 'declined')),
    viewed_at TIMESTAMP,
    signed_at TIMESTAMP,
    completed_at TIMESTAMP,
    ip_address VARCHAR(45) DEFAULT '',
    user_agent TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Document Fields Table (Normalized from nested array)
CREATE TABLE docu_document_fields (
    id VARCHAR(36) PRIMARY KEY,
    document_id VARCHAR(36) NOT NULL REFERENCES docu_documents(id) ON DELETE CASCADE,
    assigned_recipient_id VARCHAR(36) REFERENCES docu_recipients(id) ON DELETE SET NULL,
    page_number INT NOT NULL,
    field_type VARCHAR(30) NOT NULL,
    label VARCHAR(100) DEFAULT '',
    placeholder VARCHAR(100) DEFAULT '',
    required BOOLEAN DEFAULT TRUE,
    x_percent DECIMAL(5,2) NOT NULL,
    y_percent DECIMAL(5,2) NOT NULL,
    width_percent DECIMAL(5,2) NOT NULL,
    height_percent DECIMAL(5,2) NOT NULL,
    value TEXT DEFAULT '',
    options_json TEXT DEFAULT '',
    font_size INT DEFAULT 12,
    signature_data TEXT DEFAULT '', -- Stores Base64 signature image
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Audit Logs Table
CREATE TABLE docu_audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id VARCHAR(36) REFERENCES docu_workspaces(id) ON DELETE CASCADE,
    document_id VARCHAR(36) REFERENCES docu_documents(id) ON DELETE CASCADE,
    recipient_id VARCHAR(36) REFERENCES docu_recipients(id) ON DELETE SET NULL,
    user_id VARCHAR(36) REFERENCES docu_users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45) DEFAULT '',
    user_agent TEXT DEFAULT '',
    metadata_json TEXT DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
