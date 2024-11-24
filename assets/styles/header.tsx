import {
    StyleSheet
} from "react-native"

interface Data {
    headerColor: string;
}

export default function getStyles({
    headerColor
}: Data) {
    return StyleSheet.create({
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
}