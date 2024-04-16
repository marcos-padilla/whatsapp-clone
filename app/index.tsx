import { Text, View, Image, TouchableOpacity } from 'react-native'
import images from '@/constants/Images'
import { Link } from 'expo-router'

export default function WelcomeScreen() {
	return (
		<View className='flex flex-1 justify-center items-center p-5 bg-white'>
			<Image
				source={images.welcomeImage}
				className='w-full h-[300px] rounded-[60px] mb-[80px]'
				resizeMode='contain'
			/>
			<Text className='text-2xl font-bold my-5'>
				Welcome to WhatsApp Clone
			</Text>
			<Text className='text-lg text-center mb-20 text-gray'>
				Read our{' '}
				<Text className='text-primary'>Privacy Policy</Text>.{' '}
				{'Tap "Agree & Continue" to accept the '}
				<Text className='text-primary'>Terms of Service</Text>.
			</Text>
			<Link href={'/otp'} replace asChild>
				<TouchableOpacity className='w-full items-center'>
					<Text className='text-primary text-2xl font-medium'>
						Agree & Continue
					</Text>
				</TouchableOpacity>
			</Link>
		</View>
	)
}
