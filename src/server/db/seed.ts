import { db } from "./index";
import { themes, blockTemplates } from "./schema/main.schema";
import { nanoid } from "nanoid";

// System themes
const systemThemes = [
  {
    id: nanoid(),
    name: "Modern Minimal",
    description: "Clean and minimal design with subtle shadows",
    createdBy: null, // System theme
    config: {
      colors: {
        primary: "#000000",
        secondary: "#6B7280",
        background: "#FFFFFF",
        text: "#111827",
        accent: "#3B82F6",
      },
      fonts: {
        heading: "Inter, sans-serif",
        body: "Inter, sans-serif",
      },
      spacing: {
        xs: "0.5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
      },
    },
    preview: "/themes/modern-minimal.jpg",
    isPublic: true,
    isSystem: true,
    status: "published" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  },
  {
    id: nanoid(),
    name: "Vibrant Gradient",
    description: "Bold gradients and vibrant colors",
    createdBy: null,
    config: {
      colors: {
        primary: "#8B5CF6",
        secondary: "#EC4899",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        text: "#FFFFFF",
        accent: "#F59E0B",
      },
      fonts: {
        heading: "Poppins, sans-serif",
        body: "Poppins, sans-serif",
      },
      spacing: {
        xs: "0.5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
      },
      borderRadius: {
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
      },
    },
    preview: "/themes/vibrant-gradient.jpg",
    isPublic: true,
    isSystem: true,
    status: "published" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  },
  {
    id: nanoid(),
    name: "Dark Mode",
    description: "Sleek dark theme with neon accents",
    createdBy: null,
    config: {
      colors: {
        primary: "#10B981",
        secondary: "#6B7280",
        background: "#111827",
        text: "#F9FAFB",
        accent: "#F59E0B",
      },
      fonts: {
        heading: "JetBrains Mono, monospace",
        body: "Inter, sans-serif",
      },
      spacing: {
        xs: "0.5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
      },
    },
    preview: "/themes/dark-mode.jpg",
    isPublic: true,
    isSystem: true,
    status: "published" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  },
];

// System block templates
const systemBlockTemplates = [
  {
    id: nanoid(),
    name: "Link Button",
    description: "A clickable button that links to external URLs",
    createdBy: null,
    type: "LinkButton",
    config: {
      fields: {
        title: {
          type: "text",
          label: "Button Text",
          placeholder: "Enter button text",
        },
        url: {
          type: "url",
          label: "Destination URL",
          placeholder: "https://example.com",
        },
        style: {
          type: "select",
          label: "Button Style",
          options: [
            { label: "Filled", value: "filled" },
            { label: "Outlined", value: "outlined" },
            { label: "Text", value: "text" },
          ],
          defaultValue: "filled",
        },
        icon: {
          type: "text",
          label: "Icon (optional)",
          placeholder: "e.g., instagram, twitter, website",
        },
      },
    },
    defaultProps: {
      title: "Click me",
      url: "https://example.com",
      style: "filled",
    },
    category: "links",
    preview: "/blocks/link-button.jpg",
    icon: "link",
    isPublic: true,
    isSystem: true,
    status: "published" as const,
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: nanoid(),
    name: "Social Media Grid",
    description: "A grid of social media icons and links",
    createdBy: null,
    type: "SocialGrid",
    config: {
      fields: {
        platforms: {
          type: "external",
          label: "Social Platforms",
          placeholder: "Add your social media links",
        },
        layout: {
          type: "select",
          label: "Layout",
          options: [
            { label: "Grid", value: "grid" },
            { label: "Row", value: "row" },
          ],
          defaultValue: "grid",
        },
        iconSize: {
          type: "select",
          label: "Icon Size",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
          ],
          defaultValue: "md",
        },
      },
    },
    defaultProps: {
      platforms: [],
      layout: "grid",
      iconSize: "md",
    },
    category: "social",
    preview: "/blocks/social-grid.jpg",
    icon: "share",
    isPublic: true,
    isSystem: true,
    status: "published" as const,
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: nanoid(),
    name: "Text Block",
    description: "Rich text content with formatting options",
    createdBy: null,
    type: "TextBlock",
    config: {
      fields: {
        content: {
          type: "textarea",
          label: "Text Content",
          placeholder: "Enter your text here...",
        },
        alignment: {
          type: "select",
          label: "Text Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
          defaultValue: "center",
        },
        size: {
          type: "select",
          label: "Text Size",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
          ],
          defaultValue: "md",
        },
      },
    },
    defaultProps: {
      content: "Your text here",
      alignment: "center",
      size: "md",
    },
    category: "content",
    preview: "/blocks/text-block.jpg",
    icon: "type",
    isPublic: true,
    isSystem: true,
    status: "published" as const,
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: nanoid(),
    name: "Image Block",
    description: "Display images with optional captions",
    createdBy: null,
    type: "ImageBlock",
    config: {
      fields: {
        src: {
          type: "image",
          label: "Image",
          placeholder: "Upload or enter image URL",
        },
        alt: {
          type: "text",
          label: "Alt Text",
          placeholder: "Describe the image",
        },
        caption: {
          type: "text",
          label: "Caption (optional)",
          placeholder: "Image caption",
        },
        size: {
          type: "select",
          label: "Image Size",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Full Width", value: "full" },
          ],
          defaultValue: "md",
        },
        borderRadius: {
          type: "select",
          label: "Border Radius",
          options: [
            { label: "None", value: "none" },
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Circle", value: "full" },
          ],
          defaultValue: "md",
        },
      },
    },
    defaultProps: {
      src: "/placeholder-image.jpg",
      alt: "Image",
      size: "md",
      borderRadius: "md",
    },
    category: "media",
    preview: "/blocks/image-block.jpg",
    icon: "image",
    isPublic: true,
    isSystem: true,
    status: "published" as const,
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: nanoid(),
    name: "Spacer",
    description: "Add vertical spacing between elements",
    createdBy: null,
    type: "Spacer",
    config: {
      fields: {
        height: {
          type: "select",
          label: "Spacing Height",
          options: [
            { label: "Extra Small", value: "xs" },
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra Large", value: "xl" },
          ],
          defaultValue: "md",
        },
      },
    },
    defaultProps: {
      height: "md",
    },
    category: "layout",
    preview: "/blocks/spacer.jpg",
    icon: "minus",
    isPublic: true,
    isSystem: true,
    status: "published" as const,
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function seedDatabase() {
  console.log("🌱 Seeding database with system themes and block templates...");

  try {
    // Insert system themes
    await db.insert(themes).values(systemThemes);
    console.log(`✅ Inserted ${systemThemes.length} system themes`);

    // Insert system block templates
    await db.insert(blockTemplates).values(systemBlockTemplates);
    console.log(
      `✅ Inserted ${systemBlockTemplates.length} system block templates`,
    );

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
