import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Header from '@/constants/header';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { cadastrarItem } from '@/constants/storage';
import { Item } from '@/constants/types';

const CadastrarItem: React.FC = () => {
    const router = useRouter();

    const [nomeItem, setNomeItem] = useState('');
    const [preco, setPreco] = useState('');

    const handlePrecoChange = (
        text: string,
        setPreco: React.Dispatch<React.SetStateAction<string>>
        ) => {
        // Remove caracteres que não sejam números, vírgula ou ponto
        let newText = text.replace(/[^0-9.,]/g, '');
        
        // Substitui a primeira vírgula por um ponto
        newText = newText.replace(',', '.'); 
        
        // Remove qualquer ponto ou vírgula adicional
        newText = newText.replace(/([.,].*)[.,]/g, '$1');
    
        // Garantir que tenha apenas dois dígitos após o ponto decimal
        const parts = newText.split('.');
        if (parts[1]?.length > 2) {
            parts[1] = parts[1].substring(0, 2);
        }
        newText = parts.join('.');
    
        // Substitui o ponto por vírgula
        newText = newText.replace(',', '.');
    
        setPreco(newText);
    };

    const handleSave = async () => {
        if (!nomeItem || !preco) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        const precoFormatado = parseFloat(preco.replace(',', '.'));

        const item: Item = { nome: nomeItem, preco: precoFormatado.toFixed(2), quantidade: '0' };

        let response = await cadastrarItem(item);
        if(response === null) {
            Alert.alert('Erro', 'Erro ao adicionar item');
            return;
        }
        else if(response === 1) {
            Alert.alert('Erro', 'Item ja existe');
            return;
        }
        Alert.alert('Adicionar Item', 'Item adicionado com sucesso');
        router.navigate('/itens');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header title="Cadastrar Item" />

            <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding">
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            label="Nome do Item"
                            value={nomeItem}
                            onChangeText={setNomeItem}
                            mode='outlined'
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            label="Preço"
                            value={preco}
                            onChangeText={(text) => handlePrecoChange(text, setPreco)}
                            keyboardType='numeric'
                            mode='outlined'
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button mode="contained" onPress={handleSave} style={styles.button}>
                            Cadastrar
                        </Button>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: hp('15%'),
    },
    keyboardAvoidingView: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('100%'),
        paddingBottom: hp('5%'),
    },
    inputContainer: {
        width: wp('80%'),
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: 'black',
    },
    input: {
        flex: 1,
        height: hp('6%'),
        backgroundColor: 'white',
    },
    buttonContainer: {
        width: wp('80%'),
        marginTop: 40,
    },
    button: {
        height: 50,
        justifyContent: 'center',
        backgroundColor: 'black',
    },
});

export default CadastrarItem;