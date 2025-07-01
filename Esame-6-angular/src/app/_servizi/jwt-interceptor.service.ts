import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

    urlDaNonUsare: string[] = []

    constructor(private authService: AuthService) {
        this.urlDaNonUsare = [
            'accedi', 'register','comuni','comuni?nome=','sigla-provincia','nazioni'
        ]
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Non lo uso all'interno del login
        if(this.isValidRequestForInterceptor(request.url)){
            const token = this.authService.token!
            const authReq = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${token}`)
    
            })
            return next.handle(authReq)
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
