import {
  LoginErrorCode,
  LoginErrorViewModel
} from './login-error.models';

const LOGIN_ERROR_MESSAGES: Record<
  LoginErrorCode,
  LoginErrorViewModel
> = {
  user_banned: {
    title: 'Este acesso foi bloqueado',
    message:
      'Não foi possível iniciar uma sessão para esta conta. Se você acredita que isso ocorreu por engano, entre em contato com o suporte da HeadSpace.'
  },

  authentication_failed: {
    title: 'Não foi possível concluir o acesso',
    message:
      'O processo de autenticação não foi concluído. Tente novamente.'
  }
};

const FALLBACK_LOGIN_ERROR: LoginErrorViewModel = {
  title: 'Não foi possível concluir o acesso',
  message:
    'Ocorreu uma falha durante a autenticação. Tente novamente.'
};

export function mapLoginError(
  value: string | null
): LoginErrorViewModel | null {
  if (!value) {
    return null;
  }

  if (isLoginErrorCode(value)) {
    return LOGIN_ERROR_MESSAGES[value];
  }

  return FALLBACK_LOGIN_ERROR;
}

function isLoginErrorCode(
  value: string
): value is LoginErrorCode {
  return (
    value === 'user_banned' ||
    value === 'authentication_failed'
  );
}