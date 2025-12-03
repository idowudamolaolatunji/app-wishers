import { BaseColors, radius, spacingX, spacingY } from '@/constants/theme'
import { useTheme } from '@/hooks/useTheme'
import { getProfileImage } from '@/services/imageService'
import { formatCurrency, formatDate } from '@/utils/helpers'
import { verticalScale } from '@/utils/styling'
import { ContributorItemProps, ContributorListType } from '@/utils/types'
import { FlashList } from "@shopify/flash-list"
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { ContributorType } from '../utils/types'
import Loading from './Loading'
import Typography from './Typography'


export default function ContributionList({ data, title, loading, emptyListMessage }: ContributorListType) {
    const router = useRouter();
    const { Colors, currentTheme } = useTheme();

    const handleClick = function(item: ContributorType) {
        router.push({ pathname: "/(modals)/contributorModal", params: { refId: item?.refId, } })
    }

  return (
    <View style={styles.container}>
        {title && (
            <Typography size={21.5} fontFamily="urbanist-semibold" color={Colors.text}>
                {title}
            </Typography>
        )}

        {(loading) && (
            <View style={{ top: verticalScale(30) }}>
                <Loading color={BaseColors[currentTheme == "light" ? "primaryLight" : "accent"]} />
            </View>
        )}

        {!loading && data.length > 0 && (
            <View style={styles.list}>
                <FlashList
                    data={data}
                    renderItem={({ item, index }) => (
                        <ContributionItem key={index} item={item as ContributorType} index={index} handleClick={handleClick} />
                    )}
                    {...({ estimatedItemSize: 40 } as any)}
                />
            </View>
        )}

        {(!loading && data.length < 1) && (
            <Typography
                size={15.5}
                color={Colors.textLighter}
                style={{ textAlign: "center", marginTop: spacingY._15 }}
            >
                {emptyListMessage}
            </Typography>
        )}
    </View>
  )
}

function ContributionItem({ item, index, handleClick }: ContributorItemProps) {
    const { Colors } = useTheme();

    // const date = item?.createdAt && (typeof item?.createdAt === "string") ? formatDate(item?.createdAt) : (item?.createdAt as Timestamp)?.toDate()?.toLocaleDateString("en-Gb", {
    //     day: "numeric",
    //     month: "short",
    // });

    return (
        <Animated.View entering={FadeInDown.delay(index * 70)}>
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.row, { backgroundColor: Colors.cardBackground }]}
                onPress={() => handleClick(item)}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={getProfileImage(!item?.isAnonymous ? item?.image : null)}
                        contentFit="cover"
                        style={{
                            height: verticalScale(45),
                            width: verticalScale(45),
                            borderRadius: radius._10,
                        }}
                    />
                </View>

                <View style={styles.details}>
                    <Typography
                        size={18.5}
                        fontFamily="urbanist-semibold"
                    >
                        From {(item?.isAnonymous || !item?.name) ? "an Anonymous" : item.name}
                    </Typography>

                    {item.message ? (
                        <Typography
                            size={14}
                            color={Colors.neutral400}
                            textProps={{ numberOfLines: 2 }}
                            fontFamily="urbanist-medium"
                        >
                            {item.message}
                        </Typography>
                    ) : null}
                </View>

                <View style={styles.amountDetails}>
                    <Typography size={18} fontFamily="urbanist-bold" color={BaseColors.primaryLight}>{formatCurrency(item.amount ?? 0, 2)}</Typography>
                    <Typography size={12.5} fontFamily="urbanist-medium" color={Colors.textLighter}>{formatDate(item?.createdAt)}</Typography>
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: spacingY._20,
    },
    list: {
        minHeight: 3,
        marginBottom: spacingY._20,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacingX._12,
        marginBottom: spacingY._7,
        padding: spacingY._10,
        // paddingHorizontal: spacingY._10,
        borderRadius: radius._12,
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    details: {
        flex: 1,
        gap: spacingY._5,
    },
    amountDetails: {
        alignItems: "flex-end",
        gap: 3,
    },
});