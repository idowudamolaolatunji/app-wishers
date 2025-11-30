import BackButton from '@/components/BackButton'
import ModalWrapper from '@/components/ModalWrapper'
import ScreenHeader from '@/components/ScreenHeader'
import Typography from '@/components/Typography'
import { radius, spacingY } from '@/constants/theme'
import { useTheme } from '@/hooks/useTheme'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import { CaretRightIcon } from 'phosphor-react-native'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'


export default function LegalPoliciesModal() {
    const router = useRouter();
    const { Colors } = useTheme();
    
    return (
        <ModalWrapper>
            <View style={styles.container}>
                <ScreenHeader title='Legals & Policies' leftElement={<BackButton />} style={{ marginBottom: spacingY._40 }} />

                <View style={{ flex: 1, gap: spacingY._5 }}>
                    <TouchableOpacity activeOpacity={0.95} style={[styles.cardItem, { backgroundColor: Colors.cardBackground }]} onPress={() => router.push("https://wishers.app/privacy-policy")}>
                        <Typography size={17} fontFamily="urbanist-medium">Privacy Policies</Typography>

                        <CaretRightIcon
                            size={verticalScale(20)}
                            weight="bold" color={Colors.text}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.95} style={[styles.cardItem, { backgroundColor: Colors.cardBackground }]} onPress={() => router.push("https://wishers.app/terms-of-use")}>
                        <Typography size={17} fontFamily="urbanist-medium">Terms of Use</Typography>

                        <CaretRightIcon
                            size={verticalScale(20)}
                            weight="bold" color={Colors.text}
                        />
                    </TouchableOpacity>
                </View>
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
    contentView: {
        gap: spacingY._30,
        marginTop: spacingY._15
    },
    cardItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderRadius: radius._10,
        marginBottom: spacingY._10
    }
})