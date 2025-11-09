// import { BaseColors, radius, spacingX, spacingY } from '@/constants/theme'
// import { useAuth } from '@/contexts/AuthContext'
// import useFetchData from '@/hooks/useFetchData'
// import { useTheme } from '@/hooks/useTheme'
// import { formatCurrency } from '@/utils/helpers'
// import { scale, verticalScale } from '@/utils/styling'
// import { WalletType } from '@/utils/types'
// import { ImageBackground } from 'expo-image'
// import { limit, where } from 'firebase/firestore'
// import * as Icons from "phosphor-react-native"
// import React from 'react'
// import { Platform, StyleSheet, View } from 'react-native'
// import Typography from './Typography'


// const isIOS = Platform.OS === "ios";

// export default function HomeCard() {
//     const { user } = useAuth();
//     const { currentTheme } = useTheme();

//     const { data, loading } = useFetchData<WalletType>(
//         "wallets", (user?.uid) ? [where("uid", "==", user.uid), limit(1)] : [],
//     );
//     const wallet = data?.[0];

//     return (
//         <ImageBackground
//             source={require("@/assets/images/card-full.png")}
//             // resizeMode="stretch"
//             style={styles.bgImage}
//         >
//             <View style={styles.container}>
//                 {/* this view container only covers the first card area */}

//                 <View>
//                     <View style={styles.totalBalanceRow}>
//                         <Typography color={BaseColors[currentTheme == "dark" ? "neutral600" : "neutral700"]} fontFamily='urbanist-bold' size={isIOS ? 17 : 19}>
//                             All Time Raised
//                         </Typography>
//                         <Icons.DotsThreeOutlineIcon
//                             size={verticalScale(23)}
//                             color={BaseColors.black}
//                             weight="fill"
//                         />
//                     </View>

//                     <Typography color={BaseColors.neutral800} fontFamily="urbanist-bold" size={isIOS ? 31 : 33}>
//                         {loading ? "----" : formatCurrency(wallet?.allTimeBalance ?? 0, 2)}
//                     </Typography>
//                 </View>

//                 {/* raised & referral earnings */}
//                 <View style={styles.stats}>
//                     <View style={{ gap: verticalScale(3) }}>
//                         <View style={styles.statsElement}>
//                             <View style={[styles.statsIcon, { alignSelf: "flex-start", borderRadius: 100 }]}>
//                                 <Icons.HandCoinsIcon
//                                     color={BaseColors.primaryLight}
//                                     size={verticalScale(16)}
//                                     weight="bold"
//                                 />
//                             </View>
//                             <Typography size={isIOS ? 16 : 17.5} color={BaseColors.neutral700} fontFamily="urbanist-semibold">
//                                 Amount Raised
//                             </Typography>
//                         </View>

//                         <View style={{ alignSelf: "flex-start" }}>
//                             <Typography size={isIOS ? 17 : 20} color={BaseColors.primaryLight} fontFamily="urbanist-bold">
//                                 {loading ? "---" : formatCurrency(wallet?.contributedEarning ?? 0, 0)}
//                             </Typography>
//                         </View>
//                     </View>

//                     <View style={{ gap: verticalScale(3) }}>
//                         <View style={styles.statsElement}>
//                             <View style={[styles.statsIcon, { alignSelf: "flex-end", borderRadius: 100 }]}>
//                                 <Icons.UsersThreeIcon
//                                     // color={BaseColors.neutral800}
//                                     color={BaseColors.violet}
//                                     size={verticalScale(16)}
//                                     weight="bold"
//                                 />
//                             </View>
//                             <Typography size={isIOS ? 16 : 18} color={BaseColors.neutral700} fontFamily="urbanist-semibold">
//                                 Referrals invited
//                             </Typography>
//                         </View>

//                         <View style={{ alignSelf: "flex-end" }}>
//                             <Typography size={isIOS ? 17 : 20} color={BaseColors.violet} fontFamily="urbanist-bold">
//                                 {loading ? "---" : formatCurrency(wallet?.referralEarnings ?? 0, 0)}
//                             </Typography>
//                         </View>
//                     </View>
//                 </View>
//             </View>
//         </ImageBackground>
//     )
// }

// const styles = StyleSheet.create({
//     bgImage: {
//         // height: scale(210),
//         height: scale(185),
//         width: "100%",

//         // temps
//         borderRadius: radius._20,
//         overflow: "hidden",
//     },
//     container: {
//         // padding: spacingX._20,
//         padding: spacingX._15,
//         paddingHorizontal: scale(20),
//         // height: "87%",
//         height: "100%",
//         width: "100%",
//         justifyContent: "space-between",
//     },
//     totalBalanceRow: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: spacingY._5,
//     },
//     stats: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     statsElement: {
//         // flexDirection: "row",
//         alignItems: "center",
//         gap: spacingY._7
//     },
//     statsIcon: {
//         backgroundColor: BaseColors.neutral300,
//         padding: spacingY._7,
//         borderCurve: "continuous",
//     },
// })