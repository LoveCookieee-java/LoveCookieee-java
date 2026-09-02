const fs = require('fs');
const path = require('path');

function updateDailyQuote() {
  const readmePath = path.join(__dirname, '..', 'README.md');
  const quotesPath = path.join(__dirname, '..', 'data', 'quotes.json');

  if (!fs.existsSync(readmePath)) {
    console.error(`README not found at: ${readmePath}`);
    process.exit(1);
  }

  if (!fs.existsSync(quotesPath)) {
    console.error(`Quotes file not found at: ${quotesPath}`);
    process.exit(1);
  }

  const quotes = JSON.parse(fs.readFileSync(quotesPath, 'utf-8'));
  if (!quotes || quotes.length === 0) {
    console.error('Quotes list is empty.');
    process.exit(1);
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { quote, author } = quotes[randomIndex];

  const encodedQuote = encodeURIComponent(quote);
  const encodedAuthor = encodeURIComponent(author);

  // Warm bakery & cozy Minecraft shader palette:
  // bg_color=231d19 (warm roasted bean / dark wood)
  // author_color=f59e0b (warm amber honey)
  // accent_color=d97706 (golden crust)
  const quoteUrl = `https://readme-daily-quotes.vercel.app/api?author=${encodedAuthor}&quote=${encodedQuote}&theme=dark&bg_color=231d19&author_color=f59e0b&accent_color=d97706`;

  const newSection = `<!--START_SECTION:quote-->
<p align="center">
  <img src="${quoteUrl}" alt="${author} Wisdom" />
</p>
<!--END_SECTION:quote-->`;

  const currentReadme = fs.readFileSync(readmePath, 'utf-8');
  const quoteRegex = /<!--START_SECTION:quote-->[\s\S]*?<!--END_SECTION:quote-->/;

  if (!quoteRegex.test(currentReadme)) {
    console.error('Quote placeholder tags <!--START_SECTION:quote--> not found in README.md');
    process.exit(1);
  }

  const updatedReadme = currentReadme.replace(quoteRegex, newSection);
  fs.writeFileSync(readmePath, updatedReadme, 'utf-8');
  console.log(`Successfully updated quote: "${quote}" - ${author}`);
}

updateDailyQuote();
