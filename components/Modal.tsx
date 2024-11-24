import { Modal, View, Text, StyleSheet, ScrollView } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable } from "@react-native-material/core";

type Props = {
	closeSettingsRef: React.RefObject<View>;
	children: React.ReactNode;
	onClose: () => void;
	isVisible: boolean;
};

export default function SettingsModal({
	closeSettingsRef,
	isVisible,
	children,
	onClose,
}: Props) {
	return (
		<Modal animationType="fade" transparent={true} visible={isVisible}>
			<View style={styles.overlay}>
				<View style={styles.modalContent} ref={closeSettingsRef}>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Settings</Text>
						<Pressable onPress={onClose}>
							<MaterialIcons name="close" color="#fff" size={22} />
						</Pressable>
					</View>
					<ScrollView>
						{children}
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
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
