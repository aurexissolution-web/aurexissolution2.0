import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SERVICES,
  TESTIMONIALS,
  PRICING_TIERS,
  FAQ_ITEMS,
  SERVICE_DETAILS,
  DEFAULT_HOMEPAGE_SETTINGS,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_HOMEPAGE_CONTENT,
  DEFAULT_ABOUT_PAGE_SETTINGS,
  DEFAULT_PRICING_PAGE_CONTENT
} from '../constants';
import {
  ServiceItem,
  Testimonial,
  PricingTier,
  FaqItem,
  ServiceDetailContent,
  ServiceHeroContent,
  HomepageSettings,
  SocialLinks,
  HomepageContent,
  AboutPageSettings,
  PricingPageContent,
  PricingPageId,
  PortfolioProject,
  ServiceChallengeContent,
  ServiceCTAContent,
  ServiceCTABanner,
  BlogPost,
  BlogPostStatus
} from '../types';
import { supabase } from '../src/supabaseClient';

interface DataContextType {
  services: ServiceItem[];
  testimonials: Testimonial[];
  pricing: PricingTier[];
  faqs: FaqItem[];
  serviceDetails: Record<string, ServiceDetailContent>;
  homepageSettings: HomepageSettings;
  homepageContent: HomepageContent;
  socialLinks: SocialLinks;
  aboutPageSettings: AboutPageSettings;
  pricingPages: Record<PricingPageId, PricingPageContent>;
  projects: PortfolioProject[];
  blogPosts: BlogPost[];
  
  updateService: (id: string, data: Partial<ServiceDetailContent>) => Promise<void>;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  addTestimonial: (data: Omit<Testimonial, 'id'>) => void;
  
  updatePricing: (id: string, data: Partial<PricingTier>) => Promise<void> | void;
  
  updateFaq: (id: string, data: Partial<FaqItem>) => void;
  addFaq: (data: Omit<FaqItem, 'id'>) => void;
  deleteFaq: (id: string) => void;
  updatePricingPage: (id: PricingPageId, data: Partial<PricingPageContent>) => Promise<void>;

  updateHomepageSettings: (data: Partial<HomepageSettings>) => Promise<void> | void;
  updateHomepageContent: (data: Partial<HomepageContent>) => Promise<void> | void;
  updateSocialLinks: (data: Partial<SocialLinks>) => Promise<void> | void;
  updateAboutPageSettings: (data: Partial<AboutPageSettings>) => Promise<void> | void;

  addProject: (data: Omit<PortfolioProject, 'id'>) => Promise<void>;
  updateProject: (id: string, data: Partial<PortfolioProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  addBlogPost: (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBlogPost: (id: string, data: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;

  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const mergeHeroContent = (
  base?: ServiceHeroContent,
  override?: ServiceHeroContent
): ServiceHeroContent | undefined => {
  if (!base && !override) return undefined;
  return {
    badge: override?.badge ?? base?.badge,
    headline: override?.headline ?? base?.headline,
    highlight: override?.highlight ?? base?.highlight,
    subheadline: override?.subheadline ?? base?.subheadline,
    description: override?.description ?? base?.description,
    stats: override?.stats ?? base?.stats
  };
};

const mergeChallengeContent = (
  base?: ServiceChallengeContent,
  override?: ServiceChallengeContent
): ServiceChallengeContent | undefined => {
  if (!base && !override) return undefined;
  const fallbackTitle = override?.title ?? base?.title ?? 'Challenges we solve';
  return {
    eyebrow: override?.eyebrow ?? base?.eyebrow,
    title: fallbackTitle,
    highlight: override?.highlight ?? base?.highlight,
    description: override?.description ?? base?.description,
    cards: override?.cards ?? base?.cards ?? []
  };
};

const mergeCtaBanner = (
  base?: ServiceCTABanner,
  override?: ServiceCTABanner
): ServiceCTABanner | undefined => {
  if (!base && !override) return undefined;
  const heading = override?.heading ?? base?.heading ?? 'Book a strategy call';
  const body = override?.body ?? base?.body ?? '';
  const primaryLabel = override?.primaryLabel ?? base?.primaryLabel ?? 'Chat with us';
  const primaryLink = override?.primaryLink ?? base?.primaryLink ?? '/contact';
  return {
    eyebrow: override?.eyebrow ?? base?.eyebrow,
    heading,
    body,
    primaryLabel,
    primaryLink,
    secondaryLabel: override?.secondaryLabel ?? base?.secondaryLabel,
    secondaryLink: override?.secondaryLink ?? base?.secondaryLink
  };
};

const mergeCtaContent = (
  base?: ServiceCTAContent,
  override?: ServiceCTAContent
): ServiceCTAContent | undefined => {
  if (!base && !override) return undefined;
  const banner = mergeCtaBanner(base?.banner, override?.banner);
  return {
    eyebrow: override?.eyebrow ?? base?.eyebrow,
    title: override?.title ?? base?.title,
    subtitle: override?.subtitle ?? base?.subtitle,
    cards: override?.cards ?? base?.cards ?? [],
    banner: banner ?? {
      heading: 'Book a strategy call',
      body: '',
      primaryLabel: 'Chat with us',
      primaryLink: '/contact'
    }
  };
};

const mergeServiceDetailContent = (
  base: ServiceDetailContent,
  override?: Partial<ServiceDetailContent>
): ServiceDetailContent => {
  if (!override) return base;

  return {
    ...base,
    ...override,
    heroContent: mergeHeroContent(base.heroContent, override.heroContent),
    challengeContent: mergeChallengeContent(base.challengeContent, override.challengeContent),
    ctaContent: mergeCtaContent(base.ctaContent, override.ctaContent)
  };
};

const mergePricingHero = (
  base?: PricingPageContent['hero'],
  override?: PricingPageContent['hero']
): PricingPageContent['hero'] | undefined => {
  if (!base && !override) return undefined;
  const ctas = {
    primaryLabel: override?.ctas?.primaryLabel ?? base?.ctas?.primaryLabel,
    primaryLink: override?.ctas?.primaryLink ?? base?.ctas?.primaryLink,
    secondaryLabel: override?.ctas?.secondaryLabel ?? base?.ctas?.secondaryLabel,
    secondaryLink: override?.ctas?.secondaryLink ?? base?.ctas?.secondaryLink
  };
  return {
    eyebrow: override?.eyebrow ?? base?.eyebrow,
    badge: override?.badge ?? base?.badge,
    title: override?.title ?? base?.title,
    highlight: override?.highlight ?? base?.highlight,
    subtitle: override?.subtitle ?? base?.subtitle,
    description: override?.description ?? base?.description,
    bullets: override?.bullets ?? base?.bullets ?? [],
    chips: override?.chips ?? base?.chips ?? [],
    ctas,
    metrics: override?.metrics ?? base?.metrics ?? []
  };
};

const mergePricingRoi = (
  base?: PricingPageContent['roi'],
  override?: PricingPageContent['roi']
): PricingPageContent['roi'] | undefined => {
  if (!base && !override) return undefined;
  return {
    headline: override?.headline ?? base?.headline,
    description: override?.description ?? base?.description,
    baselineCost: override?.baselineCost ?? base?.baselineCost,
    sliders: override?.sliders ?? base?.sliders ?? []
  };
};

const mergePricingPageContent = (
  base: PricingPageContent,
  override?: Partial<PricingPageContent>
): PricingPageContent => {
  if (!override) return base;
  return {
    ...base,
    ...override,
    hero: mergePricingHero(base.hero, override.hero)!,
    metricBubbles: override.metricBubbles ?? base.metricBubbles ?? [],
    plans: override.plans ?? base.plans ?? [],
    faqs: override.faqs ?? base.faqs ?? [],
    roi: mergePricingRoi(base.roi, override.roi),
    updatedAt: override.updatedAt ?? base.updatedAt
  };
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [serviceDetails, setServiceDetails] = useState<Record<string, ServiceDetailContent>>(SERVICE_DETAILS);
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(DEFAULT_HOMEPAGE_SETTINGS);
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(DEFAULT_HOMEPAGE_CONTENT);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(DEFAULT_SOCIAL_LINKS);
  const [aboutPageSettings, setAboutPageSettings] = useState<AboutPageSettings>(DEFAULT_ABOUT_PAGE_SETTINGS);
  const [pricingPages, setPricingPages] = useState<Record<PricingPageId, PricingPageContent>>(DEFAULT_PRICING_PAGE_CONTENT);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!supabase) return;
      const [
        servicesRes,
        serviceDetailsRes,
        testimonialsRes,
        pricingRes,
        faqsRes,
        homepageRes,
        homepageContentRes,
        socialRes,
        aboutRes,
        pricingPagesRes,
        projectsRes,
        blogPostsRes
      ] = await Promise.all([
        supabase.from('services').select('*'),
        supabase.from('service_details').select('*'),
        supabase.from('testimonials').select('*'),
        supabase.from('pricing_tiers').select('*'),
        supabase.from('faqs').select('*'),
        supabase.from('site_settings').select('*').eq('key', 'homepage'),
        supabase.from('site_settings').select('*').eq('key', 'homepageContent'),
        supabase.from('site_settings').select('*').eq('key', 'socialLinks'),
        supabase.from('site_settings').select('*').eq('key', 'aboutPage'),
        supabase.from('pricing_pages').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('blog_posts').select('*')
      ]);
      setServices((servicesRes.data as ServiceItem[]) ?? []);
      const mergedDetails: Record<string, ServiceDetailContent> = { ...SERVICE_DETAILS };
      const detailsRows = (serviceDetailsRes.data as any[]) ?? [];
      detailsRows.forEach(row => {
        const id = row.id as string;
        const base =
          mergedDetails[id] ||
          (() => {
            const serviceItem = SERVICES.find(s => s.id === id);
            if (!serviceItem) return undefined;
            return {
              ...serviceItem,
              tagline: serviceItem.description,
              longDescription: serviceItem.description,
              benefits: [],
              process: [],
              technologies: serviceItem.features
            } as ServiceDetailContent;
          })();
        if (!base) return;
        mergedDetails[id] = mergeServiceDetailContent(base, {
          tagline: row.tagline,
          longDescription: row.long_description,
          benefits: row.benefits ?? [],
          process: row.process ?? [],
          technologies: row.technologies ?? [],
          heroContent: row.hero_content ?? undefined,
          challengeContent: row.challenge_content ?? undefined,
          ctaContent: row.cta_content ?? undefined,
          faqItems: row.faq_items ?? undefined
        });
      });
      setServiceDetails(mergedDetails);
      setTestimonials(((testimonialsRes.data as Testimonial[]) ?? []).map(t => ({ ...t })));
      {
        const rows = (pricingRes.data as PricingTier[]) ?? [];
        const merged = PRICING_TIERS.map((def) => {
          const override = rows.find((r) => r.id === def.id);
          return override ? { ...def, ...override } : def;
        });
        const extras = rows.filter((r) => !PRICING_TIERS.some((d) => d.id === r.id));
        setPricing([...merged, ...extras]);
      }
      {
        const rawRows = (faqsRes.data as any[]) ?? [];
        const dbFaqs: FaqItem[] = rawRows.map(row => ({
          id: row.id,
          q: row.q ?? row.question ?? '',
          a: row.a ?? row.answer ?? ''
        }));
        const mergedFaqs = FAQ_ITEMS.map(def => {
          const override = dbFaqs.find(r => r.id === def.id);
          return override ? { ...def, ...override } : def;
        });
        const extras = dbFaqs.filter(r => !FAQ_ITEMS.some(d => d.id === r.id));
        setFaqs([...mergedFaqs, ...extras]);
      }
      const homepageRow = (homepageRes.data as any[])?.[0]?.data ?? null;
      const homepageContentRow = (homepageContentRes.data as any[])?.[0]?.data ?? null;
      const socialRow = (socialRes.data as any[])?.[0]?.data ?? null;
      const aboutRow = (aboutRes.data as any[])?.[0]?.data ?? null;
      setHomepageSettings({ ...DEFAULT_HOMEPAGE_SETTINGS, ...(homepageRow ?? {}) });
      setHomepageContent({ ...DEFAULT_HOMEPAGE_CONTENT, ...(homepageContentRow ?? {}) });
      setSocialLinks({ ...DEFAULT_SOCIAL_LINKS, ...(socialRow ?? {}) });
      const mergedAbout = { ...DEFAULT_ABOUT_PAGE_SETTINGS, ...(aboutRow ?? {}) };
      mergedAbout.founderLocation = 'Sungai Petani,Kedah';
      setAboutPageSettings(mergedAbout);
      const pricingPagesRows = (pricingPagesRes.data as any[]) ?? [];
      const mergedPages: Record<PricingPageId, PricingPageContent> = { ...DEFAULT_PRICING_PAGE_CONTENT };
      pricingPagesRows.forEach(row => {
        const id = row.id as PricingPageId;
        if (!mergedPages[id]) return;
        mergedPages[id] = mergePricingPageContent(mergedPages[id], {
          ...(row.content ?? {}),
          updatedAt: row.updated_at ?? mergedPages[id].updatedAt
        });
      });
      setPricingPages(mergedPages);
      const projectRows = (projectsRes.data as any[]) ?? [];
      const projItems = projectRows.map(row => {
        return {
          id: row.id,
          title: row.title ?? '',
          summary: row.summary ?? '',
          category: (row.category ?? 'web') as PortfolioProject['category'],
          tech: Array.isArray(row.tech) ? row.tech : [],
          durationDays: typeof row.duration_days === 'number' ? row.duration_days : Number(row.duration_days ?? 0),
          link: row.link ?? '',
          image: row.image ?? '',
          showcaseImages: Array.isArray(row.showcase_images) ? row.showcase_images : [],
          featured: Boolean(row.featured),
          order: typeof row.order === 'number' ? row.order : Number(row.order ?? 0)
        } as PortfolioProject;
      });
      projItems.sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));
      setProjects(projItems);
      const blogRows = (blogPostsRes.data as any[]) ?? [];
      const posts = blogRows.map(row => {
        return {
          id: row.id,
          title: row.title ?? 'Untitled Post',
          slug: row.slug ?? row.id,
          content: row.content ?? '',
          excerpt: row.excerpt ?? '',
          author: row.author ?? 'Aurexis Solution',
          imageUrl: row.image_url ?? '',
          status: (row.status as BlogPostStatus) ?? 'draft',
          tags: Array.isArray(row.tags) ? row.tags : [],
          generatedFrom: row.generated_from ?? '',
          createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
          updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
        } as BlogPost;
      });
      posts.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
      setBlogPosts(posts);
    };
    load();
  }, []);

  // Actions
  const updateService = async (id: string, data: Partial<ServiceDetailContent>) => {
    setServices(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
    setServiceDetails(prev => {
      const fallback =
        prev[id] ||
        SERVICE_DETAILS[id] ||
        (() => {
          const serviceItem = SERVICES.find(s => s.id === id);
          if (!serviceItem) return undefined;
          return {
            ...serviceItem,
            tagline: serviceItem.description,
            longDescription: serviceItem.description,
            benefits: [],
            process: [],
            technologies: serviceItem.features
          } as ServiceDetailContent;
        })();

      if (!fallback) return prev;

      return {
        ...prev,
        [id]: {
          ...fallback,
          ...data
        }
      };
    });
    if (!supabase) return;
    const baseService =
      services.find(s => s.id === id) ||
      SERVICES.find(s => s.id === id) || {
        id,
        title: typeof data.title === 'string' ? data.title : 'Service',
        icon: typeof data.icon === 'string' ? data.icon : 'default',
        description: typeof data.description === 'string' ? data.description : '',
        features: Array.isArray(data.features) ? data.features : [],
        price: typeof (data as any).price === 'string' ? (data as any).price : ''
      };
    const serviceRow = {
      id,
      title: data.title ?? (baseService as any).title,
      icon: data.icon ?? (baseService as any).icon,
      description: data.description ?? (baseService as any).description,
      features: data.features ?? (baseService as any).features ?? [],
      price: (data as any).price ?? (baseService as any).price ?? ''
    };
    const baseDetail =
      serviceDetails[id] ||
      SERVICE_DETAILS[id] ||
      (() => {
        const s =
          services.find(x => x.id === id) ||
          SERVICES.find(x => x.id === id) ||
          baseService;
        return {
          id,
          title: (s as any).title,
          icon: (s as any).icon,
          description: (s as any).description,
          features: (s as any).features ?? [],
          price: (s as any).price ?? '',
          tagline: (s as any).description ?? '',
          longDescription: (s as any).description ?? '',
          benefits: [],
          process: [],
          technologies: (s as any).features ?? [],
          heroContent: undefined,
          challengeContent: undefined,
          ctaContent: undefined
        } as ServiceDetailContent;
      })();
    const detailRow: any = {
      id,
      tagline: data.tagline ?? (baseDetail as any).tagline ?? '',
      long_description: data.longDescription ?? (baseDetail as any).longDescription ?? '',
      benefits: Array.isArray(data.benefits) ? data.benefits : (baseDetail as any).benefits ?? [],
      process: Array.isArray(data.process) ? data.process : (baseDetail as any).process ?? [],
      technologies: Array.isArray(data.technologies) ? data.technologies : (baseDetail as any).technologies ?? [],
      hero_content: data.heroContent ?? (baseDetail as any).heroContent ?? undefined,
      challenge_content: data.challengeContent ?? (baseDetail as any).challengeContent ?? undefined,
      cta_content: data.ctaContent ?? (baseDetail as any).ctaContent ?? undefined,
      faq_items: Array.isArray((data as any).faqItems) ? (data as any).faqItems : (baseDetail as any).faqItems ?? undefined
    };
    const results = await Promise.all([
      supabase.from('services').upsert(serviceRow),
      supabase.from('service_details').upsert(detailRow)
    ]);
    const error = results.find(r => (r as any).error)?.error;
    if (error) throw error;
  };

  const addProject = async (data: Omit<PortfolioProject, 'id'>) => {
    const payload: PortfolioProject = {
      ...data,
      durationDays: Number(data.durationDays) || 0,
      order: data.order ?? projects.length,
      tech: Array.isArray(data.tech) ? data.tech : [],
      id: crypto.randomUUID()
    };

    setProjects(prev => [...prev, payload]);

    if (!supabase) return;
    const { error } = await supabase.from('projects').insert({
      id: payload.id,
      title: payload.title,
      summary: payload.summary,
      category: payload.category,
      tech: payload.tech,
      duration_days: payload.durationDays,
      link: payload.link,
      image: payload.image,
      showcase_images: payload.showcaseImages,
      featured: payload.featured,
      order: payload.order
    });
    if (error) throw error;
  };

  const updateProject = async (id: string, data: Partial<PortfolioProject>) => {
    setProjects(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              ...data,
              tech: data.tech ? [...data.tech] : item.tech,
              durationDays: data.durationDays !== undefined ? Number(data.durationDays) : item.durationDays,
              order: data.order !== undefined ? Number(data.order) : item.order
            }
          : item
      )
    );

    if (!supabase) return;
    const { error } = await supabase.from('projects').update({
      title: data.title,
      summary: data.summary,
      category: data.category,
      tech: data.tech,
      duration_days: data.durationDays !== undefined ? Number(data.durationDays) : undefined,
      link: data.link,
      image: data.image,
      showcase_images: data.showcaseImages,
      featured: data.featured,
      order: data.order !== undefined ? Number(data.order) : undefined
    }).eq('id', id);
    if (error) throw error;
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));

    if (!supabase) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  };

  const addBlogPost = async (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();
    const payload: BlogPost = {
      ...data,
      id: crypto.randomUUID(),
      slug: data.slug?.trim() || slugify(data.title ?? ''),
      createdAt: timestamp,
      updatedAt: timestamp
    };

    setBlogPosts(prev => [...prev, payload]);

    if (!supabase) return;
    const { error } = await supabase.from('blog_posts').insert({
      id: payload.id,
      title: payload.title,
      slug: payload.slug,
      content: payload.content,
      excerpt: payload.excerpt,
      author: payload.author,
      image_url: payload.imageUrl,
      status: payload.status,
      tags: payload.tags,
      generated_from: payload.generatedFrom,
      created_at: payload.createdAt,
      updated_at: payload.updatedAt
    });
    if (error) throw error;
  };

  const updateBlogPost = async (id: string, data: Partial<BlogPost>) => {
    const timestamp = new Date().toISOString();
    setBlogPosts(prev =>
      prev.map(post =>
        post.id === id
          ? {
              ...post,
              ...data,
              slug: data.slug?.trim() || post.slug,
              updatedAt: timestamp
            }
          : post
      )
    );

    if (!supabase) return;
    const { error } = await supabase.from('blog_posts').update({
      title: data.title,
      slug: data.slug?.trim(),
      content: data.content,
      excerpt: data.excerpt,
      author: data.author,
      image_url: data.imageUrl,
      status: data.status,
      tags: data.tags,
      generated_from: data.generatedFrom,
      updated_at: timestamp
    }).eq('id', id);
    if (error) throw error;
  };

  const deleteBlogPost = async (id: string) => {
    setBlogPosts(prev => prev.filter(post => post.id !== id));

    if (!supabase) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
  };

  const updateTestimonial = (id: string, data: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
    if (!supabase) return;
    const payload: any = { id };
    Object.assign(payload, data);
    supabase.from('testimonials').upsert(payload);
  };
  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(item => item.id !== id));
    if (!supabase) return;
    supabase.from('testimonials').delete().eq('id', id);
  };
  const addTestimonial = (data: Omit<Testimonial, 'id'>) => {
    const newId = Math.random().toString(36).substr(2, 9);
    setTestimonials(prev => [...prev, { ...data, id: newId }]);
    if (!supabase) return;
    supabase.from('testimonials').insert({ ...data, id: newId });
  };

  const updatePricing = async (id: string, data: Partial<PricingTier>) => {
    setPricing(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));

    if (!supabase) return;
    const { error } = await supabase.from('pricing_tiers').upsert({ id, ...data });
    if (error) throw error;
  };

  const updateFaq = (id: string, data: Partial<FaqItem>) => {
    setFaqs(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
    if (!supabase) return;
    supabase.from('faqs').upsert({ id, ...data });
  };
  const addFaq = (data: Omit<FaqItem, 'id'>) => {
    const newId = Math.random().toString(36).substr(2, 9);
    setFaqs(prev => [...prev, { ...data, id: newId }]);
    if (!supabase) return;
    supabase.from('faqs').insert({ ...data, id: newId });
  };
  const deleteFaq = (id: string) => {
    setFaqs(prev => prev.filter(item => item.id !== id));
    if (!supabase) return;
    supabase.from('faqs').delete().eq('id', id);
  };

  const updateHomepageSettings = async (data: Partial<HomepageSettings>) => {
    setHomepageSettings(prev => ({ ...prev, ...data }));
    if (!supabase) return;
    await supabase.from('site_settings').upsert({ key: 'homepage', data });
  };

  const updateHomepageContent = async (data: Partial<HomepageContent>) => {
    setHomepageContent(prev => ({ ...prev, ...data }));
    if (!supabase) return;
    await supabase.from('site_settings').upsert({ key: 'homepageContent', data });
  };

  const updateSocialLinks = async (data: Partial<SocialLinks>) => {
    setSocialLinks(prev => ({ ...prev, ...data }));
    if (!supabase) return;
    await supabase.from('site_settings').upsert({ key: 'socialLinks', data });
  };

  const updateAboutPageSettings = async (data: Partial<AboutPageSettings>) => {
    setAboutPageSettings(prev => ({ ...prev, ...data }));
    if (!supabase) return;
    const { error } = await supabase.from('site_settings').upsert({ key: 'aboutPage', data });
    if (error) throw error;
  };

  const updatePricingPage = async (id: PricingPageId, data: Partial<PricingPageContent>) => {
    const timestamp = new Date().toISOString();
    setPricingPages(prev => {
      const base = prev[id] ?? DEFAULT_PRICING_PAGE_CONTENT[id];
      const merged = mergePricingPageContent(base, { ...data, updatedAt: timestamp });
      return { ...prev, [id]: merged };
    });
    if (!supabase) return;
    const { error } = await supabase.from('pricing_pages').upsert({ id, content: { ...data }, updated_at: timestamp });
    if (error) throw error;
  };

  const resetData = () => {
    setServices(SERVICES);
    setTestimonials(TESTIMONIALS);
    setPricing(PRICING_TIERS);
    setFaqs(FAQ_ITEMS);
    setServiceDetails(SERVICE_DETAILS);
    setHomepageSettings(DEFAULT_HOMEPAGE_SETTINGS);
    setHomepageContent(DEFAULT_HOMEPAGE_CONTENT);
    setSocialLinks(DEFAULT_SOCIAL_LINKS);
    setAboutPageSettings(DEFAULT_ABOUT_PAGE_SETTINGS);
    setPricingPages(DEFAULT_PRICING_PAGE_CONTENT);
    localStorage.clear();
  };

  return (
    <DataContext.Provider value={{
      services,
      testimonials,
      pricing,
      faqs,
      serviceDetails,
      homepageSettings,
      homepageContent,
      socialLinks,
      aboutPageSettings,
      pricingPages,
      projects,
      blogPosts,
      updateService,
      updateTestimonial,
      deleteTestimonial,
      addTestimonial,
      updatePricing,
      updateFaq,
      addFaq,
      deleteFaq,
      updatePricingPage,
      updateHomepageSettings,
      updateHomepageContent,
      updateSocialLinks,
      updateAboutPageSettings,
      addProject,
      updateProject,
      deleteProject,
      addBlogPost,
      updateBlogPost,
      deleteBlogPost,
      resetData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
