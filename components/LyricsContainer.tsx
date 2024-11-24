import { View, StyleSheet, Text } from "react-native";
import { Pressable } from "@react-native-material/core";
import Lyrics from "@/components/Lyrics";
import type { FormattedLyric } from "@stef-0012/synclyrics";
import type {
	AuthRequestPromptOptions,
	AuthSessionResult,
} from "expo-auth-session";

type Props = {
	lyrics: Array<FormattedLyric> | null | undefined;
	spotifyAccessTokenExpiration: string | null;
	spotifyAccessToken: string | null;
	previousLyricsColor: string;
	currentLyricColor: string;
	nextLyricsColor: string;
	lyricsFontSize: string;
	headerHeight: number;
	promptAsync: (
		options?: AuthRequestPromptOptions,
	) => Promise<AuthSessionResult>;
	progress: number;
};

export default function LyricsContainer({
	spotifyAccessTokenExpiration,
	previousLyricsColor,
	spotifyAccessToken,
	currentLyricColor,
	nextLyricsColor,
	lyricsFontSize,
	headerHeight,
	promptAsync,
	progress,
	lyrics,
}: Props) {
	const styles = StyleSheet.create({
		mainContent: {
			marginTop: headerHeight,
			padding: 10,
		},

		spotifyLoginButtonContainer: {
			flex: 1,
			justifyContent: "center",
		},

		spotifyLoginButton: {
			backgroundColor: "#1ed760",
			borderRadius: 20,
			padding: 12,
			alignItems: "center",
			justifyContent: "center",
		},

		spotifyLoginText: {
			fontFamily: "Arimo-Nerd-Font",
			color: "#000000",
			fontSize: 25,
			fontWeight: "bold",
		},
	});

	return (
		<View style={styles.mainContent}>
			{spotifyAccessToken &&
			Number.parseFloat(String(spotifyAccessTokenExpiration)) > Date.now() ? (
				<View>
					<Lyrics
						lyrics={lyrics}
						progress={progress}
						headerHeight={headerHeight}
						lyricsFontSize={lyricsFontSize}
						nextLyricsColor={nextLyricsColor}
						currentLyricColor={currentLyricColor}
						previousLyricsColor={previousLyricsColor}
					/>
				</View>
			) : (
				<View style={styles.spotifyLoginButtonContainer}>
					<Pressable
						style={styles.spotifyLoginButton}
						onPress={() => promptAsync()}
					>
						<Text style={styles.spotifyLoginText}>Login with Spotify</Text>
					</Pressable>
				</View>
			)}
		</View>
	);
}
