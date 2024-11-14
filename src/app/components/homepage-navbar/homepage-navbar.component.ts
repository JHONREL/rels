import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-homepage-navbar',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './homepage-navbar.component.html',
  styleUrls: ['./homepage-navbar.component.css'],
})
export class HomepageNavbarComponent implements OnInit {
  userid: string | null = localStorage.getItem('id');
  user: User[] = [];
  loading: boolean = true;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    if (this.userid && this.userid.trim()) {
      this.getUserInformation();
    } else {
      console.warn('No valid User ID found in localStorage');
    }
    console.log(localStorage.getItem('id'));
  }

  getUserInformation() {
    if (this.userid) {
      this.http
        .get<User[]>(`http://localhost/rels/pdo/api/get_users/${this.userid}`)
        .subscribe(
          (result: User[]) => {
            this.user = result;
            this.loading = false;
          },
          (error) => {
            console.error('Error fetching user information', error);
            this.loading = false;
          }
        );
    }
  }

  logout(): void {
    localStorage.removeItem('id'); // Clear the user ID from localStorage
    this.user = []; // Reset the user data
    this.loading = true; // Reset the loading state
    this.router.navigate(['/login']); // Redirect to login page (or any other page you prefer)
  }
}
