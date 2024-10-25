import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UsersService } from './users.service';
import { MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [CommonModule,MatTableModule],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css',
})
export class UsersTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email'];
  dataSource: User[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.fetchUsers().subscribe((users) => {
      this.dataSource = users;
    });
  }
}
