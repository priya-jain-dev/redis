import { redisPub } from "./redisService";

const companies = ["AAPL", "GOOGL", "AMZN", "TSLA"];

setInterval(() => {
  const randomCompany = companies[Math.floor(Math.random() * companies.length)];
  const price = (Math.random() * 1000).toFixed(2);
  redisPub
    .publish(
      `stock-price-${randomCompany}`,
      JSON.stringify({ company: randomCompany, price })
    )
    .catch((error) => {
      console.error("Error publishing message:", error);
    });
}, 2000);
