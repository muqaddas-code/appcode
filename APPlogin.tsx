import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Animated,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    ActivityIndicator,
    Image,
    Easing,
    Alert, // Import Easing
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Choose your icon set

const { width, height } = Dimensions.get('window');

const LoginScreen = ({navigation}:any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Animation Values
    const logoAnim = useRef(new Animated.Value(0)).current;
    const titleAnim = useRef(new Animated.Value(0)).current;
    const formAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Entrance Animations
        Animated.stagger(200, [
            Animated.timing(logoAnim, {
                toValue: 1,
                duration: 600,
                easing: Easing.out(Easing.exp), // Use a nice easing function
                useNativeDriver: true,
            }),
            Animated.timing(titleAnim, {
                toValue: 1,
                duration: 600,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
            Animated.timing(formAnim, {
                toValue: 1,
                duration: 700,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
             Animated.timing(buttonAnim, {
                toValue: 1,
                duration: 800,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
        ]).start();
    }, [logoAnim, titleAnim, formAnim, buttonAnim]);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Please enter both email and password.');
            return;
        }
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            console.log('Login attempt with:', email, password);
            // Navigate to next screen or show success message
            Alert.alert('Login Successful (Simulated)');
        }, 2000);
    };

    // Interpolations for animations
    const logoTranslateY = logoAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, 0], // Starts slightly above and moves down
    });

    const titleTranslateY = titleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-30, 0],
    });

     const formTranslateY = formAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [height * 0.2 , 0], // Start lower and slide up
    });

    const buttonScale = buttonAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1], // Start smaller and scale up
    });


    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']} // Example Gradient Colors
            // colors={['#ff7e5f', '#feb47b']} // Alternative: Sunset
            // colors={['#6a11cb', '#2575fc']} // Alternative: Royal Blue/Purple
            style={styles.gradientContainer}
        >
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.innerContainer}>
                    {/* --- Logo --- */}
                    <Animated.View style={[styles.logoContainer, { opacity: logoAnim, transform: [{ translateY: logoTranslateY }] }]}>
                        {/* Replace with your actual logo */}
                        {/* <Image
                          source={require('./assets/logo.png')} // Make sure you have a logo.png in an assets folder
                          style={styles.logo}
                          resizeMode="contain"
                        /> */}
                    </Animated.View>

                    {/* --- Title --- */}
                    <Animated.Text style={[styles.title, { opacity: titleAnim, transform: [{ translateY: titleTranslateY }] }]}>
                        Welcome Back!
                    </Animated.Text>
                    <Animated.Text style={[styles.subtitle, { opacity: titleAnim, transform: [{ translateY: titleTranslateY }] }]} 
                    
                    >
                        Sign in to continue
                    </Animated.Text>

                    {/* --- Form Inputs --- */}
                    <Animated.View style={[styles.formContainer, { opacity: formAnim, transform: [{ translateY: formTranslateY }] }]}>
                        <View style={styles.inputContainer}>
                            {/* <Icon name="email-outline" size={22} color="#ccc" style={styles.inputIcon} /> */}
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                placeholderTextColor="#aaa"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            {/* <Icon name="lock-outline" size={22} color="#ccc" style={styles.inputIcon} /> */}
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#aaa"
                                secureTextEntry={!isPasswordVisible}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                                {/* <Icon name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={22} color="#ccc" /> */}
                            </TouchableOpacity>
                        </View>

                         <TouchableOpacity style={styles.forgotPasswordButton}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </Animated.View>


                    {/* --- Login Button --- */}
                     <Animated.View style={[styles.buttonWrapper, { opacity: buttonAnim, transform: [{ scale: buttonScale }] }]}>
                        <TouchableOpacity
                            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <Text style={styles.loginButtonText}>Login</Text>
                            )}
                        </TouchableOpacity>
                     </Animated.View>


                    {/* --- Sign Up Link --- */}
                    <Animated.View style={[styles.signUpContainer, { opacity: buttonAnim }]}>
                        <Text style={styles.signUpText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('')}>
                            <Text style={[styles.signUpText, styles.signUpLink]}>Sign Up</Text>
                        </TouchableOpacity>
                    </Animated.View>

                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    logoContainer: {
        marginBottom: 20,
        // Add shadow for depth
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    logo: {
        width: width * 0.35, // Responsive width
        height: width * 0.35, // Responsive height
        // borderRadius: (width * 0.35) / 2, // Make it circular if needed
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
        textAlign: 'center',
    },
     subtitle: {
        fontSize: 16,
        color: '#eee',
        marginBottom: 30,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
        marginBottom: 20, // Add space before the button
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
        borderRadius: 25, // Rounded corners
        marginBottom: 15,
        paddingHorizontal: 15,
        height: 50, // Fixed height
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#ffffff',
        fontSize: 16,
    },
    eyeIcon: {
        padding: 5, // Easier to tap
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginTop: -5, // Adjust spacing
        marginBottom: 15,
    },
    forgotPasswordText: {
        color: '#ccc',
        fontSize: 14,
    },
    buttonWrapper: {
        width: '100%',
        alignItems: 'center', // Center button if its width is less than 100%
    },
    loginButton: {
        backgroundColor: '#6a11cb', // Vibrant color matching gradient potential
        paddingVertical: 15,
        borderRadius: 25, // Match input border radius
        width: '100%', // Make button full width
        alignItems: 'center',
        marginTop: 10, // Space above button
        // Add shadow for depth
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loginButtonDisabled: {
        backgroundColor: '#a076d9', // Lighter/desaturated color when disabled
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signUpContainer: {
        flexDirection: 'row',
        marginTop: 40, // More space at the bottom
        justifyContent: 'center',
    },
    signUpText: {
        color: '#ccc',
        fontSize: 14,
    },
    signUpLink: {
        color: '#fff', // Make link stand out
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
