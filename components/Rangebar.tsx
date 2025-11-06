import { BaseColors, radius } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Rangebar({ value=0, height=9 }: { value: number, height?: number }) {
    const { currentTheme } = useTheme();

	return (
		<View style={[styles.rangebar, { height: verticalScale(height), backgroundColor: BaseColors[currentTheme == "dark" ? "neutral700" : "neutral200"] }]}>
			<View style={[styles.value, { width: `${value}%` }]}></View>
		</View>
	);
}

const styles = StyleSheet.create({
    rangebar: {
        width: "100%",
        borderRadius: radius._6,
        overflow: "hidden",
    },
    value: {
        flex: 1,
        backgroundColor: BaseColors.primaryLight,
        borderRadius: radius._3
    },
});
