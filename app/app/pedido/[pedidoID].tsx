import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, KeyboardAvoidingView, Alert, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '@/constants/header';
import { Item, Pedido } from '@/constants/types';
import { buscarPedido, excluirPedido, removerItemDoPedido } from '@/constants/storage';

const PedidoID: React.FC = () => {
  const router = useRouter();
  const { codPedido } = useLocalSearchParams();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPedido = async () => {
      setIsLoading(true);
      const pedidoAtual = await buscarPedido(codPedido as string);
      if (pedidoAtual) {
        setPedido(pedidoAtual);
      } else {
        Alert.alert("Erro!", "Nenhum pedido encontrado!");
      }
      setIsLoading(false);
    };
    fetchPedido();
  }, [codPedido]);

  const handleExcluir = async () => {
    if (!pedido) {
      Alert.alert("Erro!", "Nenhum pedido encontrado!");
      return;
    }

    const response = await excluirPedido(codPedido as string);
    if (response === 1) {
      router.back();
    }
  };

  const confirmExcluir = () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza de que deseja excluir este pedido?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: handleExcluir,
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  };

  const calculateTotal = (items: Item[]) => {
    return items.reduce((total, item) => {
      const preco = parseFloat(item.preco.replace(',', '.'));
      const quantidade = parseFloat(item.quantidade.replace(',', '.'));
      return total + (isNaN(preco) || isNaN(quantidade) ? 0 : preco * quantidade);
    }, 0).toFixed(2);
  };

  const total = useMemo(() => calculateTotal(pedido?.itens || []), [pedido?.itens]);

  const confirmExcluirItem = (nomeItem: string) => {
    Alert.alert(
      "Confirmar exclusão",
      `Tem certeza de que deseja remover o item ${nomeItem} do pedido?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Remover",
          onPress: () => handleRemoverItem(nomeItem),
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  };

  const handleRemoverItem = async (nomeItem: string) => {
    if (!pedido) {
      Alert.alert("Erro!", "Nenhum pedido encontrado!");
      return;
    }

    const pedidoAtualizado = await removerItemDoPedido(codPedido as string, nomeItem);
    if (pedidoAtualizado) {
      setPedido(pedidoAtualizado);
    }
  };

  const renderItem = ({ item }: { item: Item }) => {
    const { nome, quantidade, preco } = item;
    const totalItem = calculateTotal([item]);
    return (
      <TouchableOpacity style={styles.item} onPress={() => confirmExcluirItem(nome)}>
        <View style={styles.itemDetails}>
          <View>
            <Text style={styles.itemName}>{nome}</Text>
            <Text>Quantidade: {quantidade}</Text>
            <Text>Preço/UN: R$ {preco}</Text>
            <Text style={styles.itemTotal}>Total: R$ {totalItem}</Text>
          </View>
          <View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ItemList = () => {
    return (
      <View style={styles.listContainer}>
        <FlatList
          data={pedido?.itens || []}
          renderItem={renderItem}
          keyExtractor={(item) => item.nome}
          style={styles.list}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title={`Pedido ${pedido?.id || 'não Encontrado'}`} />

      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding" enabled>
        {isLoading ? (
          <Text>Carregando pedido...</Text>
        ) : (
          <>
            <Button onPress={() => router.navigate({ pathname: "/addItemPedido/[addItem]", params: { codPed: codPedido } })} style={styles.buttonAdicionar}>
              Adicionar Item
            </Button>

            <ItemList />

            <Text style={styles.total}>Total: R$ {total}</Text>

            <View style={styles.buttonContainer}>
              <Button mode="contained" onPress={() => router.navigate({ pathname: "/gerarQR/[codQR]", params: { codPedido } })} style={styles.button}>
                Gerar QR-CODE
              </Button>
              <Button mode="contained" onPress={confirmExcluir} style={styles.buttonExcluir}>
                Cancelar Pedido
              </Button>
            </View>
          </>
        )}
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
    paddingTop: hp('10%'),
  },
  keyboardAvoidingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  listContainer: {
    width: '80%',
    maxHeight: hp('60%'),
    flex: 1,
    marginBottom: wp('10%'),
  },
  list: {
    flex: 1,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'blue',
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: wp('1%'),
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: "stretch",
  },
  buttonContainer: {
    width: '80%',
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
    marginVertical: hp('5%'),
  },
  total: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: hp('4%'),
  },
  buttonAdicionar: {
    marginTop: hp('3%'),
  },
});

export default PedidoID;