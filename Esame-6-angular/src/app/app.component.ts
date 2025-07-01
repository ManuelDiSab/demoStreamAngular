import { Component, HostListener, Input, OnInit, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Auth } from './interfaces/IAuth.interface';
import { AuthService } from './_servizi/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  auth: BehaviorSubject<Auth>
  title = 'Esame_6';
  isLeftSidebarCollapsed = signal<boolean>(false)
  screenWidth = signal<number>(window.innerWidth)
  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth)
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true)
    }
  }
  changeIsleftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed)
  }
  @Input({required:true}) isLeftsidebarCollapsed!:boolean
  @Input({required:true}) larghezza!:number
  sizeClass(){
    if(this.isLeftSidebarCollapsed()){
      return 'body-md-screen'
    }else{
      return 'body-trimmed'
      
    }
  }
  constructor(private authService:AuthService){
    this.auth = this.authService.LeggiObsAuth()//Leggo l'auth da localstorage se esiste (sono loggato)
  }
  ngOnInit(): void {
    this.isLeftSidebarCollapsed.set(true)
  }
}
