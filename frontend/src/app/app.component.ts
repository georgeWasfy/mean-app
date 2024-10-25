import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { UsersTableComponent } from './users-table/users-table.component';

@Component({
  standalone: true,
  imports: [RouterModule, HeaderComponent,UsersTableComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}
