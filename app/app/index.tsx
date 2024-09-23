import { useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const HomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Button title="Cliente" onPress={() => router.navigate('/cliente')} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Button title="Funcionário" onPress={() => router.navigate('/funcionario')} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    padding: 15,
    margin: hp('10%'),
    borderRadius: 5,
    width: wp('80%'),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default HomeScreen;
