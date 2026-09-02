import { View, Text } from 'react-native'
import {Link} from "expo-router";

const Settings = () => {
    return (
        <View>
            <Text>Settings</Text>
            <Link href="/(auth)/sign-up">Settings</Link>
        </View>
    )
}

export default Settings