import axios from 'axios';

// action type constants
const CREATE_MOVIE = 'CREATE_MOVIE';
const DELETE_MOVIE = 'DELETE_MOVIE';
const SET_MOVIES = 'SET_MOVIES';
const UPDATE_MOVIE = 'UPDATE_MOVIE'

// action creators
const _createMovie = (movie) => {
  return {
    type: CREATE_MOVIE,
    movie,
  };
};

const _deleteMovie = (movie) => {
  return {
    type: DELETE_MOVIE,
    movie,
  };
};

const _setMovies = (movies) => {
  return {
    type: SET_MOVIES,
    movies,
  };
};

const _updateMovie = (movie) => {
  return {
    type: UPDATE_MOVIE,
    movie
  };
};

// THUNK CREATORS

export const createMovie = () => {
  return async (dispatch) => {
    const movie = (await axios.post('/api/movies')).data;
    dispatch(_createMovie(movie));
  };
};

export const fetchMovies = () => {
  return async (dispatch) => {
    const { data: movies } = await axios.get('/api/movies');
    dispatch(_setMovies(movies));
  };
};

export const deleteMovie = (movie) => {
  return async (dispatch) => {
    await axios.delete(`/api/movies/${movie.id}`);
    dispatch(_deleteMovie(movie))
  };
};

export const updateMovie = (movie) => {
  return async (dispatch) => {
    movie = (await axios.put(`/api/movies/${movie.id}`, movie)).data;
    dispatch(_updateMovie(movie));
  };
};

export default (state = [], action) => {
  switch (action.type) {
    case SET_MOVIES:
      return action.movies;
    case DELETE_MOVIE:
      return state.filter((movie) => movie.id !== action.movie.id);
    case CREATE_MOVIE:
      return [...state, action.movie];
    case UPDATE_MOVIE:
      return state.map(movie => movie.id !== action.movie.id ? movie : action.movie);
    default:
      return state;
  }
};