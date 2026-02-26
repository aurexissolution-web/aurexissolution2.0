insert into public.services (id,title,icon,description,features,price) values
('web','Web Development','Globe','High-performance websites tailored to your brand identity.', array['React/Next.js','SEO Optimization','Responsive Design'],'From RM 3,000'),
('app','App Development','Smartphone','Native and Cross-platform mobile applications.', array['iOS & Android','Flutter/React Native','User-centric UI/UX'],'From RM 8,000'),
('ai','AI Automation','Bot','Streamline workflows with intelligent bots and automation.', array['Chatbots','Process Automation','Custom AI Models'],'From RM5,000'),
('cloud','Cloud Solutions','Cloud','Secure, scalable cloud infrastructure and migration.', array['AWS/GCP/Azure','Serverless','DevOps'],'Custom Quote'),
('data','Data Analysis','BarChart','Turn raw data into actionable business insights.', array['BI Dashboards','Predictive Analytics','Reporting'],'From RM 2,500')
on conflict (id) do update set
  title=excluded.title,
  icon=excluded.icon,
  description=excluded.description,
  features=excluded.features,
  price=excluded.price;

insert into public.pricing_tiers (id,name,price,note,features,recommended) values
('starter','Starter','RM 1500','Ideal for small sites', array['Landing page','Basic SEO','Contact form'], false),
('growth','Growth','RM 3500','For growing SMEs', array['Multi-page site','Analytics','CMS'], true),
('pro','Pro','RM 8000','Advanced builds', array['E-commerce','Integrations','Priority support'], false)
on conflict (id) do update set
  name=excluded.name,
  price=excluded.price,
  note=excluded.note,
  features=excluded.features,
  recommended=excluded.recommended;

insert into public.faqs (id,q,a) values
('faq1','Can you customize packages?','Yes, all plans can be tailored to your exact scope.'),
('faq2','Do you provide ongoing support?','We offer maintenance and support with transparent monthly options.')
on conflict (id) do update set q=excluded.q, a=excluded.a;

insert into public.site_settings (key,data) values
('homepage', $$
{
  "heroBadge": "Empowering Digital Transformation",
  "heroTitle": "Future-Proof Your",
  "heroHighlight": "Digital Presence.",
  "heroSubtitle": "",
  "heroDescription": "From AI-driven automation to scalable cloud infrastructure. We build the technology that powers the next generation of business.",
  "aboutTitle": "Why Aurexis Solution?",
  "aboutText": "We merge AI innovation with thoughtful engineering to ship dependable digital experiences, faster.",
  "logoUrl": ""
}
$$::jsonb),
('homepageContent', $$
{
  "problemEyebrow": "Problem Statement",
  "problemTitle": "The barriers modern teams can’t ignore",
  "problemSubtitle": "We partner with technology leaders to eliminate four systemic blockers that stall growth.",
  "problems": [],
  "ctaPill": "CTA",
  "ctaHeadline": "Ready to Transform?",
  "ctaBody": "Join forward-thinking teams leveraging AI, automation, and premium digital experiences with Aurexis Solution.",
  "ctaPrimaryLabel": "Book Free Consultation",
  "ctaPrimaryLink": "/contact"
}
$$::jsonb),
('socialLinks', $$
{
  "linkedin": "https://linkedin.com/company/aurexissolution",
  "facebook": "https://facebook.com/aurexissolution",
  "instagram": "https://instagram.com/aurexissolution",
  "whatsapp": "https://wa.me/60164071129?text=Hi%20Aurexis%20Solution",
  "twitter": "https://twitter.com/aurexissolution",
  "youtube": "https://youtube.com/@aurexissolution"
}
$$::jsonb),
('aboutPage', $$
{
  "heroTitle": "Building Malaysia's",
  "heroHighlight": "AI Future",
  "heroPrimaryCtaLabel": "See Our Work",
  "heroPrimaryCtaLink": "/portfolio",
  "heroSecondaryCtaLabel": "Book Discovery Call",
  "heroSecondaryCtaLink": "https://calendly.com/aurexis/30min",
  "heroMessages": ["Hands-on AI operators for Malaysian SMEs", "Skip costly data science agency fees", "Scale from RM50k → RM500k+ revenue"],
  "storyHighlights": [{"icon": "🤖", "text": "AI automation without PhD data scientists"}],
  "ourStoryTitle": "Our Story",
  "ourStoryText": "Founded with a mission to democratize AI and modern web technologies for Malaysian SMEs.",
  "missionTitle": "Our Mission",
  "missionText": "To empower Malaysian SMEs with cutting-edge technology solutions that drive growth.",
  "principlesTitle": "Principles powering every AI/web/cloud project for Malaysian SMEs.",
  "principlesSubtitle": "Principles powering every AI/web/cloud project for Malaysian SMEs.",
  "principles": [{"title": "Transparency First", "body": "No hidden costs, no surprises. Clear pricing from day one."}],
  "founderName": "Sanjay Gunabalan",
  "founderRole": "Founder & AI Architect",
  "founderLocation": "Sungai Petani, Kedah",
  "founderBio": "Architecting founder-led AI systems, modern React websites, and secure cloud for Malaysia's SMEs.",
  "founderLinkedIn": "https://www.linkedin.com",
  "founderInstagram": "https://instagram.com",
  "founderWhatsApp": "https://wa.me/60123456789",
  "howWeWorkTitle": "How We Work",
  "howWeWorkSubtitle": "A proven process that delivers results",
  "whyNowTitle": "Why Now?",
  "whyNowSubtitle": "The perfect time to transform your business",
  "whyUsTitle": "Why Choose Us?",
  "whyUsSubtitle": "What makes Aurexis Solution different"
}
$$::jsonb)
on conflict (key) do update set data=excluded.data;

insert into public.pricing_pages (id, content, updated_at) values
('web', $${
  "id":"web",
  "hero": {"title":"Web Pricing","subtitle":"Transparent packages","description":""},
  "metricBubbles": [],
  "plans": [],
  "faqs": []
}$$::jsonb, now()),
('ai', $${
  "id":"ai",
  "hero": {"title":"AI Pricing","subtitle":"Automation packages","description":""},
  "metricBubbles": [],
  "plans": [],
  "faqs": []
}$$::jsonb, now()),
('app', $${
  "id":"app",
  "hero": {"title":"App Pricing","subtitle":"Mobile builds","description":""},
  "metricBubbles": [],
  "plans": [],
  "faqs": []
}$$::jsonb, now()),
('data', $${
  "id":"data",
  "hero": {"title":"Data Pricing","subtitle":"Analytics and BI","description":""},
  "metricBubbles": [],
  "plans": [],
  "faqs": []
}$$::jsonb, now()),
('cloud', $${
  "id":"cloud",
  "hero": {"title":"Cloud Pricing","subtitle":"Infra and DevOps","description":""},
  "metricBubbles": [],
  "plans": [],
  "faqs": []
}$$::jsonb, now())
on conflict (id) do update set content=excluded.content, updated_at=excluded.updated_at;
