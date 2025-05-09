import React, { useState, FC } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  PermissionStatus,
  Image, // Import Image component
} from 'react-native';
import LinearGradient, { LinearGradientProps } from 'react-native-linear-gradient';
import Geolocation, {
  GeoPosition,
  GeoError,
  GeoCoordinates,
  GeoOptions,
} from 'react-native-geolocation-service';
import {
  launchImageLibrary,
  // launchCamera, // Uncomment if you want to use camera
  Asset,
  ImagePickerResponse,
  MediaType,
  ImageLibraryOptions,
} from 'react-native-image-picker';

// --- Type Definitions ---

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  cnic: string;
  address: string;
}

interface NominatimAddress {
  road?: string;
  suburb?: string;
  city?: string;
  municipality?: string;
  county?: string;
  state_district?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
  [key: string]: string | undefined;
}

interface NominatimResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: NominatimAddress;
  boundingbox: [string, string, string, string];
  error?: string;
}

const EMAIL_REGEX = /\S+@\S+\.\S+/;
const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;

const SignupHO: FC = () => {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cnic: '',
    address: '',
  });
  const [location, setLocation] = useState<GeoCoordinates | null>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);

  // --- State for CNIC Image ---
  const [cnicImage, setCnicImage] = useState<Asset | null>(null);
  const [isCnicImageLoading, setIsCnicImageLoading] = useState<boolean>(false);

  const handleInputChange = (field: keyof FormState, value: string): void => {
    setForm(prevForm => ({ ...prevForm, [field]: value }));
  };

  const togglePasswordVisibility = (): void => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = (): void => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    // ... (Implementation from previous correct version)
    setLocationErrorMsg(null);
    if (Platform.OS === 'ios') {
      try {
        const auth = await Geolocation.requestAuthorization('whenInUse');
        if (auth === 'granted') return true;
        setLocationErrorMsg('iOS Location permission denied.');
        Alert.alert('Permission Denied','Location permission is required.');
        return false;
      } catch (err) {
        console.warn(err);
        setLocationErrorMsg('Error requesting iOS location permission.');
        return false;
      }
    }
    if (Platform.OS === 'android') {
      try {
        const granted: PermissionStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This app needs access to your location.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) return true;
        setLocationErrorMsg('Android Location permission denied.');
        Alert.alert('Permission Denied','Location permission is required.');
        return false;
      } catch (err) {
        console.warn(err);
        setLocationErrorMsg('Error requesting Android location permission.');
        return false;
      }
    }
    return false;
  };

  const fetchAddressFromCoordinates = async (latitude: number, longitude: number): Promise<void> => {
    // ... (Implementation from previous correct version, ensure proper error handling)
    setLocationErrorMsg(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: NominatimResponse = await response.json();
      if (data && data.display_name) {
        handleInputChange('address', data.display_name);
        Alert.alert('Address Found', `Address updated:\n${data.display_name}`);
      } else if (data && data.error) {
        throw new Error(`Geocoding error: ${data.error}`);
      } else {
        throw new Error('No address found for coordinates.');
      }
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      setLocationErrorMsg(`Failed to fetch address: ${message}`);
      Alert.alert('Address Error', `Failed to fetch address: ${message}`);
    }
  };

  const getCurrentLocation = async (): Promise<void> => {
    // ... (Implementation from previous correct version)
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;
    setLocationLoading(true);
    setLocationErrorMsg(null);
    setLocation(null);
    const options: GeoOptions = {
      accuracy: { android: 'high', ios: 'best' },
      enableHighAccuracy: true, timeout: 20000, maximumAge: 10000,
      distanceFilter: 0, forceRequestLocation: true, showLocationDialog: true,
    };
    Geolocation.getCurrentPosition(
      async (position: GeoPosition) => {
        setLocation(position.coords);
        await fetchAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
        setLocationLoading(false);
      },
      (error: GeoError) => {
        let msg = `Location Error: ${error.message} (Code: ${error.code})`;
        if (error.code === 3) msg = "Getting location timed out.";
        else if (error.code === 2) msg = "Unable to determine location.";
        setLocationErrorMsg(msg);
        Alert.alert('Location Error', msg);
        setLocation(null);
        setLocationLoading(false);
      },
      options
    );
  };

  // --- CNIC Image Picker Logic ---
  const handleChooseCnicPhoto = (): void => { // Return type is void
    // setCnicImage(null); // Optional: clear previous image immediately
    setIsCnicImageLoading(true);

    const options: ImageLibraryOptions = {
      mediaType: 'photo' as MediaType, // Ensure MediaType is correctly typed or cast
      quality: 0.7,
      includeBase64: false,
      selectionLimit: 1, // Ensure only one image can be selected
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      setIsCnicImageLoading(false);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      }
      if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Image Error', response.errorMessage || 'Could not select image.');
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const selectedAsset = response.assets[0];
        if (selectedAsset.uri) { // Ensure URI exists
            console.log('Selected CNIC Image: ', selectedAsset.uri);
            setCnicImage(selectedAsset);
        } else {
            Alert.alert('Image Error', 'Selected image does not have a valid URI.');
        }
      } else {
         // This case might occur if assets is empty or null for some reason
         Alert.alert('Image Error', 'No image was selected or an unexpected error occurred.');
      }
    });
  };

  const handleSignUp = (): void => {
    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;
    const cnic = form.cnic.trim();
    const address = form.address.trim();

    if (!name || !email || !password || !cnic || !address) {
      Alert.alert('Missing Information','All fields are required.');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }
    if (!CNIC_REGEX.test(cnic)) {
      Alert.alert('Invalid CNIC','Please use format: 12345-1234567-1');
      return;
    }
    if (!cnicImage || !cnicImage.uri) { // Check for image and its URI
      Alert.alert('Missing CNIC Image', 'Please upload a picture of your CNIC.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('cnic', cnic);
    formData.append('address', address);

    if (location) {
      formData.append('latitude', String(location.latitude));
      formData.append('longitude', String(location.longitude));
    }

    // --- Correctly appending the image file to FormData ---
    const imageUri = cnicImage.uri;
    const imageType = cnicImage.type || 'image/jpeg'; // Fallback MIME type
    const imageName = cnicImage.fileName || `cnic_${Date.now()}.jpg`; // Fallback filename

    formData.append('cnicPicture', {
      uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
      type: imageType,
      name: imageName,
    } as any); // Using `as any` here is a common workaround if TS struggles with the exact shape
                // for FormData file uploads, but ensure your object IS correct.
                // A more typesafe way would be to define an interface for this specific object.

    console.log('Signing Up with FormData. Data prepared. (Image data is binary, not shown in console object)');
    Alert.alert('Sign Up Initiated','Account data being prepared.');

    // --- TODO: Actual API Call ---
    /*
    fetch('YOUR_SIGNUP_API_ENDPOINT', {
      method: 'POST',
      body: formData, // 'Content-Type': 'multipart/form-data' is set automatically
    })
    .then(async response => {
      // ... (handle response)
    })
    .catch(error => {
      // ... (handle error)
    });
    */
  };

  const gradientProps: Omit<LinearGradientProps, 'children'> = {
    colors: ['#7B66FF', '#C77DFF', '#F99BFF'],
    style: styles.gradientContainer,
  };

  return (
    <LinearGradient {...gradientProps}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create Account</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#888"
              style={styles.input}
              value={form.name}
              onChangeText={(text: string) => handleInputChange('name', text)}
              autoCapitalize="words"
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              value={form.email}
              onChangeText={(text: string) => handleInputChange('email', text)}
              autoComplete="email"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password (min. 6 characters)"
              placeholderTextColor="#888"
              secureTextEntry={!isPasswordVisible}
              style={styles.input}
              value={form.password}
              onChangeText={(text: string) => handleInputChange('password', text)}
              autoComplete="new-password"
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.visibilityToggle}>
              <Text style={styles.visibilityToggleText}>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              secureTextEntry={!isConfirmPasswordVisible}
              style={styles.input}
              value={form.confirmPassword}
              onChangeText={(text: string) => handleInputChange('confirmPassword', text)}
              autoComplete="new-password"
            />
            <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.visibilityToggle}>
              <Text style={styles.visibilityToggleText}>{isConfirmPasswordVisible ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>

          {/* CNIC Number Input */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="CNIC Number (e.g., 12345-1234567-1)"
              placeholderTextColor="#888"
              keyboardType="default"
              style={styles.input}
              value={form.cnic}
              onChangeText={(text: string) => handleInputChange('cnic', text)}
              maxLength={15}
            />
          </View>

          {/* CNIC Image Upload Section */}
          <Text style={styles.sectionLabel}>CNIC Picture</Text>
          <View style={styles.imagePickerContainer}>
            {cnicImage && cnicImage.uri ? (
              <Image source={{ uri: cnicImage.uri }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>No image selected</Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.buttonGeneral, styles.imagePickerButton]} // Use a general button style
              onPress={handleChooseCnicPhoto}
              disabled={isCnicImageLoading}>
              {isCnicImageLoading ? (
                <ActivityIndicator color="#fff" size="small"/>
              ) : (
                <Text style={styles.buttonText}>
                  {cnicImage ? 'Change CNIC Picture' : 'Upload CNIC Picture'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Address Input */}
          <Text style={styles.addressLabel}>Address</Text>
          <View style={styles.addressContainer}>
            <View style={[styles.inputContainer, styles.addressInputContainerFlex]}>
              <TextInput
                placeholder="Enter address or use location button"
                placeholderTextColor="#888"
                style={[styles.input, styles.addressInput]}
                value={form.address}
                onChangeText={(text: string) => handleInputChange('address', text)}
                multiline
              />
            </View>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getCurrentLocation}
              disabled={locationLoading}>
              {locationLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.locationButtonText}>📍</Text>
              )}
            </TouchableOpacity>
          </View>
          {locationErrorMsg && (
            <Text style={styles.errorText}>{locationErrorMsg}</Text>
          )}

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.buttonGeneral} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 30, paddingVertical: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 35, textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  input: { flex: 1, height: 55, color: '#333', fontSize: 16, paddingHorizontal: 15 },
  visibilityToggle: { paddingHorizontal: 15, height: 55, justifyContent: 'center' },
  visibilityToggleText: { color: '#6A4DFF', fontSize: 14, fontWeight: '600' },
  sectionLabel: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 10, marginTop: 15, marginLeft: 5, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  imagePickerContainer: { alignItems: 'center', marginBottom: 20, padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  previewImage: { width: 200, height: 120, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  imagePlaceholder: { width: 200, height: 120, borderRadius: 8, marginBottom: 15, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  imagePlaceholderText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  imagePickerButton: { // Specific style for this button if needed, can inherit from buttonGeneral
    backgroundColor: '#8A6DFF', // A distinct color
    width: '90%', // Make it wider
    alignSelf: 'center',
  },
  addressLabel: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 8, marginLeft: 5, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  addressContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 5 },
  addressInputContainerFlex: { // Renamed for clarity from addressInputContainer
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
    // Removed redundant styling, inputContainer style is applied to the View wrapping TextInput
  },
  addressInput: { height: 'auto', minHeight: 55, maxHeight: 110, paddingTop: Platform.OS === 'ios' ? 15 : 12, paddingBottom: Platform.OS === 'ios' ? 15 : 12, textAlignVertical: 'top'},
  locationButton: { backgroundColor: '#7B66FF', padding: 15, borderRadius: 12, justifyContent: 'center', alignItems: 'center', width: 55, height: 55, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4, marginTop: 0 },
  locationButtonText: { color: '#fff', fontSize: 24 },
  buttonGeneral: { // General button style for Sign Up and potentially Image Picker
    backgroundColor: '#6A4DFF',
    paddingVertical: 14, // Slightly reduced padding
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' }, // Slightly adjusted font size
  errorText: { color: '#FF6B6B', fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: -10, marginBottom: 10, paddingHorizontal: 5, borderRadius: 4 },
});

export default SignupHO;
