import { auth } from "@/config/firebase";
import { getUnreadNotificationCount } from "@/services/notificationServices";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushAsync";
import { EventSubscription } from "expo-modules-core";
import * as Notifications from "expo-notifications";
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";

interface NotificationContextType {
	expoPushToken: string | null;
	notification: Notifications.Notification | null;
	error: Error | null;
	// in-app notification
	countNotifications: () => void;
	notificationCount: number;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
	children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
	const [notificationCount, setNotificationCount] = useState(0);
	const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
	const [notification, setNotification] = useState<Notifications.Notification | null>(null);
	const [error, setError] = useState<Error | null>(null);

	const notificationListener = useRef<EventSubscription>(null);
	const responseListener = useRef<EventSubscription>(null);

	useEffect(function() {
		registerForPushNotificationsAsync().then(
			(token) => setExpoPushToken(token),
			(error) => setError(error),
		);

		notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
			console.log("🔔 Notification Received: ", notification);
			setNotification(notification);
		});

		responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
			console.log("🔔 Notification Response: ", JSON.stringify(response, null, 2), JSON.stringify(response.notification.request.content.data, null, 2));
			// Handle the notification response here
		});

		return () => {
			if (notificationListener.current) {
				Notifications.removeNotificationSubscription(notificationListener.current);
			}
			if (responseListener.current) {
				Notifications.removeNotificationSubscription(responseListener.current);
			}
		};
	}, []);

	const handleCountNotification = async function() {
		setNotificationCount(0);

		const res = await getUnreadNotificationCount(auth?.currentUser?.uid!);
		if(res.success == true) {
			setNotificationCount(res?.data || 0)
		}
	}

	useEffect(function() {
		handleCountNotification();
	}, [notification]);

	return <NotificationContext.Provider value={{ expoPushToken, notification, error, notificationCount, countNotifications: handleCountNotification }}>{children}</NotificationContext.Provider>;
};

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error("useNotification must be used within a NotificationProvider");
	}
	return context;
};