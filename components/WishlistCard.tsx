import { BaseColors, radius, spacingX, spacingY } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { getFilePath, getProfileImage } from "@/services/imageService";
import { calculatePercentage, formatCurrency, formatNumber, formatShortCurrency } from "@/utils/helpers";
import { verticalScale } from "@/utils/styling";
import { WishlistType } from "@/utils/types";
import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Rangebar from "./Rangebar";
import Typography from "./Typography";
import WishlistCreator from "./WishlistCreator";

export default function WishlistCard({ item, index, isFeatured=false, handleOpenDetails }: { item: WishlistType; index: number; isFeatured?: boolean; handleOpenDetails: () => void }) {
	const { Colors, currentTheme } = useTheme();
	const percentage = calculatePercentage(item?.totalAmountReceived ?? 0, item?.totalGoalAmount ?? 0);

	return (
		<Animated.View {...(!isFeatured && {entering: FadeInDown.delay(index * 70) })}>
			<TouchableOpacity activeOpacity={0.8} style={[styles.card, { backgroundColor: Colors.background200, gap: spacingY[isFeatured ? "_8_5" : "_15"] }]} onPress={handleOpenDetails}>
				<ImageBackground source={getFilePath(item?.image)} contentFit="cover" imageStyle={{ borderRadius: radius._10 }} style={{ width: "100%", borderRadius: radius._10, height: verticalScale(!isFeatured ? 170 : 155) }}>
					{isFeatured ? (
						<LinearGradient
							colors={currentTheme == "dark" ? ['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.85)'] : ['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.7)']}
							style={{ flex: 1, justifyContent: 'flex-end', padding: spacingY._7, borderRadius: radius._10 }}
						>
							<WishlistCreator uid={item?.uid!} />
						</LinearGradient>
					): (
						item?.currentboostExpiresAt! > new Date().toISOString() && <LottieView source={require("@/assets/lottie/rocket.json")} loop autoPlay style={{ width: 24, height: 24, marginTop: -7, position: "absolute", top: "5%", right: "3.5%" }} />
					)}
				</ImageBackground>


				<View style={styles.cardDetails}>
					<Typography size={22} fontFamily="urbanist-bold">
						{item?.title}
					</Typography>

					{item.description && (
						<Typography textProps={{ numberOfLines: 1 }} color={Colors.textLighter}>
							{item.description}
						</Typography>
					)}

					<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
						<View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
							{item?.contributorsImages && (item?.contributorsImages?.length || 0) > 1 ? (
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									{(item?.contributorsImages as string[])?.map((img, i) => (
										<Image source={getProfileImage(img)} style={[styles.contributorImage, { backgroundColor: BaseColors.neutral300, borderColor: BaseColors.white, marginRight: i == (item?.contributorsImages?.length || 1) - 1 ? 0 : -10 }]} contentFit="cover" key={i} />
									))}
								</View>
							) : (
								<React.Fragment>
									{(isFeatured && item?.totalContributors) ? (
										<Image source={getProfileImage(null)} style={[styles.contributorImage, { backgroundColor: BaseColors.neutral300, borderColor: BaseColors.white,  }]} contentFit="cover" />
									) : (
										<Icons.UsersThreeIcon size={21} color={Colors.textLighter} />
									)}
								</React.Fragment>
							)}
							<Typography fontFamily="urbanist-medium" size={verticalScale(17)} color={Colors.textLighter}>
								{formatNumber(item?.totalContributors || 0) || "No"} Giver{item?.totalContributors === 1 ? "" : "s"} {(isFeatured && item.totalContributors == 0) ? "Yet!" : ""}
							</Typography>
						</View>
						<View style={{ flexDirection: "row", gap: 3 }}>
							<Icons.GiftIcon size={21} color={Colors.textLighter} />
							<Typography fontFamily="urbanist-medium" size={verticalScale(17)} color={Colors.textLighter}>
								{item?.totalWishItems} Wish{item?.totalWishItems === 1 ? "" : "es"}
							</Typography>
						</View>
					</View>

					<Rangebar value={percentage} />

					<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
						<Typography fontFamily="urbanist-semibold" size={verticalScale(18)} color={Colors.neutral400}>
							{percentage}% Raised
						</Typography>
						{!item?.isCompleted ? (
							<Typography fontFamily="urbanist-bold" size={verticalScale(19)} color={BaseColors.primaryLight}>
								{item?.totalAmountReceived ? `${formatShortCurrency(item?.totalAmountReceived ?? 0)} / ${formatShortCurrency(item?.totalGoalAmount ?? 0)}` : formatCurrency(0)}
							</Typography>
						) : (
							<View style={{ flexDirection: "row", alignItems: "center", gap: spacingX._5 }}>
								<Typography fontFamily="urbanist-bold" size={verticalScale(19)} color={BaseColors.primaryLight}>
									Completed
								</Typography>
								<LottieView source={require("@/assets/lottie/popper-big.json")} loop autoPlay style={{ width: 24, height: 24, marginTop: -7 }} />
							</View>
						)}
					</View>
				</View>
			</TouchableOpacity>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: radius._10,
		padding: spacingY._7,
		marginBottom: spacingY._15,
	},
	cardDetails: {
		gap: spacingY._10,
		// added
		padding: spacingY._7,
		paddingTop: spacingY._3,
	},
	contributorImage: {
		height: verticalScale(24),
		width: verticalScale(24),
		borderRadius: 100,
		borderWidth: 1,
	},
});
