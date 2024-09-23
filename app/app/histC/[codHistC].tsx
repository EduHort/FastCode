import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import Header from '@/constants/header';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { buscarPedidoHistoricoCliente } from '@/constants/storage';
import { Pedido } from '@/constants/types';

const HistPedidoCliente: React.FC = () => {
    const [pedido, setPedido] = useState<Pedido | null>(null);
    const { data, hora } = useLocalSearchParams();

    useEffect(() => {
        const loadPedido = async () => {
            if (data && hora) {
                try {
                    const fetchedPedido = await buscarPedidoHistoricoCliente(data as string, hora as string);
                    setPedido(fetchedPedido);
                } catch (error) {
                    console.error('Erro ao carregar pedido:', error);
                    Alert.alert("Erro!", "Não foi possível carregar o pedido.");
                }
            } else {
                Alert.alert("Erro!", "Nenhum pedido encontrado!");
            }
        };
        loadPedido();
    }, [data, hora]);

    const calcularTotalPedido = (pedido: Pedido): number => {
        return pedido.itens.reduce((total, item) => {
            const preco = parseFloat(item.preco.replace(',', '.'));
            const quantidade = parseFloat(item.quantidade);
            return total + (preco * quantidade);
        }, 0);
    };

    if (!pedido) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <Header title="Itens do Pedido" />
                <Text style={styles.loadingText}>Carregando pedido...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header title="Itens do Pedido" />

            <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding">
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.headerPedido}>
                        <Text style={styles.headerPedidoText}>Data: {pedido.data}</Text>
                        <Text style={styles.headerPedidoText}>Hora: {pedido.hora}</Text>
                    </View>

                    <View style={styles.itensContainer}>
                        {pedido.itens.map((item, index) => (
                            <View key={index} style={styles.itemContainer}>
                                <Text style={styles.itemNome}>{item.nome}</Text>
                                <Text style={styles.itemDetalhes}>
                                    Quantidade: {item.quantidade} x R$ {item.preco.replace('.', ',')} = R$ {(parseFloat(item.preco.replace(',', '.')) * parseFloat(item.quantidade)).toFixed(2).replace('.', ',')}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.totalText}>
                        Total: R$ {calcularTotalPedido(pedido).toFixed(2).replace('.', ',')}
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

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
    headerPedido: {
        alignItems: 'center',
        marginBottom: hp('3%'),
    },
    headerPedidoText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itensContainer: {
        width: wp('90%'),
        marginBottom: 20,
    },
    itemContainer: {
        marginBottom: 10,
    },
    itemNome: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemDetalhes: {
        fontSize: 14,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
});

export default HistPedidoCliente;
