import HomeCard from "@/components/HomeCard";
import HomeReferral from "@/components/HomeReferral";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransactionList from "@/components/TransactionList";
import { spacingX, spacingY } from '@/constants/theme';
import { useAuth } from "@/contexts/AuthContext";
import useFetchData from "@/hooks/useFetchData";
import { useTheme } from "@/hooks/useTheme";
import { ContributorType } from "@/utils/types";
import { useRouter } from "expo-router";
import { limit, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import { useState } from "react";
import { Platform, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from "react-native-reanimated";
import Typography from '../../components/Typography';
import { verticalScale } from '../../utils/styling';

const isIOS = Platform.OS === "ios";

export default function HomeScreen() {
	const router = useRouter();
	const { user } = useAuth();
	const { Colors } = useTheme();
	const displayName = user?.name?.split(" ").slice(0, 2).join(" ")

	const [showBanner, setShowBanner] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const handleRefresh = function() {
		setRefreshing(true);
		setTimeout(() => setRefreshing(false), 1500);
	}

	const { data, error, loading } = useFetchData<ContributorType>(
		"contributors", (user?.uid) ? [where("uid", "==", user.uid), limit(1)] : [],
	);

	return (
		<ScreenWrapper>
			<View style={styles.container}>
				
				<View style={styles.header}>
					<Animated.View style={{ gap: 4 }}
						entering={FadeInDown.duration(500)}
					>
						<Typography size={isIOS ? 16 : 18} fontFamily="urbanist-medium" color={Colors.textLighter}>Hello,</Typography>
						<Typography size={isIOS ? 20 : 24} fontFamily="urbanist-semibold">{displayName}</Typography>
					</Animated.View>

					<TouchableOpacity style={[styles.headerIcn, { backgroundColor: Colors.background300 }]} onPress={() => router.push("/(modals)/notificationModal")}>
						<Icons.BellIcon weight="bold" size={verticalScale(23)} color={Colors.textLighter} />
					</TouchableOpacity>
				</View>

				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={handleRefresh}
						/>
					}
					contentContainerStyle={styles.scrollViewStyle}
					showsVerticalScrollIndicator={false}
				>
					<HomeCard />

					{showBanner && <HomeReferral handleClose={() => setShowBanner(false)} />}

					{(!loading && error) && (
						<Typography>Error</Typography>
					)}

					{!error && (
						<TransactionList
							title="Recent Contributions"
							data={data as ContributorType[]}
							loading={loading}
							emptyListMessage="No contribution yet!"
						/>
					)}
				</ScrollView>
			</View>
		</ScreenWrapper>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: verticalScale(8),
		position: "relative",
		// paddingHorizontal: spacingX._18,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacingY._10,
		paddingHorizontal: spacingX._18,
	},
	headerIcn: {
		padding: spacingX._10,
		borderRadius: 50
	},
	scrollViewStyle: {
		paddingHorizontal: spacingX._18,
		marginTop: spacingY._10,
		paddingBottom: verticalScale(50),
		gap: spacingY._25
	}
});