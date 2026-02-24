import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Movie } from '../Services/movie';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

import { RouterLink } from "@angular/router";

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Moviez } from '../Models/Moviez';
@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {

  movieFormGroup;
  poster: File | null = null;
  screenShots: File[] = [];
  categories!: string[];

  constructor(
    private fb: FormBuilder,
    private movieService: Movie,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.movieFormGroup = this.fb.group({
      title: ['', [Validators.required]],
      subHead_MovieName: ['', [Validators.required]],
      subHead_type: ['', [Validators.required]],
      movieInfo_movieName: ['', [Validators.required]],
      movieInfo_ImbdRating: ['', [Validators.required]],
      movieInfo_langauge: ['', [Validators.required]],
      movieInfo_releaseYear: ['', [Validators.required]],
      movieInfo_quality: ['', [Validators.required]],
      movieInfo_size: ['', [Validators.required]],
      movieInfo_Format: ['', [Validators.required]],
      movieSynopsis: ['', [Validators.required]],
      downloadLink480: ['', [Validators.required]],
      downloadLink720: ['', [Validators.required]],
      downloadLink1080: ['', [Validators.required]],
      category: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getCategory();
  }

  onFileSelectedPoster(event: any) {
    this.poster = event.target.files[0];
  }
  onFileSelectedSS(event: any) {
    this.screenShots = Array.from(event.target.files);
  }


  submitForm() {
    console.log('Token:', localStorage.getItem('token'));

    // Debugging: If this block hits, the form is invalid. Check your console.
    if (this.movieFormGroup.invalid || !this.poster || this.screenShots.length === 0) {
      console.error("Form is invalid. Please check the following fields:");
      // This will help you find WHICH field is invalid causing the 'no request' issue
      Object.keys(this.movieFormGroup.controls).forEach(key => {
        const controlErrors = this.movieFormGroup.get(key)?.errors;
        if (controlErrors) {
          console.log('Field: ' + key + ', Errors: ', controlErrors);
        }
      });
      return;
    }

    const formValue = this.movieFormGroup.value;

    // 1. Create a Javascript Object matching your MovieDTO to send the Normal form text
    const movieData = {
      title: formValue.title,
      subHead_MovieName: formValue.subHead_MovieName,
      subHead_type: formValue.subHead_type,
      movieInfo_movieName: formValue.movieInfo_movieName,
      movieInfo_ImbdRating: formValue.movieInfo_ImbdRating,
      movieInfo_langauge: formValue.movieInfo_langauge,
      movieInfo_releaseYear: formValue.movieInfo_releaseYear,
      movieInfo_quality: formValue.movieInfo_quality,
      movieInfo_size: formValue.movieInfo_size,
      movieInfo_Format: formValue.movieInfo_Format,
      movieSynopsis: formValue.movieSynopsis,
      downloadLink480: formValue.downloadLink480,
      downloadLink720: formValue.downloadLink720,
      downloadLink1080: formValue.downloadLink1080,
      category: formValue.category
    };


    //new form Data For Sending movie object + poster + Screenshots 
    const formData = new FormData();

    // 2. Append the JSON object as a Blob with type 'application/json'
    // Key must be 'movie' to match @RequestPart("movie")
    formData.append('movie', new Blob([JSON.stringify(movieData)], { type: 'application/json' }));

    // 3. Append the Poster
    // Key must be 'poster' to match @RequestPart("poster") (Changed from 'posterImg')
    formData.append('poster', this.poster);

    // 4. Append Screenshots
    this.screenShots.forEach((file) => {
      formData.append('screenshots', file);
    });

    // Call the save API
    this.movieService.saveMovie(formData).subscribe({
      next: () => {
        console.log('Movie saved successfully');
        this.router.navigate(['/']);
      },
      error: err => console.error('Error saving movie:', err)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin-login']);
  }

  getCategory(){
    this.movieService.getCategories().subscribe({
      next:(data)=>{
        console.log("Category fetch succesful");
        this.categories = data;
      },
      error:err=> console.error("error while fetching categories",err)
    })
  }
}
