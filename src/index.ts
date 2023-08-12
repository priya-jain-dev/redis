import Redis from "ioredis";
console.log("Hello Redis!");

const redisClient = new Redis({
  port: 6379,
  host: "127.0.0.1",
});

const redisBasicDemo = async () => {
  await redisClient.set("my-name", "priya jain");
  const name = await redisClient.get("my-name");
  console.log(name);

  await redisClient.del("my-name");
  const name1 = await redisClient.get("my-name");
  console.log("Deleted name: ", name1);

  await redisClient.set("key_with_ttl", "hey", "EX", 1000);
  const ttl = await redisClient.ttl("key_with_ttl");
  console.log(ttl); // a number smaller or equal to 1000

  // Disconnect from Redis.
  redisClient.quit();
};

// redisBasicDemo();

const PlanetListDemo = async () => {
  const PLANET_LIST_KEY = "planets";
  const planets: Array<string> = [
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Pluto",
  ];

  const redisPlanetListLen = await redisClient.lpush(
    PLANET_LIST_KEY,
    ...planets
  );
  console.log("List length is ->", redisPlanetListLen);

  const somePlanets = await redisClient.lrange(PLANET_LIST_KEY, 0, 4);
  console.log("Range Planets list -> " + somePlanets.length, somePlanets);

  const firstPlanet = await redisClient.lindex(PLANET_LIST_KEY, 0);

  console.log("firstPlanet list -> " + firstPlanet);

  // LINDEX key index
  const lastPlanet = await redisClient.lindex(PLANET_LIST_KEY, -1);

  console.log("lastPlanet list -> " + lastPlanet);

  // LINSERT key BEFORE|AFTER pivot element
  const insertDummyPlanet = await redisClient.linsert(
    PLANET_LIST_KEY,
    "BEFORE",
    "Pluto",
    "TestPlanet"
  );
  console.log("insertDummyPlanet -> " + insertDummyPlanet);

  // LLEN key
  const PlanetLen = await redisClient.llen(PLANET_LIST_KEY);

  console.log("Planet Length -> " + PlanetLen);

  // LPOP key [count]
  const PlanetPop = await redisClient.lpop(PLANET_LIST_KEY);

  console.log("PlanetPop -> " + PlanetPop);

  const rightPlant = await redisClient.rpush(PLANET_LIST_KEY, "Right Planet 1");

  console.log("rightPlant -> ", rightPlant);

  await redisClient.rpop(PLANET_LIST_KEY);

  // LRANGE mylist 0 -1
  const allPlanet = await redisClient.lrange(PLANET_LIST_KEY, 0, -1);

  console.log("allPlanet -> ", allPlanet);

  const deletedPlanet = await redisClient.del(PLANET_LIST_KEY);

  console.log("deleted All Planet -> " + deletedPlanet);

  // Disconnect from Redis.
  redisClient.quit();
};

// PlanetListDemo();

const RedisPipeline = async () => {
  const hashSetPipeResult = await redisClient
    .pipeline()
    .hset(
      "planet:mercury",
      "name",
      "Mercury",
      "diameter",
      4879,
      "diameterUnit",
      "km"
    )
    .hset(
      "planet:venus",
      "name",
      "Venus",
      "diameter",
      12104,
      "diameterUnit",
      "km"
    )
    .hset(
      "planet:earth",
      "name",
      "Earth",
      "diameter",
      12756,
      "diameterUnit",
      "km"
    )
    .hset("planet:mars", "name", "Mars", "diameter", 6779, "diameterUnit", "km")
    .exec();
  console.log("hashSetPipeResult ->", hashSetPipeResult);

  const getPipeResult = await redisClient
    .pipeline()
    .hgetall("planet:earth")
    .hgetall("planet:mars")
    .exec();
  console.log("getPipeResult ->", getPipeResult);
  // Disconnect from Redis.
  redisClient.quit();
};

// RedisPipeline();

const multiValue = async () => {
  const user = {
    name: "priya",
    age: 27,
    description: "I am a honest person.",
    interested: ["programming", "health", "business", "mindset"],
  };

  const mSetUser = await redisClient.mset(user);
  console.log("set multi value ", mSetUser);

  const name = await redisClient.get("name");
  const interested = await redisClient.get("interested");
  console.log("name - ", name, "interested - ", interested);

  const exists = await redisClient.exists("name");
  console.log("exists name - ", exists); // 0 (means false, and if it's 1, it means true)

  await redisClient.incrby("age", 1); //for integer only
  const newAge = await redisClient.get("age");
  console.log(newAge); // 28

  // Disconnect from Redis.
  redisClient.quit();
};

multiValue();
