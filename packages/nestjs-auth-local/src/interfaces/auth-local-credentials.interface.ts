import {
  IdentityReferenceInterface,
  IdentityUsernameInterface,
} from '@concepta/nestjs-common';
import { PasswordStorageInterface } from '@concepta/nestjs-password';

/**
 * Credentials Interface
 */
export interface AuthLocalCredentialsInterface
  extends IdentityReferenceInterface,
    IdentityUsernameInterface,
    Pick<PasswordStorageInterface, 'password' | 'salt'> {}