import { Component } from '@angular/core';
import { HomepageNavbarComponent } from '../components/homepage-navbar/homepage-navbar.component';
import { NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { QuillModule } from 'ngx-quill';
import { BlotFormatter } from 'quill-blot-formatter';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-post',
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
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
})
export class AddPostComponent {
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

  imageUrl: string | ArrayBuffer | null = null;
  image: File | null = null;
  userid = localStorage.getItem('id');

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      text: new FormControl(''),
      title: new FormControl(''),
    });
  }

  public blur(): void {
    console.log('blur');
  }

  public onSelectionChanged(): void {
    console.log('onSelectionChanged');
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

  createPost() {
    // Get the values from the form controls
    const title = this.form.get('title')?.value;
    const description = this.form.get('text')?.value;

    // Check if the title and description are provided
    if (!title || !description) {
      console.error('Title and description are required.');
      return;
    }

    // Ensure the user ID is available and the image is selected
    if (this.userid) {
      this.postService
        .createPost(this.userid, title, description, this.image)
        .subscribe((result) => {
          if (result) {
            this.router.navigate(['/view-post/', result]);
          }
        });
    } else {
      console.error('User ID or image is missing.');
    }
  }
}
