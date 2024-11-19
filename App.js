import React from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import GestionObraScreen from './Screens/GestionObraScreen';
import RegistroObraScreen from './Screens/RegistroObraScreen';
import GestionAntiguedadScreen from './Screens/GestionAntiguedadScreen';
import RegistroAntiguedadScreen from './Screens/RegistroAntiguedadScreen';
import EstadisticasScreen from './Screens/EstadisticasScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ObrasStack() {
  return (
    <Stack.Navigator initialRouteName="GestionObraScreen">
      <Stack.Screen 
        name="GestionObraScreen" 
        component={GestionObraScreen} 
        options={({ navigation }) => ({
          title: 'Catálogo de Obras',
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate('RegistroObraScreen')}
              title="Registrar Obra"
              color="#333366"
            />
          ),
        })}
      />
      <Stack.Screen 
        name="RegistroObraScreen" 
        component={RegistroObraScreen} 
        options={{ title: 'Registrar Obra' }}
      />
    </Stack.Navigator>
  );
}

function AntiguedadesStack() {
  return (
    <Stack.Navigator initialRouteName="GestionAntiguedadScreen">
      <Stack.Screen 
        name="GestionAntiguedadScreen" 
        component={GestionAntiguedadScreen} 
        options={({ navigation }) => ({
          title: 'Galeria de Antigüedades',
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate('RegistroAntiguedadScreen')}
              title="Registrar Antigüedad"
              color="#333366"
            />
          ),
        })}
      />
      <Stack.Screen 
        name="RegistroAntiguedadScreen" 
        component={RegistroAntiguedadScreen} 
        options={{ title: 'Registrar Antigüedad' }}
      />
    </Stack.Navigator>
  );
}

function EstadisticasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="EstadisticasMain" 
        component={EstadisticasScreen} 
        options={{ title: 'Estadísticas',
          headerShown: false
         }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Obras"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Obras') {
              iconName = 'palette';
            } else if (route.name === 'Antiguedades') {
              iconName = 'castle';
            } else if (route.name === 'Estadisticas') {
              iconName = 'chart-bar';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#cc99ff',
          tabBarInactiveTintColor: 'purple',
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Obras" 
          component={ObrasStack} 
          options={{ title: 'Obras' }}
        />
        <Tab.Screen 
          name="Antiguedades" 
          component={AntiguedadesStack} 
          options={{ title: 'Antigüedades' }}
        />
        <Tab.Screen 
          name="Estadisticas" 
          component={EstadisticasStack} 
          options={{ title: 'Estadisticas' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
