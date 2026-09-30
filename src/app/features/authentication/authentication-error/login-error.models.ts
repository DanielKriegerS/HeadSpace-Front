export type LoginErrorCode =
  | 'user_banned'
  | 'authentication_failed';

export interface LoginErrorViewModel {
  title: string;
  message: string;
}