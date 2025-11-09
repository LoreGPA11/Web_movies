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

  // 🔹 Ahora ngOnInit es asíncrono
  async ngOnInit(): Promise<void> {
    await this.loadMovies();
  }

  // 🔹 Carga las películas de manera asíncrona
  async loadMovies(): Promise<void> {
    this.movies = await this.movieService.getAllMovies();
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

  // 🔹 Guardar película con await
  async saveMovie(): Promise<void> {
    if (this.isEditing && this.selectedMovie) {
      await this.movieService.updateMovie(this.selectedMovie.id, this.movieForm);
      this.isEditing = false;
      this.selectedMovie = null;
    } else if (this.isAdding) {
      await this.movieService.addMovie(this.movieForm as Omit<Movie, 'id'>);
      this.isAdding = false;
    }
    await this.loadMovies();
    this.resetForm();
  }

  // 🔹 Borrar película con await
  async deleteMovie(id: number): Promise<void> {
    if (confirm('¿Estás seguro de que deseas eliminar esta película?')) {
      const success = await this.movieService.deleteMovie(id);
      if (success) {
        await this.loadMovies();
        this.selectedMovie = null;
      }
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
