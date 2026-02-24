import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Route, Router, RouterOutlet } from '@angular/router';
import { Movie } from './Services/movie';
import { Moviez } from './Models/Moviez';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('FrontEnd');
  activeFooterLink = 'Home';
  menuOpen = false;
  searchFormGroup: any;
  moviesList: Moviez[] | null = null;
  movieId: number | null = null;


  constructor(
    private fb: FormBuilder,
    public movieService: Movie,
    private router:Router
  ) {
    this.searchFormGroup = this.fb.group({
      search: ['']
    })
  }



  setActiveFooterLink(linkName: string) {
    this.activeFooterLink = linkName;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  goHome() {
    this.moviesList = null; // Hides the search results section
    this.searchFormGroup.reset(); // Clears the search input field
    this.activeFooterLink = 'Home';
    this.menuOpen = false; // Closes mobile menu if open
    this.router.navigate(['/home']);
  }
  //get Movie data on Click Movie Card and route to the download page
  openMovie(movieId: number) {
    this.router.navigate(['/download', movieId]);
  }

  //CATEGORY search 
  searchByCategory(category: string) {
    this.searchFormGroup.patchValue({ search: category });
    this.submitSearch();
  }

  //search api

  submitSearch() {
    //validation 
    if (this.searchFormGroup.invalid) {
      console.error("Form is invalid. Please check the following fields:");
      // This will help you find WHICH field is invalid causing the 'no request' issue
      Object.keys(this.searchFormGroup.controls).forEach(key => {
        const controlErrors = this.searchFormGroup.get(key)?.errors;
        if (controlErrors) {
          console.log('Field: ' + key + ', Errors: ', controlErrors);
        }
      });
      return;
    }

    const formValue = this.searchFormGroup.value;

    // Map form value 'search' to backend parameter 'title'
    let queryParams = {
      title: formValue.search
    };

    //call the service
    this.movieService.searchMovie(queryParams).subscribe({
      next: (data: Moviez[]) => {
        console.log('Search results:', data);
        this.moviesList = data; // Update the UI list
      },
      error: (err: any) => {
        console.error('Error searching movie:', err);
      }
    });
  }
}
