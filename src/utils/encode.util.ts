import * as bcrypt from 'bcrypt';

export class EncodeUtil {
  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, 10);
  }

  async compareHashed(value: string, hashedValue: string): Promise<boolean> {
    return await bcrypt.compare(value, hashedValue);
  }
}
