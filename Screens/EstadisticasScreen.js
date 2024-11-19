import React, { useState, useEffect } from 'react';
import { Button, Text, Dimensions, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/BDconfi';

const EstadisticasScreen = () => {
  const [obraData, setObraData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [antiguedadData, setAntiguedadData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchObraData();
    fetchAntiguedadData();
  }, []);

  const fetchObraData = async () => {
    const labels = [];
    const values = [];
    try {
      const querySnapshot = await getDocs(collection(db, 'catalogoarte'));
      querySnapshot.forEach((doc) => {
        labels.push(doc.data().nombre);
        values.push(doc.data().valor_estimado || 0);
      });
      setObraData({ labels, datasets: [{ data: values }] });
    } catch (error) {
      console.error('Error fetching obra data:', error);
    }
  };

  const fetchAntiguedadData = async () => {
    const labels = [];
    const values = [];
    try {
      const querySnapshot = await getDocs(collection(db, 'galeria_antiguedades'));
      querySnapshot.forEach((doc) => {
        labels.push(doc.data().nombre);
        values.push(parseInt(doc.data().valor_historico || 0));
      });
      setAntiguedadData({ labels, datasets: [{ data: values }] });
    } catch (error) {
      console.error('Error fetching antiguedad data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchObraData();
    await fetchAntiguedadData();
    setRefreshing(false);
  };

  const generatePDF = async () => {
    const htmlContent = `
      <html>
        <body>
          <h1>Reporte de Obras y Antigüedades</h1>
          <h2>Obras</h2>
          <ul>
            ${obraData.labels.map(
              (label, index) => `<li>${label}: $${obraData.datasets[0].data[index]}</li>`
            ).join('')}
          </ul>
          <h2>Antigüedades</h2>
          <ul>
            ${antiguedadData.labels.map(
              (label, index) => `<li>${label}: $${antiguedadData.datasets[0].data[index]}</li>`
            ).join('')}
          </ul>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const pdfUri = `${FileSystem.documentDirectory}Reporte_Obras_Antiguedades.pdf`;
      await FileSystem.moveAsync({ from: uri, to: pdfUri });
      
      await Sharing.shareAsync(pdfUri, {
        dialogTitle: 'Enviar PDF por WhatsApp',
        mimeType: 'application/pdf',
      });
    } catch (error) {
      console.error("Error generating or sharing PDF:", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Estadísticas de Valor Estimado</Text>

      <Text style={styles.subtitle}>Obras</Text>
      <BarChart
        data={obraData}
        width={Dimensions.get('window').width - 20}
        height={220}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#cc99cc',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(73, 76, 77, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
          barPercentage: 0.5,
        }}
        style={styles.chart}
      />

      <Text style={styles.subtitle}>Antigüedades</Text>
      <BarChart
        data={antiguedadData}
        width={Dimensions.get('window').width - 20}
        height={220}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: '#f7b731',
          backgroundGradientFrom: '#cc99cc',
          backgroundGradientTo: '#fef9e7',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(73, 76, 77, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
          barPercentage: 0.5,
        }}
        style={styles.chart}
      />

      <Button title="Generar PDF" onPress={generatePDF} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  chart: { marginVertical: 8, borderRadius: 16 },
});

export default EstadisticasScreen;
