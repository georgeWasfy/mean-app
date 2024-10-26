import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersTableComponent } from './users-table/users-table.component';

@Component({
  standalone: true,
  imports: [RouterModule,UsersTableComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}
