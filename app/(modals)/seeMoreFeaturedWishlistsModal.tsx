import BackButton from "@/components/BackButton";
import ModalWrapper from "@/components/ModalWrapper";
import ScreenHeader from "@/components/ScreenHeader";
import { spacingY } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export default function SeeMoreFeaturedWishlistsModal() {
    return (
        <ModalWrapper>
            <View style={styles.container}>
                <ScreenHeader title="Featured Wishlists" leftElement={<BackButton />} style={{ marginBottom: spacingY._5 }} />
                
            </View>
        </ModalWrapper>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: spacingY._20,
    },
});