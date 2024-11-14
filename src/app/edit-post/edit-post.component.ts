import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { QuillModule } from 'ngx-quill';
import { HomepageNavbarComponent } from '../components/homepage-navbar/homepage-navbar.component';
import { Post } from '../interfaces/post';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [
    HomepageNavbarComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    HttpClientModule,
    QuillModule,
  ],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css',
})
export class EditPostComponent implements OnInit {
  imageUrl: string | ArrayBuffer | null = null;
  image: File | null = null;
  title: string = '';
  description: string = '';
  userid = localStorage.getItem('id');

  form!: FormGroup;
  quillConfig = {
    toolbar: [
      ['bold', 'underline', 'strike'], // toggled buttons

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      ['clean'], // remove formatting button

      ['link', 'image', 'video'], // media options (you can remove 'video' if not needed)
    ],
    blotFormatter: {},
  };

  public blur(): void {
    console.log('blur');
  }

  public onSelectionChanged(): void {
    console.log('onSelectionChanged');
  }

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialize the form with default values
    this.form = this.fb.group({
      title: ['', Validators.required],
      text: ['', Validators.required],
      // Optional: You can also handle other form controls such as image URL if needed
    });

    this.getPostInformation(); // Fetch post details and patch the form
  }

  getPostInformation() {
    this.route.params.subscribe((params) => {
      this.postService.getPosts(params['postid']).subscribe((post: Post[]) => {
        // Patch the form with values from the fetched post
        this.form.patchValue({
          title: post[0].title,
          text: post[0].description,
        });
        this.imageUrl = `http://localhost/rels/pdo/images/posts/${post[0].photo}`;
      });
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.image = input.files[0];
      const fileType = this.image.type;

      if (fileType.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result;
        };
        reader.readAsDataURL(this.image);
      } else {
        console.error('Selected file is not an image.');
      }
    }
  }

  updatePost() {
    // Check if the form is valid before submitting
    if (this.form.invalid) {
      return;
    }

    // Extract form values
    const { title, text } = this.form.value;

    this.route.params.subscribe((params) => {
      // If an image has been selected, include it in the request
      if (this.image) {
        this.postService
          .editPost(params['postid'], title, text, this.image)
          .subscribe((result) => {
            this.router.navigate(['/view-post/', result]);
          });
      } else {
        // If no new image is selected, only send the post data
        this.postService
          .editPost(params['postid'], title, text, null)
          .subscribe((result) => {
            this.router.navigate(['/view-post/', result]);
          });
      }
    });
  }
}
