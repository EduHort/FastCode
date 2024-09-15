import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '@/constants/header';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { buscarPedido, excluirPedido, salvarHistFuncionario } from '@/constants/storage';
import { Pedido } from '@/constants/types';
import QRCode from 'react-native-qrcode-svg';

const GerarQR: React.FC = () => {
    const router = useRouter();
    const { codPedido } = useLocalSearchParams();
    const [pedido, setPedido] = useState<Pedido | null>(null);

    useEffect(() => {
        const fetchPedido = async () => {
          const pedidoAtual = await buscarPedido(codPedido as string);
          if (pedidoAtual) {
            setPedido(pedidoAtual);
          } else {
            Alert.alert("Erro!", "Nenhum pedido encontrado!");
          }
        };
        fetchPedido();
    }, [codPedido]);

    const handleSave = async () => {
        if(!pedido) {
            Alert.alert('Erro', 'Nenhum pedido encontrado');
            return;
        }
        if(pedido.itens.length === 0) {
            Alert.alert('Erro', 'O Pedido não possui itens.');
            return;
        }

        Alert.alert(
            'Confirmar Finalizar Pedido',
            'Tem certeza que deseja finalizar o pedido?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Sim',
                    onPress: async () => {
                        try {
                            // Salvar o pedido no histórico do funcionário
                            await salvarHistFuncionario(pedido);

                            // Excluir o pedido da lista de pedidos ativos
                            await excluirPedido(codPedido as string);

                            Alert.alert('Sucesso!', 'Pedido finalizado com sucesso!');
                            router.navigate('/pedidos'); // Redireciona para a tela de pedidos
                        } catch (error) {
                            Alert.alert('Erro', 'Erro ao finalizar pedido!');
                            console.error('Erro ao salvar pedido:', error);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header title="Finalizar Pedido" />

            <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding">
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.inputContainer}>
                    {pedido && (
                        <QRCode
                            value={JSON.stringify(pedido)} // Serializando o objeto Pedido
                            size={wp('80%')} // Tamanho do QR Code
                        />
                    )}
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button mode="contained" onPress={handleSave} style={styles.button}>
                            Finalizar Pedido
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

export default GerarQR;
