import { defineEventHandler, getQuery, createError } from 'h3';
import {readByStartWithWord} from '../../utils/database/services/daos/daoTags'; 

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    let tags = await readByStartWithWord(query.text as string);
    return {
      ok: true,
      tags,
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: "[ERROR] Getting the possible tags from description." });
  }
});
