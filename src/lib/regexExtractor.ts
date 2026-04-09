import { ExtractedClientData } from './claudeClient';

/**
 * Extracts business data from raw HTML using meta tags, Schema.org JSON-LD,
 * and regex patterns. No external API required.
 */
export function extractClientDataFromHtml(
  htmlChunks: { label: string; html: string }[]
): ExtractedClientData {
  const result: ExtractedClientData = {
    services: [],
    contactInfo: {},
  };

  for (const { html } of htmlChunks) {
    // 1. Schema.org JSON-LD — most reliable structured data source
    try {
      const ldBlocks =
        html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) ?? [];
      for (const block of ldBlocks) {
        const inner = block.replace(/<script[^>]*>|<\/script>/gi, '').trim();
        let data: unknown;
        try { data = JSON.parse(inner); } catch { continue; }

        const schemas: Record<string, unknown>[] = Array.isArray(data)
          ? (data as Record<string, unknown>[])
          : [data as Record<string, unknown>];

        for (const schema of schemas) {
          if (!result.businessName && schema.name) {
            result.businessName = String(schema.name);
          }
          if (!result.description && schema.description) {
            result.description = String(schema.description);
          }
          if (!result.businessType && schema['@type']) {
            const t = Array.isArray(schema['@type']) ? schema['@type'][0] : schema['@type'];
            result.businessType = schemaTypeToHebrew(String(t));
          }
          const addr = schema.address as Record<string, string> | undefined;
          if (addr && !result.contactInfo!.address) {
            result.contactInfo!.address = [
              addr.streetAddress,
              addr.addressLocality,
              addr.addressRegion,
            ].filter(Boolean).join(', ');
          }
          if (addr && !result.area) {
            result.area = addr.addressLocality ?? addr.addressRegion ?? undefined;
          }
          if (schema.telephone && !result.contactInfo!.phone) {
            result.contactInfo!.phone = String(schema.telephone);
          }
          if (schema.email && !result.contactInfo!.email) {
            result.contactInfo!.email = String(schema.email);
          }
          // Services from hasOfferCatalog or makesOffer
          const catalog = schema.hasOfferCatalog as { itemListElement?: { name?: string }[] } | undefined;
          if (catalog?.itemListElement?.length) {
            const names = catalog.itemListElement.map((i) => i.name).filter(Boolean) as string[];
            if (names.length) result.services = [...(result.services ?? []), ...names];
          }
        }
      }
    } catch { /* invalid JSON-LD */ }

    // 2. Open Graph + standard meta tags
    if (!result.businessName) {
      result.businessName =
        metaContent(html, 'property', 'og:site_name') ??
        metaContent(html, 'property', 'og:title') ??
        titleTag(html) ??
        h1Tag(html) ??
        undefined;
    }
    if (!result.description) {
      result.description =
        metaContent(html, 'property', 'og:description') ??
        metaContent(html, 'name', 'description') ??
        undefined;
    }

    // 3. Israeli phone numbers — supports 0X-XXXXXXX and 05X-XXXXXXX formats
    if (!result.contactInfo!.phone) {
      // Prefer href="tel:..." links for accuracy
      const telHref = html.match(/href=["']tel:([\d\s\-+]+)["']/i);
      if (telHref) {
        result.contactInfo!.phone = telHref[1].trim();
      } else {
        // Fallback: bare Israeli phone in page text
        const barePhone = html
          .replace(/<[^>]+>/g, ' ')
          .match(/0(?:[23489]\d-?\d{7}|[57]\d-?\d{7}|[57]\d {1}\d{3}[-\s]\d{4})/);
        if (barePhone) result.contactInfo!.phone = barePhone[0].trim();
      }
    }

    // 4. Email addresses — prefer mailto: links
    if (!result.contactInfo!.email) {
      const mailtoMatch = html.match(/href=["']mailto:([^"'?\s]+)/i);
      if (mailtoMatch) {
        result.contactInfo!.email = mailtoMatch[1].trim();
      } else {
        const emailMatch = html
          .replace(/<[^>]+>/g, ' ')
          .match(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/);
        if (emailMatch) result.contactInfo!.email = emailMatch[0].trim();
      }
    }

    // 5. Services — extract clean <li> text items if no schema services found
    if (!result.services?.length) {
      const liItems = [...html.matchAll(/<li[^>]*>\s*(?:<[^>]+>)*([^<]{5,80})(?:<\/[^>]+>)*\s*<\/li>/gi)]
        .map((m) => m[1].replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim())
        .filter((t) => t.length >= 4 && t.length <= 60 && !t.includes('<'))
        .slice(0, 8);
      if (liItems.length >= 2) result.services = liItems;
    }
  }

  return result;
}

function metaContent(html: string, attr: string, value: string): string | null {
  // Handles both attribute orders: property/name first or content first
  const re = new RegExp(
    `<meta[^>]+${attr}=["']${value}["'][^>]+content=["']([^"'<]{1,300})["']` +
    `|<meta[^>]+content=["']([^"'<]{1,300})["'][^>]+${attr}=["']${value}["']`,
    'i'
  );
  const m = html.match(re);
  return m ? (m[1] ?? m[2] ?? null) : null;
}

function titleTag(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]{2,120})<\/title>/i);
  return m ? m[1].trim() : null;
}

function h1Tag(html: string): string | null {
  const m = html.match(/<h1[^>]*>([^<]{2,100})<\/h1>/i);
  return m ? m[1].trim() : null;
}

function schemaTypeToHebrew(type: string): string {
  const map: Record<string, string> = {
    Electrician: 'חשמלאי',
    Plumber: 'אינסטלטור',
    GeneralContractor: 'קבלן',
    HomeAndConstructionBusiness: 'בנייה ושיפוצים',
    Restaurant: 'מסעדה',
    FoodEstablishment: 'עסק מזון',
    DentalClinic: 'רפואת שיניים',
    Dentist: 'רפואת שיניים',
    MedicalClinic: 'מרפאה',
    Physician: 'רפואה',
    AutoRepair: 'מוסך',
    AutomotiveBusiness: 'רכב',
    RealEstateAgent: 'תיווך נדל"ן',
    LegalService: 'עו"ד',
    AccountingService: 'רואה חשבון',
    Locksmith: 'מנעולן',
    Painter: 'צבעי',
    HvacBusiness: 'מזגנים וחימום',
    PestControl: 'הדברה',
    MovingCompany: 'הובלות',
    Bakery: 'מאפייה',
    BeautySalon: 'קוסמטיקה / מספרה',
    HairSalon: 'מספרה',
    LocalBusiness: 'עסק מקומי',
    Organization: 'ארגון',
    Store: 'חנות',
    ProfessionalService: 'שירות מקצועי',
  };
  return map[type] ?? type;
}
