import bcrypt from 'bcryptjs';

export async function verifyPassword(providedPassword, storedHash) {
    console.log("StoredHash:", storedHash);
    try {
      return await bcrypt.compare(providedPassword, storedHash);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
}
