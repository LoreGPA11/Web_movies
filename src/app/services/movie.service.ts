import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = '/api/movies';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async getAllMovies(): Promise<Movie[]> {
    // Si no estamos en el navegador, retornar array vacío
    if (!this.isBrowser) {
      return [];
    }

    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Error al cargar películas');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  async getMovieById(id: number): Promise<Movie | undefined> {
    if (!this.isBrowser) return undefined;

    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      if (!response.ok) return undefined;
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return undefined;
    }
  }

  async addMovie(movie: Omit<Movie, 'id'>): Promise<Movie | null> {
    if (!this.isBrowser) return null;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie)
      });
      if (!response.ok) throw new Error('Error al crear película');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  async updateMovie(id: number, movie: Partial<Movie>): Promise<Movie | undefined> {
    if (!this.isBrowser) return undefined;

    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie)
      });
      if (!response.ok) return undefined;
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return undefined;
    }
  }

  async deleteMovie(id: number): Promise<boolean> {
    if (!this.isBrowser) return false;

    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }
}