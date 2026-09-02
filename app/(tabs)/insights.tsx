import { View, Text } from 'react-native'
import {Link} from "expo-router";

const Insights = () => {
    return (
        <View>
            <Text>Insights</Text>
            <Link href="/(auth)/sign-up">Insights</Link>
        </View>
    )
}

export default Insights