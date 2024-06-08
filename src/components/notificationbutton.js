import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const NotificationButton = React.memo(({ navigate }) => {
    return (
        <TouchableOpacity
            onPress={() => navigate("Notification")}
            style={styles.button}
        >
            <FontAwesome5
                name="bell"
                size={25}
                color="white"
                style={{ alignSelf: "center" }}
            />
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#3498db",
        padding: 5,
        borderRadius: 10,
        width: "90px",
    }
});

export default NotificationButton;
