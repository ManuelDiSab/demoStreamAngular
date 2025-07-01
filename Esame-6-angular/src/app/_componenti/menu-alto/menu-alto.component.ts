import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { Auth } from 'src/app/interfaces/IAuth.interface';

@Component({
    selector: 'app-menu-alto',
    templateUrl: './menu-alto.component.html',
    styleUrls: ['./menu-alto.component.scss']
})
export class MenuAltoComponent implements OnInit {
    auth: BehaviorSubject<Auth>

    constructor(private authService: AuthService, private router: Router, private api: ApiService, private fb:FormBuilder) {
        this.auth = this.authService.LeggiObsAuth()//Leggo l'auth da localstorage se esiste (sono loggato)
    }
    ngOnInit(): void {
    }
    logo: string = "../../../assets/img/strem-viola.png"
        
}
