import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

    urlDaNonUsare: string[] = []

    constructor(private authService: AuthService, private router:Router) {
        this.urlDaNonUsare = [
            'accedi', 'register', 'comuni', 'comuni?nome=', 'sigla-provincia', 'nazioni'
        ]
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Non lo uso all'interno del login
        if (this.isValidRequestForInterceptor(request.url)) {
            const token = this.authService.token!
            const authReq = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${token}`)

            })
            return next.handle(authReq).pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401 || error.status === 403) {
                        // Token non valido o scaduto → fai logout e redirect
                        this.authService.logout(); // opzionale
                        this.router.navigate(['/login']);
                    }
                    return throwError(() => error);
                })
            );
        }
        return next.handle(request)
    }

    private isValidRequestForInterceptor(requestUrl: string): boolean {
        let positionIndicator: string = 'api/v1/';
        let position = requestUrl.indexOf(positionIndicator);
        if (position > 0) {
            let destination: string = requestUrl.substr(position + positionIndicator.length);
            for (let address of this.urlDaNonUsare) {
                if (new RegExp(address).test(destination)) {
                    return false;
                }
            }
        }
        return true;
    }

}


export const httpInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptorService,
    multi: true
}
