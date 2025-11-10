import type React from "react";
import { useState } from "react";
import {
	View,
	Text,
	Pressable,
	Modal,
	TextInput,
} from "react-native";
import NativeColorPicker, {
	Panel1,
	Preview,
	OpacitySlider,
	HueSlider,
	InputWidget,
	Swatches,
} from "reanimated-color-picker";

interface CustomColorPickerProps {
	onSelectColor?: (color: string) => void;
	initialColor?: string;
}

export default function ColorPicker({
	onSelectColor,
	initialColor = "#FF0000",
}: CustomColorPickerProps) {
	const [modalVisible, setModalVisible] = useState(false);
	const [currentColor, setCurrentColor] = useState(initialColor);

	const handleColorSelect = ({ hex }: { hex: string }) => {
		setCurrentColor(hex);
		onSelectColor?.(hex);
	};

	const handleComplete = () => {
		setModalVisible(false);
	};

	return (
		<>
			<Pressable
				onPress={() => setModalVisible(true)}
				style={{
					flexDirection: "row",
					alignItems: "center",
					borderWidth: 1,
					borderColor: "#ccc",
					borderRadius: 8,
					paddingLeft: 12,
					height: 50,
				}}
			>
				<TextInput
					value={currentColor.toUpperCase()}
					style={{
                        flex: 1,
                        fontSize: 16,
                        color: "#000",
                    }}
					editable={false}
					placeholder="#000000"
				/>
				<View
					style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        marginHorizontal: 10,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        backgroundColor: currentColor
                    }}
				/>
			</Pressable>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={{
                    flex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
					<View style={{
                        width: "90%",
                        maxWidth: 400,
                        backgroundColor: "#fff",
                        borderRadius: 20,
                        padding: 20,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}>
						<NativeColorPicker
							// value={selectedColor.value}
							sliderThickness={25}
							thumbSize={24}
							thumbShape="circle"
							onChange={() => {}}
							boundedThumb
						>
							<Preview style={{
                                height: 40,
                                borderRadius: 20,
                                borderWidth: 1.5,
                                borderColor: "#ccc",
                                marginBottom: 10,
                            }} />
							<Panel1 style={{
                                borderRadius: 16,

                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,
                            }} />
							<HueSlider style={{
                                borderRadius: 20,
                                marginTop: 20,

                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,
                            }} />
							<OpacitySlider style={{
                                borderRadius: 20,
                                marginTop: 20,

                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,
                            }} />
							<Swatches
								style={{
                                    paddingTop: 20,
                                    marginTop: 20,
                                    borderTopWidth: 1,
                                    borderColor: "#bebdbe",
                                    alignItems: "center",
                                    flexWrap: "nowrap",
                                    gap: 10,
                                }}
								swatchStyle={{
                                    borderRadius: 20,
                                    height: 30,
                                    width: 30,
                                    margin: 0,
                                    marginBottom: 0,
                                    marginHorizontal: 0,
                                    marginVertical: 0,
                                }}
								colors={["#ffffff", "#000000"]}
							/>
							<View style={{
                                paddingTop: 20,
                                marginTop: 20,
                                borderTopWidth: 1,
                                borderColor: "#bebdbe",
                            }}>
								<InputWidget />
							</View>
						</NativeColorPicker>

						<Pressable style={{
                            backgroundColor: "#2196F3",
                            padding: 15,
                            borderRadius: 8,
                            marginTop: 20,
                            alignItems: "center",
                        }} onPress={handleComplete}>
							<Text style={{
                                color: "#fff",
                                fontSize: 16,
                                fontWeight: "600",
                            }}>Done</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
		</>
	);
};
