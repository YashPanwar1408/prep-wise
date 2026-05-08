const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// Some frontend sidebar links use legacy/alternate slugs.
// Keep the API resilient by aliasing those slugs to the canonical seeded ones.
const FULL_STACK_TOPIC_SLUG_ALIASES = {
  // JavaScript
  'js-basics': 'js-tutorial',
  'es6+': 'js-ecmascript-2026',
  'dom': 'js-html-dom',
  'events': 'js-events',
  'async-js': 'js-asynchronous',
  'fetch-api': 'js-web-apis',
  'modules': 'js-modules',
  'localstorage': 'js-web-apis',

  // Node.js
  'node-introduction': 'node-intro',
  'node-http-module': 'http-module',
  'node-file-system': 'file-system-fs',
  'node-url-module': 'url-module',
  'query-string': 'url-module',
  'node-events': 'events-module',
  'streams': 'stream-module',
  'buffers': 'buffer-module',
  'timer-module': 'timers-module',
  'assertions': 'assert-module',
  'process-module': 'node-process',
  'debugging': 'node-adv-debugging',
  'express': 'expressjs',
  'rest-api': 'rest-api-design',
  'template-engines-ejs-pug': 'expressjs',
  'form-handling': 'expressjs',
  'file-uploads': 'file-system-fs',
  'upload-files': 'file-system-fs',
  'session-management': 'api-authentication',
  'cookies': 'api-authentication',
  'authentication-passport': 'api-authentication',
  'node-email': 'node-frameworks',

  // React
  'jsx': 'react-jsx-intro',
  'components': 'react-components',
  'props': 'react-props',
  'state': 'react-usestate',
  'hooks': 'what-is-hooks',
  'useeffect': 'react-useeffect',
  'context-api': 'react-usecontext',

  // Next.js
  'intro': 'what-is-next',
  'server-components': 'app-router',
  'client-components': 'app-router',

  // Mobile
  'react-native': 'react-native-intro',
  'native-navigation': 'navigation',

  // CSS
  'css-pseudo-class': 'css-pseudo-classes',
  'css-pseudo-element': 'css-pseudo-elements',
  'css-navigation-bar': 'css-navigation-bars',
  'css-shadow-effects': 'css-shadows',
  'css-web-fonts': 'css-fonts',
  'css-style-images': 'css-image-sprites',
  'css-image-reflection': 'css-shadows',
  'css-flexbox': 'flexbox-intro',
  'css-grid': 'grid-intro',

  // DevOps / Cloud
  'git-basics': 'git',
  'cicd': 'ci-cd',
  'netlify': 'vercel',

  // Backend Architecture
  'layered': 'service-layer',
  'monolith': 'monolith-vs-microservices',
};

const AIML_TOPIC_SLUG_ALIASES = {
  'aiml-ai-ethics': 'aiml-ai-ethics-introduction',
  'aiml-builtin-functions': 'aiml-built-in-functions',
  'aiml-cicd-for-ml': 'aiml-cicd-ml',
  'aiml-dall-e': 'aiml-dalle',
  'aiml-data-engineering-introduction': 'aiml-data-engineering-overview',
  'aiml-data-lakes': 'aiml-etl-pipelines',
  'aiml-datatypes-reference': 'aiml-data-types-reference',
  'aiml-debug-code': 'aiml-how-to-debug-code',
  'aiml-deep-learning': 'aiml-deep-learning-introduction',
  'aiml-etl-processes': 'aiml-etl-pipelines',
  'aiml-genai-introduction': 'aiml-generative-ai-introduction',
  'aiml-handle-errors': 'aiml-how-to-handle-errors',
  'aiml-install-python': 'aiml-how-to-install-python',
  'aiml-knn': 'aiml-k-nearest-neighbors',
  'aiml-machine-translation': 'aiml-seq2seq-models',
  'aiml-optimize-code': 'aiml-how-to-optimize-code',
  'aiml-pandas-visualization': 'aiml-pandas-data-visualization',
  'aiml-planning-and-reasoning': 'aiml-planning-reasoning',
  'aiml-prompt-basics': 'aiml-prompt-engineering-basics',
  'aiml-question-answering': 'aiml-seq2seq-models',
  'aiml-setup-environment': 'aiml-how-to-setup-environment',
  'aiml-sklearn-reference': 'aiml-scikit-learn-reference',
  'aiml-svm': 'aiml-support-vector-machines',
  'aiml-text-summarization': 'aiml-seq2seq-models',
  'aiml-what-is-ml': 'aiml-what-is-machine-learning',
};

function resolveTopicSlug(domainSlug, slug) {
  if (domainSlug === 'full-stack') {
    return FULL_STACK_TOPIC_SLUG_ALIASES[slug] || slug;
  }

  if (domainSlug === 'aiml') {
    return AIML_TOPIC_SLUG_ALIASES[slug] || slug;
  }

  return slug;
}

// Get all domains (e.g., Full Stack Development)
router.get('/domains', async (req, res) => {
  try {
    const domains = await prisma.learnDomain.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
      },
    });
    res.json(domains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

// Get sidebar data for a specific domain (categories + topics for navigation)
router.get('/:domainSlug/sidebar', async (req, res) => {
  try {
    const { domainSlug } = req.params;
    
    const domain = await prisma.learnDomain.findUnique({
      where: { slug: domainSlug },
      include: {
        categories: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            order: true,
            topics: {
              select: {
                id: true,
                slug: true,
                title: true,
                order: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
    
    if (!domain) {
      return res.status(404).json({ error: 'Domain not found' });
    }
    
    res.json(domain);
  } catch (error) {
    console.error('Error fetching sidebar:', error);
    res.status(500).json({ error: 'Failed to fetch sidebar data' });
  }
});

// Get topic by slug with prev/next navigation
router.get('/:domainSlug/topic/:slug', async (req, res) => {
  try {
    const { domainSlug, slug } = req.params;

    const requestedSlug = slug;
    const aliasSlug = resolveTopicSlug(domainSlug, requestedSlug);
    const slugsToTry = aliasSlug !== requestedSlug ? [requestedSlug, aliasSlug] : [requestedSlug];
    
    // Fetch current topic
    let topic = null;
    for (const candidateSlug of slugsToTry) {
      // eslint-disable-next-line no-await-in-loop
      const found = await prisma.learnTopic.findUnique({
        where: { slug: candidateSlug },
        include: {
          category: {
            select: {
              id: true,
              title: true,
              order: true,
            },
          },
        },
      });
      if (found) {
        topic = found;
        break;
      }
    }
    
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    // Fetch all topics in the domain to determine prev/next
    const domain = await prisma.learnDomain.findUnique({
      where: { slug: domainSlug },
      include: {
        categories: {
          orderBy: { order: 'asc' },
          include: {
            topics: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                slug: true,
                title: true,
                order: true,
              },
            },
          },
        },
      },
    });
    
    if (!domain) {
      return res.status(404).json({ error: 'Domain not found' });
    }
    
    // Flatten all topics across categories, retaining category info for navigation.
    const allTopics = domain.categories.flatMap((cat) =>
      cat.topics.map((t) => ({
        ...t,
        category: {
          id: cat.id,
          title: cat.title,
          order: cat.order,
        },
      }))
    );
    
    // Find current index and determine prev/next
    const currentIndex = allTopics.findIndex(t => t.id === topic.id);

    if (currentIndex === -1) {
      return res.status(404).json({ error: 'Topic not found in domain' });
    }

    const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
    const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;
    
    res.json({
      topic: {
        id: topic.id,
        slug: topic.slug,
        title: topic.title,
        content: topic.content,
        order: topic.order,
        category: topic.category,
      },
      navigation: {
        prev: prevTopic
          ? {
              slug: prevTopic.slug,
              title: prevTopic.title,
              categoryTitle: prevTopic.category.title,
            }
          : null,
        next: nextTopic
          ? {
              slug: nextTopic.slug,
              title: nextTopic.title,
              categoryTitle: nextTopic.category.title,
            }
          : null,
      },
      meta: {
        requestedSlug,
        resolvedSlug: topic.slug,
      },
    });
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ error: 'Failed to fetch topic' });
  }
});

// Get all topics in a category
router.get('/:domainSlug/category/:categoryId/topics', async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const topics = await prisma.learnTopic.findMany({
      where: { categoryId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        order: true,
      },
    });
    
    res.json(topics);
  } catch (error) {
    console.error('Error fetching category topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

module.exports = router;
