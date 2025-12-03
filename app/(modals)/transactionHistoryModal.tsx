import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Loading from "@/components/Loading";
import ModalWrapper from "@/components/ModalWrapper";
import ScreenHeader from "@/components/ScreenHeader";
import TransactionItem from "@/components/TransactionItem";
import Typography from "@/components/Typography";
import { BaseColors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import useFetchData from "@/hooks/useFetchData";
import { useTheme } from "@/hooks/useTheme";
import { verticalScale } from "@/utils/styling";
import { TransactionType } from "@/utils/types";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";


export default function TransactionHistoryModal() {
    const router = useRouter();
	const { user } = useAuth();
	const { Colors, currentTheme } = useTheme();

	const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

	const { data: transactionData, error, loading: transactionLoading, refetch: refetchTransactions } = useFetchData<TransactionType>(
		"transactions", user?.uid ? [where("uid", "==", user.uid), orderBy("paidAt", "desc")] : []
	);

	const handleRefresh = function() {
		setRefreshing(true);
		refetchTransactions();
    	setRefreshing(false);
	}

	const handleClickTransaction = function(item: TransactionType) {
		router.push({ pathname: "/(modals)/transactionDetailsModal", params: { refId: item?.refId, } })
	}

	return (
		<ModalWrapper>
			<View style={styles.container}>
				<ScreenHeader title="Transaction History" leftElement={<BackButton />} style={{ marginBottom: spacingY._15 }} />

                <View style={{ flexDirection: "row" , alignItems: "center", gap: spacingX._10 }}>
                    <FormInput
                        placeholder="Search for a transaction"
                        icon={<Icons.MagnifyingGlassIcon size={verticalScale(24)} color={BaseColors.primary} weight="bold" />}
                        value={searchQuery}
                        onChangeText={(value: string) => setSearchQuery(value)}
                        containerStyle={{ flex: 1 }}
                    />

                    <Button style={{ paddingHorizontal: spacingX._15 }}>
                        <Icons.SlidersHorizontalIcon color={BaseColors.white} size={verticalScale(25)} weight="bold" />
                    </Button>
                </View>

				<ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ marginTop: spacingY._10, paddingBottom: spacingY._35 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
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
		</ModalWrapper>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
		paddingHorizontal: spacingY._20,
	},
});
