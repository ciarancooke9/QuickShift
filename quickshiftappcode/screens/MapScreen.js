import { StyleSheet, Text, View, Button } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import * as Location from "expo-location";

const MapScreen = ({ route, navigation }) => {
  const [userCoords, setUserCoords] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const adverts = route.params.adverts;

  const [mapRegion, setMapRegion] = useState(null);

  const extractMarkers = (adverts) => {
    const markersList = [];

    adverts.forEach((advert) => {
      if (advert.geopoint) {
        console.log("map adverts", advert.geopoint);
        markersList.push({
          index: advert.id,
          latlng: {
            latitude: advert.geopoint.latitude,
            longitude: advert.geopoint.longitude,
          },
          title: `Name: ${advert.employerName}`,
          time: `When: ${advert.time.date} ${advert.time.startTime}`,
          pay: `Rate:$ ${advert.pay}`,
          hours: `Hours:${advert.hours}`,
        });
      }
    });

    setMapRegion({
      latitude: markersList[0].latlng.latitude,
      longitude: markersList[0].latlng.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    return markersList;
  };

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
    }
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    setUserCoords({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      userLocation();
      setMarkers(extractMarkers(adverts));
      setLoading(false);
      console.log("markers", markers);
      return () => {};
    }, [])
  );

  const renderMarkers = () => {
    const markerComponents = [];
    console.log("markers", markers);
    console.log("markerslength", markers.length);
    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      console.log("marker", marker);
      markerComponents.push(
        <Marker
          key={i}
          coordinate={marker.latlng}
          title={marker.title}
          description={marker.description}
        >
          <Callout style={styles.calloutContainer}>
            <View style={styles.calloutHeader}>
              <Text style={styles.calloutTitle}>{marker.title}</Text>
            </View>
            <View style={styles.calloutContent}>
              <Text style={styles.calloutText}>{marker.time}</Text>
              <Text style={styles.calloutText}>{marker.pay}</Text>
              <Text style={styles.calloutText}>{marker.hours}</Text>
            </View>
          </Callout>
        </Marker>
      );
    }
    console.log("markercomps", markerComponents);
    return markerComponents;
  };

  return (
    <View style={styles.mapContainer}>
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} region={mapRegion}>
        {userCoords && (
          <Marker
            coordinate={userCoords}
            title="This is where you are!"
            pinColor="green"
          >
            <Callout style={styles.calloutContainer} tooltip={false}>
              <Text style={styles.calloutText}>Your Location</Text>
            </Callout>
          </Marker>
        )}
        {markers && renderMarkers()}
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
    flex: 10,
  },
  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  calloutContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 10,
  },
  calloutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  calloutSubtitle: {
    fontSize: 14,
    color: "#999999",
  },
  calloutContent: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  calloutText: {
    fontSize: 14,
    color: "#333333",
  },
});
