import {
    StyleSheet
} from "react-native"

export default function getStyles() {
    return StyleSheet.create({
        overlay: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        modalContent: {
            width: "80%",
            height: "60%",
            backgroundColor: "#25292e",
            borderRadius: 18,
            padding: 0,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
        },
        titleContainer: {
            height: 40,
            backgroundColor: "#464C55",
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        title: {
            fontFamily: "Arimo-Nerd-Font",
            color: "#fff",
            fontSize: 16,
        },
    });
}