import BackButton from "@/components/BackButton";
import FormInput from "@/components/FormInput";
import Loading from "@/components/Loading";
import ModalWrapper from "@/components/ModalWrapper";
import ScreenHeader from "@/components/ScreenHeader";
import TransactionItem from "@/components/TransactionItem";
import Typography from "@/components/Typography";
import { BaseColors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import useFetchPaginatedData from "@/hooks/useFetchPaginatedData";
import { useTheme } from "@/hooks/useTheme";
import { verticalScale } from "@/utils/styling";
import { TransactionType } from "@/utils/types";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React from "react";
import { RefreshControl, StyleSheet, View } from "react-native";


export default function TransactionHistoryModal() {
    const router = useRouter();
	const { user } = useAuth();
	const { Colors, currentTheme } = useTheme();

	// const { data, error, loading: transactionLoading, refetch: refetchTransactions } = useFetchData<TransactionType>(
	// 	"transactions", user?.uid ? [where("uid", "==", user?.uid), orderBy("paidAt", "desc")] : []
	// );

    // const filteredTransaction = data?.filter((item) => {
    //     if(searchQuery?.length > 1) {
    //         if(
    //             item?.refId?.includes(searchQuery) || 
    //             String(item?.amount)?.includes(searchQuery) || 
    //             item?.type?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    //             item?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    //         ) {
    //             return true;
    //         }
    //         return false;
    //     }
    //     return true;
    // })

    const {
        data: transactions, 
        loading: transactionLoading, 
        loadingMore,
        searching,
        refreshing,
        hasMore,
        searchTerm: searchQuery,
        loadMore: handleLoadMore,
        refresh: handleRefresh,
        search: setSearchQuery,
        clearSearch
    } = useFetchPaginatedData<TransactionType>(
		"transactions", user?.uid ? [where("uid", "==", user?.uid), orderBy("paidAt", "desc")] : [], 25
    )

	const handleClickTransaction = function(item: TransactionType) {
		router.push({ pathname: "/(modals)/transactionDetailsModal", params: { refId: item?.refId, } })
	}

	return (
		<ModalWrapper>
			<View style={styles.container}>
				<ScreenHeader title="Transaction History" leftElement={<BackButton />} style={{ marginBottom: spacingY._15, paddingHorizontal: spacingY._20, }} />

                <View style={{ flexDirection: "row" , alignItems: "center", gap: spacingX._10, paddingHorizontal: spacingY._20, }}>
                    <FormInput
                        placeholder="Search for a transaction by reference ID"
                        icon={<Icons.MagnifyingGlassIcon size={verticalScale(24)} color={BaseColors.primary} weight="bold" />}
                        value={searchQuery}
                        onChangeText={(value: string) => setSearchQuery(value, "refId")}
                        containerStyle={{ flex: 1 }}
                        isSearch={true}
                        handleClearSearch={clearSearch}
                    />

                    {/* <Button style={{ paddingHorizontal: spacingX._15 }}>
                        <Icons.SlidersHorizontalIcon color={BaseColors.white} size={verticalScale(25)} weight="bold" />
                    </Button> */}
                </View>

                {searching && (
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", height: 200, }}>
                        <Loading color={BaseColors[currentTheme == "light" ? "primaryLight" : "accentDark"]} />
                    </View>
                )}

                <View style={{ minHeight: 3, flex: 1 }}>
                    <FlashList
                        data={transactions as TransactionType[]}
                        onEndReached={() => hasMore && handleLoadMore()}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={() => 
                            loadingMore ? (
                                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", height: 50 }}>
                                    <Loading size="small" />
                                </View>
                            ) : null
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: spacingY._20, marginTop: spacingY._10, paddingBottom: spacingY._35 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                        ListEmptyComponent={
                            (!refreshing) ? (
                                (transactionLoading || searching) ? (
                                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", height: 200, }}>
                                        <Loading color={BaseColors[currentTheme == "light" ? "primaryLight" : "accentDark"]} />
                                    </View>
                                ) : (
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
                                            {searchQuery ? "No transactions with this query" : "No transactions yet!"}
                                        </Typography>
                                    </View>
                                )
                            ) : null}
                        renderItem={({ item, index }) => (
                            <TransactionItem
                                key={index}
                                item={item as TransactionType}
                                index={index}
                                handleClick={handleClickTransaction}
                            />
                        )}
                    />
                </View>
			</View>
		</ModalWrapper>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
	},
});
