import BackButton from "@/components/BackButton";
import ModalWrapper from "@/components/ModalWrapper";
import ScreenHeader from "@/components/ScreenHeader";
import Typography from "@/components/Typography";
import { spacingY } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { scale } from "@/utils/styling";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";


export default function NotificationModal() {
    const [loading, setLoading] = useState(false);
    const notifications = [];
    const { Colors } = useTheme();

	return (
		<ModalWrapper>
			<View style={styles.container}>
				<ScreenHeader title="Notifications" leftElement={<BackButton iconType="cancel" />} style={{ marginBottom: spacingY._10 }} />

				<ScrollView showsVerticalScrollIndicator={false}>
                    {(!loading && notifications?.length < 1) && (
                        <View style={{ marginTop: spacingY._35, gap: spacingY._15, alignItems: "center" }}>
                            <Image
                                source={require("@/assets/images/icon-notification.png")}
                                resizeMode="contain"
                                style={{ height: scale(104), opacity: 0.7 }}
                            />
                            
                            <Typography
                                size={17}
                                color={Colors.textLighter}
                                style={{ textAlign: "center" }}
                                fontFamily="urbanist-medium"
                            >
                                No Notification Yet!
                            </Typography>
                        </View>
                    )}
                </ScrollView>
			</View>
		</ModalWrapper>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
		paddingHorizontal: spacingY._20,
	},
});
