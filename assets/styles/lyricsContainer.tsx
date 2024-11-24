import { StyleSheet } from "react-native"

interface Data {
    headerHeight: number
}

export default function getStyles({
    headerHeight
}: Data) {
    return StyleSheet.create({
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
}