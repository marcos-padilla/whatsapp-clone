import { Text, TouchableOpacity, View } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { Link, SplashScreen, Stack, useRouter, useSegments } from 'expo-router'
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { useFonts } from 'expo-font'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useEffect } from 'react'
import Colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'

const CLERK_PUBLISHABLE_API = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

// Cache Clerk JWT
const tokenCache = {
	async getToken(key: string) {
		try {
			return SecureStore.getItemAsync(key)
		} catch (err) {
			return null
		}
	},
	async saveToken(key: string, value: string) {
		try {
			return SecureStore.setItemAsync(key, value)
		} catch (err) {
			return
		}
	},
}

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router'

SplashScreen.preventAutoHideAsync()

function RootLayoutContent() {
	const { isLoaded, isSignedIn } = useAuth()
	const segments = useSegments()
	const router = useRouter()
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	})
	useEffect(() => {
		if (error) throw error
	}, [error])

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()
		}
	}, [loaded])

	useEffect(() => {
		if (!isLoaded) return

		const inTabsGroup = segments[0] === '(auth)'
		if (isSignedIn && !inTabsGroup) {
			router.replace('/(tabs)/chats')
		} else if (!isSignedIn) {
			router.replace('/')
		}
	}, [isSignedIn])

	if (!loaded || !isLoaded) {
		return <View />
	}

	return (
		<Stack>
			<Stack.Screen
				name='index'
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='verify/[phone]'
				options={{
					title: 'Verify Your Phone Number',
					headerShown: true,
					headerBackTitle: 'Edit number',
				}}
			/>
			<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
			<Stack.Screen
				name='(modals)/new-chat'
				options={{
					presentation: 'modal',
					title: 'New Chat',
					headerTransparent: true,
					headerBlurEffect: 'regular',
					headerStyle: {
						backgroundColor: Colors.background,
					},
					headerRight: () => (
						<Link href={'/(tabs)/chats'} asChild>
							<TouchableOpacity
								style={{
									backgroundColor: Colors.lightGray,
									borderRadius: 20,
									padding: 4,
								}}
							>
								<Ionicons
									name='close'
									color={Colors.gray}
									size={30}
								/>
							</TouchableOpacity>
						</Link>
					),
					headerSearchBarOptions: {
						placeholder: 'Search name or number',
						hideWhenScrolling: false,
					},
				}}
			/>
		</Stack>
	)
}

export default function RootLayout() {
	return (
		//@ts-ignore
		<ClerkProvider
			publishableKey={CLERK_PUBLISHABLE_API}
			tokenCache={tokenCache}
		>
			<RootLayoutContent />
		</ClerkProvider>
	)
}
