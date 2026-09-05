import {View, Text, Image} from 'react-native'

const UpcomingSubscriptionCard = ({ data: { name, price, daysLeft, icon}}: UpcomingSubscription)  => {
    return (
        <View className="upcming-card">
            <View className="upcming-row">
                <Image source={icon} className="upcoming-icon" />
            </View>
        </View>
    )
}

export default UpcomingSubscriptionCard