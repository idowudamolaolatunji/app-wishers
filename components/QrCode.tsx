import { BaseColors, radius, spacingY } from '@/constants/theme'
import { useTheme } from '@/hooks/useTheme'
import { verticalScale } from '@/utils/styling'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

export default function QrCode({ link } : { link: string }) {
    const { Colors } = useTheme();
    
    return (
        <View style={[styles.card, { backgroundColor: Colors.cardBackground }]}>            
            <QRCode
                value={link}
                size={240}
                color={BaseColors.neutral800}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: verticalScale(300),
        minHeight: verticalScale(100),
        borderRadius: radius._10,
        padding: spacingY._17,
        paddingVertical: spacingY._20,
        alignSelf: "center",

        alignItems: "center",
        justifyContent: "center",
        gap: spacingY._22,
        textAlign: "center",
    },
})