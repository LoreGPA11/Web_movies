import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private movies: Movie[] = [
    {
      id: 1,
      title: 'El Padrino',
      director: 'Francis Ford Coppola',
      year: 1972,
      genre: 'Drama',
      duration: 175,
      rating: 9.2,
      poster: 'https://via.placeholder.com/200x300/4a5568/ffffff?text=El+Padrino',
      description: 'La historia de una familia mafiosa en Nueva York.'
    },
    {
      id: 2,
      title: 'Inception',
      director: 'Christopher Nolan',
      year: 2010,
      genre: 'Ciencia Ficción',
      duration: 148,
      rating: 8.8,
      poster: 'https://via.placeholder.com/200x300/4a5568/ffffff?text=Inception',
      description: 'Un ladrón que roba secretos corporativos a través de los sueños.'
    },
    {
      id: 3,
      title: 'Pulp Fiction',
      director: 'Quentin Tarantino',
      year: 1994,
      genre: 'Crimen',
      duration: 154,
      rating: 8.9,
      poster: 'https://via.placeholder.com/200x300/4a5568/ffffff?text=Pulp+Fiction',
      description: 'Historias entrelazadas del mundo criminal de Los Ángeles.'
    }
  ];

  private nextId: number = 4;

  getAllMovies(): Movie[] {
    return [...this.movies];
  }

  getMovieById(id: number): Movie | undefined {
    return this.movies.find(movie => movie.id === id);
  }

  addMovie(movie: Omit<Movie, 'id'>): Movie {
    const newMovie: Movie = {
      ...movie,
      id: this.nextId++
    };
    this.movies.push(newMovie);
    return newMovie;
  }

  updateMovie(id: number, updatedMovie: Partial<Movie>): Movie | undefined {
    const index = this.movies.findIndex(movie => movie.id === id);
    if (index !== -1) {
      this.movies[index] = { ...this.movies[index], ...updatedMovie };
      return this.movies[index];
    }
    return undefined;
  }

  deleteMovie(id: number): boolean {
    const index = this.movies.findIndex(movie => movie.id === id);
    if (index !== -1) {
      this.movies.splice(index, 1);
      return true;
    }
    return false;
  }
}