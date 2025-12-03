import BackButton from "@/components/BackButton";
import Loading from "@/components/Loading";
import ModalWrapper from "@/components/ModalWrapper";
import ScreenHeader from "@/components/ScreenHeader";
import { BaseColors, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import useFetchData from "@/hooks/useFetchData";
import { useTheme } from "@/hooks/useTheme";
import { ContributorType } from "@/utils/types";
import { useLocalSearchParams } from "expo-router";
import { limit, where } from "firebase/firestore";
import React, { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

export default function ContributorModal() {
	const { user } = useAuth();
	const { currentTheme } = useTheme();
	const { refId }: { refId: string } = useLocalSearchParams();

    const [refreshing, setRefreshing] = useState(false);

	const { data: contibutorData, loading: contributorLoading, refetch: refetchContributor } = useFetchData<ContributorType>(
		"contributors", user?.uid ? [where("uid", "==", user.uid), where("refId", "==", refId), limit(1)] : [],
	);

	const contributor = contibutorData?.[0];
	
    const handleRefresh = function() {
        setRefreshing(true);
        refetchContributor();
        setRefreshing(false);
    }


	return (
		<ModalWrapper>
			<View style={styles.container}>
				<ScreenHeader title="Contribution Details" leftElement={<BackButton />} style={{ marginBottom: spacingY._10 }} />

				<ScrollView
					bounces={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
					showsVerticalScrollIndicator={false}
				>

					{contributorLoading && (
						<View style={{ flex: 1, alignItems: "center", justifyContent: "center", height: 200, }}>
							<Loading color={BaseColors[currentTheme == "light" ? "primaryLight" : "accentDark"]} />
						</View>
					)}

                    {(!contributorLoading && contributor) && (
						<View>
							
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
