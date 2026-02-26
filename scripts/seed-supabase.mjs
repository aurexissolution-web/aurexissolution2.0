import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function loadEnv() {
  const envPath = path.join(projectRoot, '.env');
  let content = '';
  try {
    content = readFileSync(envPath, 'utf8');
  } catch {
    console.error('Unable to read .env at', envPath);
    process.exit(1);
  }
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  });
}

loadEnv();

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE;
if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE in .env');
  process.exit(1);
}
const supabase = createClient(url, serviceKey);

async function upsert(table, rows) {
  const { error } = await supabase.from(table).upsert(rows);
  if (error) throw error;
}

async function run() {
  await upsert('services', [
    { id: 'web', title: 'Web Development', icon: 'Globe', description: 'High-performance websites tailored to your brand identity.', features: ['React/Next.js','SEO Optimization','Responsive Design'], price: 'From RM 3,000' },
    { id: 'app', title: 'App Development', icon: 'Smartphone', description: 'Native and Cross-platform mobile applications.', features: ['iOS & Android','Flutter/React Native','User-centric UI/UX'], price: 'From RM 8,000' },
    { id: 'ai', title: 'AI Automation', icon: 'Bot', description: 'Streamline workflows with intelligent bots and automation.', features: ['Chatbots','Process Automation','Custom AI Models'], price: 'From RM5,000' },
    { id: 'cloud', title: 'Cloud Solutions', icon: 'Cloud', description: 'Secure, scalable cloud infrastructure and migration.', features: ['AWS/GCP/Azure','Serverless','DevOps'], price: 'Custom Quote' },
    { id: 'data', title: 'Data Analysis', icon: 'BarChart', description: 'Turn raw data into actionable business insights.', features: ['BI Dashboards','Predictive Analytics','Reporting'], price: 'From RM 2,500' }
  ]);

  await upsert('pricing_tiers', [
    { id: 'starter', name: 'Starter', price: 'RM 1500', note: 'Ideal for small sites', features: ['Landing page','Basic SEO','Contact form'], recommended: false },
    { id: 'growth', name: 'Growth', price: 'RM 3500', note: 'For growing SMEs', features: ['Multi-page site','Analytics','CMS'], recommended: true },
    { id: 'pro', name: 'Pro', price: 'RM 8000', note: 'Advanced builds', features: ['E-commerce','Integrations','Priority support'], recommended: false }
  ]);

  await upsert('faqs', [
    { id: 'faq1', q: 'Can you customize packages?', a: 'Yes, all plans can be tailored to your exact scope.' },
    { id: 'faq2', q: 'Do you provide ongoing support?', a: 'We offer maintenance and support with transparent monthly options.' }
  ]);

  const now = new Date().toISOString();
  await upsert('site_settings', [
    {
      key: 'homepage',
      data: {
        heroBadge: 'Empowering Digital Transformation',
        heroTitle: 'Future-Proof Your',
        heroHighlight: 'Digital Presence.',
        heroSubtitle: '',
        heroDescription: 'From AI-driven automation to scalable cloud infrastructure. We build the technology that powers the next generation of business.',
        aboutTitle: 'Why Aurexis Solution?',
        aboutText: 'We merge AI innovation with thoughtful engineering to ship dependable digital experiences, faster.',
        logoUrl: ''
      }
    },
    {
      key: 'homepageContent',
      data: {
        problemEyebrow: 'Problem Statement',
        problemTitle: 'The barriers modern teams can’t ignore',
        problemSubtitle: 'We partner with technology leaders to eliminate four systemic blockers that stall growth.',
        problems: [],
        ctaPill: 'CTA',
        ctaHeadline: 'Ready to Transform?',
        ctaBody: 'Join forward-thinking teams leveraging AI, automation, and premium digital experiences with Aurexis Solution.',
        ctaPrimaryLabel: 'Book Free Consultation',
        ctaPrimaryLink: '/contact'
      }
    },
    {
      key: 'socialLinks',
      data: {
        linkedin: 'https://linkedin.com/company/aurexissolution',
        facebook: 'https://facebook.com/aurexissolution',
        instagram: 'https://instagram.com/aurexissolution',
        whatsapp: 'https://wa.me/60164071129?text=Hi%20Aurexis%20Solution',
        twitter: 'https://twitter.com/aurexissolution',
        youtube: 'https://youtube.com/@aurexissolution'
      }
    },
    {
      key: 'aboutPage',
      data: {
        heroTitle: "Building Malaysia's",
        heroHighlight: 'AI Future',
        heroPrimaryCtaLabel: 'See Our Work',
        heroPrimaryCtaLink: '/portfolio',
        heroSecondaryCtaLabel: 'Book Discovery Call',
        heroSecondaryCtaLink: 'https://calendly.com/aurexis/30min',
        heroMessages: ['Hands-on AI operators for Malaysian SMEs', 'Skip costly data science agency fees', 'Scale from RM50k → RM500k+ revenue'],
        storyHighlights: [{ icon: '🤖', text: 'AI automation without PhD data scientists' }],
        ourStoryTitle: 'Our Story',
        ourStoryText: 'Founded with a mission to democratize AI and modern web technologies for Malaysian SMEs.',
        missionTitle: 'Our Mission',
        missionText: 'To empower Malaysian SMEs with cutting-edge technology solutions that drive growth.',
        principlesTitle: 'Principles powering every AI/web/cloud project for Malaysian SMEs.',
        principlesSubtitle: 'Principles powering every AI/web/cloud project for Malaysian SMEs.',
        principles: [{ title: 'Transparency First', body: 'No hidden costs, no surprises. Clear pricing from day one.' }],
        founderName: 'Sanjay Gunabalan',
        founderRole: 'Founder & AI Architect',
        founderLocation: 'Sungai Petani, Kedah',
        founderBio: "Architecting founder-led AI systems, modern React websites, and secure cloud for Malaysia's SMEs.",
        founderLinkedIn: 'https://www.linkedin.com',
        founderInstagram: 'https://instagram.com',
        founderWhatsApp: 'https://wa.me/60123456789',
        howWeWorkTitle: 'How We Work',
        howWeWorkSubtitle: 'A proven process that delivers results',
        whyNowTitle: 'Why Now?',
        whyNowSubtitle: 'The perfect time to transform your business',
        whyUsTitle: 'Why Choose Us?',
        whyUsSubtitle: 'What makes Aurexis Solution different'
      }
    }
  ]);

  await upsert('pricing_pages', [
    { id: 'web', content: { id: 'web', hero: { title: 'Web Pricing', subtitle: 'Transparent packages', description: '' }, metricBubbles: [], plans: [], faqs: [] }, updated_at: now },
    { id: 'ai', content: { id: 'ai', hero: { title: 'AI Pricing', subtitle: 'Automation packages', description: '' }, metricBubbles: [], plans: [], faqs: [] }, updated_at: now },
    { id: 'app', content: { id: 'app', hero: { title: 'App Pricing', subtitle: 'Mobile builds', description: '' }, metricBubbles: [], plans: [], faqs: [] }, updated_at: now },
    { id: 'data', content: { id: 'data', hero: { title: 'Data Pricing', subtitle: 'Analytics and BI', description: '' }, metricBubbles: [], plans: [], faqs: [] }, updated_at: now },
    { id: 'cloud', content: { id: 'cloud', hero: { title: 'Cloud Pricing', subtitle: 'Infra and DevOps', description: '' }, metricBubbles: [], plans: [], faqs: [] }, updated_at: now }
  ]);
}

run()
  .then(() => {
    console.log('Supabase seed completed.');
  })
  .catch(err => {
    console.error('Supabase seed failed:', err);
    process.exit(1);
  });
