import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Movie } from '../Services/movie';// Ensure correct path
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-download-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './download-page.html',
  styleUrls: ['./download-page.scss']
})
export class DownloadPageComponent implements OnInit {
  movie: any = {};
  relatedMovies: any[] = [];
  apiUrl = environment.apiUrl;

  constructor(private route: ActivatedRoute, private movieService: Movie) {}

  ngOnInit() {
    // Subscribe to paramMap to detect changes in the URL ID
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.getMovieById(id);
      }
    });

    this.getAllMovies();
  }

  getMovieById(id: number) {
    this.movieService.getMovieById(id).subscribe({
      next: (data:any) => {
        this.movie = data;
        // Scroll to the top of the page when a new movie loads
        window.scrollTo(0, 0);
      },
      error: (err:any) => {
        console.error("Failed to load Movie", err);
      }
    });
  }

  getAllMovies() {
    this.movieService.getAllMovies().subscribe({
      next: (data:any) => {
        this.relatedMovies = data.slice(0, 4);
      },
      error: (err:any) => {
        console.error(err);
      }
    });
  }
}
