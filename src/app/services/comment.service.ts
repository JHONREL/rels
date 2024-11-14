import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../interfaces/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}

  public getComments(postid: string | null): Observable<any> {
    if (postid == null) {
      return this.http.get<Comment[]>(
        `http://localhost/rels/pdo/api/get_comments`
      );
    } else {
      return this.http.get<Comment[]>(
        `http://localhost/rels/pdo/api/get_comments/${postid}`
      );
    }
  }

  public createComment(
    postid: string,
    userid: string,
    comment: string
  ): Observable<any> {
    const data = {
      postid: postid,
      userid: userid,
      comment: comment,
    };

    return this.http.post(
      `http://localhost/rels/pdo/api/create_comment`,
      data
    );
  }
}
