import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient, private router: Router) {}

  public getPosts(postid: string | null): Observable<Post[]> {
    if (postid == null) {
      return this.http.get<Post[]>(`http://localhost/rels/pdo/api/get_posts`);
    } else {
      return this.http.get<Post[]>(
        `http://localhost/rels/pdo/api/get_posts/${postid}`
      );
    }
  }

  public createPost(
    userid: string,
    title: string,
    description: string,
    image: File | null
  ): Observable<any> {
    const formData = new FormData();

    // Append fields to formData
    formData.append('userid', userid);
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    console.log(formData);

    return this.http.post(
      `http://localhost/rels/pdo/api/create_post/`,
      formData
    );
  }

  public editPost(
    postid: string,
    title: string,
    description: string,
    image: File | null
  ): Observable<any> {
    const formData = new FormData();

    // Append fields to formData
    formData.append('postid', postid);
    formData.append('title', title);
    formData.append('description', description);
    if (image != null) {
      formData.append('image', image);
    }

    return this.http.post(
      `http://localhost/rels/pdo/api/update_post/`,
      formData
    );
  }

  public viewPost(postid: string): Observable<any> {
    return this.http.post(`http://localhost/rels/pdo/api/view_post/`, postid);
  }

  public deletePost(postid: string): Observable<any> {
    return this.http.post(
      `http://localhost/rels/pdo/api/delete_post/`,
      postid
    );
  }
}
