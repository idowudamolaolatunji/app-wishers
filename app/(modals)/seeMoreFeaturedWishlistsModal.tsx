import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Loading from "@/components/Loading";
import ModalNoudgeHandle from "@/components/ModalNoudgeHandle";
import ModalWrapper from "@/components/ModalWrapper";
import ScreenHeader from "@/components/ScreenHeader";
import Typography from "@/components/Typography";
import WishlistCard from "@/components/WishlistCard";
import { BaseColors, spacingX, spacingY } from "@/constants/theme";
import useDraggable from "@/hooks/useDraggable";
import useFetchPaginatedData from "@/hooks/useFetchPaginatedData";
import { useTheme } from "@/hooks/useTheme";
import { verticalScale } from "@/utils/styling";
import { WishlistType } from "@/utils/types";
import { FlashList } from "@shopify/flash-list";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import { Animated, Linking, Modal, Platform, Pressable, RefreshControl, StyleSheet, View } from "react-native";


export default function SeeMoreFeaturedWishlistsModal() {
    const { Colors, currentTheme } = useTheme();
    const { pan, panResponder, showModal: showFilterModal, setShowModal: setShowFilterModal } = useDraggable();

    const {
        data: featuredWishlists, 
        loading, 
        loadingMore,
        searching,
        refreshing,
        hasMore,
        searchTerm: searchQuery,
        loadMore: handleLoadMore,
        refresh: handleRefresh,
        search: setSearchQuery,
        clearSearch
    } = useFetchPaginatedData<WishlistType>(
        "wishlists", [
            where("currentboostExpiresAt", ">=", new Date().toISOString()), // active boosts
			orderBy("previousBoostingCount", "desc"), // most recent boost next
			orderBy("lastBoostedAt", "desc"), // most recent boost next
			orderBy("totalAmountReceived", "desc"), // highest paying first
			orderBy("totalContributors", "desc"), // highestes contributors next
        ], 4
    );


    return (
        <ModalWrapper>
            <View style={styles.container}>
                <ScreenHeader title="Featured Wishlists" leftElement={<BackButton />} style={{ marginBottom: spacingY._15, paddingHorizontal: spacingY._20 }} />
                
                <View style={{ flexDirection: "row" , alignItems: "center", gap: spacingX._10, paddingHorizontal: spacingY._20 }}>
                    <FormInput
                        placeholder="Search wishlists"
                        icon={<Icons.MagnifyingGlassIcon size={verticalScale(24)} color={BaseColors.primary} weight="bold" />}
                        value={searchQuery}
                        onChangeText={(value: string) => setSearchQuery(value, "title")}
                        containerStyle={{ flex: 1 }}
                        isSearch={true}
                        handleClearSearch={clearSearch}
                    />

                    <Button style={{ paddingHorizontal: spacingX._15 }} onPress={() => setShowFilterModal(true)}>
                        <Icons.SlidersHorizontalIcon color={BaseColors.white} size={verticalScale(25)} weight="bold" />
                    </Button>
                </View>

                {searching && (
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", height: 200, }}>
                        <Loading color={BaseColors[currentTheme == "light" ? "primaryLight" : "accentDark"]} />
                    </View>
                )}

                <View style={{ minHeight: 3, marginTop: spacingY._20, flex: 1 }}>
                    <FlashList
                        data={featuredWishlists as WishlistType[]}
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
                        contentContainerStyle={{ paddingHorizontal: spacingY._20 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                        ListEmptyComponent={
                            (!refreshing) ? (
                            (loading || searching) ? (
                                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", height: 200, }}>
                                    <Loading color={BaseColors[currentTheme == "light" ? "primaryLight" : "accentDark"]} />
                                </View>
                            ) : <Typography style={{ textAlign: "center", marginTop: spacingY._30 }}>No featured wshlist found {searchQuery?.length > 0 ? "with this query" : ""}</Typography>
                        ) : null}
                        renderItem={({ item, index }) => (
                            <WishlistCard
                                index={index}
                                key={index}
                                item={item}
                                isFeatured={true}
                                handleOpenDetails={() => Linking.openURL(item?.link!)}
                            />
                        )}
                    />
                </View>
            </View>

            <Modal
                visible={showFilterModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowFilterModal(false)}                
            >
                <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
                    <Pressable onPress={() => setShowFilterModal(false)} style={{ flex: 1 }} />

                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[
                            { minHeight: verticalScale(400), padding: spacingY._17, paddingBottom: spacingY._20, backgroundColor: Colors.background200, borderTopRightRadius: verticalScale(30), borderTopLeftRadius: verticalScale(30) },
                            pan.getLayout(),
                        ]}
                    >
                        {Platform.OS == "android" && <ModalNoudgeHandle />}
                        

                    </Animated.View>
                </View>
            </Modal>
        </ModalWrapper>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
});