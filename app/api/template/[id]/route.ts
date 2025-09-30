import { db } from "@/lib/db";
import path from "path";
import fs from "fs/promises";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const param = await params;
  const id = param.id;

  if (!id) {
    return Response.json({ error: "Missing playground ID" }, { status: 400 });
  }

  const playground = await db.playground.findUnique({
    where: { id },
  });

  if (!playground) {
    return Response.json({ error: "Playground not found" }, { status: 404 });
  }

  const templateKey = playground.template;

  if (!templateKey) {
    return Response.json({ error: "Invalid template" }, { status: 404 });
  }

  try {
    // Read pre-generated JSON from template-cache directory
    const cacheFilePath = path.join(
      process.cwd(), 
      'template-cache', 
      `${templateKey}.json`
    );
    
    console.log("Reading template cache from:", cacheFilePath);
    
    // Read the cached template file
    const fileContent = await fs.readFile(cacheFilePath, 'utf-8');
    const templateJson = JSON.parse(fileContent);

    // Validate that we have the expected structure
    if (!templateJson || !templateJson.items) {
      return Response.json({ 
        error: "Invalid template structure" 
      }, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      templateJson 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error reading template cache:", error);
    
    // Provide more detailed error message
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return Response.json({ 
      error: "Failed to load template",
      details: errorMessage,
      template: templateKey
    }, { status: 500 });
  }
}
