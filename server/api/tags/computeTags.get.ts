import { defineEventHandler, getQuery, createError } from 'h3';
import keyword_extractor from "keyword-extractor"; // ???? Es un paquete de node, lo necesitamos???

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    let extraction_result = keyword_extractor.extract(query.descrip, {
        language: "spanish",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
    });

    let tags = extraction_result;
    return {
      ok: true,
      tags,
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: "[ERROR] Getting the tags from description." });
  }
});
