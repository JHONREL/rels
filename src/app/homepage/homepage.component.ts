import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { HomepageNavbarComponent } from '../components/homepage-navbar/homepage-navbar.component';
import { Post } from '../interfaces/post';
import { User } from '../interfaces/user';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [HomepageNavbarComponent, NgFor, NgIf],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {
  posts: Post[] = [];
  profilePhotos: { [key: string]: string | null } = {};

  constructor(
    private router: Router,
    private postService: PostService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.postService.getPosts(null).subscribe((result: Post[]) => {
      this.posts = result;

      this.posts.forEach((post) => {
        this.getProfile(post.userid).subscribe((profilePhoto) => {
          this.profilePhotos[post.userid] = profilePhoto;
        });
      });
    });
  }

  mylog() {
    this.router.navigate(['/homepage']);
  }

  createPost() {
    this.router.navigate(['add-post']);
  }

  viewPost(postid: string) {
    this.router.navigate(['/view-post', postid]);
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

  getProfile(userid: string): Observable<string | null> {
    if (userid) {
      return this.http
        .get<User[]>(`http://localhost/rels/pdo/api/get_users/${userid}`)
        .pipe(
          map((result: User[]) => {
            return result.length > 0 ? result[0].profilephoto : null;
          })
        );
    } else {
      return of(null);
    }
  }
}
