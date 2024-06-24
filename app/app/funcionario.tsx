import Header from '@/constants/header';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const HomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title='Funcionário'/>

      <TouchableOpacity style={styles.button}>
        <Button title="Pedidos" onPress={() => router.navigate('/pedidos')} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Button title="Itens" onPress={() => router.navigate('/itens')} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Button title="Histórico" onPress={() => router.navigate('/histFuncionario')} />
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
