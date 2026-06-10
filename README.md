# Botanische Tuin Den Boterlaer - Website

A modern, responsive website for a private botanical garden built with Next.js, TypeScript, and Tailwind CSS.

## 🌿 Features

- **Responsive Design**: Mobile-first approach with beautiful layouts on all devices
- **Modern Tech Stack**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **SEO Optimized**: Built-in metadata and semantic HTML
- **Interactive Components**: 
  - Image gallery with lightbox
  - Contact form with validation
  - Responsive navigation
- **Content Management**: Easy-to-update JSON files for plants and blog posts
- **Performance**: Optimized images with Next.js Image component

## 📁 Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── about/               # About page
│   ├── blog/                # Blog listing and individual posts
│   │   └── [slug]/          # Dynamic blog post pages
│   ├── contact/             # Contact form page
│   ├── gallery/             # Photo gallery page
│   ├── plants/              # Plant collection page
│   ├── visit/               # Visit information page
│   ├── layout.tsx           # Root layout with navbar and footer
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles and Tailwind
├── components/              # Reusable React components
│   ├── Navbar.tsx           # Navigation component
│   ├── Footer.tsx           # Footer component
│   └── Lightbox.tsx         # Image lightbox component
├── data/                    # JSON data files
│   ├── plants.json          # Plant collection data
│   └── blog-posts.json      # Blog posts data
└── public/                  # Static assets (add your images here)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. **Clone or navigate to this directory**

2. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Customization Guide

### 1. Replace Placeholder Content

Look for `TODO:` comments throughout the code to find places where you need to add your actual content:

- Garden name and descriptions
- Contact information (address, phone, email)
- Opening hours and admission fees
- Social media links

### 2. Add Your Images

Replace the placeholder Unsplash images with your actual garden photos:

**For the home page hero:**
- Edit `app/page.tsx` and replace the `backgroundImage` URL

**For the gallery:**
- Add your images to the `public/images/gallery/` folder
- Update the `galleryImages` array in `app/gallery/page.tsx`

**For plant photos:**
- Add images to `public/images/plants/`
- Update the `image` paths in `data/plants.json`

**For blog posts:**
- Add images to `public/images/blog/`
- Update the `image` paths in `data/blog-posts.json`

### 3. Update Plant Collection

Edit `data/plants.json` to add your actual plant collection:

```json
{
  "id": 6,
  "commonName": "Your Plant Name",
  "latinName": "Genus species",
  "description": "Description of the plant...",
  "image": "/images/plants/your-plant.jpg",
  "category": "Category"
}
```

### 4. Add Blog Posts

Edit `data/blog-posts.json` to add your news and updates:

```json
{
  "id": 6,
  "slug": "your-post-slug",
  "title": "Your Post Title",
  "date": "2024-03-20",
  "author": "Author Name",
  "teaser": "Short description...",
  "image": "/images/blog/post-image.jpg",
  "content": "Full post content with \\n\\n for paragraph breaks..."
}
```

### 5. Configure Contact Form

The contact form is abstracted for easy integration. Choose one of these options:

**Option 1: Formspree (Easiest)**
```javascript
// In app/contact/page.tsx, replace the TODO section with:
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

**Option 2: Custom API Route**
```javascript
// Create app/api/contact/route.ts and send emails via your preferred service
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

**Option 3: EmailJS or similar service**
Follow their documentation to integrate

### 6. Add Google Maps

In `app/visit/page.tsx`, replace the map placeholder:

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your location
3. Click "Share" → "Embed a map"
4. Copy the iframe code
5. Replace the placeholder div with your iframe

### 7. Customize Colors

Edit `tailwind.config.ts` to change the color scheme:

```typescript
colors: {
  primary: {
    // Your custom green shades
    500: "#YourColor",
    600: "#YourColor",
    // etc.
  },
  accent: {
    DEFAULT: "#YourDarkGreen",
  },
}
```

### 8. Update SEO Metadata

Edit metadata in each page file and `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Your Title",
  description: "Your description",
  keywords: ["your", "keywords"],
};
```

## 🎨 Design System

### Color Palette
- **Primary (Green)**: Soft greens for buttons and accents
- **Accent (Dark Green/Navy)**: `#1e3a2e` for headings and emphasis
- **Neutral**: Off-white and cream backgrounds

### Typography
- Font: Inter (loaded from Google Fonts)
- Headings: Bold, accent color
- Body: Gray-800 for readability

### Spacing
- Section padding: `py-12 md:py-16 lg:py-20`
- Max width: `max-w-7xl` for content containers

## 📱 Responsive Breakpoints

- Mobile: Default (< 640px)
- Tablet: `sm:` (640px+) and `md:` (768px+)
- Desktop: `lg:` (1024px+) and `xl:` (1280px+)

## 🔧 Build for Production

```bash
npm run build
npm start
```

## 🚢 Deployment

This Next.js app can be deployed to:

- **Vercel** (Recommended - built by Next.js creators)
  - Connect your GitHub repo
  - Automatic deployments on push
  - [Deploy with Vercel](https://vercel.com)

- **Netlify**
  - Build command: `npm run build`
  - Publish directory: `.next`

- **Any Node.js hosting**
  - Requires Node.js 18+
  - Run `npm run build` then `npm start`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🐛 Troubleshooting

**Images not loading?**
- Make sure images are in the `public` folder
- Use paths starting with `/` (e.g., `/images/photo.jpg`)
- For external images, add domains to `next.config.js`

**Build errors?**
- Run `npm install` to ensure all dependencies are installed
- Check that all TypeScript types are correct
- Clear `.next` folder and rebuild

## 📄 License

This project is created for Botanische Tuin Den Boterlaer. Modify and use as needed for your garden.

## 🤝 Support

For questions or issues with the code, refer to the TODO comments in each file or consult the Next.js documentation.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

