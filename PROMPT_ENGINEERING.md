# MAISON — AI & Prompt Engineering Guide

## Các tính năng AI có thể tích hợp

| Feature | Model | Mô tả |
|---|---|---|
| Gợi ý sản phẩm | GPT-4o-mini | Dựa trên lịch sử mua, body type, sở thích |
| Tìm kiếm ngôn ngữ tự nhiên | GPT-4o-mini + Embedding | "Váy đi đám cưới màu be" |
| Mô tả sản phẩm tự động | GPT-4o | Admin upload ảnh → sinh description |
| Chatbot tư vấn | GPT-4o-mini | Hỗ trợ chọn size, phong cách |
| SEO meta tags | GPT-4o-mini | Tự động sinh title/description cho sản phẩm |

---

## Prompt 1 — Gợi ý sản phẩm cá nhân hóa

### Mục đích
Gợi ý sản phẩm phù hợp dựa trên lịch sử mua và thông tin khách hàng.

### System Prompt

```
Bạn là trợ lý thời trang cao cấp của MAISON — một thương hiệu thời trang Việt Nam chuyên về thiết kế tinh tế và chất liệu bền vững.

Nhiệm vụ: Gợi ý sản phẩm phù hợp nhất cho khách hàng dựa trên thông tin được cung cấp.

Quy tắc:
- Chỉ gợi ý từ danh sách sản phẩm được cung cấp
- Tối đa 3 gợi ý, xếp theo độ phù hợp giảm dần
- Giải thích ngắn gọn tại sao phù hợp (1-2 câu)
- Phong cách tư vấn: chuyên nghiệp, ấm áp, không sáo rỗng
- Trả lời bằng tiếng Việt
- Trả về JSON thuần túy, không có markdown

Định dạng JSON output:
{
  "recommendations": [
    {
      "productSlug": "string",
      "reason": "string",
      "matchScore": number (0-100)
    }
  ]
}
```

### User Prompt Template

```
Thông tin khách hàng:
- Lịch sử mua: {{purchaseHistory}}
- Sản phẩm đã xem gần đây: {{recentlyViewed}}
- Danh sách yêu thích: {{wishlist}}
- Mùa hiện tại: {{season}}

Danh sách sản phẩm hiện có:
{{productsJSON}}

Gợi ý 3 sản phẩm phù hợp nhất cho khách hàng này.
```

### Implementation

```typescript
// src/app/api/recommendations/route.ts
import OpenAI from 'openai'
import { PRODUCTS } from '@/lib/data'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const { userId, purchaseHistory, recentlyViewed, wishlist } = await request.json()

  const season = getSeason()
  const productsJSON = JSON.stringify(
    PRODUCTS.map(p => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      tag: p.tag,
      price: p.price,
      badge: p.badge,
    }))
  )

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: USER_PROMPT_TEMPLATE
          .replace('{{purchaseHistory}}', JSON.stringify(purchaseHistory))
          .replace('{{recentlyViewed}}', JSON.stringify(recentlyViewed))
          .replace('{{wishlist}}', JSON.stringify(wishlist))
          .replace('{{season}}', season)
          .replace('{{productsJSON}}', productsJSON),
      },
    ],
  })

  const result = JSON.parse(completion.choices[0].message.content!)
  return Response.json(result)
}
```

---

## Prompt 2 — Tìm kiếm ngôn ngữ tự nhiên

### Mục đích
Cho phép khách hàng tìm kiếm bằng mô tả tự nhiên thay vì keyword.

### Cách hoạt động

```
Input:  "váy đi đám cưới không quá formal, màu pastel"
Output: { category: "vay-dam", tags: ["elegant", "pastel"], exclude: ["formal"] }
```

### System Prompt

```
Bạn là công cụ phân tích tìm kiếm cho website thời trang MAISON.

Phân tích câu tìm kiếm của người dùng và trả về bộ lọc dạng JSON.

Categories có sẵn: ao, vay-dam, quan, phu-kien, giay, tui
Price range: low (dưới 1.5tr), mid (1.5-3tr), high (trên 3tr)

Trả về JSON thuần túy:
{
  "category": string | null,
  "priceRange": "low" | "mid" | "high" | null,
  "occasions": string[],      // ["wedding", "office", "casual", "party"]
  "colors": string[],
  "keywords": string[],       // Từ khóa bổ sung để full-text search
  "excludeKeywords": string[]
}
```

### User Prompt

```
Tìm kiếm: "{{query}}"
```

### Implementation

```typescript
export async function POST(request: Request) {
  const { query } = await request.json()

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SEARCH_SYSTEM_PROMPT },
      { role: 'user', content: `Tìm kiếm: "${query}"` },
    ],
  })

  const filters = JSON.parse(completion.choices[0].message.content!)

  // Apply filters to database query
  let query_builder = supabase.from('products').select('*')
  if (filters.category) query_builder = query_builder.eq('category', filters.category)
  if (filters.priceRange === 'low') query_builder = query_builder.lt('price', 1_500_000)
  // ...

  const { data } = await query_builder
  return Response.json({ products: data, filters })
}
```

---

## Prompt 3 — Chatbot tư vấn thời trang

### Mục đích
Trợ lý AI giúp khách hàng chọn size, phối đồ, tư vấn phong cách.

### System Prompt

```
Bạn là chuyên gia tư vấn thời trang của MAISON — thương hiệu thời trang cao cấp Việt Nam.

Thông tin về thương hiệu:
- Chuyên thời trang nữ cao cấp, thiết kế tinh tế
- Chất liệu: lụa, linen, cotton cao cấp, satin
- Phong cách: elegant, minimalist, contemporary Vietnamese
- Giá: 1.5tr - 10tr VNĐ

Bảng size MAISON:
| Size | Ngực (cm) | Eo (cm) | Mông (cm) | Chiều cao tiêu chuẩn |
|------|-----------|---------|-----------|---------------------|
| XS   | 76-80     | 60-64   | 84-88     | 155-160 cm          |
| S    | 80-84     | 64-68   | 88-92     | 157-162 cm          |
| M    | 84-88     | 68-72   | 92-96     | 160-165 cm          |
| L    | 88-92     | 72-76   | 96-100    | 163-168 cm          |
| XL   | 92-96     | 76-80   | 100-104   | 165-170 cm          |

Quy tắc tư vấn:
1. Luôn hỏi thêm thông tin nếu cần (số đo, dịp mặc, ngân sách)
2. Gợi ý cụ thể từ catalog, không bịa ra sản phẩm
3. Tư vấn phối đồ khi được hỏi
4. Tone: chuyên nghiệp nhưng gần gũi, như người bạn có gu thời trang
5. Trả lời bằng tiếng Việt, ngắn gọn (tối đa 150 từ/tin)
6. Khi không chắc, hướng dẫn khách liên hệ stylist qua hotline: 1800-6868

Catalog sản phẩm hiện có:
{{productsContext}}
```

### Implementation với streaming

```typescript
// src/app/api/chat/route.ts
export async function POST(request: Request) {
  const { messages } = await request.json()

  const productsContext = PRODUCTS
    .map(p => `- ${p.name} (${p.category}): ${formatPrice(p.price)}`)
    .join('\n')

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    stream: true,
    temperature: 0.7,
    max_tokens: 300,
    messages: [
      {
        role: 'system',
        content: CHAT_SYSTEM_PROMPT.replace('{{productsContext}}', productsContext),
      },
      ...messages.slice(-10), // Giữ 10 tin gần nhất để tiết kiệm token
    ],
  })

  // Stream response về client
  const encoder = new TextEncoder()
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || ''
        controller.enqueue(encoder.encode(text))
      }
      controller.close()
    },
  })

  return new Response(readableStream, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}
```

---

## Prompt 4 — Tự động sinh mô tả sản phẩm

### Mục đích
Admin upload ảnh sản phẩm → AI sinh description, tags, SEO meta.

### System Prompt

```
Bạn là copywriter thời trang cao cấp của MAISON.

Phân tích ảnh sản phẩm và tạo nội dung marketing theo định dạng JSON:

{
  "name": "Tên sản phẩm ngắn gọn, sang trọng",
  "tag": "Tag ngắn (Mới về / Bán chạy / Xu hướng / Luxury)",
  "description": "Mô tả 2-3 câu, nhấn vào chất liệu và cảm xúc mặc",
  "details": ["Chi tiết 1", "Chi tiết 2", "Chi tiết 3"],
  "seoTitle": "SEO title dưới 60 ký tự",
  "seoDescription": "Meta description 150-160 ký tự",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "suggestedCategory": "ao|vay-dam|quan|phu-kien|giay|tui"
}

Tone: sang trọng, tinh tế, tập trung vào cảm xúc và giá trị
Ngôn ngữ: Tiếng Việt tự nhiên, không dùng từ sáo rỗng
```

### Implementation với Vision

```typescript
export async function POST(request: Request) {
  const { imageBase64, category } = await request.json()

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',  // Cần vision capability
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: PRODUCT_DESC_PROMPT },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
          },
          {
            type: 'text',
            text: `Danh mục sản phẩm: ${category}. Hãy sinh nội dung cho sản phẩm này.`,
          },
        ],
      },
    ],
  })

  return Response.json(JSON.parse(completion.choices[0].message.content!))
}
```

---

## Best Practices

### 1. Tiết kiệm token

```typescript
// ❌ Gửi toàn bộ product object
const context = JSON.stringify(PRODUCTS)  // ~5000 tokens

// ✅ Chỉ gửi fields cần thiết
const context = PRODUCTS.map(p => `${p.slug}:${p.name}:${p.category}`).join('\n')  // ~200 tokens
```

### 2. Caching

```typescript
// Cache recommendations 30 phút
export const revalidate = 1800

// Hoặc dùng Redis
const cacheKey = `rec:${userId}`
const cached = await redis.get(cacheKey)
if (cached) return Response.json(JSON.parse(cached))
```

### 3. Rate limiting

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1m'),  // 10 requests/phút
})

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)
  if (!success) return new Response('Too Many Requests', { status: 429 })
  // ...
}
```

### 4. Fallback khi AI thất bại

```typescript
try {
  const aiResult = await getAIRecommendations(userId)
  return Response.json(aiResult)
} catch (error) {
  // Fallback: trả về bestsellers thay vì throw
  const fallback = PRODUCTS
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 3)
    .map(p => ({ productSlug: p.slug, reason: 'Sản phẩm bán chạy', matchScore: 70 }))

  return Response.json({ recommendations: fallback })
}
```

---

## Chi phí ước tính (GPT-4o-mini)

| Feature | Tokens/request | Requests/ngày | Chi phí/tháng |
|---|---|---|---|
| Search parsing | ~500 | 1000 | ~$3 |
| Recommendations | ~2000 | 500 | ~$6 |
| Product descriptions | ~1500 | 50 | ~$1.5 |
| Chatbot | ~1000 | 200 | ~$2 |
| **Tổng** | | | **~$12.5/tháng** |

> GPT-4o-mini: $0.15 / 1M input tokens, $0.60 / 1M output tokens (tháng 3/2025)
