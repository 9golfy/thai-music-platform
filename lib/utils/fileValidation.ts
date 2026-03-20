import { fileTypeFromBuffer } from 'file-type';

/**
 * Validate image file using magic bytes (file signature)
 * This prevents attackers from uploading malicious files with fake MIME types
 * 
 * @param file - File or Buffer to validate
 * @returns true if valid image, false otherwise
 */
export async function validateImageFile(file: File | Buffer): Promise<{ valid: boolean; error?: string; detectedType?: string }> {
  try {
    let buffer: Buffer;
    
    // Convert File to Buffer if needed
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      buffer = file;
    }
    
    // Detect actual file type using magic bytes
    const detectedType = await fileTypeFromBuffer(buffer);
    
    if (!detectedType) {
      return {
        valid: false,
        error: 'Unable to detect file type. File may be corrupted or invalid.',
      };
    }
    
    // Only allow JPEG and PNG images
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    
    if (!allowedMimeTypes.includes(detectedType.mime)) {
      return {
        valid: false,
        error: `Invalid file type detected: ${detectedType.mime}. Only JPEG and PNG images are allowed.`,
        detectedType: detectedType.mime,
      };
    }
    
    return {
      valid: true,
      detectedType: detectedType.mime,
    };
  } catch (error) {
    return {
      valid: false,
      error: `File validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Validate file size
 * 
 * @param file - File to validate
 * @param maxSizeInMB - Maximum allowed size in megabytes
 * @returns true if valid size, false otherwise
 */
export function validateFileSize(file: File | Buffer, maxSizeInMB: number): { valid: boolean; error?: string } {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  const fileSize = file instanceof File ? file.size : file.length;
  
  if (fileSize > maxSizeInBytes) {
    return {
      valid: false,
      error: `File size (${(fileSize / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed size of ${maxSizeInMB} MB`,
    };
  }
  
  return { valid: true };
}

/**
 * Comprehensive file validation (type + size)
 * 
 * @param file - File to validate
 * @param maxSizeInMB - Maximum allowed size in megabytes (default: 1MB)
 * @returns validation result
 */
export async function validateUploadedImage(
  file: File | Buffer,
  maxSizeInMB: number = 1
): Promise<{ valid: boolean; error?: string; detectedType?: string }> {
  // Check file size first (faster)
  const sizeValidation = validateFileSize(file, maxSizeInMB);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }
  
  // Check file type using magic bytes
  const typeValidation = await validateImageFile(file);
  if (!typeValidation.valid) {
    return typeValidation;
  }
  
  return {
    valid: true,
    detectedType: typeValidation.detectedType,
  };
}
