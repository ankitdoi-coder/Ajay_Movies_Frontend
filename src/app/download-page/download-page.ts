import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Movie } from '../Services/movie';// Ensure correct path
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Moviez } from '../Models/Moviez';
import { PageResponse } from '../Models/PageResponse';

@Component({
  selector: 'app-download-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './download-page.html',
  styleUrls: ['./download-page.scss']
})
export class DownloadPageComponent implements OnInit {
  movie: any = {};
  relatedMovies: any[] = [];
  apiUrl = environment.apiUrl;
  searchFormGroup: any;
  moviesList: Moviez[] | null = null;
  movieId:number | null=null;
  categories:any[]=[];
  categoryMovieList:any[]=[];
  categorySelected:boolean=false;
  commentFormGroup:any;
  commentList:any[]=[];

  constructor(private route: ActivatedRoute,
    private movieService: Movie,
    private fb:FormBuilder,
    private router:Router
    ) {
      this.searchFormGroup=this.fb.group({
        search:['']
      }),
      this.commentFormGroup=this.fb.group({
        name:['', Validators.required],
        comment:['', Validators.required],
        movieId:['']
      })
    }

  ngOnInit() {
    // Subscribe to paramMap to detect changes in the URL ID
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.getMovieById(id);
      }
    });

    this.getAllMovies();
    this.getCategory();
  }

  getMovieById(id: number) {
    this.movieService.getMovieById(id).subscribe({
      next: (data: any) => {
        this.movie = data;
        this.movieId = id;
        this.getComments(id);
        // Scroll to the top of the page when a new movie loads
        window.scrollTo(0, 0);
      },
      error: (err: any) => {
        console.error("Failed to load Movie", err);
      }
    });

  }


  getAllMovies() {
    this.movieService.getAllMovies().subscribe({
      next: (data: any) => {
        this.relatedMovies = data.slice(0, 4);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  submitSearch() {
    if(this.searchFormGroup.invalid){
      console.error("Form is invalid. Please check the following fields:");
      Object.keys(this.searchFormGroup.controls).forEach(key => {
        const controlErrors = this.searchFormGroup.get(key)?.errors;
        if (controlErrors) {
          console.log('Field: ' + key + ', Errors: ', controlErrors);
        }
      });
      return;
    }

    const formValue=this.searchFormGroup.value;
    
    this.movieService.searchMovie(formValue.search).subscribe({
      next: (data: PageResponse<Moviez>) => {
        console.log('Search results:', data.content);
        this.moviesList = data.content; // Update the UI list
      },
      error: (err: any) => {
        console.error('Error searching movie:', err);
      }
    });
  }

  getCategory(){
    this.movieService.getCategories().subscribe({
      next:(data:Moviez[])=>{
        console.log('search result :',data);
        this.categories=data;
      },
      error:(err:any) =>{
        console.error('error fetching category',err);
      }
    })
  };

  searchByCategory(category:string){
    if(!category){
      this.categorySelected=false;
      this.categoryMovieList=[];
      return;
    }
    this.categorySelected=true;
    this.movieService.searchMovie(undefined,category).subscribe({
      next:(data:PageResponse<Moviez>)=>{
        console.log("seached movies by category :",data.content);
        this.categoryMovieList=data.content;
      },
      error:(err:any)=>{
        console.log("error in searching Movies",err);
      }
    })
  }

  initializeForm(){
    this.commentFormGroup.reset();
  }
  submitComment() {
    if(this.commentFormGroup.invalid){
      alert("Please fill in all required fields");
      return;
    }
    
    const formValue = this.commentFormGroup.value;
    const commentData={
      name:formValue.name,
      comment:formValue.comment,
      movieId:this.movieId
    };

    const formData=new FormData();

    formData.append('comment',new Blob([JSON.stringify(commentData)],{ type: 'application/json' }))
    this.movieService.postComment(formData).subscribe({
      next:()=>{
        // alert("Commented Successfully")
        console.log("Comment saved Succesfully")
        this.initializeForm();
        this.getComments(this.movieId);
      },
      error:(err:any)=>{
        console.error("Error While Saving ",err);
      }
    })
  }

  getComments(movieId:any){
    this.movieService.getCommentsByMovieId(movieId).subscribe({
      next:(data:any)=>{
        this.commentList=data;
        console.log("successfully saved Comment in variable");
      },
      error:(err:any)=> {
        console.error("error while fetching the comments",err);
      }
    })
  }



}
