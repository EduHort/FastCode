import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Header from '@/constants/header';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { buscarPedidosHistoricoFuncionario } from '@/constants/storage';
import { Pedido } from '@/constants/types';

const HistFuncionario: React.FC = () => {
    const router = useRouter();
    const [pedidosAgrupados, setPedidosAgrupados] = useState<{ [key: string]: Pedido[] }>({});

    useEffect(() => {
        const loadPedidos = async () => {
            const fetchedPedidos = await buscarPedidosHistoricoFuncionario();
            setPedidosAgrupados(agruparPedidosPorData(fetchedPedidos));
        };
        loadPedidos();
    }, []);

    const agruparPedidosPorData = (pedidos: Pedido[]): { [key: string]: Pedido[] } => {
        const agrupados: { [key: string]: Pedido[] } = {};
        pedidos.forEach(pedido => {
            const data = pedido.data;
            if (!agrupados[data]) {
                agrupados[data] = [];
            }
            agrupados[data].push(pedido);
        });

        const datasOrdenadas = Object.keys(agrupados).sort((a, b) => {
            const dataA = new Date(a.split('/').reverse().join('-'));
            const dataB = new Date(b.split('/').reverse().join('-'));
            return dataB.getTime() - dataA.getTime();
        });

        const agrupadosOrdenados: { [key: string]: Pedido[] } = {};
        datasOrdenadas.forEach(data => {
            agrupadosOrdenados[data] = agrupados[data];
        });

        return agrupadosOrdenados;
    };

    const calcularTotalPedido = (pedido: Pedido): number => {
        return pedido.itens.reduce((total, item) => {
            const preco = parseFloat(item.preco.replace(',', '.'));
            const quantidade = parseFloat(item.quantidade);
            return total + (preco * quantidade);
        }, 0);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header title="Histórico Funcionário" />

            <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding">
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {Object.entries(pedidosAgrupados).map(([data, pedidosDia]) => (
                        <View key={data}>
                            <Text style={styles.dataHeader}>{data}</Text>

                            {pedidosDia.map((pedido) => (
                                <TouchableOpacity key={pedido.data + pedido.hora} style={styles.pedidoContainer}
                                onPress={() => router.navigate({ pathname: "/histF/[codHistF]", params: { data: pedido.data, hora: pedido.hora } })}>
                                    <Text style={styles.pedidoData}>ID: {pedido.id}</Text>
                                    <Text style={styles.pedidoData}>{pedido.hora}</Text>
                                    <Text style={styles.pedidoData}>
                                        R$ {calcularTotalPedido(pedido).toFixed(2)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
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
    headerTable: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: wp('90%'),
        marginBottom: 10,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    pedidoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: wp('90%'),
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f2f2f2',
    },
    pedidoData: {
        fontSize: 14,
        color: 'black',
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
    dataHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
    }
});

export default HistFuncionario;
