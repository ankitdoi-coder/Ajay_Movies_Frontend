import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Movie } from '../Services/movie';
import { Moviez } from '../Models/Moviez';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-download-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './download-page.html',
  styleUrl: './download-page.scss',
})
export class DownloadPage {

  constructor(private route: ActivatedRoute, private movieService: Movie) { }
  apiUrl = environment.apiUrl;

  movie: Moviez = {};
  relatedMovies: Moviez[] = [];

  ngOnInit() {
    const movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.movieService.getMovieById(movieId).subscribe({
      next:(data:Moviez)=>{
        this.movie=data;
      },
      error:(err: any)=>{
        console.error("Failed to load Movie" ,err);
      }
    });

    this.movieService.getAllMovies().subscribe({
      next: (data) => this.relatedMovies = data.slice(0, 4),
      error: (err) => console.error(err)
    });
  }
}
