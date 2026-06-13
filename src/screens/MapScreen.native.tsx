// ============================================================
// MapScreen.tsx
// Tela de mapa interativo com os EcoPontos de descarte
// Solicita permissão de localização ao usuário e centraliza
// o mapa na posição atual, exibindo marcadores dos EcoPontos
// ============================================================

import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

// Componente de mapa e marcador do react-native-maps
import MapView, { Marker } from 'react-native-maps';

// API de localização do Expo para obter permissão e coordenadas
import * as Location from 'expo-location';

// -------------------------------------------------------
// Tipagem das coordenadas de localização do usuário
// -------------------------------------------------------
interface UserCoords {
  latitude: number;
  longitude: number;
}

// -------------------------------------------------------
// Tipagem de cada EcoPonto exibido no mapa
// -------------------------------------------------------
interface EcoPoint {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

// -------------------------------------------------------
// Coordenadas padrão usadas caso a localização seja negada
// Centro do Rio de Janeiro — cidade dos EcoPontos cadastrados
// -------------------------------------------------------
const DEFAULT_LATITUDE  = -22.9068;
const DEFAULT_LONGITUDE = -43.1729;

// -------------------------------------------------------
// Componente principal da tela de mapa
// -------------------------------------------------------
export default function MapScreen() {

  // Estado com as coordenadas reais do usuário (null se não obtidas)
  const [location, setLocation] = useState<UserCoords | null>(null);

  // Estado que controla o indicador de carregamento
  const [loading, setLoading] = useState(true);

  // Lista estática de EcoPontos com nome, descrição e coordenadas
  const ecoPoints: EcoPoint[] = [
    {
      id: 1,
      name: 'EcoPonto Centro',
      description: 'Plástico, Papel e Vidro',
      latitude: -22.9068,
      longitude: -43.1729,
    },
    {
      id: 2,
      name: 'EcoPonto Sul',
      description: 'Eletrônicos',
      latitude: -22.9711,
      longitude: -43.1822,
    },
    {
      id: 3,
      name: 'EcoPonto Norte',
      description: 'Óleo de Cozinha',
      latitude: -22.8926,
      longitude: -43.2252,
    },
  ];

  // Executa a busca de localização assim que o componente é montado
  useEffect(() => {
    getUserLocation();
  }, []); // Array vazio = executa apenas uma vez, na montagem

  // -------------------------------------------------------
  // Solicita permissão e obtém a localização atual do usuário
  // -------------------------------------------------------
  async function getUserLocation() {

    try {

      // Solicita permissão de localização em primeiro plano
      // (foreground = enquanto o app está aberto)
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      // Se a permissão for negada, encerra sem atualizar location
      if (status !== 'granted') {
        setLoading(false);
        return;
      }

      // Obtém as coordenadas atuais do dispositivo
      const currentLocation =
        await Location.getCurrentPositionAsync({});

      // Armazena apenas latitude e longitude no estado
      setLocation(currentLocation.coords);

    } catch (error) {

      console.log('Erro ao obter localização:', error);

    } finally {

      // Desativa o loading independente de sucesso ou erro
      setLoading(false);

    }
  }

  // -------------------------------------------------------
  // Tela de carregamento exibida enquanto obtém a localização
  // -------------------------------------------------------
  if (loading) {

    return (

      <View style={styles.loadingContainer}>

        <ActivityIndicator
          size="large"
          color="#2E7D32"
        />

        <Text style={styles.loadingText}>
          Obtendo localização...
        </Text>

      </View>

    );
  }

  // -------------------------------------------------------
  // Renderização principal: título + mapa com marcadores
  // -------------------------------------------------------
  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        🗺️ EcoPontos
      </Text>

      <Text style={styles.subtitle}>
        Encontre locais próximos para descarte correto.
      </Text>

      {/*
        MapView renderiza o mapa nativo do dispositivo.
        showsUserLocation exibe o ponto azul da posição atual.
        initialRegion define o centro e o zoom inicial do mapa.
        latitudeDelta e longitudeDelta controlam o nível de zoom
        (valores menores = mais aproximado).
      */}
      <MapView
        style={styles.map}
        showsUserLocation
        initialRegion={{
          latitude:  location?.latitude  ?? DEFAULT_LATITUDE,
          longitude: location?.longitude ?? DEFAULT_LONGITUDE,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >

        {/*
          Renderiza um Marker para cada EcoPonto da lista.
          title e description aparecem ao tocar no marcador.
          A prop key é obrigatória para identificação na lista.
        */}
        {ecoPoints.map((point) => (

          <Marker
            key={point.id}
            coordinate={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            title={point.name}
            description={point.description}
          />

        ))}

      </MapView>

    </View>

  );
}

// ============================================================
// Estilos do componente utilizando StyleSheet do React Native
// ============================================================
const styles = StyleSheet.create({

  // Container principal que ocupa toda a tela
  container: {
    flex: 1,
    backgroundColor: '#F4FFF6',
  },

  // Título da tela posicionado acima do mapa
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 60,
    marginHorizontal: 20,
  },

  // Subtítulo descritivo abaixo do título
  subtitle: {
    color: '#757575',
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 20,
  },

  // Mapa ocupa todo o espaço restante da tela (flex: 1)
  map: {
    flex: 1,
  },

  // Container centralizado exibido durante o carregamento
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4FFF6',
  },

  // Texto abaixo do spinner de carregamento
  loadingText: {
    marginTop: 15,
    color: '#757575',
  },

});