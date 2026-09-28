import {
  computed,
  Injectable,
  signal
} from '@angular/core';

import { CurrentUser } from '../models/CurrentUser';

export type AuthStatus =
  | 'INITIALIZING'
  | 'ANONYMOUS'
  | 'AUTHENTICATED'
  | 'ERROR';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private readonly statusState = signal<AuthStatus>('INITIALIZING');
  private readonly currentUserState = signal<CurrentUser | null>(null);
  private readonly errorState = signal<string | null>(null);
  private readonly operationErrorState = signal<string | null>(null);
  private readonly logoutInProgressState = signal(false);

  readonly status = this.statusState.asReadonly();
  readonly currentUser = this.currentUserState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly operationError = this.operationErrorState.asReadonly();
  readonly logoutInProgress = this.logoutInProgressState.asReadonly();

  readonly isAuthenticated = computed(
    () => this.statusState() === 'AUTHENTICATED'
  );

  readonly isInitializing = computed(
    () => this.statusState() === 'INITIALIZING'
  );

  readonly isAnonymous = computed(
    () => this.statusState() === 'ANONYMOUS'
  );

  setInitializing(): void {
    this.statusState.set('INITIALIZING');
    this.errorState.set(null);
    this.operationErrorState.set(null);
  }

  setAuthenticated(user: CurrentUser): void {
    this.currentUserState.set(user);
    this.statusState.set('AUTHENTICATED');
    this.errorState.set(null);
    this.operationErrorState.set(null);
  }

  setAnonymous(): void {
    this.currentUserState.set(null);
    this.statusState.set('ANONYMOUS');
    this.errorState.set(null);
    this.operationErrorState.set(null);
  }

  setError(message: string): void {
    this.currentUserState.set(null);
    this.statusState.set('ERROR');
    this.errorState.set(message);
    this.operationErrorState.set(null);
  }

  setOperationError(message: string): void {
    this.operationErrorState.set(message);
  }

  clearOperationError(): void {
    this.operationErrorState.set(null);
  }

  setLogoutInProgress(inProgress: boolean): void {
    this.logoutInProgressState.set(inProgress);
  }

  clear(): void {
    this.currentUserState.set(null);
    this.statusState.set('ANONYMOUS');
    this.errorState.set(null);
    this.operationErrorState.set(null);
    this.logoutInProgressState.set(false);
  }
}