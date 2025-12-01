import { createBlog } from "@repo/actions/blogs.actions";
import { createImage } from "@repo/actions/image.actions";
import { createBlogSchema } from "@repo/db/schema/blogs";
import { NextResponse } from "next/server";
import {
  uploadAndMakeVariantsFromFile,
  type UploadResult,
} from "@/lib/image-upload";

export const runtime = "nodejs";

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

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let title: string;
    let content: string;
    let categoryId: number;
    let thumbnailImageId: number | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      title = formData.get("title") as string;
      content = formData.get("content") as string;
      categoryId = parseInt(formData.get("category_id") as string, 10);

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

    const blogData = {
      title,
      content,
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
