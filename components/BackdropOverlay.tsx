import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

export default function BackdropOverlay({ style, handleClose }: { style?: ViewStyle; handleClose: () => void }) {
	return (
		<Animated.View style={[styles.backdrop, style]}>
			<TouchableOpacity style={{ flex: 1 }} onPress={handleClose} />
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		zIndex: 100,
		overflow: "hidden",
	},
});
