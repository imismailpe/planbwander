"use client";
import React, { useState } from "react";
import {
  Input,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  message as antdMessage,
} from "antd";

const { Paragraph } = Typography;

export default function PlaceInfoApp() {
  const [place, setPlace] = useState("Palakkad, Kerala");
const [usingLocation, setUsingLocation] = useState(false);
  const [confirmedPlace, setConfirmedPlace] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

const onGetInfo = (place) => {
  setUsingLocation(false);
  fetchPlaceInfo(place);
}
  const fetchPlaceInfo = async (place) => {
    if (!place) return;
    setLoading(true);
    try {
      const res = await fetch("/api/placeinfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "user_message",
          input: { content: `Tell me about ${place}` },
        }),
      });
      const result = await res.json();
      setData(result);
    } catch (error) {
      antdMessage.error("Failed to fetch place info");
      console.error(error);
    }
    setConfirmedPlace(place);
    setLoading(false);

  };
  const useMyLocation = () => {
setLoading(true)
setUsingLocation(true)

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(
      (data) => {
        const placeText = `lat: ${data.coords.latitude}, long: ${data.coords.longitude}`;
        setPlace(placeText);
        fetchPlaceInfo(placeText);
      },
      () => {
        antdMessage.error("Failed to get location");
setUsingLocation(false);
setLoading(false)
      },
      options
    );
  };
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <h2>LaPlace</h2>
        <h4 style={{ color: "#525252", fontWeight: 400, margin: 0 }}>
          Find the best things to explore in a place with the help of AI
        </h4>
        <Row justify={"center"} gutter={[32, 16]} align={"middle"}>
          <Col flex={1}>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="Enter a place name"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              onPressEnter={() => onGetInfo(place)}
              style={{ width: "100%" }}
              size="large"
allowClear
            />
            <Button
              type="primary"
              loading={loading}
              onClick={() => onGetInfo(place)}
              size="large"
            >
              Get Info
            </Button>
          </Space.Compact>
          </Col>
          <Col>
          <Button type="default" onClick={useMyLocation} size="large">
            Use my location
          </Button>
          </Col>
        </Row>

        <Card
          loading={loading}
          title={"☔ Weather"}
          variant="outlined"
          style={{
            boxShadow: "2px 2px 6px #bcbcbc",
          }}
        >
          {data?.weather && (
            <Row justify={"space-between"} gutter={[16, 16]}>
              <Col>
                <Paragraph>
                  <strong>Temperature:</strong> {data.weather.temperature}
                </Paragraph>
              </Col>
              <Col>
                <Paragraph>
                  <strong>Condition:</strong> {data.weather.description}
                </Paragraph>
              </Col>
              <Col>
                <Paragraph>
                  <strong>Feels Like:</strong> {data.weather.feels_like}
                </Paragraph>
              </Col>
              <Col>
                <Paragraph>
                  <strong>Humidity:</strong> {data.weather.humidity}
                </Paragraph>
              </Col>
              <Col>
                <Paragraph>
                  <strong>Wind:</strong> {data.weather.wind}
                </Paragraph>
              </Col>
            </Row>
          )}
        </Card>

        <Row gutter={[16, 16]}>
          {["events", "restaurants", "attractions"].map((section) => (
            <Col xs={24} md={8} key={section}>
              <Card
                title={
                  (section === "events"
                    ? "⚽"
                    : section === "attractions"
                    ? "⛲"
                    : "☕") +
                  " " +
                  section.charAt(0).toUpperCase() +
                  section.slice(1)
                }
                variant="outlined"
                styles={{
                  body: {
                    background: "#f6f6f6",
                    padding: 16,
                  },
                }}
                style={{
                  boxShadow: "2px 2px 4px #bcbcbc",
                }}
                loading={loading}
              >
                {data?.[section]?.map((item, idx) => (
                  <Card
                    type="inner"
                    key={idx}
                    title={item.name || item.title}
                    style={{
                      marginBottom: 12,
                      boxShadow: "4px 4px 6px #bcbcbc",
                    }}
                  >
                    {item.description && (
                      <Paragraph>{item.description}</Paragraph>
                    )}
                    {item.specialty && (
                      <Paragraph>
                        <strong>Specialty:</strong> {item.specialty}
                      </Paragraph>
                    )}
                    {item.notes && (
                      <Paragraph>
                        <strong>Notes:</strong> {item.notes}
                      </Paragraph>
                    )}
                    {item.type && (
                      <Paragraph>
                        <strong>Type:</strong> {item.type}
                      </Paragraph>
                    )}
                    {item.rating && (
                      <Paragraph>
                        <strong>Rating:</strong> {item.rating} ⭐
                      </Paragraph>
                    )}
                    <Button
                      type="primary"
                      target="_blank"
                      href={`https://www.google.com/search?q=${item.name}, near ${usingLocation? "me":confirmedPlace}`}
                    >
                      {section === "events"
                        ? "Know more"
                        : section === "restaurants"
                        ? "Find it"
                        : "Explore"}
                    </Button>
                  </Card>
                ))}
              </Card>
            </Col>
          ))}
        </Row>
        <footer>
          <center>Powered by: Gemini, Zod, Vercel, Antd, Github</center>
        </footer>
      </Space>
    </div>
  );
}
