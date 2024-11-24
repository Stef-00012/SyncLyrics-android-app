import { Modal, View, Text, StyleSheet, ScrollView } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable } from "@react-native-material/core";
import getStyles from "@/assets/styles/modal";

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

const styles = getStyles()
