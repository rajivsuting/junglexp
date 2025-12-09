import { createBlog, getCategoryByName } from "@repo/actions/blogs.actions";
import { createImage } from "@repo/actions/image.actions";
import { createBlogSchema } from "@repo/db/schema/blogs";
import { NextResponse } from "next/server";
import {
  uploadAndMakeVariantsFromFile,
  type UploadResult,
} from "@/lib/image-upload";
import { createBlogCategory } from "@repo/actions/blog-categories.actions";

export const runtime = "nodejs";

const getCategoryId = async (categoryName: string) => {
  const category = await getCategoryByName(categoryName);
  if (!category) {
    const newCategory = await createBlogCategory({
      name: categoryName,
    });
    return newCategory.id;
  }
  return category.id;
};

function getImageMapFromUploadResult(result: UploadResult) {
  const small = result.variants.find((v) => v.size === "small");
  const medium = result.variants.find((v) => v.size === "medium");
  const large = result.variants.find((v) => v.size === "large");
  const original = result.variants.find((v) => v.size === "original");

  if (!small || !medium || !large || !original) {
    throw new Error("Missing required image variants");
  }

  return {
    small_url: small.url,
    medium_url: medium.url,
    large_url: large.url,
    original_url: original.url,
  };
}

function convertHtmlToLexical(html: string) {
  if (!html) return "";
  // If it's already JSON (starts with {), assume it's valid Lexical state
  if (html.trim().startsWith("{")) {
    return html;
  }

  const rootChildren = [];

  // Split by h2 tags, capturing the delimiters
  // Using [\s\S] to match newlines
  const parts = html.split(/(<h2>[\s\S]*?<\/h2>)/i);

  for (const part of parts) {
    if (part.match(/^<h2>[\s\S]*?<\/h2>$/i)) {
      // It's a heading
      const text = part.replace(/<\/?h2>/gi, "").trim();
      const lines = part.split(/<br\s*\/?>/i);

      if (text) {
        rootChildren.push({
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: text,
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          tag: "h2",
          type: "heading",
          version: 1,
        });
      }
    } else {
      // It's text (potentially multiple paragraphs)
      // Split by double newlines to indicate a new paragraph (treat <br> as line breaks within paragraph)
      const paragraphs = part.split(/(?:\r?\n\s*){2,}/i);

      for (const p of paragraphs) {
        // Handle single <br> tags within a paragraph as line breaks
        // We split by <br> or <br/>
        const lines = p.split(/<br\s*\/?>/i);
        const paragraphChildren = [];

        for (let i = 0; i < lines.length; i++) {
          const lineText = lines[i].replace(/<[^>]+>/g, "").trim(); // detailed cleanup still needed?
          // Actually we should be careful not to strip too much if we want to preserve some inline formatting,
          // but for now we are stripping all tags.

          if (lineText) {
            paragraphChildren.push({
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: lineText,
              type: "text",
              version: 1,
            });
          }

          // Add a LineBreak node after each line except the last one
          if (i < lines.length - 1) {
            paragraphChildren.push({
              type: "linebreak",
              version: 1,
            });
          }
        }

        if (paragraphChildren.length > 0) {
          rootChildren.push({
            children: paragraphChildren,
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          });
        }
      }
    }
  }

  return JSON.stringify({
    root: {
      children: rootChildren,
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let title: string;
    let content: string;
    let categoryId: number;
    let thumbnailImageId: number | undefined;
    let categoryName: string;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      title = formData.get("title") as string;
      content = formData.get("content") as string;
      categoryId = parseInt(formData.get("category_id") as string, 10);
      categoryName = formData.get("category_name") as string;

      const imageFile = formData.get("image") as File | null;

      if (imageFile) {
        // Upload image
        const uploadResult = await uploadAndMakeVariantsFromFile(imageFile);
        const imageUrls = getImageMapFromUploadResult(uploadResult);

        // Create image in DB
        const newImage = await createImage({
          ...imageUrls,
          alt_text: title || imageFile.name,
        });

        thumbnailImageId = newImage.id;
      } else {
        // Check if id is passed directly in formdata
        const idStr = formData.get("thumbnail_image_id") as string;
        if (idStr) thumbnailImageId = parseInt(idStr, 10);
      }
    } else {
      // Handle JSON
      const body = await request.json();
      title = body.title;
      content = body.content;
      categoryId = body.category_id;
      thumbnailImageId = body.thumbnail_image_id;
      categoryName = body.category_name;
    }

    if (!thumbnailImageId) {
      return NextResponse.json(
        {
          error:
            "Thumbnail image is required (either 'image' file or 'thumbnail_image_id')",
        },
        { status: 400 }
      );
    }

    if (!categoryId && categoryName) {
      if (!categoryName.trim()) {
        return NextResponse.json(
          { error: "Category name is required" },
          { status: 400 }
        );
      }
      categoryId = await getCategoryId(categoryName);
    }

    // Convert HTML content to Lexical JSON if needed
    const processedContent = convertHtmlToLexical(content);

    const blogData = {
      title,
      content: processedContent,
      category_id: categoryId,
      thumbnail_image_id: thumbnailImageId,
    };

    // Validate input
    const validatedData = createBlogSchema.safeParse(blogData);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validatedData.error.format() },
        { status: 400 }
      );
    }

    // Create blog in database
    const newBlog = await createBlog(validatedData.data);

    return NextResponse.json(
      {
        message: "Blog created successfully",
        data: newBlog,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating blog:", error);

    if (error.message?.includes("foreign key constraint")) {
      return NextResponse.json(
        { error: "Invalid thumbnail_image_id. Image does not exist." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
