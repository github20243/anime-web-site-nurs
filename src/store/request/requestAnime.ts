import axios from "axios";
import { Anime, AnimeInfo, AnimeEpisode } from "../../types/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_APP_API_URL;
const ANIME_INFO_URL = import.meta.env.VITE_APP_ANIME_INFO_URL;
const EPISODES_VIDEO_URL = import.meta.env.VITE_APP_EPISODES_VIDEO_URL;

// Получение списка аниме
export const getAnimes = createAsyncThunk<Anime[], void, { rejectValue: string }>(
  "animes/getAnimes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Ошибка сети');
      }
      const data: Anime[] = await response.json();
      return data;
    } catch (error) {
      console.error("Ошибка при получении аниме:", error);
      return rejectWithValue("Не удалось получить список аниме");
    }
  }
);

// Получение информации об аниме по ID
export const getAnimeInfo = createAsyncThunk<AnimeInfo, string, { rejectValue: string }>(
  "animes/getAnimeInfo",
  async (animeId, { rejectWithValue }) => {
    try {
      const response = await axios.get<AnimeInfo>(`${ANIME_INFO_URL}/${animeId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching anime info:", error);
      return rejectWithValue("Failed to fetch anime info");
    }
  }
);

// Получение видео-эпизодов по ID аниме
export const getEpisodes = createAsyncThunk<
  AnimeEpisode[],
  string, // Change this to string to match the expected animeId type
  { rejectValue: string }
>(
  "animes/getEpisodes",
  async (animeId, { rejectWithValue }) => {
    try {
      const response = await axios.get<AnimeEpisode[]>(`${EPISODES_VIDEO_URL}/${animeId}/episodes`, { // Correct the URL endpoint
        headers: {
          'Cache-Control': 'no-cache', // Запрет кэширования
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching episodes:", error);
      return rejectWithValue("Failed to fetch episodes");
    }
  }
);
