import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '@/constants/header';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { cadastrarItem, fetchItem, removerItem } from '@/constants/storage';
import { Item } from '@/constants/types';

const AlterarItem: React.FC = () => {
    const router = useRouter();
    const { codItem } = useLocalSearchParams();
    const [nomeItem, setNomeItem] = useState('');
    const [preco, setPreco] = useState('');
    const [nomeAntigo, setNomeAntigo] = useState('');

    useEffect(() => {
        const loadItem = async () => {
            const fetchedItem = await fetchItem(codItem as string);
            if (fetchedItem) {
                setNomeItem(fetchedItem.nome);
                setPreco(fetchedItem.preco.toString());
                setNomeAntigo(fetchedItem.nome);
            }
        };
        loadItem();
    }, [codItem]);

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

        if(nomeItem !== nomeAntigo) {
            const response = await fetchItem(nomeItem as string);
            if(response !== null) {
                Alert.alert('Erro', 'Esse item já existe!');
                return;
            }
        }

        const response1 = await removerItem(codItem as string);
        if (response1 === null) {
            Alert.alert('Erro', 'Erro ao salvar item');
            return;
        }

        const precoFormatado = parseFloat(preco.replace(',', '.'));

        const item: Item = { nome: nomeItem, preco: precoFormatado.toFixed(2), quantidade: '0' };

        let response = await cadastrarItem(item);
        if (response === null) {
            Alert.alert('Erro', 'Erro ao adicionar item');
            return;
        }
        Alert.alert('Adicionar Item', 'Item alterado com sucesso');
        router.navigate('/itens');
    };

    const handleExcluir = async () => {
        Alert.alert(
            'Confirmar Exclusão',
            'Você tem certeza que deseja excluir este item?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        const response = await removerItem(codItem as string);
                        if (response === null) {
                            Alert.alert('Erro', 'Erro ao excluir item');
                            return;
                        }
                        Alert.alert('Excluir Item', 'Item excluído com sucesso');
                        router.navigate('/itens');
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header title="Alterar Item" />

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
                            Salvar
                        </Button>
                        <Button mode="contained" onPress={handleExcluir} style={styles.buttonExcluir}>
                            Excluir Item
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
    buttonExcluir: {
        height: 50,
        justifyContent: 'center',
        backgroundColor: 'red',
        marginTop: hp('5%'),
    },
});

export default AlterarItem;
