import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthQuery } from 'src/app/auth/state/auth.query';
import { AuthService } from 'src/app/auth/state/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn$ = this.authQuery.selectUserLoggedIn();
  subscriptions = new Subscription();

  constructor(private authService: AuthService, private authQuery: AuthQuery, private router: Router) { }

  ngOnInit(): void {

  }

  logout = () => {
    this.subscriptions.add(
      this.authService.logout().subscribe(
        () => {
          this.router.navigateByUrl('/login')
        }
      )
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
