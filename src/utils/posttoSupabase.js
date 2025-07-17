import { supabase } from "../supabaseClient.js";

/**
 * Insert data into a Supabase table
 * @param {string} tableName - Name of the Supabase table
 * @param {object|object[]} data - A single object or array of objects to insert
 * @returns {Promise<{ data: any|null, error: Error|null }>}
 */
export const postToSupabase = async (tableName, data) => {
  if (typeof tableName !== 'string' || !tableName.trim()) {
    return { data: null, error: new Error('Invalid table name') };
  }
  if (!data || (Array.isArray(data) ? data.length === 0 : typeof data !== 'object')) {
    return { data: null, error: new Error('Invalid data payload') };
  }

  try {
    const { data: insertedData, error: sbError } = await supabase
      .from(tableName)
      .insert(data)
      .select();

    if (sbError) {
      console.error(`Supabase insert error on "${tableName}":`, sbError.message);
      return { data: null, error: new Error('Database insert failed') };
    }

    return { data: insertedData, error: null };
  } catch (err) {
    console.error(`Unexpected error in postToSupabase:`, err);
    return { data: null, error: new Error('Internal server error') };
  }
};
