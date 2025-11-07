import { BaseColors, radius, spacingX, spacingY } from '@/constants/theme'
import { useTheme } from '@/hooks/useTheme'
import { getContributorImage } from '@/services/imageService'
import { formatCurrency } from '@/utils/helpers'
import { verticalScale } from '@/utils/styling'
import { TransactionItemProps, TransactionListType } from '@/utils/types'
import { FlashList } from "@shopify/flash-list"
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Timestamp } from 'firebase/firestore'
import React from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { ContributorType } from '../utils/types'
import Loading from './Loading'
import Typography from './Typography'

const isIOS = Platform.OS === "ios"

export default function TransactionList({ data, title, loading, emptyListMessage }: TransactionListType) {
    const router = useRouter();
    const { Colors, currentTheme } = useTheme();

    const handleClick = function(item: ContributorType) {
        router.push({ pathname: "/(modals)/contributionTransactionModal", params: { id: item?.id, } })
    }

  return (
    <View style={styles.container}>
        {title && (
            <Typography size={isIOS ? 21 : 23} fontFamily="urbanist-semibold" color={Colors.text}>
                {title}
            </Typography>
        )}

        <View style={styles.list}>
            <FlashList
                data={data}
                renderItem={({ item, index }) => (
                    <TransactionItem key={index} item={item as ContributorType} index={index} handleClick={handleClick} />
                )}
                {...({ estimatedItemSize: 60 } as any)}
            />
        </View>

        {(!loading && data.length < 1) && (
            <Typography
                size={isIOS ? 15 : 17}
                color={Colors.textLighter}
                style={{ textAlign: "center", marginTop: spacingY._15 }}
            >
                {emptyListMessage}
            </Typography>
        )}

        {(loading) && (
            <View style={{ top: verticalScale(30) }}>
                <Loading color={BaseColors[currentTheme == "light" ? "primaryLight" : "accent"]} />
            </View>
        )}
    </View>
  )
}

function TransactionItem({ item, index, handleClick }: TransactionItemProps) {
    const { Colors } = useTheme();

    const date = (item?.date as Timestamp)?.toDate()?.toLocaleDateString("en-Gb", {
        day: "numeric",
        month: "short",
    })

    return (
        <Animated.View entering={FadeInDown.delay(index * 70)}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.row, { backgroundColor: Colors.cardBackground }]}
                onPress={() => handleClick(item)}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={getContributorImage(item?.image ?? null)}
                        contentFit="cover"
                        style={{
                            height: verticalScale(50),
                            width: verticalScale(50),
                            borderRadius: radius._6,
                        }}
                    />
                </View>

                <View style={styles.details}>
                    <Typography
                        size={isIOS ? 17 : 20.5}
                        fontFamily="urbanist-semibold"
                    >
                        From {item.name || "an Annonymous"}
                    </Typography>
                    <Typography
                        size={isIOS ? 12 : 15}
                        color={Colors.textLighter}
                        textProps={{ numberOfLines: 2 }}
                        fontFamily="urbanist-medium"
                    >
                        {item.description || "--"}
                    </Typography>
                </View>

                <View style={styles.amountDetails}>
                    <Typography size={isIOS ? 17 : 20} fontFamily="urbanist-bold" color={BaseColors.primaryLight}>{formatCurrency(item.amount)}</Typography>
                    <Typography size={isIOS ? 12 : 15} fontFamily="urbanist-medium" color={Colors.textLighter}>{date}</Typography>
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: spacingY._15,
    },
    list: {
        minHeight: 3,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacingX._12,
        marginBottom: spacingY._10,
        padding: spacingY._10,
        paddingHorizontal: spacingY._10,
        borderRadius: radius._12,
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    details: {
        flex: 1,
        gap: 2,
    },
    amountDetails: {
        alignItems: "flex-end",
        gap: 3,
    },
});