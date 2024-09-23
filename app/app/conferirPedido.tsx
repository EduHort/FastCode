import React, { useState, useEffect } from 'react';
import { Alert, FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '@/constants/header';
import { Button } from 'react-native-paper';
import { buscarQR, removerQR, salvarHistCliente } from '@/constants/storage';
import { Item, Pedido } from '@/constants/types';

const ConferirPedido: React.FC = () => {
    const router = useRouter();
    const [pedido, setPedido] = useState<Pedido | null>(null);

    useEffect(() => {
        const fetchQR = async () => {
            const qr = await buscarQR();
            if (qr) {
                setPedido(qr);
            } else {
                Alert.alert("Erro!", "QR-CODE não lido corretamente!");
            }
        };
        fetchQR();
    }, []);

    const handleFinalizarPedido = async () => {
        if (pedido && pedido.itens.length > 0) {
            await salvarHistCliente(pedido);
            await removerQR();
            Alert.alert("Sucesso!", "Pedido finalizado com sucesso!");
            router.replace('/cliente');
        } else {
            Alert.alert("Erro!", "Pedido não possui itens!");
        }
    };

    const confirmarFinalizacao = () => {
        Alert.alert(
            "Confirmar Finalização",
            "Você tem certeza que deseja finalizar o pedido?",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: handleFinalizarPedido }
            ],
            { cancelable: false }
        );
    };

    const calculateTotalPedido = (items: Item[]) => {
        return items.reduce((total, item) => {
          const preco = parseFloat(item.preco.replace(',', '.'));
          const quantidade = parseFloat(item.quantidade.replace(',', '.'));
          return total + (isNaN(preco) || isNaN(quantidade) ? 0 : preco * quantidade);
        }, 0).toFixed(2);
      };

    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <View key={index} style={styles.item}>
            <Text style={styles.itemName}>{item.nome}</Text>
            <Text style={styles.itemQuantity}>Quantidade: {item.quantidade}</Text>
            <View style={styles.priceContainer}>
                <Text style={styles.itemPrice}>Preço: {item.preco}</Text>
                <Text style={styles.totalPrice}>Total: R$ {(parseFloat(item.preco.replace(',', '.')) * parseFloat(item.quantidade.replace(',', '.'))).toFixed(2)}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header title="Finalizar Pedido" />

            {pedido && (
                <View style={styles.pedidoInfo}>
                    <Text style={styles.infoText}>Data: {pedido.data}</Text>
                    <Text style={styles.infoText}>Hora: {pedido.hora}</Text>

                    <View style={styles.itensContainer}>
                        <FlatList
                            data={pedido.itens}
                            renderItem={renderItem}
                        />
                    </View>
                    <Text style={styles.total}>Valor Total: R$ {calculateTotalPedido(pedido.itens)}</Text>
                </View>
            )}

            <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={confirmarFinalizacao} style={styles.button}>
                    Finalizar Pedido
                </Button>
            </View>
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
    pedidoInfo: {
        marginTop: wp('1%'),
        width: wp('80%'),
        marginBottom: 20,
    },
    infoText: {
        fontSize: 18,
        marginBottom: 10,
    },
    itensContainer: {
        marginTop: 20,
        height: hp('50%'),
    },
    item: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    itemName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    itemQuantity: {
        fontSize: 14,
        marginTop: 5,
    },
    itemPrice: {
        fontSize: 14,
    },
    priceContainer: {
        marginTop: 5,
        alignItems: 'flex-start',
    },
    totalPrice: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    buttonContainer: {
        width: wp('80%'),
        marginTop: 20,
        marginBottom: hp('1%'),
    },
    button: {
        height: 50,
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    total: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
    },
});

export default ConferirPedido;
