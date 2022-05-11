import { AuditDateCreated } from '../../audit/audit.types';

/**
 * Date data was created.
 */
export interface AuditDateCreatedInterface<T = AuditDateCreated> {
  dateCreated: T;
}
