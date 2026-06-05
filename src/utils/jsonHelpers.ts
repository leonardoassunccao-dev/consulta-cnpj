export interface JsonStats {
  totalFields: number;
  filledFields: number;
  emptyFields: number;
  numberOfObjects: number;
  numberOfLists: number;
  sizeInKB: number;
}

/**
 * Recurses through a JSON-like object to collect structural statistics.
 */
export function analyzeJson(data: any): JsonStats {
  let totalFields = 0;
  let filledFields = 0;
  let emptyFields = 0;
  let numberOfObjects = 0;
  let numberOfLists = 0;

  function traverse(node: any) {
    if (node === null || node === undefined) {
      totalFields++;
      emptyFields++;
      return;
    }

    if (Array.isArray(node)) {
      numberOfLists++;
      totalFields++; // Count the list as a field
      if (node.length === 0) {
        emptyFields++;
      } else {
        filledFields++;
        node.forEach(item => traverse(item));
      }
      return;
    }

    if (typeof node === 'object') {
      numberOfObjects++;
      totalFields++; // Count the object container as a field
      const keys = Object.keys(node);
      if (keys.length === 0) {
        emptyFields++;
      } else {
        filledFields++;
        keys.forEach(key => {
          traverse(node[key]);
        });
      }
      return;
    }

    // It's a primitive (string, number, boolean)
    totalFields++;
    if (node === '') {
      emptyFields++;
    } else {
      filledFields++;
    }
  }

  traverse(data);

  // Compute exact string size in KB
  let sizeInKB = 0;
  try {
    const jsonString = JSON.stringify(data);
    sizeInKB = jsonString ? jsonString.length / 1024 : 0;
  } catch (e) {
    // Falback
  }

  return {
    totalFields,
    filledFields,
    emptyFields,
    numberOfObjects,
    numberOfLists,
    sizeInKB: parseFloat(sizeInKB.toFixed(2)),
  };
}

/**
 * Simple helper to format JSON data into plain text (for copying formatted data).
 */
export function formatDataAsText(data: any): string {
  if (!data || typeof data !== 'object') return String(data);

  let text = '';

  function buildText(obj: any, indent: string = '') {
    if (obj === null || obj === undefined) {
      text += 'Não informado\n';
      return;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        text += '[]\n';
        return;
      }
      text += '\n';
      obj.forEach((item, index) => {
        text += `${indent}- Item ${index + 1}:\n`;
        buildText(item, indent + '  ');
      });
      return;
    }

    if (typeof obj === 'object') {
      text += '\n';
      Object.entries(obj).forEach(([key, val]) => {
        const readableKey = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        if (val !== null && val !== undefined && typeof val !== 'object') {
          text += `${indent}${readableKey}: ${val}\n`;
        } else {
          text += `${indent}${readableKey}: `;
          buildText(val, indent + '  ');
        }
      });
      return;
    }

    text += `${obj}\n`;
  }

  buildText(data);
  return text.trim();
}
