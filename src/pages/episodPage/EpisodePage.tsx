import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import {
	Typography,
	Card,
	CardContent,
	styled,
	Container as MUIContainer,
	Pagination,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { JutsuKaisenData } from "../../data/dataJujutsuKaisen"; // Импортируем данные из JutsuKaisenData
import backgroundImage from "../../assets/img/DALL·E 2024-09-20 21.04.13 - A serene anime-style scene featuring blooming sakura trees, with soft, pink cherry blossoms illuminated by gentle evening light. The sky is a gradient.webp";

const EPISODES_PER_PAGE = 1; // Количество эпизодов на странице

const EpisodePage: React.FC = () => {
	const { id } = useParams<{ id: string }>();

	// Используем данные из JutsuKaisenData
	const anime = JutsuKaisenData.find((anime) => anime.id === id);
	const episodeList = anime ? anime.episodes : [];
	const [currentPage, setCurrentPage] = useState<number>(1);

	useEffect(() => {
		console.log("animeEpisode:", anime);
	}, [anime]);

	const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
		setCurrentPage(page);
	};

	if (!anime) {
		return (
			<MUIContainer>
				<Typography variant="h4" gutterBottom>
					Аниме не найдено.
				</Typography>
			</MUIContainer>
		);
	}

	if (episodeList.length === 0) {
		return (
			<MUIContainer>
				<Typography variant="h4" gutterBottom>
					Эпизоды не найдены.
				</Typography>
			</MUIContainer>
		);
	}

	// Определение эпизодов для текущей страницы
	const startIndex = (currentPage - 1) * EPISODES_PER_PAGE;
	const endIndex = startIndex + EPISODES_PER_PAGE;
	const currentEpisodes = episodeList.slice(startIndex, endIndex);

	return (
		<CustomContainer>
			<Typography variant="h4" gutterBottom>
				{anime.title}
			</Typography>

			{currentEpisodes.length > 0 && (
				<StyledCard>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							Эпизод {currentEpisodes[0].episodeNumber}:{" "}
							{currentEpisodes[0].title}
						</Typography>

						<Typography variant="body2" color="text.secondary">
							{currentEpisodes[0].description}
						</Typography>

						{currentEpisodes[0].videoUrl ? (
							<div style={{ marginTop: "10px" }}>
								<ReactPlayer
									url={currentEpisodes[0].videoUrl}
									controls={true}
									width="100%"
									height="auto"
									onError={(e) => console.error("Ошибка загрузки видео:", e)}
								/>
							</div>
						) : (
							<Typography variant="body2" color="text.secondary">
								Видео не доступно для этого эпизода.
							</Typography>
						)}
					</CardContent>
				</StyledCard>
			)}

			{episodeList.length > 1 && (
				<Pagination
					count={Math.ceil(episodeList.length / EPISODES_PER_PAGE)} // Количество страниц
					page={currentPage}
					onChange={handlePageChange}
					color="primary"
					style={{
						marginTop: "20px",
						display: "flex",
						justifyContent: "center",
					}}
				/>
			)}
		</CustomContainer>
	);
};

export default EpisodePage;

const CustomContainer = styled("div")({
	backgroundImage: `url(${backgroundImage})`,
	backgroundSize: "cover",
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	backgroundPosition: "center",
	backgroundRepeat: "no-repeat",
	minHeight: "100vh",
	padding: "20px",
});

const StyledCard = styled(Card)(({ theme }) => ({
	width: "100%",
	maxWidth: "600px",
	margin: "20px",
	transition: "transform 0.3s ease, box-shadow 0.3s ease",
	background: "white",
	textAlign: "center",
	"&:hover": {
		transform: "scale(1.05)",
		boxShadow: theme.shadows[6],
	},
}));
