import { BaseColors, radius, spacingY } from '@/constants/theme'
import { useTheme } from '@/hooks/useTheme'
import { verticalScale } from '@/utils/styling'
import LottieView from "lottie-react-native"
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Button from './Button'
import Typography from './Typography'


export default function SubscribeCompleted({ handleFinish }: { handleFinish: () => void; }) {
    const { Colors } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: Colors.cardBackground }]}>
            <LottieView
                autoPlay
                loop
                source={require("@/assets/lottie/joyful.json")}
                style={{ width: verticalScale(200), aspectRatio: 1, marginTop: -50, }}
            />

            <View style={{ alignItems: "center", gap: spacingY._7 }}>
                <Typography color={Colors.text} fontFamily="urbanist-semibold" size={verticalScale(32.5)}>Success!!</Typography>
                <Typography color={Colors.textLighter} size={19} style={{ textAlign: "center" }}>Your payment has been made successfully!</Typography>
            </View>

            <Button style={{ width: "100%"}} onPress={handleFinish}>
                <Typography fontFamily="urbanist-semibold" size={25} color={BaseColors.white}>Finish</Typography>
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        minHeight: verticalScale(100),
        borderRadius: radius._10,
        padding: spacingY._17,
        paddingVertical: spacingY._25,

        alignItems: "center",
        gap: spacingY._25,
        textAlign: "center",
    },
})