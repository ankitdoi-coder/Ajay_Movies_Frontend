import { Component, OnInit } from '@angular/core';
import { Movie } from '../Services/movie';
import { Moviez } from '../Models/Moviez';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  movies: Moviez[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 12;

  movieId:number | null=null;
  apiUrl = environment.apiUrl;


  constructor(public movieService: Movie, private router: Router) {}

  //loads movies on page Load
  ngOnInit() {
    this.loadMovies(this.currentPage);
  }

  loadMovies(page: number) {
    this.movieService.getAllMovies(page, this.pageSize).subscribe({
      next: (data) => {
        this.movies = data.content;
        this.totalPages = data.totalPages;
        this.currentPage = data.number;
      },
      error: (err) => console.error(err)
    });
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.loadMovies(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 3);
    
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  }

  //get Movie data on Click Movie Card and route to the download page
  openMovie(movieId:number){
    this.router.navigate(['/download',movieId]);
  }
}
