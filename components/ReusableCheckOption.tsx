import { BaseColors, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { verticalScale } from '@/utils/styling';
import { CheckIcon } from 'phosphor-react-native';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Typography from './Typography';

const isIOS = Platform.OS === "ios";

export default function ReusableCheckOption({ title, text }: { title: string; text: string;}) {
    const { Colors, currentTheme } = useTheme();

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: currentTheme == "dark" ? "#dcfce733" : BaseColors.neutral200, borderRadius: 100, }]}>
                <CheckIcon color={BaseColors.primaryLight} size={20.5} weight='bold' />
            </View>

            <View style={{ gap: spacingY._3 }}>
                <Typography size={isIOS ? 17 : 19} fontFamily="urbanist-semibold">{title}</Typography>
                <Typography size={16} color={Colors.textLighter}>{text}</Typography>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: spacingX._15,
    },
    iconContainer: {
        width: verticalScale(35),
        height: verticalScale(35),
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
})