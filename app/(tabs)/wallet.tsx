import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typography from "@/components/Typography";
import { BaseColors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import useFetchData from "@/hooks/useFetchData";
import { useTheme } from "@/hooks/useTheme";
import { verticalScale } from "@/utils/styling";
import { TransactionType, WalletType } from "@/utils/types";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import { Platform, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { formatCurrency } from '../../utils/helpers';


const isIOS = Platform.OS === "ios"

export default function WalletScreen() {
	const router = useRouter();
	const { user } = useAuth();
	const { Colors, currentTheme } = useTheme();
	const [refreshing, setRefreshing] = useState(false);
	
	const { data: walletData, loading: walletLoading, refetch: refetchWallet } = useFetchData<WalletType>(
		"wallets", (user?.uid) ? [where("uid", "==", user.uid), limit(1)] : [],
	);
	const wallet = walletData?.[0];

	const constraints = user?.uid 
		? [where("uid", "==", user.uid), orderBy("created", "desc")]
		: [orderBy("created", "desc")]
	;
	const { data: transactionData, error, loading: transactionLoading, refetch: refetchTransactions } = useFetchData<TransactionType>("transactions", constraints);

	const handleRefresh = function() {
		setRefreshing(true);
		refetchWallet();
		refetchTransactions();
    	setRefreshing(false);
	}

	return (
		<ScreenWrapper>
			<View style={styles.container}>
                {/* balance */}
				<View style={[styles.balanceView]}>
					<View style={{ alignItems: "center" }}>
						<Typography size={isIOS ? 42 : 45} fontFamily="urbanist-semibold">
							{walletLoading ? "----" : formatCurrency(wallet?.remainingBalance ?? 0)}
						</Typography>
						<Typography size={isIOS ? 16 : 18} color={Colors.textLighter} fontFamily="urbanist-medium">
							Remaining Balance
						</Typography>
					</View>
				</View>


				<View style={[styles.transactionView, { backgroundColor: Colors[currentTheme == "dark" ? "background300" : "cardBackground"] }]}>

					<View style={styles.flexRow}>
						<Typography size={isIOS ? 20 : 23} fontFamily="urbanist-semibold">My Transactions</Typography>

						<TouchableOpacity
							onPress={() => router.push("/(modals)/withdrawalModal")}
							activeOpacity={0.75}
							style={{
								width: verticalScale(isIOS ? 37 : 40),
								height: verticalScale(isIOS ? 37 : 40),
								backgroundColor: BaseColors.primaryLight,
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 100
							}}
						>
							<Icons.HandWithdrawIcon
								weight="fill"
								color={BaseColors.white}
								size={verticalScale(30)}
							/>
						</TouchableOpacity>
					</View>

					<ScrollView
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={handleRefresh}
							/>
						}
						bounces={false}
						// contentContainerStyle={styles.listContainer}
                    	showsVerticalScrollIndicator={false}
					>

						{transactionLoading && (
							<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
								<Loading color={BaseColors[currentTheme == "light" ? "primaryLight" : "accentDarker"]} />
							</View>
						)}

						{(!transactionLoading && transactionData.length < 1) && (
							<View
								style={{
									alignItems: "center",
									justifyContent: "center",
									marginTop: spacingY._50
								}}
							>
								<Image
									source={require("@/assets/images/icon-naira.png")}
									style={{ width: verticalScale(95), height: verticalScale(95), }}
									contentFit="cover"
								/>
								<Typography
									size={isIOS ? 15 : 17}
									color={Colors.textLighter}
									style={{ textAlign: "center", marginTop: spacingY._15 }}
								>
									No transactions yet!
								</Typography>
							</View>
						)}
						
					</ScrollView>
				</View>
            </View>
		</ScreenWrapper>
	);
}


const styles = StyleSheet.create({
    container: {
		flex: 1,
		justifyContent: "space-between",
    },
	balanceView: {
		height: verticalScale(160),
		alignItems: "center",
		justifyContent: "center",
	},
	flexRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacingY._10,
	},
	transactionView: {
		flex: 1,
		borderTopRightRadius: radius._30,
		borderTopLeftRadius: radius._30,
		padding: spacingX._20,
		paddingTop: spacingX._25
	},
});