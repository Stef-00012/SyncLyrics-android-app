import { Stack, IconButton } from "@react-native-material/core";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { FormattedLyric } from "@stef-0012/synclyrics";
import { View, Text, StyleSheet } from "react-native";
import type React from "react";

type Props = {
	trackName: string;
	albumName: string;
	artistName: string;
	headerColor: string;
	lyricsCached: boolean;
	onSettingsPress: () => void;
	spotifyClientID: string | null;
	spotifyClientSecret: string | null;
	lyricsSource: string | null | undefined;
	lyrics: Array<FormattedLyric> | null | undefined;
	setHeaderHeight: React.Dispatch<React.SetStateAction<number>>;
};

export default function Header({
	lyrics,
	trackName,
	albumName,
	artistName,
	headerColor,
	lyricsCached,
	lyricsSource,
	setHeaderHeight,
	onSettingsPress,
	spotifyClientID,
	spotifyClientSecret,
}: Props) {
	const styles = StyleSheet.create({
		header: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			padding: 10,
			backgroundColor: headerColor || "#1a1d21",
			zIndex: 1000,
		},
	
		headerLeft: {
			flexDirection: "column",
		},
	
		text: {
			fontFamily: "Arimo-Nerd-Font",
			color: "#fff",
		},
	
		settings: {
			width: 30,
			height: 30,
			marginRight: 10,
		},
	
		settingsIcon: {
			width: "100%",
			height: "100%",
		},
	});

	return (
		<View
			style={styles.header}
			onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
		>
			<View style={styles.headerLeft}>
				<Text style={styles.text}>
					<Text style={{ fontWeight: "bold" }}>Name:</Text> {trackName}
				</Text>
				
				<Text style={styles.text}>
					<Text style={{ fontWeight: "bold" }}>Artist(s):</Text> {artistName}
				</Text>
				
				<Text style={styles.text}>
					<Text style={{ fontWeight: "bold" }}>Album:</Text> {albumName}
				</Text>

				{lyrics && lyricsSource && spotifyClientID && spotifyClientSecret ? (
					<Text style={styles.text}>
						<Text style={{ fontWeight: "bold" }}>Lyrics Source:</Text>{" "}
						{lyricsSource}{" "}
						{lyricsCached ? (
							<Text style={{ fontStyle: "italic" }}>(Cached)</Text>
						) : (
							<View />
						)}
					</Text>
				) : (
					<View />
				)}
			</View>

			<Stack>
				<IconButton
					icon={() => (
						<MaterialIcons name="settings" color={"#999"} size={40} />
					)}
					onPress={onSettingsPress}
				/>
			</Stack>
		</View>
	);
}