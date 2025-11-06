import BackButton from "@/components/BackButton";
import ModalWrapper from "@/components/ModalWrapper";
import ScreenHeader from "@/components/ScreenHeader";
import Typography from "@/components/Typography";
import { BaseColors, radius, spacingX, spacingY } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { scale, verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import React from 'react';
import { Alert, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated from "react-native-reanimated";

const isIOS = Platform.OS === "ios"
export default function DeleteAccountModal() {
    const router = useRouter();
    const { Colors, currentTheme } = useTheme();

    const handleDeleteData = async function() {
    }

    const showDeleteDataAlert = function() {
        Alert.alert("Confirm", "Are you sure you want to take this action?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Yes, Logout",
                onPress: () => handleDeleteData(),
                style: "destructive"
            }
        ]);
    }

  return (
    <ModalWrapper>
        <View style={styles.container}>
            <ScreenHeader title='Delete Your Account?' leftElement={<BackButton iconType="cancel" />} style={{ marginBottom: spacingY._10 }} />

            <Animated.ScrollView contentContainerStyle={{ gap: spacingY._20, marginTop: spacingY._20 }}>
                <Typography size={verticalScale(isIOS ? 19 : 21)} fontFamily="urbanist-medium" color={Colors.text} style={{ lineHeight: 25 }}>This will permanently remove your personal information from the app, including transaction history, saved settings, and login data.</Typography>
                <Typography size={verticalScale(isIOS ? 19 : 21)} fontFamily="urbanist-medium" color={Colors.text}>You won't be able to undo this action.</Typography>

            </Animated.ScrollView>
        </View>
        
        <View style={[styles.flexRow, styles.footerArea, { borderTopColor: BaseColors[currentTheme == "dark" ? "neutral700" : "neutral400"] }]}>
            <TouchableOpacity style={[styles.button, { backgroundColor: Colors.neutral300 }]} onPress={() => router.back()}>
                <Typography size={20} fontFamily="urbanist-bold" color={Colors.black}>Cancel</Typography>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: Colors.rose }]} onPress={showDeleteDataAlert}>
                <Typography size={20} fontFamily="urbanist-bold" color={BaseColors.white}>Delete</Typography>
            </TouchableOpacity>
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
    flexRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._12
    },
    footerArea: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        marginBottom: spacingY._15,
        borderTopWidth: 1,
    },
    button: {
        minWidth: "47%",
        padding: spacingY._10,
        borderRadius: radius._12,
        borderCurve: "continuous",
        height: verticalScale(52),
        justifyContent: "center",
        alignItems: "center",
    },
});