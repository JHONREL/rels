import { Component, OnInit } from '@angular/core';
import { HomepageNavbarComponent } from '../components/homepage-navbar/homepage-navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { Post } from '../interfaces/post';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { CommentService } from '../services/comment.service';
import { FormsModule } from '@angular/forms';
import { Comment } from '../interfaces/comment';

@Component({
  selector: 'app-view-post',
  standalone: true,
  imports: [HomepageNavbarComponent, NgIf, NgClass, FormsModule, NgFor],
  templateUrl: './view-post.component.html',
  styleUrl: './view-post.component.css',
})
export class ViewPostComponent implements OnInit {
  post: Post[] = [];
  loaded: Boolean = false;
  author: User[] = [];
  userid = localStorage.getItem('id');
  comment = '';
  commentList: Comment[] = [];
  user: User[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getPost();
    this.getComments();
    this.viewPost();
    this.getUserInformation();
  }

  getPost() {
    this.route.params.subscribe((params) => {
      this.postService.getPosts(params['postid']).subscribe((post: Post[]) => {
        this.post = post;

        if (this.post[0].userid) {
          this.http
            .get<User[]>(
              `http://localhost/rels/pdo/api/get_users/${this.post[0].userid}`
            )
            .subscribe(
              (result: User[]) => {
                this.author = result;
                if (this.author != null) {
                  this.loaded = true;
                }
              },
              (error) => {
                console.error('Error fetching user information', error);
              }
            );
        }
      });
    });
  }

  editPost() {
    this.route.params.subscribe((params) => {
      this.router.navigate([`edit-post/${params['postid']}`]);
    });
  }

  viewPost() {
    this.route.params.subscribe((params) => {
      this.postService.viewPost(params['postid']).subscribe((result) => {
        result;
      });
    });
  }

  deletePost() {
    this.route.params.subscribe((params) => {
      this.postService.deletePost(params['postid']).subscribe((result) => {
        this.navigateToUser(this.author[0].userid);
      });
    });
  }

  createComment() {
    this.route.params.subscribe((params) => {
      const postid = params['postid'];
      if (postid != null && this.comment != null && this.userid != null) {
        this.commentService
          .createComment(postid, this.userid, this.comment)
          .subscribe((result) => {
            this.getComments();
            this.comment = '';
          });
      }
    });
  }

  getComments() {
    this.route.params.subscribe((params) => {
      const postid = params['postid'];
      this.commentService
        .getComments(postid)
        .subscribe((commments: Comment[]) => {
          this.commentList = commments;
        });
    });
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

  showOptions: boolean = false; // To track dropdown visibility

  toggleOptions() {
    this.showOptions = !this.showOptions; // Toggle visibility
  }

  navigateToUser(userid: string) {
    this.router.navigate([`logs/${userid}`]);
  }

  getUserInformation() {
    if (this.userid) {
      this.http
        .get<User[]>(`http://localhost/rels/pdo/api/get_users/${this.userid}`)
        .subscribe(
          (result: User[]) => {
            this.user = result;
            if (this.user != null) {
              this.loaded = true;
            }
          },
          (error) => {
            console.error('Error fetching user information', error);
          }
        );
    }
  }
}
