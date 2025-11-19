# Database Process Review and SQL Object Requirements

**Version:** 1.0  
**Domain:** UserManagement-Broker-Insurance  
**Audience:** DB Architects, Backend Engineers, DevOps

## Executive Summary

This document provides a comprehensive review of existing database processes for the MiSeguroDigital platform, identifies required SQL objects (views, transactions, queries), and defines improvements for admin/broker/analyst workflows. The analysis focuses on ensuring coherence with relational SQL data models while maintaining ACID compliance and proper RBAC implementation.

## Glossary

- **Usuario**: Authenticated user in the platform
- **GlobalAdmin**: Superuser for the platform (global scope)
- **AdminBroker**: Administrator within a broker's organization (tenant scope)
- **Analista**: Broker analyst role with limited permissions
- **Poliza**: Insurance policy managed under a Broker
- **Documento**: Supporting artifact tied to users/polizas/pagos
- **Pago**: Payment record associated to a poliza or account
- **Review**: User-provided review or feedback
- **RBAC**: Role-Based Access Control
- **SoftDelete**: Flagging a record as deleted instead of physical removal

## High-Level Process Review

### Current State Analysis

The existing processes primarily cover user-side administration and partial broker admin actions. Key findings:

#### User Management - **Partially Coherent**
- Insert/Modify/Delete users require uniqueness checks, role assignment, tenant scoping, and audit logs
- Reviews deletion must be restricted and auditable

#### AdminBroker and Analista - **Needs Detailing**
- Creation/modification implies role provisioning, broker linkage, and revocation workflows
- Distinction between disable vs delete operations required

#### Polizas/Documentos/Pagos - **Under-specified**
- Need full CRUD semantics with status transitions (draft→active→cancelled)
- Document versioning and integrity controls missing
- Payment allocation and reconciliation processes undefined

#### Security & Audit - **Insufficiently Explicit**
- Standardized audit trail required
- Row-level access via views needed
- Transactional guards for concurrent updates missing

## RBAC Model

### Role Definitions

#### GlobalAdmin
**Scope:** Platform-wide
**Permissions:**
- Usuarios: Create/Read/Update/Delete
- Reviews: Delete (moderation)
- AdminBrokers: Create/Read/Update/Delete
- Analistas: Create/Read/Update/Delete
- Polizas/Documentos/Pagos: Read All
- Tenants/Brokers: Manage

#### AdminBroker
**Scope:** Broker-tenant
**Permissions:**
- Usuarios (within broker): Create/Read/Update/Disable
- Analistas: Create/Read/Update/Disable
- Polizas: Create/Read/Update/Disable
- Documentos: Create/Read/Update/Disable
- Pagos: Read/Update/Delete (with restrictions)
- Reviews: Read (moderation flow suggested)

#### Analista
**Scope:** Broker-tenant
**Permissions:**
- Polizas: Read/Update limited fields
- Documentos: Create/Read
- Pagos: Create/Read (no delete)

#### EndUser
**Permissions:**
- Self: Read/Update Profile
- Polizas: Read own
- Documentos: Upload linked to own polizas
- Pagos: Initiate
- Reviews: Create/Delete own (soft)

### RBAC Guidelines
- Prefer Disable (soft-delete) for user-like identities to preserve referential integrity
- Use tenant filters in all broker-bound views

## Cross-Cutting Requirements

### Audit Requirements
- All mutating actions write audit trail with actor, timestamp, entity, operation, before/after snapshot
- Deletion actions are soft by default unless legal requires hard delete with tombstone

### Transaction Requirements
- Wrap multi-entity operations in explicit transactions for ACID compliance
- Critical for: user creation with roles, broker assignment, poliza creation, payment posting

### Concurrency Requirements
- Use optimistic concurrency via version or updated_at checks in UPDATE/DELETE statements

### Validation Requirements
- Enforce uniqueness (email/identifier) and foreign key existence via pre-check queries

## Process Groups and SQL Objects

### AccionesGlobalAdmin

#### InsertarManualmenteUsuarios
**Description:** Global admin manually creates users, assigns roles, optionally associates to broker tenant

**SQL Objects Required:**
- **View:** `v_usuarios_basic` - Unified user listing with role aggregation
- **Transaction:** `tx_create_user_with_roles_broker`
  1. Check unique email
  2. Insert user
  3. Map roles
  4. Link to broker (optional)
  5. Write audit record
- **Queries:** `q_check_user_email_unique`, `q_insert_user`, `q_assign_roles`, `q_link_broker`, `q_insert_audit`

#### EliminarUsuarios
**Description:** Global admin disables or deletes user (soft-delete preferred)

**SQL Objects Required:**
- **Transaction:** `tx_soft_delete_user`
  1. Ensure user not last GlobalAdmin (safety)
  2. Mark is_active=false, set deleted_at
  3. Revoke active sessions
  4. Audit
- **Queries:** `q_is_last_global_admin`, `q_disable_user`, `q_insert_audit`

#### ModificarUsuarios
**Description:** Global admin updates user profile fields and roles

**SQL Objects Required:**
- **Transaction:** `tx_update_user_and_roles`
  1. Check concurrency token
  2. Update user fields
  3. Diff roles: insert new, remove obsolete
  4. Audit before/after
- **Queries:** `q_get_user_for_update`, `q_update_user_fields`, `q_upsert_roles`, `q_insert_audit`

#### EliminarReviews
**Description:** Global admin removes inappropriate reviews with moderation reason

**SQL Objects Required:**
- **Transaction:** `tx_moderate_review_soft_delete`
  1. Fetch review status
  2. Mark is_deleted=true, set moderation_reason
  3. Audit
- **Queries:** `q_get_review`, `q_soft_delete_review`, `q_insert_audit`

### AccionesGlobalAdminBroker

#### CrearAdminBrokers
**Description:** Create broker administrators, link to broker tenant, assign AdminBroker role

**SQL Objects Required:**
- **Transaction:** `tx_create_admin_broker`
  1. Validate broker exists
  2. Create or convert user
  3. Assign AdminBroker role
  4. Link to broker tenant
  5. Audit
- **Queries:** `q_broker_exists`, `q_insert_or_get_user`, `q_assign_admin_broker_role`, `q_link_user_broker`, `q_insert_audit`

#### EliminarAdminBrokers
**Description:** Disable or demote AdminBroker with responsibility transfer

**SQL Objects Required:**
- **Transaction:** `tx_demote_or_disable_admin_broker`
  1. Check not last AdminBroker for tenant
  2. Remove AdminBroker role or disable account
  3. Transfer open tasks
  4. Audit
- **Queries:** `q_count_admin_brokers_for_tenant`, `q_remove_admin_broker_role`, `q_disable_user`, `q_insert_audit`

#### ModificarAdminBrokers
**Description:** Update AdminBroker profile or scope (multi-broker or single tenant)

**SQL Objects Required:**
- **Transaction:** `tx_update_admin_broker`
  1. Concurrency check
  2. Update profile fields
  3. Update broker linkage(s)
  4. Audit
- **Queries:** `q_get_admin_broker_for_update`, `q_update_user_fields`, `q_update_broker_linkages`, `q_insert_audit`

#### CrearAnalistas
**Description:** Create analyst under broker with limited permissions

**SQL Objects Required:**
- **Transaction:** `tx_create_analista`
  1. Validate broker
  2. Create user or convert role
  3. Assign Analista role
  4. Link to broker
  5. Audit
- **Queries:** `q_broker_exists`, `q_insert_or_get_user`, `q_assign_analista_role`, `q_link_user_broker`, `q_insert_audit`

#### EliminarAnalistas
**Description:** Disable or remove analyst's role within tenant

**SQL Objects Required:**
- **Transaction:** `tx_disable_analista`
  1. Remove Analista role (tenant scope)
  2. Optionally disable account
  3. Audit
- **Queries:** `q_remove_analista_role`, `q_disable_user`, `q_insert_audit`

#### ModificarAnalistas
**Description:** Update analyst profile, permissions, or team assignments

**SQL Objects Required:**
- **Transaction:** `tx_update_analista`
  1. Concurrency check
  2. Update fields and assignments
  3. Audit
- **Queries:** `q_get_analista_for_update`, `q_update_user_fields`, `q_insert_audit`

### Polizas_AdminBroker

#### CrearPoliza
**Description:** Create new policy under broker with initial status and owner linkage

**SQL Objects Required:**
- **Transaction:** `tx_create_poliza`
  1. Validate broker and owner (insured/usuario)
  2. Insert poliza with status='draft' or 'active'
  3. Insert initial coverage/metadata
  4. Audit
- **Queries:** `q_validate_broker_and_owner`, `q_insert_poliza`, `q_insert_audit`

#### ModificarPoliza
**Description:** Update policy fields subject to status constraints and concurrency

**SQL Objects Required:**
- **Transaction:** `tx_update_poliza`
  1. Load poliza with version/status
  2. Validate editable state
  3. Apply updates
  4. Audit delta
- **Queries:** `q_get_poliza_for_update`, `q_update_poliza_fields`, `q_insert_audit`

#### EliminarPoliza
**Description:** Soft-delete policy if cancellable; otherwise mark status='cancelled'

**SQL Objects Required:**
- **Transaction:** `tx_cancel_or_soft_delete_poliza`
  1. Check outstanding obligations (payments/claims)
  2. Update status or soft-delete flag
  3. Audit
- **Queries:** `q_poliza_can_be_deleted`, `q_mark_poliza_cancelled_or_deleted`, `q_insert_audit`

### Documentos_AdminBroker

#### CrearDocumento
**Description:** Attach document to poliza or entity with version and integrity metadata

**SQL Objects Required:**
- **Transaction:** `tx_create_documento`
  1. Validate parent entity and broker scope
  2. Insert document record (path/hash/mime/version)
  3. Audit
- **Queries:** `q_validate_parent_and_scope`, `q_insert_documento`, `q_insert_audit`

#### ModificarDocumento
**Description:** Update document metadata or create new version

**SQL Objects Required:**
- **Transaction:** `tx_version_documento`
  1. Load current document
  2. Create new version row (preferred) or update metadata
  3. Audit
- **Queries:** `q_get_documento`, `q_insert_documento_version`, `q_insert_audit`

#### EliminarDocumento
**Description:** Soft-delete document, preserving versions and references

**SQL Objects Required:**
- **Transaction:** `tx_soft_delete_documento`
  1. Mark is_deleted and set deleted_at
  2. Audit
- **Queries:** `q_soft_delete_documento`, `q_insert_audit`

### Pagos_AdminBroker_Analista

#### CrearPago
**Description:** Create payment associated to poliza with initial status

**SQL Objects Required:**
- **Transaction:** `tx_create_pago`
  1. Validate poliza and tenant scope
  2. Insert pago with status='pending' and amount/currency
  3. Optionally allocate to term/invoice
  4. Audit
- **Queries:** `q_validate_poliza_scope`, `q_insert_pago`, `q_insert_audit`

#### ModificarPago
**Description:** Update payment details before final posting

**SQL Objects Required:**
- **Transaction:** `tx_update_pago`
  1. Load pago with version/status
  2. Validate editable status (not reconciled/posted)
  3. Apply allowed field changes
  4. Audit
- **Queries:** `q_get_pago_for_update`, `q_update_pago_fields`, `q_insert_audit`

#### EliminarPago
**Description:** AdminBroker may void payment if not reconciled

**SQL Objects Required:**
- **Transaction:** `tx_void_pago`
  1. Check status 'pending' or 'posted_unreconciled'
  2. Mark voided with reason
  3. Audit
- **Queries:** `q_pago_can_be_voided`, `q_mark_pago_voided`, `q_insert_audit`

### UserSide_ExistingAndImproved

#### UserSelfService_ProfileUpdate
**Description:** EndUser updates own profile fields

**SQL Objects Required:**
- **View:** `v_user_self_profile` - Scoped read for self-service
- **Transaction:** `tx_user_update_profile`
  1. Concurrency check
  2. Update allowed fields only
  3. Audit (self-action)
- **Queries:** `q_update_self_fields`, `q_insert_audit`

#### UserReviews_CreateDeleteOwn
**Description:** EndUser creates or deletes (soft) own reviews

**SQL Objects Required:**
- **Transaction:** `tx_create_review`
  1. Validate ownership scope
  2. Insert review
  3. Audit
- **Transaction:** `tx_delete_own_review`
  1. Confirm ownership
  2. Soft-delete
  3. Audit
- **Queries:** `q_insert_review`, `q_soft_delete_review`
- **View:** `v_reviews_public` - List non-deleted reviews

## Views Catalog

| View Name | Audience | Purpose |
|-----------|----------|---------|
| `v_usuarios_basic` | GlobalAdmin | Unified user listing with role aggregation |
| `v_usuarios_tenant` | AdminBroker | Users scoped to broker |
| `v_polizas_tenant` | AdminBroker, Analista | Policies by broker with status filters |
| `v_documentos_by_entity` | AdminBroker, Analista | Documents for given entity and tenant |
| `v_pagos_tenant` | AdminBroker, Analista | Payments filtered by broker and status |
| `v_reviews_public` | All | Publicly visible reviews (not deleted) |
| `v_audit_recent` | GlobalAdmin, Compliance | Recent audit trail for monitoring |

## Data Quality and Governance Rules

1. **Emails unique across platform**
2. **Users must have at least one role; AdminBroker role must be scoped to valid broker**
3. **Poliza status transitions constrained (draft → active → cancelled)**
4. **Document versions immutable; new content creates new version**
5. **Payments immutable once reconciled; use void/reversal patterns**
6. **All deletes are soft by default; hard deletes require explicit governance approval**

## Security and Access Policies

### Row-Level Security
- Broker-scoped views for AdminBroker/Analista using broker_id filter

### PII Handling
- Minimize exposure in views; mask sensitive fields where not required

### Auditing
- Complete and immutable audit logs with actor identity and reason codes

## Operational Notes

### Migration Requirements
- Introduce is_active/is_deleted flags and updated_at/version columns where absent

### Monitoring
- Expose v_audit_recent to SecOps/Compliance dashboards

### Performance
- Add indexes supporting tenant filters, status filters, and unique constraints used by pre-check queries

## Implementation Mapping

### Original Process → Improved Implementation

| Original Process | Improved Implementation |
|------------------|------------------------|
| AccionesGlobalAdmin.InsertarManualmenteUsuarios | tx_create_user_with_roles_broker; v_usuarios_basic |
| AccionesGlobalAdmin.EliminarUsuarios | tx_soft_delete_user |
| AccionesGlobalAdmin.ModificarUsuarios | tx_update_user_and_roles |
| AccionesGlobalAdmin.EliminarReviews | tx_moderate_review_soft_delete; v_reviews_public |
| AccionesGlobalAdminBroker.CrearAdminBrokers | tx_create_admin_broker |
| AccionesGlobalAdminBroker.EliminarAdminBrokers | tx_demote_or_disable_admin_broker |
| AccionesGlobalAdminBroker.ModificarAdminBrokers | tx_update_admin_broker |
| AccionesGlobalAdminBroker.CrearAnalistas | tx_create_analista |
| AccionesGlobalAdminBroker.EliminarAnalistas | tx_disable_analista |
| AccionesGlobalAdminBroker.ModificarAnalistas | tx_update_analista |
| Polizas (AdminBroker): CRUD | tx_create_poliza/tx_update_poliza/tx_cancel_or_soft_delete_poliza; v_polizas_tenant |
| Documentos (AdminBroker): CRUD | tx_create_documento/tx_version_documento/tx_soft_delete_documento; v_documentos_by_entity |
| Pagos (AdminBroker y Analista): CRUD | tx_create_pago/tx_update_pago/tx_void_pago; v_pagos_tenant |

## Conclusion

This specification provides a comprehensive framework for implementing robust, auditable, and secure database processes for the MiSeguroDigital platform. The proposed SQL objects ensure ACID compliance, proper RBAC enforcement, and comprehensive audit trails while maintaining operational efficiency and data integrity.

All processes are designed with soft-delete patterns, optimistic concurrency control, and tenant-scoped security to support a multi-tenant insurance broker platform with appropriate separation of concerns and administrative hierarchies.