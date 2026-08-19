import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  console.log('🔄 Interceptor called for:', req.url);
  const token = authService.getToken();

  if (token) {
    console.log('✓ Token found, attaching to request:', token.substring(0, 20) + '...');
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('📤 Authorization header set:', req.headers.get('Authorization') ? 'YES' : 'NO');
  } else {
    console.warn('❌ No token found in localStorage, request will be sent without auth');
  }

  return next(req);
};
