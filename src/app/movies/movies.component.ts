import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movie } from '../models/movie.model';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  selectedMovie: Movie | null = null;
  isEditing: boolean = false;
  isAdding: boolean = false;
  
  movieForm: Partial<Movie> = {
    title: '',
    director: '',
    year: new Date().getFullYear(),
    genre: '',
    duration: 0,
    rating: 0,
    poster: '',
    description: ''
  };

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.movies = this.movieService.getAllMovies();
  }

  selectMovie(movie: Movie): void {
    this.selectedMovie = movie;
    this.isEditing = false;
    this.isAdding = false;
  }

  editMovie(movie: Movie): void {
    this.selectedMovie = movie;
    this.movieForm = { ...movie };
    this.isEditing = true;
    this.isAdding = false;
  }

  showAddForm(): void {
    this.isAdding = true;
    this.isEditing = false;
    this.selectedMovie = null;
    this.movieForm = {
      title: '',
      director: '',
      year: new Date().getFullYear(),
      genre: '',
      duration: 0,
      rating: 0,
      poster: 'https://via.placeholder.com/200x300/4a5568/ffffff?text=Nueva+Pelicula',
      description: ''
    };
  }

  saveMovie(): void {
    if (this.isEditing && this.selectedMovie) {
      this.movieService.updateMovie(this.selectedMovie.id, this.movieForm);
      this.isEditing = false;
      this.selectedMovie = null;
    } else if (this.isAdding) {
      this.movieService.addMovie(this.movieForm as Omit<Movie, 'id'>);
      this.isAdding = false;
    }
    this.loadMovies();
    this.resetForm();
  }

  deleteMovie(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta película?')) {
      this.movieService.deleteMovie(id);
      this.loadMovies();
      this.selectedMovie = null;
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.isAdding = false;
    this.selectedMovie = null;
    this.resetForm();
  }

  resetForm(): void {
    this.movieForm = {
      title: '',
      director: '',
      year: new Date().getFullYear(),
      genre: '',
      duration: 0,
      rating: 0,
      poster: '',
      description: ''
    };
  }
}