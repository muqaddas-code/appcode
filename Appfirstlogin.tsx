
import React from 'react';
import { View, Text, Button, TouchableOpacity, Image, Linking } from 'react-native';

export default function Firstlogin({navigation}:any) {
  return (
<View
style={{
  flex: 1,
  backgroundColor: '#f9f9f9',  
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 30,
}}
>
{/* Placeholder for illustration */}
<View style={{ marginBottom: 30 }}>
  <Text style={{ fontSize: 50 }}>FiXle</Text>
</View>


<Text style={{ fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 30 }}>
  Get it Fixed,with FiXle
</Text>

{/* Login Button */}
<TouchableOpacity
  style={{
    backgroundColor: '#4b3bbd',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 15,
  }}
  onPress={() => navigation.navigate('UserLogin')}
>
  <Text style={{ color: 'white', fontSize: 16 }}>Home Owner</Text>
</TouchableOpacity>

<TouchableOpacity
  style={{
    borderWidth: 1,
    borderColor: '#4b3bbd',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 30,
  }}
  onPress={() => navigation.navigate('UserLogin')} // 👈 Add this line
>
  <Text style={{ color: '#4b3bbd', fontSize: 16 }}>Service provider</Text>
</TouchableOpacity>




</View>
  );
}
