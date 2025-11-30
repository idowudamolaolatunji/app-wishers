import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { BaseColors, spacingY } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { verticalScale } from "@/utils/styling";
import { View } from "react-native";

export default function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
	const { Colors } = useTheme();

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				padding: spacingY._20,
				backgroundColor: Colors.background,
			}}
		>
			<Typography fontFamily="urbanist-bold" size={verticalScale(22)} color={BaseColors.rose} style={{ marginBottom: spacingY._10 }}>
				Oops! Something went wrong.
			</Typography>

			<Typography fontFamily="urbanist-regular" size={verticalScale(16)} style={{ marginBottom: spacingY._10 }}>{error.message}</Typography>

			<Button onPress={resetErrorBoundary} style={{ width: "100%" }}>
				<Typography fontFamily="urbanist-semibold" color={BaseColors.white} size={verticalScale(18)}>Reload App</Typography>
			</Button>
		</View>
	);
}
