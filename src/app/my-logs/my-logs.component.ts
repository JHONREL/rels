import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HomepageNavbarComponent } from '../components/homepage-navbar/homepage-navbar.component';
import { Post } from '../interfaces/post';
import { User } from '../interfaces/user';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-my-logs',
  standalone: true,
  imports: [HomepageNavbarComponent, NgFor, NgIf],
  templateUrl: './my-logs.component.html',
  styleUrl: './my-logs.component.css',
})
export class MyLogsComponent {
  imageUrl: string | ArrayBuffer | null = null;
  image: File | null = null;
  posts: Post[] = [];
  userid = localStorage.getItem('id');
  user: User[] = [];
  loading: Boolean = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.postService.getPosts(null).subscribe((result: Post[]) => {
      this.posts = result;
      if (this.userid) {
        this.posts = this.posts.filter((post) => post.userid == this.userid);
      }
    });

    if (this.userid) {
      this.getUserInformation();
    }
  }

  getUserInformation() {
    if (this.userid) {
      this.http
        .get<User[]>(`http://localhost/rels/pdo/api/get_users/${this.userid}`)
        .subscribe(
          (result: User[]) => {
            this.user = result;
            if (this.user != null) {
              this.loading = false;
            }
          },
          (error) => {
            console.error('Error fetching user information', error);
          }
        );
    }
  }

  viewPost(postid: string) {
    this.router.navigate(['/view-post', postid]);
  }

  createPost() {
    this.router.navigate(['add-post']);
  }

  formatSqlDate(sqlDate: string): string {
    const date = new Date(sqlDate);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours24 = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const isPM = hours24 >= 12;
    const hours12 = hours24 % 12 || 12;
    return `${month}/${day}/${year} ${hours12}:${minutes} ${
      isPM ? 'PM' : 'AM'
    }`;
  }

  changeCoverPhoto(): void {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    // Trigger the file input dialog
    fileInput.click();

    // Add an event listener to handle the file selection
    fileInput.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Update the imageUrl for immediate feedback
          this.imageUrl = e.target.result;

          // Prepare the image for upload
          const profileImage = new FormData();
          if (this.userid != null) {
            profileImage.append('image', file);
            profileImage.append('userid', this.userid);
          }
          // Upload the photo to the server
          this.http
            .post(
              'http://localhost/rels/pdo/api/profile_upload/',
              profileImage
            )
            .subscribe({
              next: (response) => {
                this.getUserInformation();
              },
              error: (error) => {
                console.error('Error uploading profile photo:', error);
              },
            });
        };

        // Read the image as a data URL for immediate display
        reader.readAsDataURL(file);
      }
    });
  }
}
