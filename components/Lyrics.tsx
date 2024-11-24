import {
	ScrollView,
	View,
	Text,
	StyleSheet,
	useWindowDimensions,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import type { FormattedLyric } from "@stef-0012/synclyrics";

type Props = {
	lyrics: Array<FormattedLyric> | null | undefined;
	previousLyricsColor: string;
	currentLyricColor: string;
	nextLyricsColor: string;
	lyricsFontSize: string;
	headerHeight: number;
	progress: number;
};

export default function Lyrics({
	previousLyricsColor,
	currentLyricColor,
	nextLyricsColor,
	lyricsFontSize,
	headerHeight,
	progress,
	lyrics,
}: Props) {
	const styles = StyleSheet.create({
		lyricsContainer: {
			flex: 1,
			justifyContent: "center",
		},

		missingText: {
			fontFamily: "Arimo-Nerd-Font",
			color: "#fff",
			fontSize: 30,
			fontWeight: "bold",
			alignItems: "center"
		},

		previousLyrics: {
			fontFamily: "Arimo-Nerd-Font",
			fontSize: Number.parseFloat(lyricsFontSize) || 20,
			color: previousLyricsColor || "#302f2f",
			fontWeight: "semibold",
			marginTop: 2.5,
			marginBottom: 2.5,
		},

		currentLyric: {
			fontFamily: "Arimo-Nerd-Font",
			fontSize: (Number.parseFloat(lyricsFontSize) || 20) * 1.4,
			color: currentLyricColor || "#1ed760",
			fontWeight: "bold",
			marginTop: 2.5,
			marginBottom: 2.5,
		},

		nextLyrics: {
			fontFamily: "Arimo-Nerd-Font",
			fontSize: Number.parseFloat(lyricsFontSize) || 20,
			fontWeight: "semibold",
			color: nextLyricsColor || "#fff",
			marginTop: 2.5,
			marginBottom: 2.5,
		},
	});

	const scrollViewRef = useRef<ScrollView>(null);
	const [currentLyricY, setCurrentLyricY] = useState<number>(0);

	const { height } = useWindowDimensions();

	if (!lyrics) lyrics = [];

	const currentSeconds = progress / 1000;

	let firstLyric: string | undefined;
	let lastLyric: string | undefined;

	let firstTimestamp: number | undefined;
	let lastTimestamp: number | undefined;

	for (const lyric of lyrics) {
		const timestamp = lyric.time;
		const text = lyric.text;

		if (!firstLyric) firstLyric = text;
		if (!firstTimestamp && firstTimestamp !== 0) firstTimestamp = timestamp;

		if (currentSeconds >= timestamp) {
			lastLyric = text;
			lastTimestamp = timestamp;
		}
	}

	const searchLyric = lastLyric || firstLyric;
	const searchTimestamp = lastTimestamp || firstTimestamp;

	const currentLyricIndex: number = lyrics.findIndex(
		(lyric: FormattedLyric) =>
			lyric.time === searchTimestamp && lyric.text === searchLyric,
	);

	const previousLines = [...lyrics].splice(0, currentLyricIndex);
	const nextLines = [...lyrics].splice(currentLyricIndex + 1, lyrics.length);

	useEffect(() => {
		if (scrollViewRef.current && currentLyricIndex >= 0) {
			scrollViewRef.current.scrollTo({
				y: currentLyricY - height / 2 + headerHeight,
				animated: true,
			});
		}
	}, [currentLyricIndex, currentLyricY, headerHeight]);

	return (
		<ScrollView ref={scrollViewRef}>
			{!lyrics ||
			lyrics.length <= 0 ||
			currentLyricIndex < 0 ||
			!searchLyric ||
			(!searchTimestamp && searchTimestamp !== 0) ? (
				<View style={styles.lyricsContainer}>
					<Text style={styles.missingText}>No Lyrics Available</Text>
				</View>
			) : (
				<View>
					{previousLines.map((lyric) => (
						<Text key={lyric.time} style={styles.previousLyrics}>
							{lyric.text}
						</Text>
					))}
					<Text
						onLayout={(event) => setCurrentLyricY(event.nativeEvent.layout.y)}
						key={searchTimestamp}
						style={styles.currentLyric}
					>
						{searchLyric}
					</Text>
					{nextLines.map((lyric) => (
						<Text key={lyric.time} style={styles.nextLyrics}>
							{lyric.text}
						</Text>
					))}
				</View>
			)}
		</ScrollView>
	);
}
