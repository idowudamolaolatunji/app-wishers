import { radius, spacingY } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import BackdropOverlay from "./BackdropOverlay";

interface Props {
	isOpen: any;
	toggleSheet: () => void;
	duration?: number;
	children: React.ReactNode;
    customHeight?: any;
}

export default function BottomSheet({ isOpen, toggleSheet, duration = 500, children, customHeight }: Props) {
	const { Colors } = useTheme();
	const height = useSharedValue(0);
	const progress = useDerivedValue(() => withTiming(isOpen.value ? 0 : 1, { duration }));

	const sheetStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: progress.value * 2 * height.value }],
	}));

	const backdropStyle = useAnimatedStyle(() => ({
		opacity: 1 - progress.value,
		zIndex: isOpen.value ? 1 : withDelay(duration, withTiming(-1, { duration: 0 })),
	}));

	return (
		<React.Fragment>
			<BackdropOverlay style={backdropStyle} handleClose={toggleSheet} />

			<Animated.View
				onLayout={(e) => {
					height.value = e.nativeEvent.layout.height;
				}}
				style={[styles.sheet, sheetStyle, { backgroundColor: Colors.cardBackground, height: customHeight ?? verticalScale(380) }]}
			>
				{children}
			</Animated.View>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	sheet: {
		padding: spacingY._17,
		paddingHorizontal: spacingY._20,
		width: "100%",
		position: "absolute",
		bottom: 0,
		borderTopRightRadius: radius._12,
		borderTopLeftRadius: radius._12,
		zIndex: 2,
		alignItems: "center",
		justifyContent: "center",
	},
});