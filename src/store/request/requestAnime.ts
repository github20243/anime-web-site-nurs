import axios from "axios";
import { Anime, AnimeInfo, AnimeEpisode } from "../../types/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

const ANIME_CART_URL = import.meta.env.VITE_APP_URL;
const ANIME_INFO_URL = import.meta.env.VITE_APP_ANIME_INFO_URL;
const EPISODES_VIDEO_URL = import.meta.env.VITE_APP_EPISODES_VIDEO_URL;

export const getAnimes = createAsyncThunk<
	Anime[],
	void,
	{ rejectValue: string }
>("animes/getAnimes", async (_, { rejectWithValue }) => {
	try {
		const response = await fetch(
			"https://caa3b07d2a4f13be.mokky.dev/anime-videos",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
		}

		const data: Anime[] = await response.json();
		return data;
	} catch (error) {
		console.error("Ошибка при получении аниме:", error);
		return rejectWithValue("Не удалось получить список аниме");
	}
});

export const getAnimeInfo = createAsyncThunk<
	AnimeInfo,
	string,
	{ rejectValue: string }
>("animes/getAnimeInfo", async (animeId, { rejectWithValue }) => {
	console.log(animeId, "work");
	try {
		if (!animeId) {
			return rejectWithValue("ID аниме не задан");
		}

		const response = await fetch(`${ANIME_INFO_URL}/${animeId}`);

		if (!response.ok) {
			throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
		}

		const data: AnimeInfo = await response.json();
		return data;
	} catch (error) {
		console.error("Ошибка при получении информации об аниме:", error);
		return rejectWithValue("Не удалось получить информацию об аниме");
	}
});

export const getEpisodes = createAsyncThunk<
	AnimeEpisode[],
	string,
	{ rejectValue: string }
>("animes/getEpisodes", async (animeId, { rejectWithValue }) => {
	try {
		const response = await axios.get<AnimeEpisode[]>(
			`${EPISODES_VIDEO_URL}/${animeId}/episodes`,
			{
				headers: {
					"Cache-Control": "no-cache",
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error("Ошибка при получении эпизодов:", error);
		return rejectWithValue("Не удалось получить список эпизодов");
	}
});
