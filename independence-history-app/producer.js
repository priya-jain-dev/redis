// const { v4: uuidv4 } = require("uuid");
const Redis = require("ioredis");

const streamKey = process.env.STREAM || "india-historical-moment";
const producer = process.env.PRODUCER || "indians";
// const maxMessages = parseInt(process.env.MESSAGES || "2");

const redis = new Redis();

async function sendMessages(messages) {
  // let count = 0;
  for (const message of messages) {
    try {
      const { content, date } = message;

      const data = {
        producer: producer,
        content: content,
        date: date,
      };
      // const resp = await redis.xadd(streamKey, timestamp, 'data', JSON.stringify(data));

      const resp = await redis.xadd(
        streamKey,
        "*",
        "data",
        JSON.stringify(data)
      );
      console.log(resp);
    } catch (e) {
      console.error("ERROR REDIS CONNECTION:", e);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

const historicalMessages = [
  {
    content: "🇮🇳 The Indian National Congress was founded.",
    date: "December 28, 1885",
  },
  {
    content: "🇮🇳 Partition of Bengal was announced.",
    date: "July 20, 1905",
  },
  {
    content: "🔫 The Jallianwala Bagh massacre occurred.",
    date: "April 13, 1919",
  },
  {
    content: "✊ Non-Cooperation Movement was launched.",
    date: "August 1, 1920",
  },
  {
    content:
      "💥 Chauri Chaura incident led to suspension of Non-Cooperation Movement.",
    date: "February 5, 1922",
  },
  {
    content: "📜 Simon Commission was appointed.",
    date: "November 8, 1927",
  },
  {
    content:
      "💣 Bhagat Singh and Batukeshwar Dutt threw non-lethal bombs in Central Legislative Assembly.",
    date: "April 8, 1929",
  },
  {
    content: "🌍 Civil Disobedience Movement was launched.",
    date: "March 12, 1930",
  },
  {
    content: "🚶 Gandhi launched the Dandi March.",
    date: "March 12, 1930",
  },
  {
    content: "🗣️ First Round Table Conference was held in London.",
    date: "November 12, 1930",
  },
  {
    content: "🤝 Gandhi-Irwin Pact was signed.",
    date: "March 5, 1931",
  },
  {
    content: "🚫 Civil Disobedience Movement was suspended.",
    date: "May 5, 1933",
  },
  {
    content:
      "👤 Subhas Chandra Bose became the President of Indian National Congress.",
    date: "January 29, 1938",
  },
  {
    content: "🌍 Second World War began, leading to India's involvement.",
    date: "September 1, 1939",
  },
  {
    content: "📜 August Offer was proposed by the British Government.",
    date: "August 8, 1940",
  },
  {
    content: "✊ Quit India Movement was launched.",
    date: "August 9, 1942",
  },
  {
    content: "🔍 Cripps Mission arrived in India.",
    date: "March 22, 1942",
  },
  {
    content:
      "🇮🇳 Azad Hind Fauj (Indian National Army) was formed by Subhas Chandra Bose.",
    date: "September 1, 1942",
  },
  {
    content:
      "⚔️ Battle of Imphal and Kohima marked turning point in World War II in Southeast Asia.",
    date: "April 4, 1944",
  },
  {
    content: "⚓ Bombay Naval Mutiny took place.",
    date: "February 18, 1946",
  },
  {
    content: "🗽 Mountbatten Plan for partition and independence was proposed.",
    date: "June 3, 1947",
  },
  {
    content: "🎉 India gained independence from British rule.",
    date: "August 15, 1947",
  },
  {
    content: "🔫 Mahatma Gandhi was assassinated.",
    date: "January 30, 1948",
  },
  {
    content: "🇮🇳 Integration of princely states into India began.",
    date: "1948-1950",
  },
  {
    content: "🗳️ First general elections were held in India.",
    date: "October 25, 1951",
  },
  {
    content: "📜 The Indian Constitution came into effect.",
    date: "January 26, 1950",
  },
  {
    content: "🎆 India became a Republic.",
    date: "January 26, 1950",
  },
  {
    content: "🔥 Indo-Pak War over Kashmir took place.",
    date: "October 22, 1947 - December 31, 1948",
  },
  {
    content: "📋 Five-Year Plans for economic development were introduced.",
    date: "1951-2017 (multiple plans)",
  },
  {
    content: "🤝 Panchsheel Agreement was signed between India and China.",
    date: "April 29, 1954",
  },
  {
    content: "🇮🇳 Hindi-Chini Bhai Bhai slogan was popularized.",
    date: "1950s",
  },
  {
    content:
      "🏔️ The Dalai Lama sought asylum in India, leading to strained India-China relations.",
    date: "March 1959",
  },
  {
    content: "🏖️ Goa was liberated from Portuguese rule.",
    date: "December 19, 1961",
  },
  {
    content: "⚔️ Indo-China War erupted over border disputes.",
    date: "October 20, 1962 - November 21, 1962",
  },
  {
    content: "🇮🇳 Indo-Pak War over the Rann of Kutch took place.",
    date: "April 9, 1965",
  },
  {
    content: "🔫 Indo-Pak War over Kashmir (Second Kashmir War) occurred.",
    date: "April 1965 - September 1965",
  },
  {
    content:
      "🌾 Green Revolution was initiated to increase agricultural productivity.",
    date: "1960s-1970s",
  },
  {
    content: "💰 Nationalization of banks took place.",
    date: "1969",
  },
  {
    content:
      "👩‍🦳 Indira Gandhi became the first female Prime Minister of India.",
    date: "January 24, 1966",
  },
  {
    content: "🇧🇩 Bangladesh Liberation War led to the creation of Bangladesh.",
    date: "March 26, 1971 - December 16, 1971",
  },
  {
    content:
      "☢️ Nuclear test, codenamed 'Smiling Buddha,' made India a nuclear state.",
    date: "May 18, 1974",
  },
  {
    content:
      "🚨 Emergency was declared, leading to suspension of civil liberties.",
    date: "June 25, 1975 - March 21, 1977",
  },
  {
    content:
      "⛑️ Operation Blue Star was conducted in Amritsar's Golden Temple.",
    date: "June 3, 1984",
  },
  {
    content: "🔫 Indira Gandhi was assassinated by her bodyguards.",
    date: "October 31, 1984",
  },
  {
    content:
      "☠️ Bhopal Gas Tragedy, one of the world's worst industrial disasters, occurred.",
    date: "December 3, 1984",
  },
  {
    content:
      "👦 Rajiv Gandhi became the Prime Minister after his mother's assassination.",
    date: "December 31, 1984",
  },
  {
    content: "🕌 Ayodhya dispute led to the demolition of Babri Masjid.",
    date: "December 6, 1992",
  },
  {
    content:
      "🌍 India implemented economic liberalization and globalization policies.",
    date: "1990s",
  },
  {
    content: "⚔️ Kargil War took place between India and Pakistan.",
    date: "May 3, 1999 - July 26, 1999",
  },
  {
    content: "☢️ Pokhran-II nuclear tests were conducted.",
    date: "May 11-13, 1998",
  },
  {
    content: "👴 Atal Bihari Vajpayee became the Prime Minister.",
    date: "March 19, 1998",
  },
  {
    content:
      "🚀 India's first successful mission to Mars, Mars Orbiter Mission (Mangalyaan), was launched.",
    date: "November 5, 2013",
  },
  {
    content: "🇮🇳 Narendra Modi became the Prime Minister of India.",
    date: "May 26, 2014",
  },
  {
    content: "💼 Goods and Services Tax (GST) was implemented.",
    date: "July 1, 2017",
  },
  {
    content: "⚖️ Supreme Court of India decriminalized homosexuality.",
    date: "September 6, 2018",
  },
  {
    content:
      "🛰️ India conducted 'Mission Shakti,' an anti-satellite missile test.",
    date: "March 27, 2019",
  },
  {
    content:
      "🔒 Article 370, granting special status to Jammu and Kashmir, was revoked.",
    date: "August 5, 2019",
  },
  {
    content:
      "📜 Citizenship Amendment Act (CAA) was passed, leading to protests.",
    date: "December 11, 2019",
  },
  {
    content:
      "🦠 COVID-19 pandemic hit India, leading to lockdowns and health crisis.",
    date: "From March 2020",
  },
  {
    content:
      "💸 India launched 'Aatmanirbhar Bharat' (Self-Reliant India) economic package.",
    date: "May 12, 2020",
  },
  {
    content: "🏔️ India-China border tensions escalated in Ladakh region.",
    date: "June 2020 - Ongoing",
  },
  {
    content:
      "🌾 Farmers' protests against new agricultural laws gained national attention.",
    date: "Since November 2020",
  },
  {
    content: "💉 India started its COVID-19 vaccination campaign.",
    date: "January 16, 2021",
  },
  {
    content:
      "🦠 Second wave of COVID-19 led to devastating impact on India's healthcare system.",
    date: "April-May 2021",
  },
  {
    content:
      "🏅 Tokyo 2020 Summer Olympics took place in 2021 due to COVID-19 delays.",
    date: "July 23 - August 8, 2021",
  },
  {
    content: "🎉 India celebrated its 75th Independence Day.",
    date: "August 15, 2022",
  },
  {
    content:
      "🌕 India's Chandrayaan-3 mission was announced for lunar exploration.",
    date: "September 2022",
  },
  {
    content: "💉 COVID-19 vaccination efforts continued with booster doses.",
    date: "Ongoing",
  },
  {
    content:
      "🌟 India became a superpower.🏙️ India became a developed country.",
    date: "Ongoing",
  },
  {
    content: "Happy Independence Day! 🇮🇳",
    date: "August 15, 2023",
  },
];
sendMessages(historicalMessages);
