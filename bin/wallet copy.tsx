import { TransactionItem } from "@/bin/TransactionList";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typography from "@/components/Typography";
import { BaseColors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import useFetchData from "@/hooks/useFetchData";
import { useTheme } from "@/hooks/useTheme";
import { formatCurrency } from "@/utils/helpers";
import { verticalScale } from "@/utils/styling";
import { TransactionType, WalletType } from "@/utils/types";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";



export default function WalletScreen() {
	const router = useRouter();
	const { user } = useAuth();
	const { Colors, currentTheme } = useTheme();
	const [refreshing, setRefreshing] = useState(false);
	const [showOptionsMenu, setShowOptionsMenu] = useState(false);
	
	const { data: walletData, loading: walletLoading, refetch: refetchWallet } = useFetchData<WalletType>(
		"wallets", (user?.uid) ? [where("uid", "==", user.uid), limit(1)] : [],
	);
	const wallet = walletData?.[0];

	const { data: transactionData, error, loading: transactionLoading, refetch: refetchTransactions } = useFetchData<TransactionType>(
		"transactions", user?.uid ? [where("uid", "==", user.uid), orderBy("paidAt", "desc")] : []
	);

	const handleRefresh = function() {
		setRefreshing(true);
		refetchWallet();
		refetchTransactions();
    	setRefreshing(false);
	}

	const handleClickTransaction = function(item: TransactionType) {
		router.push({ pathname: "/(modals)/transactionDetailsModal", params: { id: item?.id, } })
	}

	return (
		<ScreenWrapper>
			<View style={styles.container}>
                {/* balance */}
				<View style={[styles.balanceView]}>
					<View style={{ alignItems: "center" }}>
						<Typography size={42.5} fontFamily="urbanist-semibold">
							{walletLoading ? "----" : formatCurrency(wallet?.remainingBalance ?? 0)}
						</Typography>
						<Typography size={17} color={Colors.textLighter} fontFamily="urbanist-medium">
							Remaining Balance
						</Typography>

						{wallet?.remainingBalance >= 1000 && (
							<TouchableOpacity
								onPress={() => router.push("/(modals)/withdrawalModal")}
								style={{
									marginTop: spacingY._10,
									padding: spacingY._10,
									paddingVertical: spacingY._7,
									borderRadius: radius._6,
									flexDirection: "row",
									alignItems: "center",
									gap: spacingY._5,
									backgroundColor: BaseColors.accentDark,
								}}
							>
								<Icons.CurrencyNgnIcon color={BaseColors.primary} weight="bold" size={verticalScale(18)} />
								<Typography fontFamily="urbanist-bold" size={19} color={BaseColors.primary}>Withdral Funds</Typography>
							</TouchableOpacity>
						)}
					</View>
				</View>

				<View style={[styles.transactionView, { backgroundColor: Colors[currentTheme == "dark" ? "background300" : "cardBackground"] }]}>

					{/* <View style={styles.flexRow}>
						<Typography size={21} fontFamily="urbanist-semibold">My Transactions</Typography>

						<TouchableOpacity
							// onPress={() => router.push("/(modals)/withdrawalModal")}
							onPress={() => setShowOptionsMenu(true)}
							activeOpacity={0.75}
							style={{
								width: verticalScale(37.5),
								height: verticalScale(37.5),
								backgroundColor: BaseColors.accent,
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 100
							}}
						>
							<Icons.DotsThreeOutlineVerticalIcon
								weight="fill"
								color={BaseColors.primaryLight}
								size={verticalScale(30)}
							/>
						</TouchableOpacity>
					</View> */}

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
							<View style={{ flex: 1, alignItems: "center", justifyContent: "center", height: 200, }}>
								<Loading color={BaseColors[currentTheme == "light" ? "primaryLight" : "accentDark"]} />
							</View>
						)}

						{(!transactionLoading && transactionData.length > 0) && (
							<View style={{ minHeight: 3 }}>
								<FlashList
									data={transactionData as TransactionType[]}
									renderItem={({ item, index }) => (
										<TransactionItem key={index} item={item as TransactionType} index={index} handleClick={handleClickTransaction} />
									)}
									{...({ estimatedItemSize: 60 } as any)}
								/>
							</View>
						)}

						{(!transactionLoading && transactionData.length < 1) && (
							<View
								style={{
									alignItems: "center",
									justifyContent: "center",
									marginTop: spacingY._50,
								}}
							>
								<Image
									source={require("@/assets/images/icon-naira.png")}
									style={{ width: verticalScale(95), height: verticalScale(95), }}
									contentFit="cover"
								/>
								<Typography
									size={15.5}
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
		height: verticalScale(180),
		alignItems: "center",
		justifyContent: "center",
	},
	flexRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	transactionView: {
		backgroundColor:"red",
		flex: 1,
		gap: spacingY._5,
		borderTopRightRadius: radius._30,
		borderTopLeftRadius: radius._30,
		paddingHorizontal: spacingX._18,
	},
});