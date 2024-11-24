import {
    StyleSheet
} from "react-native";

interface Data {
    backgroundColor: string;
    headerHeight: number;
}

export default function getStyles({
    backgroundColor,
    headerHeight
}: Data) {
    return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: backgroundColor || "#121212",
			alignItems: "center",
			justifyContent: "flex-start",
		},

		modalContent: {
			paddingVertical: 20,
			paddingHorizontal: 10,
		},

		inputTitle: {
			fontFamily: "Arimo-Nerd-Font",
			fontWeight: "bold",
			color: "#fff",
			marginBottom: 5,
			fontSize: 16,
			marginTop: 7.5,
		},

		infoInputTitleContainer: {
			flexDirection: "row",
			alignItems: "center",
		},

		textInput: {
			width: "100%",
			height: 40,
			borderColor: "#aaa",
			borderWidth: 1,
			borderRadius: 5,
			paddingHorizontal: 10,
			color: "#fff",
			marginBottom: 7.5,
			fontFamily: "Arimo-Nerd-Font",
		},

		passwordInput: {
			width: "90%",
			height: 40,
			borderColor: "#aaa",
			borderWidth: 1,
			borderRadius: 5,
			paddingHorizontal: 10,
			color: "#fff",
			marginBottom: 7.5,
			fontFamily: "Arimo-Nerd-Font",
		},

		inputContainer: {
			flexDirection: "row",
			alignItems: "center",
		},

		hidePasswordToggle: {
			padding: 5,
			marginBottom: 8,
			marginLeft: 5,
		},

		infoToggle: {
			padding: 5,
		},

		infoTooltip: {
			backgroundColor: "#8f949c",
		},

		infoTooltipBackground: {
			marginTop: 5,
		},

		saveButton: {
			marginTop: 7.5,
			backgroundColor: "#1ed760",
			borderRadius: 12,
			padding: 12,
			alignItems: "center",
			justifyContent: "center",
		},

		mainContent: {
			marginTop: headerHeight,
			padding: 10,
		},

		noInternetContainer: {
			flex: 1,
			justifyContent: "center",
		},

		noInternetText: {
			fontFamily: "Arimo-Nerd-Font",
			color: "#ffffff",
			fontSize: 25,
			fontWeight: "bold",
			padding: 12,
			borderRadius: 20,
			backgroundColor: "",
			alignItems: "center",
			justifyContent: "center",
		},

		spotifySettingsText: {
			fontFamily: "Arimo-Nerd-Font",
			color: "#ffffff",
			fontSize: 20,
			fontWeight: "bold",
			padding: 12,
			borderRadius: 20,
			backgroundColor: "",
			alignItems: "center",
			justifyContent: "center",
		},

		spotifySettingsTextLink: {
			textDecorationLine: "underline",
			color: "#1ed760",
		},
	});
}