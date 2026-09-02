import { View, Text } from 'react-native'
import {Link} from "expo-router";

const Subscriptions = () => {
    return (
        <View>
            <Text>Subscriptions</Text>
            <Link href="/(auth)/sign-up">Subscriptions</Link>
        </View>
    )
}

export default Subscriptions