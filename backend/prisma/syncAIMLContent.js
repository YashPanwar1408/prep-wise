const path = require('path');
const fs = require('fs');

// Optional maintenance script (not required for app runtime).
// Syncs AIML topic title/content from seedAIML.js into an existing DB by slug.
// Useful when you improve lesson Markdown in seedAIML.js and want to update DB
// content without deleting/reseeding the AIML domain (which would wipe progress).

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const prisma = require('../lib/prisma');

function extractAIMLTopicsFromSeed(seedText) {
  // Matches topic objects like:
  // { title: '...', slug: 'aiml-...', order: 1, content: `...` }
  const topicRegex = /\{\s*title:\s*'([^']+)'\s*,\s*slug:\s*'(aiml-[^']+)'\s*,\s*order:\s*\d+\s*,\s*content:\s*`([\s\S]*?)`\s*\}/g;

  const topics = [];
  let match;
  while ((match = topicRegex.exec(seedText))) {
    const title = match[1];
    const slug = match[2];
    const content = match[3];
    topics.push({ title, slug, content });
  }

  return topics;
}

async function main() {
  const seedPath = path.join(__dirname, 'seedAIML.js');
  const seedText = fs.readFileSync(seedPath, 'utf8');

  const topics = extractAIMLTopicsFromSeed(seedText);
  if (topics.length === 0) {
    throw new Error('No AIML topics found in seedAIML.js (parser returned 0 matches).');
  }

  console.log(`Found ${topics.length} AIML topics in seedAIML.js`);

  let updated = 0;
  const missing = [];

  // Update existing topics by slug; do not create missing ones (safe on existing DB).
  for (const topic of topics) {
    // eslint-disable-next-line no-await-in-loop
    const result = await prisma.learnTopic.updateMany({
      where: { slug: topic.slug },
      data: {
        title: topic.title,
        content: topic.content,
      },
    });

    if (result.count > 0) {
      updated += result.count;
    } else {
      missing.push(topic.slug);
    }
  }

  console.log(`✅ Updated ${updated} topics`);

  if (missing.length > 0) {
    console.log(`⚠️  ${missing.length} topics were missing in the DB (not updated):`);
    for (const slug of missing) {
      console.log(`- ${slug}`);
    }
  }
}

main()
  .catch((err) => {
    console.error('❌ AIML content sync failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
    } catch {
      // ignore
    }
  });
