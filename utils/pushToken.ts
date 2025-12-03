import { saveExpoPushToken } from "@/services/userService";
import * as Notifications from "expo-notifications";

export async function savePushToken(uid: string) {
    const response = await Notifications.getExpoPushTokenAsync();
    const token = response.data;
    await saveExpoPushToken(uid, token);
}