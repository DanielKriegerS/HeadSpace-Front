import {
  HttpInterceptorFn
} from '@angular/common/http';

function isBackendRequest(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//');
}

export const credentialsInterceptor: HttpInterceptorFn = (
  request,
  next
) => {
  if (!isBackendRequest(request.url)) {
    return next(request);
  }

  return next(
    request.clone({
      withCredentials: true
    })
  );
};