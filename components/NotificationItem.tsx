import { radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { formatDate } from '@/utils/helpers';
import { verticalScale } from '@/utils/styling';
import { NotificationType } from '@/utils/types';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Typography from './Typography';

export default function NotificationItem({ item, index, handleClick }: { item: NotificationType, index: number, handleClick: (i: NotificationType) => void }) {
    const { Colors, currentTheme } = useTheme();

    return (
        <Animated.View entering={FadeInDown.delay(index * 70)}>
            <Pressable onPress={() => handleClick(item)} style={[styles.row, { backgroundColor: Colors[currentTheme == "dark" ? "cardBackground" : "background300"], opacity: item?.read ? 0.5 : 1 }]}>
                <View style={styles.details}>
                    <Typography
                        size={20}
                        fontFamily="urbanist-semibold"
                        style={{ textTransform: "capitalize" }}
                    >
                        {item.title}
                    </Typography>
                    <Typography
                        size={14}
                        color={Colors.textLighter}
                        textProps={{ numberOfLines: 2 }}
                        fontFamily="urbanist-medium"
                    >
                        {item.body}
                    </Typography>
                </View>

                <View style={styles.moreDetails}>
                    <Typography>&nbsp;</Typography>
                    <Typography size={12.5} fontFamily="urbanist-medium" color={Colors.textLighter} style={{ marginTop: 4 }}>{formatDate(item?.createdAt)}</Typography>
                </View>
            </Pressable>
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacingX._12,
        marginBottom: spacingY._7,
        padding: spacingY._10,
        paddingHorizontal: spacingY._10,
        borderRadius: radius._12,
        minHeight: verticalScale(72)
    },
    details: {
        flex: 1,
        gap: spacingY._5,
    },
    moreDetails: {
        alignItems: "flex-end",
        gap: 3,
    },
})