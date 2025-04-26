"use client"
import React, { useState } from 'react';
import { Input, Button, Card, Row, Col, Typography, Space, message as antdMessage } from 'antd';

const { Title, Paragraph } = Typography;

export default function PlaceInfoApp() {
  const [place, setPlace] = useState('Palakkad, Kerala');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchPlaceInfo = async () => {
    if (!place) return;
    setLoading(true);
    try {
      const res = await fetch('/api/placeinfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'user_message', input: { content: `Tell me about ${place}` } }),
      });
      const result = await res.json();
  
      setData(result);
    } catch (error) {
      antdMessage.error('Failed to fetch place info');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <h2>Place B Wander</h2>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Enter a place name"
            value={place}
            onChange={e => setPlace(e.target.value)}
            onPressEnter={fetchPlaceInfo}
          />
          <Button type="primary" loading={loading} onClick={fetchPlaceInfo}>
            Get Info
          </Button>
        </Space.Compact>

        {data?.weather && (
          <Card title={`Weather in ${place}`} variant="outlined">
            <Paragraph><strong>Temperature:</strong> {data.weather.temperature}</Paragraph>
            <Paragraph><strong>Description:</strong> {data.weather.description}</Paragraph>
            <Paragraph><strong>Feels Like:</strong> {data.weather.feels_like}</Paragraph>
            <Paragraph><strong>Humidity:</strong> {data.weather.humidity}</Paragraph>
            <Paragraph><strong>Wind:</strong> {data.weather.wind}</Paragraph>
          </Card>
        )}

        <Row gutter={[16, 16]}>
          {["events", "restaurants", "attractions"].map((section) => (
            <Col xs={24} md={8} key={section}>
              <Card title={section.charAt(0).toUpperCase() + section.slice(1)} variant="outlined">
                {data?.[section]?.map((item, idx) => (
                  <Card type="inner" key={idx} title={item.name || item.title} style={{ marginBottom: 12 }}>
                    {item.description && <Paragraph>{item.description}</Paragraph>}
                    {item.specialty && <Paragraph><strong>Specialty:</strong> {item.specialty}</Paragraph>}
                    {item.notes && <Paragraph><strong>Notes:</strong> {item.notes}</Paragraph>}
                    {item.type && <Paragraph><strong>Type:</strong> {item.type}</Paragraph>}
                  </Card>
                ))}
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </div>
  );
}
