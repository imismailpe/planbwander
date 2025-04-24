"use client"
import { useState } from "react";
import { Input, Button, Card, Spin, Row, Col, Typography, Checkbox } from "antd";
import { OpenAI } from "openai";
import styles from "./page.module.css";
import "antd/dist/reset.css";

const { Search } = Input;
const { Title, Paragraph } = Typography;

export default function Home() {
  const [place, setPlace] = useState("Palakkad, Kerala");
  const [loading, setLoading] = useState(false);
  const [thoughts, setThoughts] = useState("");
  const [data, setData] = useState(null);
  const [usingDummy, setUsingDummy] = useState(false);

  const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });
  const promptTemplate = `From the given place name, return the current weather condition, top popular events up to max 3, top popular restaurants up to max 5 and top popular attractions up to max 5. Provide data in JSON format. Example of response with required format is:
{
  "weather": {
    "temperature": "84°F",
    "description": "Mostly cloudy",
    "feels_like": "92°F",
    "humidity": "81%",
    "wind": "WSW 9 mph"
  },
  "events": [
    {
      "name": "Kalpathy Cart Festival",
      "description": "Annual chariot festival at Kalpathy Viswanatha Swami Temple..."
    }
  ],
  "restaurants": [
    {
      "name": "Hasi's Kitchen",
      "specialty": "Keralan non-veg cuisine",
      "notes": "Cozy eatery near the Palakkad town railway station..."
    }
  ],
  "attractions": [
    {
      "name": "Palakkad Fort",
      "type": "Historical monument",
      "notes": "18th-century fort built by Hyder Ali..."
    }
  ]
}`;
  const dummyResponse = {
    "id": "chatcmpl-BPgAv9VT7UK32sVgRHoQi1M5nj6We",
    "object": "chat.completion",
    "created": 1745460021,
    "model": "gpt-4o-mini-2024-07-18",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "{\n  \"weather\": {\n    \"temperature\": \"85°F\",\n    \"description\": \"Partly cloudy\",\n    \"feels_like\": \"90°F\",\n    \"humidity\": \"75%\",\n    \"wind\": \"SE 10 mph\"\n  },\n  \"events\": [\n    {\n      \"name\": \"Kalpathy Cart Festival\",\n      \"description\": \"Annual chariot festival at Kalpathy Viswanatha Swami Temple featuring colorful processions.\"\n    },\n    {\n      \"name\": \"Puliyarmala East Hill Festival\",\n      \"description\": \"Religious festivities held at Puliyarmala temple with traditional music and dance.\"\n    },\n    {\n      \"name\": \"Onam Celebrations\",\n      \"description\": \"Festive events celebrating the harvest festival with traditional feasts and cultural programs.\"\n    }\n  ],\n  \"restaurants\": [\n    {\n      \"name\": \"Hasi's Kitchen\",\n      \"specialty\": \"Keralan non-veg cuisine\",\n      \"notes\": \"Cozy eatery near the Palakkad town railway station known for its homely atmosphere.\"\n    },\n    {\n      \"name\": \"Aryas\",\n      \"specialty\": \"Vegetarian cuisine\",\n      \"notes\": \"Popular for its variety of Indian thalis and snacks.\"\n    },\n    {\n      \"name\": \"Dine & Wine\",\n      \"specialty\": \"Multi-cuisine\",\n      \"notes\": \"Well-known for its comfortable setting and diverse menu.\"\n    },\n    {\n      \"name\": \"Sree Sree Restaurant\",\n      \"specialty\": \"Local delicacies\",\n      \"notes\": \"Famous for its traditional Kerala meals and quick service.\"\n    },\n    {\n      \"name\": \"Sukh Sagar\",\n      \"specialty\": \"North Indian cuisine\",\n      \"notes\": \"Known for its rich flavors and generous portions.\"\n    }\n  ],\n  \"attractions\": [\n    {\n      \"name\": \"Palakkad Fort\",\n      \"type\": \"Historical monument\",\n      \"notes\": \"18th-century fort built by Hyder Ali, a popular picnic spot.\"\n    },\n    {\n      \"name\": \"Malampuzha Garden\",\n      \"type\": \"Public garden\",\n      \"notes\": \"Featuring beautiful gardens, a dam, and a variety of recreational activities.\"\n    },\n    {\n      \"name\": \"Tipu Sultan’s Fort\",\n      \"type\": \"Historical item\",\n      \"notes\": \"Remnants of the fort built by Tipu Sultan showcasing the region’s history.\"\n    },\n    {\n      \"name\": \"Parambikulam Tiger Reserve\",\n      \"type\": \"Wildlife sanctuary\",\n      \"notes\": \"Home to diverse flora and fauna, ideal for wildlife enthusiasts.\"\n    },\n    {\n      \"name\": \"Kalpathy Vishwanatha Temple\",\n      \"type\": \"Cultural site\",\n      \"notes\": \"Historic temple known for its architectural beauty and annual festivals.\"\n    }\n  ]\n}",
                "refusal": null,
                "annotations": []
            },
            "logprobs": null,
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 261,
        "completion_tokens": 604,
        "total_tokens": 865,
        "prompt_tokens_details": {
            "cached_tokens": 0,
            "audio_tokens": 0
        },
        "completion_tokens_details": {
            "reasoning_tokens": 0,
            "audio_tokens": 0,
            "accepted_prediction_tokens": 0,
            "rejected_prediction_tokens": 0
        }
    },
    "service_tier": "default",
    "system_fingerprint": "fp_0392822090"
};
  const getWeatherBgColor = (desc) => {
    if (/cloud/i.test(desc)) return "#a0a0a0";
    if (/rain|storm|thunder/i.test(desc)) return "#5f9ea0";
    if (/sun|clear/i.test(desc)) return "#ffd700";
    return "#87ceeb";
  };

  const fetchData = async (value) => {
    setPlace(value);
    setLoading(true);
    setThoughts("Generating response using OpenAI...");
    try {
      if(usingDummy){
        setData(JSON.parse(dummyResponse.choices[0].message.content));
        setLoading(false);
        return;
      }
      const messages = [
        { role: "system", content: promptTemplate },
        { role: "user", content: value },
      ];
      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
      });
      const text = res.choices[0].message.content;
      setThoughts(text);
      const json = JSON.parse(text);
      setData(json);
    } catch (err) {
      console.error(err);
      setThoughts("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div style={{ padding: 8 }}>
          <Title level={2}>Plan B Wander</Title>
          <Checkbox checked={usingDummy} onChange={e => setUsingDummy(e.target.checked)}>Use dummy data</Checkbox>
          <br />
          <Search
            placeholder="Enter a place name (e.g., palakkad, kerala)"
            enterButton="Guide me"
            size="large"
            onSearch={fetchData}
            style={{ maxWidth: 600, marginBottom: 16 }}
value={place}
onChange={setPlace}
          />

          {loading && (
            <Card style={{ marginBottom: 16 }}>
              <Spin />
              <Paragraph style={{ marginTop: 8 }}>{thoughts}</Paragraph>
            </Card>
          )}

          {data && (
            <>
              {/* Weather Card */}
              <Card
                style={{
                  marginBottom: 16,
                  background: getWeatherBgColor(data.weather.description),
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "1px solid #e8e8e8",
                }}
              >
                <Title level={4}>Weather in {place}</Title>
                <Paragraph>Temperature: {data.weather.temperature}</Paragraph>
                <Paragraph>Feels Like: {data.weather.feels_like}</Paragraph>
                <Paragraph>Description: {data.weather.description}</Paragraph>
                <Paragraph>Humidity: {data.weather.humidity}</Paragraph>
                <Paragraph>Wind: {data.weather.wind}</Paragraph>
              </Card>

              {/* Other Sections */}
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  overflowX: "auto",
                  flexWrap: "wrap",
                  paddingBottom: 16,
                }}
              >
                {/* Events */}
                <Card
                  title="Events"
                  style={{
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "1px solid #e8e8e8",
                  }}
                >
                  {data.events.map((ev, idx) => (
                    <Card
                      key={idx}
                      type="inner"
                      title={ev.name}
                      style={{ marginBottom: 8 }}
                    >
                      {ev.description}
                    </Card>
                  ))}
                </Card>

                {/* Restaurants */}
                <Card
                  title="Restaurants"
                  style={{
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "1px solid #e8e8e8",
                  }}
                >
                  {data.restaurants.map((r, idx) => (
                    <Card
                      key={idx}
                      type="inner"
                      title={r.name}
                      style={{ marginBottom: 8 }}
                    >
                      <Paragraph>
                        <strong>Specialty:</strong> {r.specialty}
                      </Paragraph>
                      <Paragraph>
                        <strong>Notes:</strong> {r.notes}
                      </Paragraph>
                    </Card>
                  ))}
                </Card>

                {/* Attractions */}
                <Card
                  title="Attractions"
                  style={{
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "1px solid #e8e8e8",
                  }}
                >
                  {data.attractions.map((a, idx) => (
                    <Card
                      key={idx}
                      type="inner"
                      title={a.name}
                      style={{ marginBottom: 8 }}
                    >
                      <Paragraph>
                        <strong>Type:</strong> {a.type}
                      </Paragraph>
                      <Paragraph>
                        <strong>Notes:</strong> {a.notes}
                      </Paragraph>
                    </Card>
                  ))}
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
