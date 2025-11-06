import { useTheme } from "@/hooks/useTheme";
import { ScreenWrapperProps } from "@/utils/types";
import React from "react";
import { Dimensions, Platform, StatusBar, View } from "react-native";

const { height } = Dimensions.get("window");

export default function ScreenWrapper({ style, children }: ScreenWrapperProps) {
	let paddingTop = Platform.OS == "ios" ? height * 0.065 : 35;
	const { Colors, currentTheme } = useTheme();

	return (
		<View
			style={[ { paddingTop, flex: 1, backgroundColor: Colors.background }, style ]}
		>
			<StatusBar barStyle={currentTheme === "light" ? "dark-content" : "light-content"} backgroundColor={Colors.background} />
			{children}
		</View>
	);
}