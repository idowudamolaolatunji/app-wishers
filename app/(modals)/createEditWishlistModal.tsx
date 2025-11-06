import Asterisk from "@/components/Asterisk";
import BackButton from "@/components/BackButton";
import FormInput from "@/components/FormInput";
import ImageUpload from "@/components/ImageUpload";
import ModalWrapper from "@/components/ModalWrapper";
import ScreenHeader from "@/components/ScreenHeader";
import Typography from "@/components/Typography";
import { BaseColors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { createOrUpdateWishlist } from "@/services/wishlistServices";
import { scale, verticalScale } from "@/utils/styling";
import { WishlistType } from "@/utils/types";
import * as Burnt from "burnt";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from '../../components/Button';


export default function CreateEditWishlistModal() {
	const router = useRouter();
	const { user } = useAuth();
	const { Colors, currentTheme } = useTheme();
	const currentWishlistData: {
		id: string,
		title: string,
		description: string,
		image: any,
	} = useLocalSearchParams();

	const [loading, setLoading] = useState(false);
	const [wishlistData, setWishlistData] = useState({
		title: "", image: null, description: ""
	});

	useEffect(function() {
		if(currentWishlistData?.id) {
			setWishlistData({
				title: currentWishlistData?.title || "",
				image: currentWishlistData?.image || null,
				description: currentWishlistData?.description || "",
			})
		}
	}, []);

	async function handleSubmit() {
		const { title, image, description } = wishlistData;
		if(!title || !image) {
			return Burnt.toast({ haptic: "error", title: "Fill up required fields!" });
		}

		const data: WishlistType = {
			title,
			image,
			uid: user?.uid,
			description: description?.trim(),
		}

		// THIS IS IF WE ARE UPDATING (THERE WILL BE ID), WE PASS THAT TO INDICATE EDIT
		if(currentWishlistData?.id) {
			data.id = currentWishlistData?.id
		}
		
		try {
			setLoading(true);
			const res = await createOrUpdateWishlist(data);
			if(!res.success) throw new Error(res.msg);

			Burnt.toast({ haptic: "error", title: "Successful" });
			if(currentWishlistData?.id) {
				router.back();
			} else {
				router.replace({
                    pathname: "/(modals)/wishlistDetailModal",
                    params: {
                        id: currentWishlistData?.id,
                        slug: res.data?.slug,
                        isnew: "true",
                    }
                });
			}
			Burnt.toast({ haptic: "error", title: "Successful" });
		} catch(err: any) {
			Burnt.toast({ haptic: "error", title: err?.message })
			setLoading(false);
		}
	}

	return (
		<ModalWrapper>
			<View style={styles.container}>
				<ScreenHeader title={currentWishlistData?.id ? "Edit Wishlist" : "Create a Wishlist"} leftElement={<BackButton />} style={{ marginBottom: spacingY._20 }} />

				<KeyboardAwareScrollView
					bounces={false}
                    overScrollMode="never" // default, always, never
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					enableAutomaticScroll={true}
					contentContainerStyle={styles.formItems}
					enableOnAndroid
				>
					<View style={styles.inputContainer}>
						<Typography fontFamily="urbanist-bold" color={Colors.textLighter}>Wishlist Title <Asterisk /></Typography>
						<FormInput
							placeholder='My christmas wishlist 👍🏿'
							keyboardType="default"
							value={wishlistData.title}
							onChangeText={(value) => setWishlistData({ ...wishlistData, title: value })}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Typography fontFamily="urbanist-bold" color={Colors.textLighter}>Cover Image <Asterisk /></Typography>

						<ImageUpload
							placeholder="Upload Image"
							file={wishlistData.image}
							onSelect={(value) => setWishlistData({ ...wishlistData, image: value })}
							onClear={() => setWishlistData({ ...wishlistData, image: null })}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Typography fontFamily="urbanist-bold" color={Colors.textLighter}>Description </Typography>
						<FormInput
							keyboardType="default"
							value={wishlistData.description}
							multiline={true}
							containerStyle={{ height: verticalScale(120) }}
							inputStyle={{
								height: "100%",
								textAlign: "left",
								textAlignVertical: "top",
							}}
							numberOfLines={7}
							maxLength={150}
							placeholder="Enter description..."
							onChangeText={(value) => setWishlistData({ ...wishlistData, description: value })}
						/>
					</View>
				</KeyboardAwareScrollView>
			</View>

			<View style={[styles.footerArea, { borderTopColor: BaseColors[currentTheme == "dark" ? "neutral700" : "neutral400"] }]}>
				<Button onPress={handleSubmit} loading={loading} style={{ flex: 1 }} disabled={loading}>
					<Typography size={Platform.OS == "ios" ? 20 : 23} color={BaseColors.white} fontFamily="urbanist-bold">
						{currentWishlistData?.id ? "Update" : "Create"} Wishlist
					</Typography>
				</Button>
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
	formItems: {
		// flex: 1,
        width: "100%",
		gap: spacingY._15,
		marginTop: spacingY._15,
		marginBottom: spacingY._30,
	},
	inputContainer: {
		gap: spacingY._10,
	},
	footerArea: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
		paddingHorizontal: spacingX._20,
		gap: scale(12),
		paddingTop: spacingY._15,
		marginBottom: spacingY._15,
		borderTopWidth: 1,
	},
});
