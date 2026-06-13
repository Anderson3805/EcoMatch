// ============================================================
// MapScreen.Web.tsx
// Versão web da tela de EcoPontos
// Como react-native-maps não suporta web, esta versão exibe
// as informações em cards — sem o componente MapView nativo
// ============================================================

import React, { useEffect, useState } from 'react';

import {
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';

// API de localização do Expo — funciona tanto no mobile quanto na web
import * as Location from 'expo-location';

// -------------------------------------------------------
// Tipagem das coordenadas de localização do usuário
// -------------------------------------------------------
interface UserCoords {
  latitude: number;
  longitude: number;
}

// -------------------------------------------------------
// Tipagem de cada EcoPonto exibido na lista
// -------------------------------------------------------
interface EcoPoint {
  id: number;
  name: string;
  description: string;
}

// -------------------------------------------------------
// Componente principal da versão web da tela de mapa
// -------------------------------------------------------
export default function MapScreen() {

  // Estado com as coordenadas do usuário (null se não obtidas)
  const [location, setLocation] = useState<UserCoords | null>(null);

  // Lista de EcoPontos — espelho dos dados do MapScreen mobile
  const ecoPoints: EcoPoint[] = [
    {
      id: 1,
      name: 'EcoPonto Centro',
      description: 'Plástico, Papel e Vidro',
    },
    {
      id: 2,
      name: 'EcoPonto Sul',
      description: 'Eletrônicos',
    },
    {
      id: 3,
      name: 'EcoPonto Norte',
      description: 'Óleo de Cozinha',
    },
  ];

  // Executa a busca de localização assim que o componente é montado
  useEffect(() => {
    getLocation();
  }, []); // Array vazio = executa apenas uma vez, na montagem

  // -------------------------------------------------------
  // Solicita permissão e obtém a localização atual do usuário
  // -------------------------------------------------------
  async function getLocation() {

    try {

      // Solicita permissão de localização em primeiro plano
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      // Encerra sem atualizar o estado se a permissão for negada
      if (status !== 'granted') return;

      // Obtém as coordenadas atuais do dispositivo/navegador
      const current =
        await Location.getCurrentPositionAsync({});

      // Armazena apenas latitude e longitude no estado
      setLocation(current.coords);

    } catch (error) {

      console.log('Erro ao obter localização:', error);

    }
  }

  // -------------------------------------------------------
  // Renderização principal: localização do usuário + EcoPontos
  // -------------------------------------------------------
  return (

    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        🗺️ EcoPontos
      </Text>

      {/* Indica ao usuário que esta é a versão web (sem mapa interativo) */}
      <Text style={styles.subtitle}>
        Versão Web
      </Text>

      {/* Card com as coordenadas obtidas do navegador */}
      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          📌 Sua localização
        </Text>

        {location ? (

          // Exibe as coordenadas quando a permissão foi concedida
          <>
            <Text style={styles.coordText}>
              Latitude: {location.latitude.toFixed(6)}
            </Text>
            <Text style={styles.coordText}>
              Longitude: {location.longitude.toFixed(6)}
            </Text>
          </>

        ) : (

          // Mensagem de fallback quando a permissão foi negada
          <Text style={styles.deniedText}>
            Localização não disponível
          </Text>

        )}

      </View>

      {/*
        Renderiza um card para cada EcoPonto da lista.
        Usa item.id como key — mais estável que o índice do array,
        pois não muda se a ordem da lista for alterada.
      */}
      {ecoPoints.map((item) => (

        <View
          key={item.id}
          style={styles.card}
        >

          <Text style={styles.cardTitle}>
            📍 {item.name}
          </Text>

          {/* Descrição dos tipos de resíduo aceitos no EcoPonto */}
          <Text style={styles.descriptionText}>
            {item.description}
          </Text>

        </View>

      ))}

    </ScrollView>

  );
}

// ============================================================
// Estilos do componente utilizando StyleSheet do React Native
// ============================================================
const styles = StyleSheet.create({

  // Container principal com scroll vertical
  container: {
    flex: 1,
    backgroundColor: '#F4FFF6',
    padding: 20,
  },

  // Título principal da tela
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 20,
  },

  // Subtítulo que indica a versão web
  subtitle: {
    color: '#757575',
    marginBottom: 20,
  },

  // Card branco reutilizado para localização e EcoPontos
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,

    // Sombra para iOS
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,

    // Sombra para Android / Web
    elevation: 2,
  },

  // Título de cada card em verde
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },

  // Texto das coordenadas de latitude e longitude
  coordText: {
    fontSize: 15,
    color: '#616161',
    marginBottom: 4,
  },

  // Mensagem exibida quando a localização não está disponível
  deniedText: {
    fontSize: 15,
    color: '#9E9E9E',
    fontStyle: 'italic',
  },

  // Descrição dos resíduos aceitos em cada EcoPonto
  descriptionText: {
    fontSize: 15,
    color: '#757575',
  },

});