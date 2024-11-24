import { StyleSheet } from "react-native"

interface Data {
    lyricsFontSize: string;
    previousLyricsColor: string;
    currentLyricColor: string;
    nextLyricsColor: string;
}

export default function getStyles({
    lyricsFontSize,
    previousLyricsColor,
    currentLyricColor,
    nextLyricsColor
}: Data) {
    return StyleSheet.create({
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
}