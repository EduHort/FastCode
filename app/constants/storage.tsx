import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item, Pedido } from './types';

export const cadastrarItem = async (item: Item) => {
  try {
    // Verifica se o item já existe
    const existingItem = await fetchItem(item.nome);
    if (existingItem) {
      console.log(`Item com nome ${item.nome} já existe.`);
      return 1;
    }

    const jsonValue = JSON.stringify(item);
    await AsyncStorage.setItem(`item_${item.nome}`, jsonValue);
    console.log(`Item com nome ${item.nome} adicionado com sucesso.`);
    return item;
  } catch (e) {
    console.error(`Erro ao adicionar item com nome ${item.nome}:`, e);
    return null;
  }
};

export const removerItem = async (nome: string) => {
  try {
    await AsyncStorage.removeItem(`item_${nome}`);
    console.log(`Item com nome ${nome} removido com sucesso.`);
  } catch (e) {
    console.error(`Erro ao remover item com nome ${nome}:`, e);
  }
};

export const fetchItens = async (): Promise<Item[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const result: Item[] = [];
    for (let key of keys) {
      if (key.startsWith('item_')) {
        const jsonValue = await AsyncStorage.getItem(key);
        if (jsonValue != null) {
          result.push(JSON.parse(jsonValue));
        }
      }
    }
    return result;
  } catch (e) {
    console.error('Erro ao buscar itens:', e);
    return [];
  }
};

export const fetchItem = async (nome: string): Promise<Item | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(`item_${nome}`);
      const item: Item | null = jsonValue != null ? JSON.parse(jsonValue) : null;
      return item;
    } catch (e) {
      console.error(`Erro ao buscar item com nome ${nome}:`, e);
      return null;
    }
  };

  export const criarPedido = async (id: string): Promise<Pedido | null> => {
    try {
      const now = new Date();
  
      // Ajusta o fuso horário (considerando -3 horas de diferença)
      now.setHours(now.getHours() - 3); 
  
      // Formata a data como "dd/mm/aaaa" 
      const dia = now.getDate().toString().padStart(2, '0');
      const mes = (now.getMonth() + 1).toString().padStart(2, '0');
      const ano = now.getFullYear();
      const dataFormatada = `${dia}/${mes}/${ano}`;
  
      // Formata a hora como "HH:mm:ss" (formato 24 horas)
      const horaFormatada = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Isso desativa o AM/PM
      });
  
      const pedido: Pedido = {
        id,
        itens: [],
        hora: horaFormatada,
        data: dataFormatada,
      };
  
      await AsyncStorage.setItem(`pedido_${id}`, JSON.stringify(pedido));
      console.log(`Pedido criado com ID ${id}.`);
      return pedido;
    } catch (e) {
      console.error('Erro ao criar pedido:', e);
      return null;
    }
  };

  export const adicionarItemAoPedido = async (pedidoId: string, item: Item): Promise<Pedido | null> => {
    try {
      const pedidoJson = await AsyncStorage.getItem(`pedido_${pedidoId}`);
      if (pedidoJson != null) {
        const pedido: Pedido = JSON.parse(pedidoJson);
  
        // Verifica se o item já existe no pedido
        const itemIndex = pedido.itens.findIndex(p => p.nome === item.nome);
  
        if (itemIndex !== -1) {
          // Se o item já existe, incrementa a quantidade
          const quantidadeAtual = parseFloat(pedido.itens[itemIndex].quantidade); // Já está no formato com ponto
          const quantidadeNova = parseFloat(item.quantidade); // Já está no formato com ponto
          pedido.itens[itemIndex].quantidade = (quantidadeAtual + quantidadeNova).toFixed(2); // Mantém o formato com ponto
        } else {
          // Se o item não existe, adiciona ao pedido
          pedido.itens.push(item);
        }
  
        await AsyncStorage.setItem(`pedido_${pedidoId}`, JSON.stringify(pedido));
        console.log(`Item adicionado ao pedido com ID ${pedidoId}.`);
        return pedido;
      } else {
        console.error(`Pedido com ID ${pedidoId} não encontrado.`);
        return null;
      }
    } catch (e) {
      console.error(`Erro ao adicionar item ao pedido com ID ${pedidoId}:`, e);
      return null;
    }
  };

  export const removerItemDoPedido = async (pedidoId: string, nomeItem: string): Promise<Pedido | null> => {
    try {
      const pedidoJson = await AsyncStorage.getItem(`pedido_${pedidoId}`);
      if (pedidoJson != null) {
        const pedido: Pedido = JSON.parse(pedidoJson);
  
        // Encontra o índice do item no pedido
        const itemIndex = pedido.itens.findIndex(item => item.nome === nomeItem);
  
        if (itemIndex !== -1) {
          // Remove o item do pedido
          pedido.itens.splice(itemIndex, 1);
  
          // Atualiza o pedido no AsyncStorage
          await AsyncStorage.setItem(`pedido_${pedidoId}`, JSON.stringify(pedido));
          console.log(`Item ${nomeItem} removido do pedido com ID ${pedidoId} com sucesso.`);
  
          return pedido;
        } else {
          console.error(`Item ${nomeItem} não encontrado no pedido com ID ${pedidoId}.`);
          return null;
        }
      } else {
        console.error(`Pedido com ID ${pedidoId} não encontrado.`);
        return null;
      }
    } catch (e) {
      console.error(`Erro ao remover item ${nomeItem} do pedido com ID ${pedidoId}:`, e);
      return null;
    }
  };

  export const buscarPedido = async (pedidoId: string): Promise<Pedido | null> => {
    try {
      const pedidoJson = await AsyncStorage.getItem(`pedido_${pedidoId}`);
      const pedido: Pedido | null = pedidoJson != null ? JSON.parse(pedidoJson) : null;
      return pedido;
    } catch (e) {
      console.error(`Erro ao buscar pedido com ID ${pedidoId}:`, e);
      return null;
    }
  };

  export const buscarTodosPedidos = async (): Promise<Pedido[]> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result: Pedido[] = [];
      for (let key of keys) {
        if (key.startsWith('pedido_')) {
          const pedidoJson = await AsyncStorage.getItem(key);
          if (pedidoJson != null) {
            result.push(JSON.parse(pedidoJson));
          }
        }
      }
      return result;
    } catch (e) {
      console.error('Erro ao buscar todos os pedidos:', e);
      return [];
    }
  };

  export const excluirPedido = async (pedidoId: string): Promise<number> => {
    try {
      await AsyncStorage.removeItem(`pedido_${pedidoId}`);
      console.log(`Pedido com ID ${pedidoId} excluído com sucesso.`);
      return 1;
    } catch (e) {
      console.error(`Erro ao excluir pedido com ID ${pedidoId}:`, e);
      return 0;
    }
  };

  export const salvarHistFuncionario = async (pedido: Pedido) => {
    try {
      const jsonValue = JSON.stringify(pedido);
      await AsyncStorage.setItem(`histF_${pedido.data}-${pedido.hora}`, jsonValue);
      console.log(`Pedido salvo com sucesso.`);
      return pedido;
    } catch (e) {
      console.error(`Erro ao salvar pedido no Histórico:`, e);
      return null;
    }
  };
  
  export const buscarPedidosHistoricoFuncionario = async (): Promise<Pedido[]> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result: Pedido[] = [];
      for (let key of keys) {
        if (key.startsWith('histF_')) {
          const pedidoJson = await AsyncStorage.getItem(key);
          if (pedidoJson != null) {
            result.push(JSON.parse(pedidoJson));
          }
        }
      }
      return result;
    } catch (e) {
      console.error('Erro ao buscar todos os pedidos:', e);
      return [];
    }
  };

  export const buscarPedidoHistoricoFuncionario = async (data: string, hora: string): Promise<Pedido | null> => {
    try {
      const pedidoJson = await AsyncStorage.getItem(`histF_${data}-${hora}`);
      const pedido: Pedido | null = pedidoJson != null ? JSON.parse(pedidoJson) : null;
      return pedido;
    } catch (e) {
      console.error(`Erro ao buscar pedido com ID ${data}-${hora}:`, e);
      return null;
    }
  }

  export const salvarHistCliente = async (pedido: Pedido) => {
    try {
      const jsonValue = JSON.stringify(pedido);
      await AsyncStorage.setItem(`histC_${pedido.data}-${pedido.hora}`, jsonValue);
      console.log(`Pedido salvo com sucesso.`);
      return pedido;
    } catch (e) {
      console.error(`Erro ao salvar pedido no Histórico:`, e);
      return null;
    }
  };
  
  export const buscarPedidosHistoricoCliente = async (): Promise<Pedido[]> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result: Pedido[] = [];
      for (let key of keys) {
        if (key.startsWith('histC_')) {
          const pedidoJson = await AsyncStorage.getItem(key);
          if (pedidoJson != null) {
            result.push(JSON.parse(pedidoJson));
          }
        }
      }
      return result;
    } catch (e) {
      console.error('Erro ao buscar todos os pedidos:', e);
      return [];
    }
  };

  export const buscarPedidoHistoricoCliente = async (data: string, hora: string): Promise<Pedido | null> => {
    try {
      const pedidoJson = await AsyncStorage.getItem(`histC_${data}-${hora}`);
      const pedido: Pedido | null = pedidoJson != null ? JSON.parse(pedidoJson) : null;
      return pedido;
    } catch (e) {
      console.error(`Erro ao buscar pedido com ID ${data}-${hora}:`, e);
      return null;
    }
  }

  export const salvarQR = async (pedido: Pedido) => {
    try {
      const jsonValue = JSON.stringify(pedido);
      await AsyncStorage.setItem(`QR`, jsonValue); // Usando o ID do pedido como chave
      return pedido;
    } catch (e) {
      console.error(`Erro ao salvar pedido:`, e);
      return null;
    }
  };

  export const buscarQR = async (): Promise<Pedido | null> => {
    try {
      const pedidoJson = await AsyncStorage.getItem(`QR`);
      const pedido: Pedido | null = pedidoJson != null ? JSON.parse(pedidoJson) : null;
      return pedido;
    } catch (e) {
      console.error(`Erro ao buscar pedido:`, e);
      return null;
    }
  }

  export const removerQR = async () => {
    try {
      await AsyncStorage.removeItem(`QR`);
      console.log(`QR removido com sucesso.`);
    } catch (e) {
      console.error(`Erro ao remover QR:`, e);
    }
  };

  export const limparStorage = async (): Promise<void> => {
    try {
        await AsyncStorage.clear();
        console.log('Todos os dados do AsyncStorage foram removidos com sucesso.');
    } catch (e) {
        console.error('Erro ao limpar AsyncStorage:', e);
    }
};